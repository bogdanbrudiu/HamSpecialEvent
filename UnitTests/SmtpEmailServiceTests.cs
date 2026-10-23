using HamEvent;
using HamEvent.Services;
using Microsoft.Extensions.Options;
using Moq;

namespace UnitTests
{
    public class SmtpEmailServiceTests
    {
        [Fact]
        public async Task SendAsync_Throws_WhenNoRecipients()
        {
            var renderer = new Mock<IEmailTemplateRenderer>();
            var service = new SmtpEmailService(
                renderer.Object,
                Options.Create(new MailerSettings
                {
                    From = "noreply@example.com",
                    Host = "smtp.example.com",
                    Port = 587,
                    EnableSSL = true
                }));

            var message = new EmailMessage
            {
                Subject = "Subject",
                TemplateName = "Shared/ValidateEmail",
                ToAddresses = new List<string>()
            };

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.SendAsync(message));
            renderer.Verify(r => r.RenderAsync(It.IsAny<string>(), It.IsAny<object?>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task SendAsync_Throws_WhenTemplateMissing()
        {
            var renderer = new Mock<IEmailTemplateRenderer>();
            var service = new SmtpEmailService(
                renderer.Object,
                Options.Create(new MailerSettings
                {
                    From = "noreply@example.com",
                    Host = "smtp.example.com",
                    Port = 587,
                    EnableSSL = true
                }));

            var message = new EmailMessage
            {
                Subject = "Subject",
                TemplateName = "",
                ToAddresses = new List<string> { "alice@example.com" }
            };

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.SendAsync(message));
            renderer.Verify(r => r.RenderAsync(It.IsAny<string>(), It.IsAny<object?>(), It.IsAny<CancellationToken>()), Times.Never);
        }

        [Fact]
        public async Task SendAsync_Throws_WhenHostMissing()
        {
            var renderer = new Mock<IEmailTemplateRenderer>();
            var service = new SmtpEmailService(
                renderer.Object,
                Options.Create(new MailerSettings
                {
                    From = "noreply@example.com",
                    Host = "",
                    Port = 587,
                    EnableSSL = true
                }));

            var message = new EmailMessage
            {
                Subject = "Subject",
                TemplateName = "Shared/ValidateEmail",
                ToAddresses = new List<string> { "alice@example.com" }
            };

            await Assert.ThrowsAsync<InvalidOperationException>(() => service.SendAsync(message));
            renderer.Verify(r => r.RenderAsync(It.IsAny<string>(), It.IsAny<object?>(), It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
