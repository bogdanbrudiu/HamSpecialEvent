using HtmlToPDFCore;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Runtime.InteropServices;

namespace HamEvent.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HamEventController : ControllerBase
    {


        private readonly ILogger<HamEventController> _logger;

        public HamEventController(ILogger<HamEventController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<QSO> Get()
        {
            using (StreamReader reader = new StreamReader("QSOs.json"))
            {
                var json = reader.ReadToEnd();
                List<QSO> QSOs = JsonConvert.DeserializeObject<List<QSO>>(json);
                return QSOs;
            }
        }

        [HttpGet]
        public IEnumerable<QSO> Get(string callsign)
        {
            using (StreamReader reader = new StreamReader("QSOs.json"))
            {
                var json = reader.ReadToEnd();
                List<QSO> QSOs = JsonConvert.DeserializeObject<List<QSO>>(json);
                return QSOs.Where(qso=>qso.Callsign2.Equals(callsign));
            }
        }

        public IActionResult PDF()
        {
            try

            {
                var html = "<html><body><b>TESTE PDF</b></body></html>";

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