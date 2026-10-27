using HamEvent;
using HamEvent.Controllers;
using HamEvent.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;

namespace UnitTests
{
    public class VerificationControllerTests
    {
        [Fact]
        public async Task SendVerificationEmail_ReturnsOk_AndUsesEmailService()
        {
            var emailService = new Mock<IEmailService>();
            emailService
                .Setup(s => s.SendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var settings = Options.Create(new MailerSettings
            {
                From = "noreply@example.com",
                Host = "smtp.example.com",
                Port = 587,
                Username = "user",
                Password = "pass",
                EnableSSL = true
            });

            var tokenService = new TokenService("secret");
            var controller = new VerificationController(
                Mock.Of<ILogger<VerificationController>>(),
                emailService.Object,
                settings,
                tokenService);

            var result = await controller.SendVerificationEmail("alice@example.com");

            Assert.IsType<OkResult>(result);
            emailService.Verify(s => s.SendAsync(
                It.Is<EmailMessage>(m =>
                    m.Subject == "Confirm Email" &&
                    m.TemplateName == "Shared/ValidateEmail" &&
                    m.ToAddresses.Count == 1 &&
                    m.ToAddresses[0] == "alice@example.com" &&
                    m.IsHtml),
                It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task SendVerificationEmail_Returns500_WhenEmailServiceThrows()
        {
            var emailService = new Mock<IEmailService>();
            emailService
                .Setup(s => s.SendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new InvalidOperationException("smtp failed"));

            var controller = new VerificationController(
                Mock.Of<ILogger<VerificationController>>(),
                emailService.Object,
                Options.Create(new MailerSettings()),
                new TokenService("secret"));

            var result = await controller.SendVerificationEmail("alice@example.com");

            var objectResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Fact]
        public async Task SendVerificationEmail_ReturnsBadRequest_ForMissingEmail()
        {
            var controller = new VerificationController(
                Mock.Of<ILogger<VerificationController>>(),
                Mock.Of<IEmailService>(),
                Options.Create(new MailerSettings()),
                new TokenService("secret"));

            var result = await controller.SendVerificationEmail(string.Empty);

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Email is required.", bad.Value);
        }

        [Fact]
        public async Task SendVerificationEmail_ReturnsBadRequest_ForInvalidEmail()
        {
            var controller = new VerificationController(
                Mock.Of<ILogger<VerificationController>>(),
                Mock.Of<IEmailService>(),
                Options.Create(new MailerSettings()),
                new TokenService("secret"));

            var result = await controller.SendVerificationEmail("not-an-email");

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid email address.", bad.Value);
        }

        [Fact]
        public void VerifyEmail_ReturnsOk_ForValidToken()
        {
            var tokenService = new TokenService("secret");
            var email = "alice@example.com";
            var token = tokenService.GenerateToken(email);

            var controller = new VerificationController(
                Mock.Of<ILogger<VerificationController>>(),
                Mock.Of<IEmailService>(),
                Options.Create(new MailerSettings()),
                tokenService);

            var result = controller.VerifyEmail(token, email);

            var ok = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Email verified.", ok.Value);
        }

        [Fact]
        public void VerifyEmail_ReturnsBadRequest_ForInvalidToken()
        {
            var controller = new VerificationController(
                Mock.Of<ILogger<VerificationController>>(),
                Mock.Of<IEmailService>(),
                Options.Create(new MailerSettings()),
                new TokenService("secret"));

            var result = controller.VerifyEmail("INVALID", "alice@example.com");

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid token.", bad.Value);
        }

        [Fact]
        public void VerifyEmail_ReturnsBadRequest_ForMissingInput()
        {
            var controller = new VerificationController(
                Mock.Of<ILogger<VerificationController>>(),
                Mock.Of<IEmailService>(),
                Options.Create(new MailerSettings()),
                new TokenService("secret"));

            var result = controller.VerifyEmail(string.Empty, string.Empty);

            var bad = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Token and email are required.", bad.Value);
        }
    }
}
