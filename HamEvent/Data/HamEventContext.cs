using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

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
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<QSO>().ToTable("QSO").HasKey(e=>e.Id);
        }

        public string DbPath { get; } = "Database\\QSOs.db";



        // The following configures EF to create a Sqlite database file in the
        // special "local" folder for your platform.
        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");
    }
}
