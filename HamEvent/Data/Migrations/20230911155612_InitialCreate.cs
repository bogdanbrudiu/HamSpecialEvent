using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HamEvent.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SecretKey = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    DiplomaURL = table.Column<string>(type: "TEXT", nullable: false),
                    StartDate = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndDate = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QSOs",
                columns: table => new
                {
                    Callsign1 = table.Column<string>(type: "TEXT", nullable: false),
                    Callsign2 = table.Column<string>(type: "TEXT", nullable: false),
                    Band = table.Column<string>(type: "TEXT", nullable: false),
                    Mode = table.Column<string>(type: "TEXT", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EventId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RST1 = table.Column<string>(type: "TEXT", nullable: true),
                    RST2 = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QSOs", x => new { x.Callsign1, x.Callsign2, x.Band, x.Mode, x.Timestamp, x.EventId });
                    table.ForeignKey(
                        name: "FK_QSOs_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Description", "DiplomaURL", "EndDate", "Name", "SecretKey", "StartDate" },
                values: new object[,]
                {
                    { new Guid("65ae0e1c-bc4e-4d63-9cac-45aa4287a7a4"), "YP20KQT Event", "https://hamevent.brudiu.ro/static/diploma-background.jpg", null, "YP20KQT", new Guid("d80e6662-22a5-412a-abac-0ee75b6435c6"), null },
                    { new Guid("dd2cb606-bde9-4c93-b1eb-efdda0f5e86d"), "YP100UPT Event", "https://hamevent.brudiu.ro/static/diploma-background.jpg", null, "YP100UPT", new Guid("8479efeb-8b7a-445c-92ba-89a2a068224f"), null }
                });

            migrationBuilder.CreateIndex(
                name: "IX_QSOs_EventId",
                table: "QSOs",
                column: "EventId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "QSOs");

            migrationBuilder.DropTable(
                name: "Events");
        }
    }
}
