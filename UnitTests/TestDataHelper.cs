using HamEvent.Controllers;
using HamEvent.Data.Model;

namespace UnitTests
{
    internal class TestDataHelper
    {
        public static List<Event> GetFakeEventsList()
        {
            var result = new List<Event>();
            for (var i = 0; i < 100; i++)
            {
                result.Add(
                new Event
                {
                    Id = Guid.NewGuid(),
                    SecretKey = HamEventController.ComputeSha256Hash(Guid.NewGuid()),
                    Name = "Name"+i,
                    Description = "Description"+i,
                    Diploma = "Diploma"+i,
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now.AddDays(1),
                    HasTop = false
                });
            }
            return result;
            
        }

        public static List<QSO> GetFakeLiveQSOsList()
        {
            var result = new List<QSO>();


            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign1",
                Callsign2 = "Callsign2",
                Band = "20M",
                Mode = "SSB",
                Freq = "14000",
                Timestamp = DateTime.Now
            }); ; ;
            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign1",
                Callsign2 = "Callsign2",
                Band = "40M",
                Mode = "SSB",
                Freq = "7000",
                Timestamp = DateTime.Now.AddMinutes(-35),
            });
            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign1",
                Callsign2 = "Callsign2",
                Band = "80M",
                Mode = "SSB",
                Freq = "3500",
                Timestamp = DateTime.Now,
            });

            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign11",
                Callsign2 = "Callsign2",
                Band = "20M",
                Mode = "SSB",
                Freq = "14000",
                Timestamp = DateTime.Now
            });
            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign11",
                Callsign2 = "Callsign2",
                Band = "80M",
                Mode = "SSB",
                Freq = "3500",
                Timestamp = DateTime.Now.AddMinutes(-35),
            });
         
            return result;

        }
    }
}