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
using System.Globalization;
using System.Text.RegularExpressions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.Extensions.Logging;

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
        public class Participant
        {
            public string Callsign { get; set; }
            public int Count { get; set; }
            public int Band { get; set; }
            public int Mode { get; set; }
            public int Points { get; set; }
            public int Rank { get; set; }
        }
        [HttpGet("Top/{hamevent}")]
        public PageResult<Participant> Top(Guid hamevent, int? page, int pagesize = 10, string callsign = "")
        {
           
        _logger.LogInformation(MyLogEvents.GetQSOs, "Get Top for event {0} page {1} paginated by {2} per page, filtered by {3}", hamevent, page, pagesize, callsign);
            IQueryable<QSO> qsos;
            IQueryable<Participant> participants;
            IEnumerable<Participant> top;
            try
            {
                qsos = _dbcontext.QSOs.Where(qso => qso.EventId.Equals(hamevent));

                participants = qsos.GroupBy(qso => new { qso.Callsign2 }).Select(grup => new Participant()
                {
                    Callsign = grup.Key.Callsign2,
                    Count = grup.Count(),
                    Band = grup.GroupBy(g => new { g.Band }).Count(),
                    Mode = grup.GroupBy(g => new { g.Mode }).Count(),
                    Points = grup.Count() * grup.GroupBy(g => new { g.Band }).Count() * grup.GroupBy(g => new { g.Mode }).Count()
                }).OrderByDescending(o => o.Points);
                top = participants.ToList();
                top = top.Join(top.GroupBy(p => p.Points).Select((p, idx) => new { Points = p.Key, Rank = idx }), p => p.Points, t => t.Points, (p, t) => new Participant()
                {
                    Callsign = p.Callsign,
                    Count = p.Count,
                    Band = p.Band,
                    Mode = p.Mode,
                    Points = p.Points,
                    Rank = t.Rank+1
                });
              
                if (!String.IsNullOrEmpty(callsign))
                {
                    top = top.Where(qso => string.Equals(callsign.ToLower(), qso.Callsign.ToLower()));
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(MyLogEvents.GetQSOs, ex, "Failed getting Top for event {0} page {1} paginated by {2} per page, filtered by {3}", hamevent, page, pagesize, callsign);

                return new PageResult<Participant>
                {
                    Count = 0,
                    Data = new List<Participant>()
                };
            }
            var countDetails = top.Count();
            return new PageResult<Participant>
            {
                Count = countDetails,
                Data = top.Skip((page - 1 ?? 0) * pagesize).Take(pagesize).ToList()
            };
        }


        [HttpDelete("QSOs/{hamevent}/{secret}")]
        public ActionResult Delete(Guid hamevent, Guid secret, string callsign1, string callsign2, string mode, string band, string timestamp)
        {
            _logger.LogInformation(MyLogEvents.DeleteQSO, "Delete QSO callsign1 {0}, callsign2 {1}, mode {2}, band {3}, timestamp {4} from event {5}", callsign1, callsign2, mode, band, timestamp, hamevent);
            var myqso = _dbcontext.QSOs.Where(qso => qso.EventId== hamevent && 
                                                       qso.Callsign1==callsign1 &&
                                                       qso.Callsign2 == callsign2 &&
                                                       qso.Mode == mode &&
                                                       qso.Band == band &&
                                                       qso.Timestamp == DateTime.Parse(timestamp, CultureInfo.InvariantCulture) &&
                                                       qso.Event.SecretKey == secret).FirstOrDefault();
            if (myqso == null) return NotFound();
            _dbcontext.QSOs.Remove(myqso);
            _dbcontext.SaveChanges();
            return Ok();
        }



        [HttpGet("hamevent/{hamevent}")]
        public ActionResult<Event> Get(Guid hamevent, Guid? secret)
        {
            _logger.LogInformation(MyLogEvents.GetEvent, "Get Event {0}", hamevent);

            try
            {
                Event myevent;
                if (secret.HasValue)
                {
                    myevent = _dbcontext.Events.Where(e=> e.Id.Equals(hamevent) && e.SecretKey.Equals(secret)).Select(e => new Event() { Id = e.Id, Name = e.Name, Description = e.Description, Diploma = e.Diploma }).FirstOrDefault();
                }
                else
                {
                    myevent = _dbcontext.Events.Where(e => e.Id == hamevent).Select(e => new Event() { Id = e.Id, Name = e.Name, Description = e.Description, Diploma = e.Diploma }).FirstOrDefault();
                }

                if (myevent == null) return NotFound();
                else return Ok(myevent);
            }
            catch(Exception ex)
            {
                _logger.LogError(MyLogEvents.GetEvent,ex, "Failed getting Event {0}", hamevent);

                return NotFound();
            }
         
        }
        [HttpPost("hamevent")]
        public ActionResult<Event> Post(Event hamevent)
        {
            _logger.LogInformation(MyLogEvents.UpdateEvent, "Update Event {0}", hamevent);

            try
            {
                var myevent = _dbcontext.Events.Where(e => e.Id == hamevent.Id && e.SecretKey==hamevent.SecretKey).FirstOrDefault();
                if (myevent == null) return NotFound();
                else {
                    myevent.Diploma= hamevent.Diploma;
                    myevent.Description = hamevent.Description;
                    myevent.Name=hamevent.Name;
                    _dbcontext.SaveChanges();
                    return Ok(myevent);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(MyLogEvents.GetEvent, ex, "Failed updating Event {0}", hamevent);

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
                    ).Select(e => new Event() {  Id=e.Id,  Name=e.Name, Description=e.Description, Diploma=e.Diploma});
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
            string diplomahtml = "";

            if (myevent!=null  )
            {
                if (!String.IsNullOrEmpty(myevent.Diploma))
                {
                    diplomahtml = myevent.Diploma;
                }
                else
                {
                    using Stream? diplomastream = assembly.GetManifestResourceStream("HamEvent.resources.diploma.html");
                    if (diplomastream != null)
                    {
                        using StreamReader reader = new(diplomastream);
                        diplomahtml = reader.ReadToEnd();
                    }
                }

                diplomahtml = diplomahtml.Replace("--callsign2--", callsign.ToUpper());
                diplomahtml = diplomahtml.Replace("--EventName--", myevent.Name);
                diplomahtml = diplomahtml.Replace("--EventDescription--", myevent.Description);



                var qsos = _dbcontext.QSOs.Where(qso => qso.EventId.Equals(hamevent));

                var participants = qsos.GroupBy(qso => new { qso.Callsign2 }).Select(grup => new Participant()
                {
                    Callsign = grup.Key.Callsign2,
                    Count = grup.Count(),
                    Band = grup.GroupBy(g => new { g.Band }).Count(),
                    Mode = grup.GroupBy(g => new { g.Mode }).Count(),
                    Points = grup.Count() * grup.GroupBy(g => new { g.Band }).Count() * grup.GroupBy(g => new { g.Mode }).Count()
                }).OrderByDescending(o => o.Points);
                IEnumerable<Participant> top = participants.ToList();
                top = top.Join(top.GroupBy(p => p.Points).Select((p, idx) => new { Points = p.Key, Rank = idx }), p => p.Points, t => t.Points, (p, t) => new Participant()
                {
                    Callsign = p.Callsign,
                    Count = p.Count,
                    Band = p.Band,
                    Mode = p.Mode,
                    Points = p.Points,
                    Rank = t.Rank + 1
                });

                var participant = top.Where(qso => string.Equals(callsign.ToLower(), qso.Callsign.ToLower())).FirstOrDefault();
                if (participant!=null)
                {

                    diplomahtml = diplomahtml.Replace("--Points--", participant.Points.ToString());
                    diplomahtml = diplomahtml.Replace("--QSOs--", participant.Count.ToString());
                    diplomahtml = diplomahtml.Replace("--Bands--", participant.Band.ToString());
                    diplomahtml = diplomahtml.Replace("--Modes--", participant.Mode.ToString());

                    diplomahtml = diplomahtml.Replace("--Rank--", participant.Rank.ToString());
                    diplomahtml = diplomahtml.Replace("--Timestamp--", DateTime.UtcNow.ToString());

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

                    while (doc.Pages.Count > 1)
                    {
                        doc.RemovePageAt(1);
                    }

                    byte[] pdf = doc.Save();
                    doc.Close();

                    FileResult fileResult = new FileContentResult(pdf, "application/pdf");
                    fileResult.FileDownloadName = myevent.Name + " " + callsign + ".pdf";
                    return fileResult;
                }

            }
            return NoContent();
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