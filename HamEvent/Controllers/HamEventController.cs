using AutoMapper;
using M0LTE.AdifLib;
using Microsoft.AspNetCore.Mvc;
using HamEvent.Data;
using HamEvent.Data.Model;
using System.Reflection;
using System.IO;
using SelectPdf;

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
            IQueryable<QSO> qsos = null;
            try
            {
                qsos = _dbcontext.QSOs.Where(qso => qso.EventId.Equals(hamevent));
                if (!String.IsNullOrEmpty(callsign))
                {
                    qsos = qsos.Where(qso => string.Equals(callsign.ToLower(), qso.Callsign2.ToLower()));
                }
               

            }
            catch (Exception ex) {
                return new PageResult<QSO>
                {
                    Count = 0,
                    Data = new List<QSO>()
                };
            }

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
           
            try
            {
                var myevent = _dbcontext.Events.Select(e => new Event() { Id = e.Id, Name = e.Name, Description = e.Description, DiplomaURL = e.DiplomaURL }).Where(e => e.Id == hamevent).FirstOrDefault();
                if (myevent == null) return NotFound();
                else return Ok(myevent);
            }
            catch (Exception ex)
            {
                return NotFound();
            }
         
        }

        [HttpGet("hamevents")]
        public PageResult<Event> Get(int? page, int pagesize = 10)
        {
            IQueryable<Event> events = null;
            try
            {

                events= _dbcontext.Events.Select(e => new Event() {  Id=e.Id,  Name=e.Name, Description=e.Description, DiplomaURL=e.DiplomaURL});
            }
            catch (Exception ex)
            {
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
            try
            {
                var myevent=_dbcontext.Events.Where(e => e.Id.Equals(hamevent)).FirstOrDefault();
                var url = myevent?.DiplomaURL;
                if (!String.IsNullOrEmpty(url))
                {
                    using Stream diplomastream = Assembly.GetExecutingAssembly().GetManifestResourceStream("HamEvent.resources.diploma.html");
                    using StreamReader reader = new(diplomastream);
                    
                    var diplomahtml = reader.ReadToEnd();
                    diplomahtml = diplomahtml.Replace("imgurl", url);

                    diplomahtml = diplomahtml.Replace("--callsign2--", callsign.ToUpper());


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
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        [HttpPost("{hamevent}/{eventsecret}/upload")]
        public IActionResult Upload(Guid hamevent, Guid eventsecret)
        {
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
                                _dbcontext.QSOs.Add(myQSO);
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
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

      
    }
}