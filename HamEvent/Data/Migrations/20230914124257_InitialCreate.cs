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
                    Diploma = table.Column<string>(type: "TEXT", nullable: false),
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
                columns: new[] { "Id", "Description", "Diploma", "EndDate", "Name", "SecretKey", "StartDate" },
                values: new object[,]
                {
                    { new Guid("17f1e8ba-a39e-4d43-b627-89c4a6bb6de2"), "YP20KQT Event", "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n    h2 {\r\n        text-align: center;\r\n        font-size: x-large;\r\n        margin-top: 30px;\r\n        margin-bottom: 10px;\r\n    }\r\n\r\n    h3 {\r\n        text-align: center;\r\n        font-size: large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n\r\n    p {\r\n        font-size: 18px;\r\n        line-height: 1.5;\r\n        text-align: center;\r\n        margin-bottom: 10px;\r\n    }\r\n\r\n    img {\r\n        display: block;\r\n        margin: 20px auto 0;\r\n        max-width: 150px;\r\n    }\r\n\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/diploma-background.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n        <div class=\"diploma\">\r\n            <h1>--EventName--</h1>\r\n            <p>--EventDescription--</p>\r\n            <p>We take the pleasure in awarding</p>\r\n            <h2>--callsign2--</h2>\r\n\r\n            <h3>Points:--Points--</h3>\r\n            <h3>QSO:--QSOs--</h3>\r\n            <h3>Bands:--Bands--</h3>\r\n            <h3>Modes:--Modes--</h3>\r\n\r\n            <img src=\"./static/radio-icon.png\" alt=\"Ham Special Event\">\r\n        </div>\r\n    </div>\r\n</body>\r\n</html>", null, "YP20KQT", new Guid("300d22d7-12dd-4c2a-bd3c-72092412867e"), null },
                    { new Guid("d6ba0da8-7d84-419c-8f2f-d33835e66625"), "YP100UPT Event", "", null, "YP100UPT", new Guid("360a0e32-a84e-4e6b-ba50-180ce51cc8b5"), null }
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
