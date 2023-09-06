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
                name: "Events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    SecretKey = table.Column<Guid>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "QSOs",
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
                    Timestamp = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EventId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QSOs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QSOs_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Name", "SecretKey" },
                values: new object[] { new Guid("fd99b134-8f84-429e-94d8-89a517abbd2a"), "YP20KQT", new Guid("aba8ed87-4f79-4a00-8f1e-67e12bbbff4a") });

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
