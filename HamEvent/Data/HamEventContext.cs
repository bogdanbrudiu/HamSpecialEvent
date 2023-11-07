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
        public HamEventContext()
        {
        }
        public virtual DbSet<QSO> QSOs { get; set; }
        public virtual DbSet<Event> Events { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Event>()
              .HasMany(e => e.QSOs)
              .WithOne(e => e.Event)
              .HasForeignKey(e => e.EventId)
              .IsRequired();
          
            modelBuilder.Entity<QSO>().HasKey(q => new { q.Callsign1, q.Callsign2, q.Band, q.Mode, q.Timestamp, q.EventId });
        }

        public string DbPath { get; } = "Database\\QSOs.db";



        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlite($"Data Source={DbPath}");
    }
}
