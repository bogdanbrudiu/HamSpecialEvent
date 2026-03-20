using HamEvent.Data.Model;
using HamEvent.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Net.Mail;

namespace HamEvent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VerificationController : Controller
    {
        private readonly TokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly MailerSettings _mailerSettings;
        private readonly ILogger<VerificationController> _logger;

        public VerificationController(ILogger<VerificationController> logger, IEmailService emailService, IOptions<MailerSettings> mailerSettings, TokenService tokenService)
        {
            _tokenService = tokenService;
            _logger = logger;
            _emailService = emailService;
            _mailerSettings = mailerSettings.Value;
        }

        [HttpGet("send-verification")]
        public async Task<IActionResult> SendVerificationEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                _ = new MailAddress(email);
            }
            catch (FormatException)
            {
                return BadRequest("Invalid email address.");
            }

            EmailMessage message = new EmailMessage
            {
                ToAddresses = new List<string>() { email },
                IsHtml = true,
                TemplateName = "Shared/ValidateEmail",
                Subject = "Confirm Email",
                Model = new { token=  _tokenService.GenerateToken(email) }
            };
            _logger.LogDebug(MyLogEvents.SendingEmail, "Sending Email");
            try
            {
                await _emailService.SendAsync(message);
            }
            catch(Exception ex)
            {
                _logger.LogError(MyLogEvents.SendingEmail, ex, "Error Sending Email");
                return StatusCode(500, $"Email send error!");
            }
            return Ok();
        }

        [HttpGet("verify")]
        public IActionResult VerifyEmail(string token, string email)
        {
            if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(email))
            {
                return BadRequest("Token and email are required.");
            }

            if (_tokenService.VerifyToken(token, email))
            {
                return Ok("Email verified.");
            }
            else
            {
                return BadRequest("Invalid token.");
            }
        }

        [HttpGet("Ping")]
        public IActionResult Ping()
        {
            return Ok("Pong");
        }
    }
}
