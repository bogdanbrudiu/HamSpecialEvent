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
                    Email = "Email" + i,
                    Diploma = "Diploma"+i,
                    Rules = "Rules"+i,
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
                Timestamp = DateTime.UtcNow
            }); ; ;
            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign1",
                Callsign2 = "Callsign2",
                Band = "40M",
                Mode = "SSB",
                Freq = "7000",
                Timestamp = DateTime.UtcNow.AddMinutes(-35),
            });
            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign1",
                Callsign2 = "Callsign2",
                Band = "80M",
                Mode = "SSB",
                Freq = "3500",
                Timestamp = DateTime.UtcNow,
            });

            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign11",
                Callsign2 = "Callsign2",
                Band = "20M",
                Mode = "SSB",
                Freq = "14000",
                Timestamp = DateTime.UtcNow
            });
            result.Add(new QSO()
            {
                EventId = new Guid("11111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign11",
                Callsign2 = "Callsign2",
                Band = "80M",
                Mode = "SSB",
                Freq = "3500",
                Timestamp = DateTime.UtcNow.AddMinutes(-35),
            });
            result.Add(new QSO()
            {
                EventId = new Guid("21111111-1111-1111-1111-111111111111"),
                Callsign1 = "Callsign11",
                Callsign2 = "Callsign2",
                Band = "80M",
                Mode = "SSB",
                Freq = "3500",
                Timestamp = DateTime.UtcNow.AddMinutes(-35),
            });
            return result;

        }

        public static List<QSO> GetFakeQSOsForTop(Guid eventId)
        {
            return new List<QSO>
            {
                new QSO { EventId = eventId, Callsign1 = "Op1", Callsign2 = "User1", Band = "20m", Mode = "SSB", Timestamp = DateTime.UtcNow.AddMinutes(-5), Freq = "14000" },
                new QSO { EventId = eventId, Callsign1 = "Op1", Callsign2 = "User1", Band = "40m", Mode = "CW", Timestamp = DateTime.UtcNow.AddMinutes(-10), Freq = "7000" },
                new QSO { EventId = eventId, Callsign1 = "Op2", Callsign2 = "User2", Band = "20m", Mode = "SSB", Timestamp = DateTime.UtcNow.AddMinutes(-15), Freq = "14000" },
                new QSO { EventId = eventId, Callsign1 = "Op2", Callsign2 = "User2", Band = "80m", Mode = "SSB", Timestamp = DateTime.UtcNow.AddMinutes(-20), Freq = "3500" },
            };
        }
    }
}