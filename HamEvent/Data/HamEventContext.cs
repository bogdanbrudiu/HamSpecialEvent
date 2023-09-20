using HamEvent.Data.Model;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Metadata;

namespace HamEvent.Data
{
    public class HamEventContext : DbContext
    {
        public HamEventContext(DbContextOptions<HamEventContext> options) : base(options)
        {

        }

        public DbSet<QSO> QSOs { get; set; }
        public DbSet<Event> Events { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>()
              .HasMany(e => e.QSOs)
              .WithOne(e => e.Event)
              .HasForeignKey(e => e.EventId)
              .IsRequired();
            modelBuilder.Entity<Event>().HasData(
                    new Event
                    {
                        Id = Guid.NewGuid(),
                        SecretKey = Guid.NewGuid(),
                        Name = "YP20KQT",
                        Description = "YP20KQT Event",
                        Diploma = @"<STYLE type=""text/css"">
    html, body {
        margin: 0;
        padding: 0;
    }

    h1 {
        text-align: center;
        font-size: xx-large;
        margin-bottom: 20px;
    }

    h2 {
        text-align: center;
        font-size: x-large;
        margin-top: 30px;
        margin-bottom: 10px;
    }

    h3 {
        text-align: center;
        font-size: large;
        margin-top: 20px;
        margin-bottom: 10px;
    }

    p {
        font-size: 18px;
        line-height: 1.5;
        text-align: center;
        margin-bottom: 10px;
    }

    img {
        display: block;
        margin: 20px auto 0;
        max-width: 150px;
    }

    .background {
        background-image: url(https://hamevent.brudiu.ro/static/YP20KQT.jpg);
        width: 842px;
        height: 595px;
        margin: 0;
        padding: 0;
        background-position: center center;
        background-size: 100%;
        background-repeat: no-repeat;
        position: relative;
    }

    .diploma {
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        margin: 0 auto;
        padding: 30px;
    }
</STYLE>
<html>
<body>
    <div class=""background"">
        <div class=""diploma"">
            <h1>--EventName--</h1>
            <p>--EventDescription--</p>
            <p>We take the pleasure in awarding</p>
            <h2>--callsign2--</h2>

            <h3>Points:--Points--</h3>
            <h3>QSO:--QSOs--</h3>
            <h3>Bands:--Bands--</h3>
            <h3>Modes:--Modes--</h3>

            <img src=""./static/radio-icon.png"" alt=""Ham Special Event"">
        </div>
    </div>
</body>
</html>"
                    }
                );
            modelBuilder.Entity<Event>().HasData(
                   new Event
                   {
                       Id = Guid.NewGuid(),
                       SecretKey = Guid.NewGuid(),
                       Name = "YP100UPT",
                       Description = "YP100UPT Event",
                       Diploma = ""
                   }
               ); 
            modelBuilder.Entity<QSO>().HasKey(q => new { q.Callsign1, q.Callsign2, q.Band, q.Mode, q.Timestamp, q.EventId });
        }

        public string DbPath { get; } = "Database\\QSOs.db";



        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlite($"Data Source={DbPath}");
    }
}
