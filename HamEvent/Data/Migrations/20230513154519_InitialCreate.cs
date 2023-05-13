using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HamEvent.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "QSO",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Callsign1 = table.Column<string>(type: "TEXT", nullable: false),
                    Callsign2 = table.Column<string>(type: "TEXT", nullable: false),
                    RST1 = table.Column<string>(type: "TEXT", nullable: true),
                    RST2 = table.Column<string>(type: "TEXT", nullable: true),
                    Band = table.Column<string>(type: "TEXT", nullable: false),
                    Mode = table.Column<string>(type: "TEXT", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QSO", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QSO");
        }
    }
}
