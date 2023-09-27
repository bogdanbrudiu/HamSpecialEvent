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
                    { new Guid("3dadc51d-d08b-4d19-b556-237991a785ff"), "YP100UPT Event", "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP100UPT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 280px;\r\n        left: 68%;\r\n    transform: translate(-50%, 0);\r\n}\r\n\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n      \r\n    </div>\r\n</body>\r\n</html>", null, "YP100UPT", new Guid("e8359b40-419c-4e96-a8fd-fef3fd51979e"), null },
                    { new Guid("e7ae6452-1d55-4989-9879-22e4f02e78fa"), "YP20KQT Event", "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n  h2 {\r\n        text-align: center;\r\n        font-size: x-large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n    h3 {\r\n        text-align: center;\r\n        font-size: large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP20KQT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 240px;\r\n        left: 35%;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Timestamp{\r\n    position: absolute;\r\n        top: 485px;\r\n        left: 50%;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Rank{\r\n    position: absolute;\r\n        top: 240px;\r\n        left: 610px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Points{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 232px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.QSOs{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 358px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Bands{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 484px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Modes{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 610px;\r\n    transform: translate(-50%, 0);\r\n}\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n<div class=\"Points\"><h3>--Points--</h3></div>\r\n<div class=\"QSOs\"><h3>--QSOs--</h3></div>\r\n<div class=\"Bands\"><h3>--Bands--</h3></div>\r\n<div class=\"Modes\"><h3>--Modes--</h3></div>\r\n<div class=\"Rank\"><h2>--Rank--</h2></div>\r\n<div class=\"Timestamp\"><h3>--Timestamp--</h3></div>       \r\n    </div>\r\n</body>\r\n</html>", null, "YP20KQT", new Guid("651eb6f4-137b-4885-8d32-6a6e2d6a5d8f"), null }
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
