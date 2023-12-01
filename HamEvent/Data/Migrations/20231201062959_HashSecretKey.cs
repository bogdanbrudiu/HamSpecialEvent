using HamEvent.Controllers;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HamEvent.Data.Migrations
{
    /// <inheritdoc />
    public partial class HashSecretKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var context = new HamEventContext();
            foreach (var hamevent in context.Events) {
                hamevent.SecretKey = HamEventController.ComputeSha256Hash(new Guid(hamevent.SecretKey));
            }
            context.SaveChanges();
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
