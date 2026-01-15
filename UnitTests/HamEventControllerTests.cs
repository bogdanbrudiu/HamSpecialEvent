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
            Assert.Equal("",events.Data[0].SecretKey);
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
            var qsos = hamEventController.Get(new Guid("11111111-1111-1111-1111-111111111111"),0,10);

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
            var e1 = new Event { Id = Guid.NewGuid(), SecretKey = "old1", Name = "Test1", Description = "Desc", Diploma = "Dip", Email = "test@example.com" };
            var e2 = new Event { Id = Guid.NewGuid(), SecretKey = "old2", Name = "Test2", Description = "Desc", Diploma = "Dip", Email = "test@example.com" };
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
            dynamic payload = result.Value;
            Assert.Equal(2, (int)payload.count);
            var refreshed = context.Events.ToList();
            Assert.DoesNotContain(refreshed, e => e.SecretKey == "old1" || e.SecretKey == "old2");
            mailer.Verify(m => m.SendAsync(It.IsAny<MailerModel>()), Times.Once);
        }




    }
}