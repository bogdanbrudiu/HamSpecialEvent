using AutoMapper;
using CoreMailer.Interfaces;
using CoreMailer.Models;
using HamEvent.Data.Model;
using HamEvent.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace HamEvent.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VerificationController : Controller
    {
        private readonly TokenService _tokenService;
        private readonly ICoreMvcMailer _mailer;
        private readonly MailerSettings _mailerSettings;
        private readonly ILogger<HamEventController> _logger;

        public VerificationController(ILogger<HamEventController> logger, IMapper mapper, ICoreMvcMailer mailer, IOptions<MailerSettings> mailerSettings, TokenService tokenService)
        {
            _tokenService = tokenService;
            _logger = logger;
            _mailer = mailer;
            _mailerSettings = mailerSettings.Value;
        }

        [HttpGet("send-verification")]
        public async Task<IActionResult> SendVerificationEmail(string email)
        {
            MailerModel mdl = new MailerModel(_mailerSettings.Host, _mailerSettings.Port)
            {
                ToAddresses = new List<string>() { email },
                FromAddress = _mailerSettings.From,
                IsHtml = true,
                ViewFile = "Shared/ValidateEmail.html",
                Subject = "Confirm Email",
                User = _mailerSettings.Username,
                Key = _mailerSettings.Password,
                EnableSsl = _mailerSettings.EnableSSL,
                Model = new { token=  _tokenService.GenerateToken(email) }
            };
            _logger.LogDebug(MyLogEvents.SendingEmail, "Sending Email");
            try
            {
                await _mailer.SendAsync(mdl);
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
