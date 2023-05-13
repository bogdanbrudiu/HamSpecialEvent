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
                string imageUrl = "url";
                string html = "<html><head><style>body {background-image: url("+ imageUrl +");background-size: cover;background-position: center;background-repeat: no-repeat; background-attachment: fixed;position: relative;}</style></head> <div><h1 style=\"text-align: center; font-size: 50px; font-family: 'Times New Roman', Times, serif; color: #000000;\">Certificate of Achievement</h1><h2 style=\"text-align: center; font-size: 30px; font-family: 'Times New Roman', Times, serif; color: #000000;\">callsign</h2></div></html>";
                if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                {
                    html = "<html><body><b>TESTE PDF no Linux</b></body></html>";
                }
                var pdf = new HtmlToPDF();
                var buffer = pdf.ReturnPDF(html);
                var stream = new MemoryStream(buffer);
                return new FileStreamResult(stream, "application/pdf");
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
    }
}