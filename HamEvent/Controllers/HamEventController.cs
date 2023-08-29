using AutoMapper;
using HtmlToPDFCore;
using M0LTE.AdifLib;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Numerics;
using System.Runtime.InteropServices;
using static System.Formats.Asn1.AsnWriter;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;
using System.Net.Http.Headers;
using HamEvent.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Runtime.CompilerServices;
using HamEvent.Data.Model;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
                var myevent = _dbcontext.Events.Select(e => new Event() { Id = e.Id, Name = e.Name, SecretKey = e.SecretKey }).Where(e => e.Id == hamevent).FirstOrDefault();
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

                events= _dbcontext.Events.Select(e => new Event() {  Id=e.Id,  Name=e.Name, SecretKey=e.SecretKey});
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
                string url = $"{this.Request.Scheme}://{this.Request.Host}{this.Request.PathBase}/static/diploma.html";

                using (HttpClient client = new HttpClient())
                {
                    using (HttpResponseMessage response = client.GetAsync(url).Result)
                    {
                        using (HttpContent content = response.Content)
                        {
                            string html = content.ReadAsStringAsync().Result;
                            var pdf = new HtmlToPDF();
                            var buffer = pdf.ReturnPDF(html);
                            var stream = new MemoryStream(buffer);
                            return new FileStreamResult(stream, "application/pdf");
                        }
                    }
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