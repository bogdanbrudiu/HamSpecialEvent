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
            //var folder = Environment.SpecialFolder.LocalApplicationData;
            //var path = Environment.GetFolderPath(folder);
            //DbPath = System.IO.Path.Join(path, "QSOs.db");
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
                        DiplomaURL = "https://hamevent.brudiu.ro/static/diploma-background.jpg"
                    }
                );
            modelBuilder.Entity<Event>().HasData(
                   new Event
                   {
                       Id = Guid.NewGuid(),
                       SecretKey = Guid.NewGuid(),
                       Name = "YP100UPT",
                       Description = "YP100UPT Event",
                       DiplomaURL = "https://hamevent.brudiu.ro/static/diploma-background.jpg"
                   }
               );
            modelBuilder.Entity<QSO>().HasKey(q => new { q.Callsign1, q.Callsign2, q.Band, q.Mode, q.Timestamp, q.EventId });
        }

        public string DbPath { get; } = "Database\\QSOs.db";



        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");
    }
}
