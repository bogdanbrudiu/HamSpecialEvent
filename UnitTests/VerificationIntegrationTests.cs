using System.Net;
using System.Threading;
using System.Threading.Tasks;
using ElmahCore;
using HamEvent.Services;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Moq;

namespace UnitTests
{
    [Collection("Elmah integration")]
    public class VerificationIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public VerificationIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory.WithWebHostBuilder(builder =>
            {
                builder.UseSetting("Logging:File:Path", $"verification-integration-{Guid.NewGuid():N}.log");
                builder.ConfigureServices(services =>
                {
                    services.RemoveAll<IEmailService>();
                    services.AddSingleton<FakeEmailService>();
                    services.AddScoped<IEmailService>(sp => sp.GetRequiredService<FakeEmailService>());
                });
            });
        }

        private sealed class FakeEmailService : IEmailService
        {
            private int _sendCount;

            public int SendCount => _sendCount;

            public Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
            {
                Interlocked.Increment(ref _sendCount);
                return Task.CompletedTask;
            }
        }

        [Fact]
        public async Task SendVerificationEmail_ReturnsOk_AndCallsEmailService()
        {
            var client = _factory.CreateClient();

            var response = await client.GetAsync("/api/Verification/send-verification?email=alice@example.com");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            using var scope = _factory.Services.CreateScope();
            var fake = scope.ServiceProvider.GetRequiredService<FakeEmailService>();
            Assert.Equal(1, fake.SendCount);
        }

        [Fact]
        public async Task SendVerificationEmail_ReportsCaughtFailureToElmah_WithoutExposingDetails()
        {
            var message = $"Simulated SMTP failure {Guid.NewGuid():N}";
            var emailService = new Mock<IEmailService>();
            emailService.Setup(service => service.SendAsync(It.IsAny<EmailMessage>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new InvalidOperationException(message));
            var errorLog = new MemoryErrorLog();

            using var factory = _factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureServices(services =>
                {
                    services.RemoveAll<IEmailService>();
                    services.AddScoped<IEmailService>(_ => emailService.Object);
                    services.RemoveAll<ErrorLog>();
                    services.AddSingleton<ErrorLog>(errorLog);
                });
            });
            using var client = factory.CreateClient();

            var response = await client.GetAsync("/api/Verification/send-verification?email=alice@example.com");

            Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
            Assert.DoesNotContain(message, await response.Content.ReadAsStringAsync());
            var errors = new List<ErrorLogEntry>();
            errorLog.GetErrors(0, 20, errors);
            Assert.Contains(errors, entry => entry.Error.Message == message);
        }

        [Fact]
        public async Task SendVerificationEmail_ReturnsBadRequest_ForInvalidEmail()
        {
            var client = _factory.CreateClient();

            var response = await client.GetAsync("/api/Verification/send-verification?email=not-an-email");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Verify_ReturnsBadRequest_WhenTokenMissing()
        {
            var client = _factory.CreateClient();

            var response = await client.GetAsync("/api/Verification/verify?token=&email=alice@example.com");

            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }
    }
}
