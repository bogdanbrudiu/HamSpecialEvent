using HamEvent.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Data.SqlClient;

#nullable disable

namespace HamEvent.Data.Migrations
{
    /// <inheritdoc />
    public partial class HashSecretKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            IConfiguration configuration = new ConfigurationBuilder()
             .SetBasePath(Directory.GetCurrentDirectory())
             .AddJsonFile("appsettings.json")
             .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var options = new DbContextOptionsBuilder<HamEventContext>()
                             .UseSqlite(connectionString)
                             .Options;
            var context = new HamEventContext(options);
            foreach (var hamevent in context.Events)
            {
                if (hamevent.SecretKey.Length.Equals(32))
                {
                    hamevent.SecretKey = HamEventController.ComputeSha256Hash(new Guid(hamevent.SecretKey));
                }
            }
            context.SaveChanges();
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
