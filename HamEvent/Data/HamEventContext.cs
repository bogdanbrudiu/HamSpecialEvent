using System.Text.Json;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using HamEvent.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace HamEvent.Data
{
    public class HamEventContext : DbContext
    {
        public HamEventContext(DbContextOptions<HamEventContext> options) : base(options)
        {
        }
        public HamEventContext()
        {
        }
        public virtual DbSet<QSO> QSOs { get; set; }
        public virtual DbSet<Event> Events { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var dictConverter = new ValueConverter<Dictionary<string, string>, string>(
                v => JsonSerializer.Serialize(v ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase), (JsonSerializerOptions?)null),
                v => DeserializeDictionary(v));

            var dictComparer = new ValueComparer<Dictionary<string, string>>(
                (l, r) => (l ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)).OrderBy(kv => kv.Key).SequenceEqual((r ?? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)).OrderBy(kv => kv.Key)),
                v => v == null ? 0 : v.Aggregate(0, (hash, pair) => HashCode.Combine(hash, pair.Key.GetHashCode(), pair.Value == null ? 0 : pair.Value.GetHashCode())),
                v => v == null ? new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) : new Dictionary<string, string>(v, StringComparer.OrdinalIgnoreCase));

            modelBuilder.Entity<Event>()
              .HasMany(e => e.QSOs)
              .WithOne(e => e.Event)
              .HasForeignKey(e => e.EventId)
              .IsRequired();

            modelBuilder.Entity<Event>()
                .Property(e => e.Description)
                .HasConversion(dictConverter)
                .Metadata.SetValueComparer(dictComparer);

            modelBuilder.Entity<Event>()
                .Property(e => e.Rules)
                .HasConversion(dictConverter)
                .Metadata.SetValueComparer(dictComparer);
          
            modelBuilder.Entity<QSO>().HasKey(q => new { q.Callsign1, q.Callsign2, q.Band, q.Mode, q.Timestamp, q.EventId });
        }

        private static Dictionary<string, string> DeserializeDictionary(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            }

            try
            {
                var deserialized = JsonSerializer.Deserialize<Dictionary<string, string>>(value);
                if (deserialized != null)
                {
                    return new Dictionary<string, string>(deserialized, StringComparer.OrdinalIgnoreCase);
                }
            }
            catch
            {
                // fall back to treating legacy plain text as English content
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                {
                    { "en", value }
                };
            }

            return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
        }
    }
}

