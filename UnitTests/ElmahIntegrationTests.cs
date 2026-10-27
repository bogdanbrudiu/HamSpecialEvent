using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace UnitTests
{
    [Collection("Elmah integration")]
    public class ElmahIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public ElmahIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        private WebApplicationFactory<Program> CreateFactory(string? remoteIp)
        {
            return _factory.WithWebHostBuilder(builder =>
            {
                builder.UseSetting("Logging:File:Path", $"elmah-integration-{Guid.NewGuid():N}.log");
                builder.UseSetting("IPWhitelist:Whitelist:0", "203.0.113.10");
                builder.ConfigureServices(services =>
                {
                    services.AddSingleton<IStartupFilter>(new RemoteIpStartupFilter(remoteIp));
                });
            });
        }

        private sealed class RemoteIpStartupFilter : IStartupFilter
        {
            private readonly IPAddress? _remoteIp;

            public RemoteIpStartupFilter(string? remoteIp)
            {
                _remoteIp = remoteIp == null ? null : IPAddress.Parse(remoteIp);
            }

            public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
            {
                return app =>
                {
                    app.Use(async (context, nextMiddleware) =>
                    {
                        context.Connection.RemoteIpAddress = _remoteIp;
                        await nextMiddleware();
                    });
                    next(app);
                };
            }
        }

        [Theory]
        [InlineData("127.0.0.1")]
        [InlineData("::1")]
        [InlineData("203.0.113.10")]
        [InlineData("::ffff:203.0.113.10")]
        public async Task ElmahEndpoint_ReturnsOk_ForAllowedAddress(string remoteIp)
        {
            using var factory = CreateFactory(remoteIp);
            using var client = factory.CreateClient();
            var res = await client.GetAsync("/api/elmah");
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
            var body = await res.Content.ReadAsStringAsync();
            Assert.Contains("ELMAH", body, System.StringComparison.OrdinalIgnoreCase);
        }

        [Theory]
        [InlineData("203.0.113.11", "/api/elmah")]
        [InlineData("::ffff:203.0.113.11", "/api/elmah")]
        [InlineData(null, "/api/elmah")]
        [InlineData("203.0.113.11", "/api/elmah/detail")]
        public async Task ElmahEndpoint_ReturnsForbidden_ForDeniedAddress(string? remoteIp, string path)
        {
            using var factory = CreateFactory(remoteIp);
            using var client = factory.CreateClient();
            var res = await client.GetAsync(path);
            Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
        }
    }
}
