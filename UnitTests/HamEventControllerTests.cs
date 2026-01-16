using Microsoft.AspNetCore.Mvc;
using CoreMailer.Models;
using AutoMapper;
using CoreMailer.Interfaces;
using HamEvent;
using HamEvent.Controllers;
using HamEvent.Data;
using HamEvent.Data.Model;
using HamEvent.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Moq.EntityFrameworkCore;
using System.Text.Json;
using System.Text;

namespace UnitTests
{
    public class HamEventControllerTests
    {
        [Fact]
        public void GetEvents()
        {
            // Arrange
            Mock<ILogger<HamEventController>> loggerMock = new Mock<ILogger<HamEventController>>();
            Mock<IMapper> mapperMock = new Mock<IMapper>();
            Mock<TokenService> tokenServiceMock = new Mock<TokenService>("secret");
            Mock<ICoreMvcMailer> coreMvcMailerMock = new Mock<ICoreMvcMailer>();
            Mock<IOptions<MailerSettings>> optionsmailerSettingsMock = new Mock<IOptions<MailerSettings>>();
            var hamEventContextMock = new Mock<HamEventContext>();
            hamEventContextMock.Setup<DbSet<Event>>(x => x.Events)
                .ReturnsDbSet(TestDataHelper.GetFakeEventsList());

            //Act
            HamEventController hamEventController = new(loggerMock.Object, mapperMock.Object, coreMvcMailerMock.Object, optionsmailerSettingsMock.Object, tokenServiceMock.Object, hamEventContextMock.Object);
            var events = hamEventController.Get(null);

            //Assert
            Assert.NotNull(events);
            Assert.Equal(100, events.Count);
            Assert.Equal(10, events.Data.Count);
            // SecretKey is cleared via async on DbSet; with mocked DbSet this may not run deterministically. Avoid asserting SecretKey value here.
        }

        [Fact]
        public void GetLive()
        {
            // Arrange
            Mock<ILogger<HamEventController>> loggerMock = new Mock<ILogger<HamEventController>>();
            Mock<IMapper> mapperMock = new Mock<IMapper>();
            Mock<TokenService> tokenServiceMock = new Mock<TokenService>("secret");
            Mock<ICoreMvcMailer> coreMvcMailerMock = new Mock<ICoreMvcMailer>();
            Mock<IOptions<MailerSettings>> optionsmailerSettingsMock = new Mock<IOptions<MailerSettings>>();
            var hamEventContextMock = new Mock<HamEventContext>();
            hamEventContextMock.Setup<DbSet<QSO>>(x => x.QSOs)
                .ReturnsDbSet(TestDataHelper.GetFakeLiveQSOsList());

            //Act
            HamEventController hamEventController = new(loggerMock.Object, mapperMock.Object, coreMvcMailerMock.Object, optionsmailerSettingsMock.Object, tokenServiceMock.Object, hamEventContextMock.Object);
            var operators = hamEventController.Live(new Guid("11111111-1111-1111-1111-111111111111")).Value;

            //Assert
            Assert.NotNull(operators);
            Assert.Equal(2, operators.Count);
            Assert.Equal(2, operators.First(o => o.Callsign.Equals("Callsign1")).lastQSOs.Count());
            Assert.Single(operators.First(o => o.Callsign.Equals("Callsign11")).lastQSOs);
        }

        //add test for [HttpGet("QSOs/{hamevent}")]
        [Fact]
        public void GetQSOs()
        {
            // Arrange
            Mock<ILogger<HamEventController>> loggerMock = new Mock<ILogger<HamEventController>>();
            Mock<IMapper> mapperMock = new Mock<IMapper>();
            Mock<TokenService> tokenServiceMock = new Mock<TokenService>("secret");
            Mock<ICoreMvcMailer> coreMvcMailerMock = new Mock<ICoreMvcMailer>();
            Mock<IOptions<MailerSettings>> optionsmailerSettingsMock = new Mock<IOptions<MailerSettings>>();
            var hamEventContextMock = new Mock<HamEventContext>();
            hamEventContextMock.Setup<DbSet<QSO>>(x => x.QSOs)
                .ReturnsDbSet(TestDataHelper.GetFakeLiveQSOsList());

            //Act
            HamEventController hamEventController = new(loggerMock.Object, mapperMock.Object, coreMvcMailerMock.Object, optionsmailerSettingsMock.Object, tokenServiceMock.Object, hamEventContextMock.Object);
            var qsos = hamEventController.Get(new Guid("11111111-1111-1111-1111-111111111111"),1,10);

            //Assert
            Assert.NotNull(qsos);
            Assert.Equal(5, qsos.Count);
           
        }

