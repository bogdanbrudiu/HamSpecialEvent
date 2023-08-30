using Microsoft.Extensions.Hosting;

namespace HamEvent.Data.Model
{
    public class Event
    {
        public Guid Id { get; set; }
        public Guid SecretKey { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string DiplomaURL { get; set; }        
        public ICollection<QSO> QSOs { get; } = new List<QSO>();


    }
}