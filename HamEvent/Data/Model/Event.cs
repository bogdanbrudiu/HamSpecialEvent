using Microsoft.Extensions.Hosting;

namespace HamEvent.Data.Model
{
    public class Event
    {
        public Guid Id { get; set; }
        public Guid SecretKey { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required string Diploma { get; set; }      
        public ICollection<QSO> QSOs { get; } = new List<QSO>();
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }

    }
}