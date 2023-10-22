using HamEvent.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
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
                        HasTop = true,
                        StartDate = new DateTime(2023,12, 1, 0, 0, 0, DateTimeKind.Utc),
                        EndDate = new DateTime(2023, 12, 31, 23, 59, 59, DateTimeKind.Utc),
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
        margin-top: 20px;
        margin-bottom: 10px;
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
        top: 240px;
        left: 35%;
    transform: translate(-50%, 0);
}
.Timestamp{
    position: absolute;
        top: 485px;
        left: 50%;
    transform: translate(-50%, 0);
}
.Rank{
    position: absolute;
        top: 240px;
        left: 610px;
    transform: translate(-50%, 0);
}
.Points{
    position: absolute;
        top: 357px;
        left: 232px;
    transform: translate(-50%, 0);
}
.QSOs{
    position: absolute;
        top: 357px;
        left: 358px;
    transform: translate(-50%, 0);
}
.Bands{
    position: absolute;
        top: 357px;
        left: 484px;
    transform: translate(-50%, 0);
}
.Modes{
    position: absolute;
        top: 357px;
        left: 610px;
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
<div class=""Rank""><h2>--Rank--</h2></div>
<div class=""Timestamp""><h3>--Timestamp--</h3></div>       
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
                       Description = "YP100UPT is a special event on the Open Campus Night, part of the European Researchers Night project. This event is supported by Politehnica University Timisoara, Faculty of Electronics Telecommunications and Information Technologies, Measurements and Optoelectronics Department in partenership with QSO Banat Timisoara (YO2KQT) radio ham club.",
                       HasTop = false,
                       StartDate = new DateTime(2023, 9, 29, 0, 0, 0, DateTimeKind.Utc),
                       EndDate = new DateTime(2023, 9, 29, 23, 59, 59, DateTimeKind.Utc),
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

    .background {
        background-image: url(https://hamevent.brudiu.ro/static/YP100UPT.jpg);
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
        top: 280px;
        left: 68%;
    transform: translate(-50%, 0);
}

</STYLE>
<html>
<body>
    <div class=""background"">
<div class=""callsign""><h1>--callsign2--</h2></div>
      
    </div>
</body>
</html>"
                   }
               ); ; 
            modelBuilder.Entity<QSO>().HasKey(q => new { q.Callsign1, q.Callsign2, q.Band, q.Mode, q.Timestamp, q.EventId });
        }

        public string DbPath { get; } = "Database\\QSOs.db";



        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlite($"Data Source={DbPath}");
    }
}
