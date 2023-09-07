using AutoMapper;
using M0LTE.AdifLib;
using Microsoft.AspNetCore.Mvc;
using HamEvent.Data;
using HamEvent.Data.Model;
using System.Reflection;
using System.IO;
using SelectPdf;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Drawing.Printing;
using System.Runtime.CompilerServices;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace HamEvent.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HamEventController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly HamEventContext _dbcontext;
        private readonly ILogger<HamEventController> _logger;

        public HamEventController(ILogger<HamEventController> logger ,IMapper mapper, HamEventContext dbcontext)
        {
            _logger = logger;
            _mapper = mapper;
            _dbcontext = dbcontext;
        }

        [HttpGet("QSOs/{hamevent}")]
        public PageResult<QSO> Get(Guid hamevent, int? page, int pagesize = 10, string callsign = "")
        {
            _logger.LogInformation(MyLogEvents.GetQSOs, "Get QSOs for event {0} page {1} paginated by {2} per page, filtered by {3}",hamevent, page, pagesize, callsign);
            IQueryable<QSO> qsos;
            try
            {
                qsos = _dbcontext.QSOs.Where(qso => qso.EventId.Equals(hamevent));
                if (!String.IsNullOrEmpty(callsign))
                {
                    qsos = qsos.Where(qso => string.Equals(callsign.ToLower(), qso.Callsign2.ToLower()));
                }
            }
            catch(Exception ex) {
                _logger.LogError(MyLogEvents.GetQSOs,ex, "Failed getting QSOs for event {0} page {1} paginated by {2} per page, filtered by {3}", hamevent, page, pagesize, callsign);

                return new PageResult<QSO>
                {
                    Count = 0,
                    Data = new List<QSO>()
                };
            }
            qsos=qsos.OrderByDescending(qso => qso.Timestamp);
            var countDetails = qsos.Count();
            return new PageResult<QSO>
            {
                Count = countDetails,
                Data = qsos.Skip((page - 1 ?? 0) * pagesize).Take(pagesize).ToList()
            };
        }
        [HttpGet("hamevent/{hamevent}")]
        public ActionResult<Event> Get(Guid hamevent)
        {
            _logger.LogInformation(MyLogEvents.GetEvent, "Get Event {0}", hamevent);

            try
            {
                var myevent = _dbcontext.Events.Select(e => new Event() { Id = e.Id, Name = e.Name, Description = e.Description, DiplomaURL = e.DiplomaURL }).Where(e => e.Id == hamevent).FirstOrDefault();
                if (myevent == null) return NotFound();
                else return Ok(myevent);
            }
            catch(Exception ex)
            {
                _logger.LogError(MyLogEvents.GetEvent,ex, "Failed getting Event {0}", hamevent);

                return NotFound();
            }
         
        }

        [HttpGet("hamevents")]
        public PageResult<Event> Get(int? page, int pagesize = 10)
        {
            _logger.LogInformation(MyLogEvents.GetEvents, "Get Events page {0} paginated by {1} per page", page, pagesize);

            IQueryable<Event> events;
            try
            {

                events= _dbcontext.Events.Where(e=> 
                        (!e.StartDate.HasValue || e.StartDate < DateTime.Now) 
                        &&
                        (!e.EndDate.HasValue || e.EndDate> DateTime.Now)
                    ).Select(e => new Event() {  Id=e.Id,  Name=e.Name, Description=e.Description, DiplomaURL=e.DiplomaURL});
            }
            catch(Exception ex)
            {
                _logger.LogError(MyLogEvents.GetEvents,ex, "Failed getting Events page {0} paginated by {1} per page", page, pagesize);

                return new PageResult<Event>
                {
                    Count = 0,
                    Data = new List<Event>()
                };
            }
            var countDetails = events.Count();
            return new PageResult<Event>
            {
                Count = countDetails,
                Data = events.Skip((page - 1 ?? 0) * pagesize).Take(pagesize).ToList()
            };
        }
     
        
        [HttpGet("Diploma/{hamevent}/{callsign}")]
        public IActionResult PDF(Guid hamevent, string callsign)
        {
            _logger.LogInformation(MyLogEvents.GetDiploma, "Get Diploma for event {0} callsign {1}", hamevent, callsign);

            var myevent =_dbcontext.Events.Where(e => e.Id.Equals(hamevent)).FirstOrDefault();
            var assembly = Assembly.GetExecutingAssembly();
            using Stream diplomastream = assembly.GetManifestResourceStream("HamEvent.resources.diploma.html");
            if (myevent!=null && !String.IsNullOrEmpty(myevent.DiplomaURL) && diplomastream != null)
            {
                   
                using StreamReader reader = new(diplomastream);
                    
                var diplomahtml = reader.ReadToEnd();
                diplomahtml = diplomahtml.Replace("imgurl", myevent.DiplomaURL);
                diplomahtml = diplomahtml.Replace("--callsign2--", callsign.ToUpper());
                diplomahtml = diplomahtml.Replace("--EventName--", myevent.Name);
                diplomahtml = diplomahtml.Replace("--EventDescription--", myevent.Description);

              

                var qsos=_dbcontext.QSOs.Where(qso => qso.EventId.Equals(hamevent) && string.Equals(callsign.ToLower(), qso.Callsign2.ToLower()));

                var qsosCount = qsos.Count();
                var bandsCount = qsos.GroupBy(qso => qso.Band).Count();
                var modesCount = qsos.GroupBy(qso => qso.Mode).Count();
                diplomahtml = diplomahtml.Replace("--Points--", qsosCount.ToString());
                diplomahtml = diplomahtml.Replace("--QSOs--", qsosCount.ToString());
                diplomahtml = diplomahtml.Replace("--Bands--", bandsCount.ToString());
                diplomahtml = diplomahtml.Replace("--Modes--", modesCount.ToString());

                SelectPdf.HtmlToPdf converter = new SelectPdf.HtmlToPdf();
                    // set converter options
                    converter.Options.PdfPageSize = PdfPageSize.A4;
                    converter.Options.PdfPageOrientation = PdfPageOrientation.Landscape;

                    converter.Options.MarginLeft = 0;
                    converter.Options.MarginRight = 0;
                    converter.Options.MarginTop = 0;
                    converter.Options.MarginBottom = 0;
                    converter.Options.DisplayHeader = false;
                    converter.Options.DisplayFooter = false;

                    converter.Options.WebPageWidth = 842;
                    converter.Options.WebPageHeight = 595;
                    converter.Options.WebPageFixedSize = true;
                    converter.Options.AutoFitHeight = HtmlToPdfPageFitMode.AutoFit;
                    converter.Options.AutoFitWidth = HtmlToPdfPageFitMode.AutoFit;
                    // set css @media print
                    converter.Options.CssMediaType = HtmlToPdfCssMediaType.Print;
                    converter.Options.ViewerPreferences.CenterWindow = true;
                    SelectPdf.PdfDocument doc = converter.ConvertHtmlString(diplomahtml, $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}");

                    while (doc.Pages.Count > 1) {
                        doc.RemovePageAt(1);
                    }

                    byte[] pdf = doc.Save();
                    doc.Close();

                    FileResult fileResult = new FileContentResult(pdf, "application/pdf");
                    fileResult.FileDownloadName = myevent.Name+" " + callsign + ".pdf";
                    return fileResult;

                }
                else
                {
                    return NoContent();
                }
           
        }

        [HttpPost("{hamevent}/{eventsecret}/upload")]
        public IActionResult Upload(Guid hamevent, Guid eventsecret)
        {
            _logger.LogInformation(MyLogEvents.UploadLog, "Uploading log for event {0}", hamevent);

            try
            {
                var myevent=_dbcontext.Events.Where(e => e.Id.Equals(hamevent) && e.SecretKey.Equals(eventsecret)).FirstOrDefault();

                    var adifInport = Request.Form.Files[0];
                    if (adifInport.Length > 0 && myevent != null)
                    {
                        using (var reader = new StreamReader(adifInport.OpenReadStream()))
                        {
                            var adif = reader.ReadToEnd();
                            AdifFile.TryParse(adif, out var file);
                            List<AdifContactRecord> adifQSOs = file.Records.ToList();
                            List<QSO> QSOs = _mapper.Map<List<AdifContactRecord>, List<QSO>>(adifQSOs);
                            foreach (QSO myQSO in QSOs)
                            {
                                myQSO.EventId = hamevent;
                            if (_dbcontext.QSOs.Count(qso =>
                                qso.EventId.Equals(myQSO.EventId)
                                && qso.Callsign1.Equals(myQSO.Callsign1)
                                && qso.Callsign2.Equals(myQSO.Callsign2)
                                && qso.Band.Equals(myQSO.Band)
                                && qso.Mode.Equals(myQSO.Mode)
                                && qso.Timestamp.Equals(myQSO.Timestamp)
                                ) == 0)
                            {
                                _dbcontext.QSOs.Add(myQSO);
                            }
                            }
                            _dbcontext.SaveChanges();
                        }

                        return Ok();
                    }
                    else
                    {
                        return BadRequest();
                    }
            }
            catch (Exception ex)
            {
                _logger.LogError(MyLogEvents.UploadLog, "Failed uploading log for event {0}", hamevent);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

      
    }
}