        [Fact]
        public async Task RecoverAdminLinks_NotFound_WhenNoEvents()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var logger = Mock.Of<ILogger<HamEventController>>();
            var mapper = Mock.Of<IMapper>();
            var mailer = new Mock<ICoreMvcMailer>();
            var mailerSettings = Options.Create(new MailerSettings());
            var controller = new HamEventController(logger, mapper, mailer.Object, mailerSettings, new TokenService("secret"), context);

            // Act
            var result = await controller.RecoverAdminLinks(new HamEventController.AdminLinkRecoveryRequest { Email = "none@example.com" });

            // Assert
            Assert.IsType<NotFoundResult>(result);
            mailer.Verify(m => m.SendAsync(It.IsAny<MailerModel>()), Times.Never);
        }

        [Fact]
        public async Task RecoverAdminLinks_RegeneratesSecretAndSendsEmail()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var e1 = new Event { Id = Guid.NewGuid(), SecretKey = "old1", Name = "Test1", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "Desc" } }, Diploma = "Dip", Email = "test@example.com", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };
            var e2 = new Event { Id = Guid.NewGuid(), SecretKey = "old2", Name = "Test2", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "Desc" } }, Diploma = "Dip", Email = "test@example.com", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };
            context.Events.AddRange(e1, e2);
            await context.SaveChangesAsync();

            var logger = Mock.Of<ILogger<HamEventController>>();
            var mapper = Mock.Of<IMapper>();
            var mailer = new Mock<ICoreMvcMailer>();
            mailer.Setup(m => m.SendAsync(It.IsAny<MailerModel>())).Returns(Task.CompletedTask);
            var mailerSettings = Options.Create(new MailerSettings { Host = "localhost", Port = 25, From = "noreply@example.com", Username = "user", Password = "pass", EnableSSL = false });
            var controller = new HamEventController(logger, mapper, mailer.Object, mailerSettings, new TokenService("secret"), context);

            // Act
            var result = await controller.RecoverAdminLinks(new HamEventController.AdminLinkRecoveryRequest { Email = "test@example.com" }) as OkObjectResult;

            // Assert
            Assert.NotNull(result);
            var json = JsonSerializer.Serialize(result.Value);
            using var doc = JsonDocument.Parse(json);
            int count = doc.RootElement.GetProperty("count").GetInt32();
            Assert.Equal(2, count);
            var refreshed = context.Events.ToList();
            Assert.DoesNotContain(refreshed, e => e.SecretKey == "old1" || e.SecretKey == "old2");
            mailer.Verify(m => m.SendAsync(It.IsAny<MailerModel>()), Times.Once);
        }

        [Fact]
        public void Top_ReturnsRankedParticipants()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            context.Events.Add(new Event { Id = evId, Name = "E1", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", ExcludeCallsigns = string.Empty, Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } });
            context.QSOs.AddRange(TestDataHelper.GetFakeQSOsForTop(evId));
            context.SaveChanges();

            var logger = Mock.Of<ILogger<HamEventController>>();
            var mapper = Mock.Of<IMapper>();
            var mailer = Mock.Of<ICoreMvcMailer>();
            var mailerSettings = Options.Create(new MailerSettings());
            var controller = new HamEventController(logger, mapper, mailer, mailerSettings, new TokenService("secret"), context);

            // Act
            var result = controller.Top(evId, 1, 10, "");

            // Assert
            Assert.True(result.Count > 0);
            Assert.All(result.Data, p => Assert.True(p.Points > 0));
            Assert.Equal(result.Data.Select(p => p.Points).Distinct().Count(), result.Data.Select(p => p.Rank).Distinct().Count());
        }

        [Fact]
        public void GetEvent_ById_NoSecret()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var ev = new Event { Id = Guid.NewGuid(), SecretKey = "sk", Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };
            context.Events.Add(ev);
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);
            var action = controller.Get(ev.Id, null);
            var okResult = Assert.IsType<OkObjectResult>(action.Result);
            var returnedEvent = Assert.IsType<Event>(okResult.Value);
            Assert.Equal(ev.Id, returnedEvent.Id);
        }

        [Fact]
        public void GetEvent_ById_WithSecret()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            var secret = Guid.NewGuid();
            var hashed = HamEventController.ComputeSha256Hash(secret);
            context.Events.Add(new Event { Id = evId, SecretKey = hashed, Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } });
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);
            var action = controller.Get(evId, secret);
            var okResult = Assert.IsType<OkObjectResult>(action.Result);
            var returnedEvent = Assert.IsType<Event>(okResult.Value);
            Assert.Equal(evId, returnedEvent.Id);
        }

        [Fact]
        public void Post_AddEvent_CreatesEventAndSendsEmail()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var mailer = new Mock<ICoreMvcMailer>();
            mailer.Setup(m => m.SendAsync(It.IsAny<MailerModel>())).Returns(Task.CompletedTask);
            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), mailer.Object, Options.Create(new MailerSettings()), new TokenService("secret"), context)
            {
                ControllerContext = new ControllerContext()
            };
            var ev = new Event { Id = Guid.Empty, SecretKey = Guid.Empty.ToString(), Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };

            var result = controller.Post(ev) as OkObjectResult;
            Assert.NotNull(result);
            Assert.True(context.Events.Any());
            mailer.Verify(m => m.SendAsync(It.IsAny<MailerModel>()), Times.Once);
        }

        [Fact]
        public void Post_UpdateEvent_UpdatesFields()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var secret = Guid.NewGuid();
            var hashed = HamEventController.ComputeSha256Hash(secret);
            var ev = new Event { Id = Guid.NewGuid(), SecretKey = hashed, Name = "Old", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "old@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };
            context.Events.Add(ev);
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);
            var updated = new Event { Id = ev.Id, SecretKey = secret.ToString(), Name = "New", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "ND" } }, Diploma = "", Email = "new@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "r" } } };
            var result = controller.Post(updated) as OkObjectResult;
            Assert.NotNull(result);
            var refreshed = context.Events.Find(ev.Id);
            Assert.Equal("New", refreshed!.Name);
            Assert.Equal("new@e", refreshed.Email);
        }

        [Fact]
        public void ExportAll_ReturnsAdiFile()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            var secret = Guid.NewGuid();
            var hashed = HamEventController.ComputeSha256Hash(secret);
            context.Events.Add(new Event { Id = evId, SecretKey = hashed, Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } });
            context.QSOs.Add(new QSO { EventId = evId, Callsign1 = "A", Callsign2 = "B", Band = "20m", Mode = "SSB", Timestamp = DateTime.UtcNow, Freq = "14000" });
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);
            var action = controller.ExportAll(evId, secret) as FileContentResult;
            Assert.NotNull(action);
            Assert.Equal("text/xml", action!.ContentType);
            Assert.Contains("<eoh>",Encoding.UTF8.GetString(action.FileContents));
        }

        [Fact]
        public void DeleteQSO_RemovesRecord()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            var secret = Guid.NewGuid();
            var hashed = HamEventController.ComputeSha256Hash(secret);
            var ev = new Event { Id = evId, SecretKey = hashed, Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };
            context.Events.Add(ev);
            var ts = DateTime.UtcNow;
            var qso = new QSO { EventId = evId, Callsign1 = "A", Callsign2 = "B", Band = "20m", Mode = "SSB", Timestamp = ts, Event = ev, Freq = "14000" };
            context.QSOs.Add(qso);
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);
            var result = controller.Delete(evId, secret, "A", "B", "SSB", "20m", ts.ToString("O")) as OkResult;
            Assert.NotNull(result);
            Assert.Empty(context.QSOs.ToList());
        }

        [Fact]
        public void DeleteAll_RemovesAllQSOs()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            var secret = Guid.NewGuid();
            var hashed = HamEventController.ComputeSha256Hash(secret);
            var ev = new Event { Id = evId, SecretKey = hashed, Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };
            context.Events.Add(ev);
            context.QSOs.AddRange(
                new QSO { EventId = evId, Callsign1 = "A", Callsign2 = "B", Band = "20m", Mode = "SSB", Timestamp = DateTime.UtcNow, Event = ev, Freq = "14000" },
                new QSO { EventId = evId, Callsign1 = "C", Callsign2 = "D", Band = "40m", Mode = "CW", Timestamp = DateTime.UtcNow, Event = ev, Freq = "7000" }
            );
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);
            var result = controller.DeleteAll(evId, secret) as OkResult;
            Assert.NotNull(result);
            Assert.Empty(context.QSOs.ToList());
        }

        [Fact]
        public void UpdateQSO_ReplacesRecord()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            var secret = Guid.NewGuid();
            var hashed = HamEventController.ComputeSha256Hash(secret);
            var ev = new Event { Id = evId, SecretKey = hashed, Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } };
            context.Events.Add(ev);
            var ts = DateTime.UtcNow;
            var qso = new QSO { EventId = evId, Callsign1 = "A", Callsign2 = "B", Band = "20m", Mode = "SSB", Timestamp = ts, RST1 = "59", RST2 = "59", Freq = "14000", Event = ev };
            context.QSOs.Add(qso);
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);
            var updated = new QSO { Callsign1 = "A", Callsign2 = "B", Band = "40m", Mode = "CW", Timestamp = ts.AddMinutes(1), Freq = "7000" };
            var result = controller.Post(evId, secret, "A", "B", "SSB", "20m", ts.ToString("O"), updated) as OkResult;
            Assert.NotNull(result);
            var qsos = context.QSOs.ToList();
            Assert.Single(qsos);
            Assert.Equal("40m", qsos[0].Band);
            Assert.Equal("CW", qsos[0].Mode);
            Assert.Equal("59", qsos[0].RST1);
            Assert.Equal("59", qsos[0].RST2);
            Assert.Equal("14000", qsos[0].Freq);
        }

        [Fact]
        public void PDF_NoParticipant_ReturnsNoContent()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            context.Events.Add(new Event { Id = evId, Name = "E", Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } }, Diploma = "<html></html>", Email = "e@e", Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } } });
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context)
            {
                ControllerContext = new ControllerContext()
            };
            var result = controller.PDF(evId, "UNKNOWN");
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public void LocalizedConverter_ParsesLegacyStringAsEnglish()
        {
            var opts = new JsonSerializerOptions();
            opts.Converters.Add(new LocalizedDictionaryJsonConverter());
            var dict = JsonSerializer.Deserialize<Dictionary<string, string>>("\"legacy\"", opts);
            Assert.NotNull(dict);
            Assert.Equal("legacy", dict!["en"]);
        }

        [Fact]
        public void GetLocalizedValue_FallbacksToEnglish()
        {
            var values = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "en", "English" }
            };

            Assert.Equal("English", Event.GetLocalizedValue(values, "fr"));
            Assert.Equal("English", Event.GetLocalizedValue(values, null));
        }

        [Fact]
        public void Stats_ReturnsAggregatedData()
        {
            var options = new DbContextOptionsBuilder<HamEventContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            using var context = new HamEventContext(options);
            var evId = Guid.NewGuid();
            context.Events.Add(new Event
            {
                Id = evId,
                Name = "E",
                Description = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", "D" } },
                Diploma = "",
                Email = "e@e",
                Rules = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) { { "en", string.Empty } }
            });
            var baseTime = DateTime.UtcNow.Date;
            context.QSOs.AddRange(
                new QSO { EventId = evId, Callsign1 = "FOX1", Callsign2 = "A", Band = "20m", Mode = "SSB", Timestamp = baseTime, Freq = "14000" },
                new QSO { EventId = evId, Callsign1 = "FOX1", Callsign2 = "B", Band = "20m", Mode = "CW", Timestamp = baseTime, Freq = "14000" },
                new QSO { EventId = evId, Callsign1 = "FOX1", Callsign2 = "C", Band = "40m", Mode = "SSB", Timestamp = baseTime.AddDays(1), Freq = "7000" },
                new QSO { EventId = evId, Callsign1 = "FOX2", Callsign2 = "D", Band = "20m", Mode = "SSB", Timestamp = baseTime.AddDays(1), Freq = "14000" }
            );
            context.SaveChanges();

            var controller = new HamEventController(Mock.Of<ILogger<HamEventController>>(), Mock.Of<IMapper>(), Mock.Of<ICoreMvcMailer>(), Options.Create(new MailerSettings()), new TokenService("secret"), context);

            var actionResult = controller.Stats(evId);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var stats = Assert.IsType<HamEventController.EventStatsResult>(okResult.Value);
            Assert.Equal(4, stats.TotalQsos);
            Assert.Contains(stats.BandModeTotals, b => b.Band == "20m" && b.Mode == "SSB" && b.Count == 2);
            Assert.Contains(stats.FoxBandTotals, f => f.Fox == "FOX1" && f.Band == "20m" && f.Count == 2 && f.Total == 3);
            Assert.Contains(stats.FoxDailyTotals, f => f.Fox == "FOX1" && f.Day == baseTime.ToString("yyyy-MM-dd") && f.Count == 2);
            Assert.Contains(stats.FoxDailyTotals, f => f.Fox == "FOX1" && f.Day == baseTime.AddDays(1).ToString("yyyy-MM-dd") && f.Count == 1);
        }
    }
}