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

    h3 {
        text-align: center;
        font-size: large;
        margin-top: 20px;
        margin-bottom: 10px;
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
.callsign{
    position: absolute;
        top: 375px;
        left: 50%;
    transform: translate(-50%, 0);
}
.Points{
    position: absolute;
        top:60px;
        left: 126px;
    transform: translate(-50%, 0);
}
.QSOs{
    position: absolute;
        top:60px;
        left: 224px;
    transform: translate(-50%, 0);
}
.Bands{
    position: absolute;
        top:60px;
        left: 618px;
    transform: translate(-50%, 0);
}
.Modes{
    position: absolute;
        top:60px;
        left: 716px;
    transform: translate(-50%, 0);
}
</STYLE>
<html>
<body>
    <div class=""background"">
<div class=""callsign""><h1>--callsign2--</h2></div>
<div class=""Points""><h3>--Points--</h3></div>
<div class=""QSOs""><h3>--QSOs--</h3></div>
<div class=""Bands""><h3>--Bands--</h3></div>
<div class=""Modes""><h3>--Modes--</h3></div>
       
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
