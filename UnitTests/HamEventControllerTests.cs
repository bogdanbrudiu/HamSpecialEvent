using AutoMapper;
using Castle.Core.Logging;
using HamEvent.Controllers;
using HamEvent.Data;
using HamEvent.Data.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.EntityFrameworkCore;
using System.Collections.Generic;

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
            var hamEventContextMock = new Mock<HamEventContext>();
            hamEventContextMock.Setup<DbSet<Event>>(x => x.Events)
                .ReturnsDbSet(TestDataHelper.GetFakeEventsList());

            //Act
            HamEventController hamEventController = new(loggerMock.Object, mapperMock.Object, hamEventContextMock.Object);
            var events = hamEventController.Get(null);

            //Assert
            Assert.NotNull(events);
            Assert.Equal(100, events.Count);
            Assert.Equal(10, events.Data.Count);
            Assert.Equal(Guid.Empty,events.Data[0].SecretKey);
        }

        [Fact]
        public void GetLive()
        {
            // Arrange
            Mock<ILogger<HamEventController>> loggerMock = new Mock<ILogger<HamEventController>>();
            Mock<IMapper> mapperMock = new Mock<IMapper>();
            var hamEventContextMock = new Mock<HamEventContext>();
            hamEventContextMock.Setup<DbSet<QSO>>(x => x.QSOs)
                .ReturnsDbSet(TestDataHelper.GetFakeLiveQSOsList());

            //Act
            HamEventController hamEventController = new(loggerMock.Object, mapperMock.Object, hamEventContextMock.Object);
            var operators = hamEventController.Live(new Guid("11111111-1111-1111-1111-111111111111")).Value;

            //Assert
            Assert.NotNull(operators);
            Assert.Equal(2, operators.Count);
            Assert.Equal(2, operators.Where(o => o.Callsign.Equals("Callsign1")).First().lastQSOs.Count());
            Assert.Equal(1, operators.Where(o => o.Callsign.Equals("Callsign11")).First().lastQSOs.Count());
        }
    }
}