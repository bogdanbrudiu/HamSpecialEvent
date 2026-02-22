using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Cryptography;
using System.Text;

namespace HamEvent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : Controller
    {
        private readonly IConfiguration _config;

        public AdminController(IConfiguration config)
        {
            _config = config;
        }

        public class ValidateRequest { public string Key { get; set; } }

        [HttpPost("validate")]
        public IActionResult Validate([FromBody] ValidateRequest req)
        {
            if (req == null || string.IsNullOrEmpty(req.Key)) return Unauthorized();

            var configured = _config["AdminSecret"];
            if (string.IsNullOrEmpty(configured)) return Unauthorized();

            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(req.Key);
            var hash = sha.ComputeHash(bytes);
            var hex = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();

            if (hex == configured.ToLowerInvariant())
            {
                return Ok("OK");
            }

            return Unauthorized();
        }
    }
}
