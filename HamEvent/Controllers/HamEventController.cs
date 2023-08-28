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
        public PageResult<QSO> listQSOs(int? page, int pagesize = 10)
        {
            var countDetails = _dbcontext.QSOs.Count();
            var result = new PageResult<QSO>
            {
                Count = countDetails,
                PageIndex = page ?? 1,
                PageSize = 10,
                Items = _dbcontext.QSOs.Skip((page - 1 ?? 0) * pagesize).Take(pagesize).ToList()
            };
            return result;
        }

        [HttpGet("{hamevent}")]
        public IEnumerable<QSO> Get(Guid hamevent,string callsign="")
        {
            try
            {
                if (!String.IsNullOrEmpty(callsign))
                {
                    return _dbcontext.QSOs.Where(qso=>qso.EventId.Equals(hamevent)).Where(qso => string.Equals(callsign.ToLower(), qso.Callsign2.ToLower())).ToList();
                }
                return _dbcontext.QSOs.Where(qso => qso.EventId.Equals(hamevent)).ToList();
            }
            catch (Exception ex) {
                return new List<QSO>();
            }
        }

        [HttpGet("hamevents")]
        public List<Event> Get()
        {
            try
            {

                return _dbcontext.Events.Select(e => new Event() {  Id=e.Id,  Name=e.Name}).ToList();
            }
            catch (Exception ex)
            {
                return new List<Event>();
            }
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