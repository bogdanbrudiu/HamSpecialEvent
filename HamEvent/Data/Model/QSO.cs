namespace HamEvent.Data.Model
{
    public class QSO
    {
        public int Id { get; set; }
        public string Callsign1 { get; set; }
        public string Callsign2 { get; set; }
        public string? RST1 { get; set; }
        public string? RST2 { get; set; }
        public string Band { get; set; }
        public string Mode { get; set; }
        public DateTime Timestamp { get; set; }
        public Guid EventId { get; set; }
        public Event Event { get; set; }
    }
}