namespace HamEvent.Data.Model
{
    public class QSO
    {
        public required string Callsign1 { get; set; }
        public required string Callsign2 { get; set; }
        public string? RST1 { get; set; }
        public string? RST2 { get; set; }
        public required string Band { get; set; }
        public required string Mode { get; set; }
        public required DateTime Timestamp { get; set; }
        public Guid EventId { get; set; }
        public required Event Event { get; set; }
    }
}