using Microsoft.Extensions.Hosting;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace HamEvent.Data.Model
{
    public class Event
    {
        public Guid Id { get; set; }
        public Guid SecretKey { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Diploma { get; set; }
        [JsonIgnore]
        public ICollection<QSO> QSOs { get; } = new List<QSO>();
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

        [NotMapped]
        public int? Days
        {
            get
            {
                if (StartDate.HasValue && EndDate.HasValue) { return (EndDate.Value - StartDate.Value).Days+1; }
                return null;
            }
        }


        [NotMapped]
        public string? Last
        {
            get
            {
                return QSOs.OrderByDescending(q=>q.Timestamp).FirstOrDefault()?.Timestamp.ToString();
            }
        }

        [NotMapped]
        public string? First
        {
            get
            {
                return QSOs.OrderBy(q => q.Timestamp).FirstOrDefault()?.Timestamp.ToString();
            }
        }

        [NotMapped]
        public int Count
        {
            get
            {
                return QSOs.Count;
            }
        }

        [NotMapped]
        public int Unique
        {
            get
            {
                return QSOs.DistinctBy(q => q.Callsign2).Count();
            }
        }

    }
}