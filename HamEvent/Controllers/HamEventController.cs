using AutoMapper;
using HtmlToPDFCore;
using M0LTE.AdifLib;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Runtime.InteropServices;
using static System.Net.WebRequestMethods;

namespace HamEvent.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HamEventController : ControllerBase
    {

        private readonly IMapper _mapper;
        private readonly ILogger<HamEventController> _logger;

        public HamEventController(ILogger<HamEventController> logger ,IMapper mapper)
        {
            _logger = logger;
            _mapper = mapper;
        }


        [HttpGet]
        public IEnumerable<QSO> Get(string callsign="")
        {
            using (StreamReader reader = new StreamReader("QSOs.adi"))
            {
                var adif = reader.ReadToEnd();
                AdifFile.TryParse(adif, out var file);
                List<AdifContactRecord> adifQSOs = file.Records.ToList();
                List<QSO> QSOs = _mapper.Map<List<AdifContactRecord>, List<QSO>>(adifQSOs);
                var result = QSOs;
                if (!String.IsNullOrEmpty(callsign) && QSOs!=null) {
                    result = QSOs.Where(qso => string.Equals(callsign, qso.Callsign2, StringComparison.CurrentCultureIgnoreCase)).ToList();
                }
                return result;
            }
        }


        [HttpGet("Diploma/{callsign}")]
        public IActionResult PDF(string callsign)
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
    }
}