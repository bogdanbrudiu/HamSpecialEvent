using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace HamEvent.Data.Migrations
{
    /// <inheritdoc />
    public partial class HasTop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("3DADC51D-D08B-4D19-B556-237991A785FF"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("E7AE6452-1D55-4989-9879-22E4F02E78FA"));

            migrationBuilder.AddColumn<bool>(
                name: "HasTop",
                table: "Events",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Description", "Diploma", "EndDate", "HasTop", "Name", "SecretKey", "StartDate" },
                values: new object[,]
                {
                    { new Guid("3DADC51D-D08B-4D19-B556-237991A785FF"), "YP20KQT Event", "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n  h2 {\r\n        text-align: center;\r\n        font-size: x-large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n    h3 {\r\n        text-align: center;\r\n        font-size: large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP20KQT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 240px;\r\n        left: 35%;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Timestamp{\r\n    position: absolute;\r\n        top: 485px;\r\n        left: 50%;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Rank{\r\n    position: absolute;\r\n        top: 240px;\r\n        left: 610px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Points{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 232px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.QSOs{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 358px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Bands{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 484px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Modes{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 610px;\r\n    transform: translate(-50%, 0);\r\n}\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n<div class=\"Points\"><h3>--Points--</h3></div>\r\n<div class=\"QSOs\"><h3>--QSOs--</h3></div>\r\n<div class=\"Bands\"><h3>--Bands--</h3></div>\r\n<div class=\"Modes\"><h3>--Modes--</h3></div>\r\n<div class=\"Rank\"><h2>--Rank--</h2></div>\r\n<div class=\"Timestamp\"><h3>--Timestamp--</h3></div>       \r\n    </div>\r\n</body>\r\n</html>", new DateTime(2023, 12, 31, 23, 59, 59, 0, DateTimeKind.Utc), true, "YP20KQT", new Guid("E8359B40-419C-4E96-A8FD-FEF3FD51979E"), new DateTime(2023, 12, 1, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { new Guid("E7AE6452-1D55-4989-9879-22E4F02E78FA"), "YP100UPT is a special event on the Open Campus Night, part of the European Researchers Night project. This event is supported by Politehnica University Timisoara, Faculty of Electronics Telecommunications and Information Technologies, Measurements and Optoelectronics Department in partenership with QSO Banat Timisoara (YO2KQT) radio ham club.", "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP100UPT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 280px;\r\n        left: 68%;\r\n    transform: translate(-50%, 0);\r\n}\r\n\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n      \r\n    </div>\r\n</body>\r\n</html>", new DateTime(2023, 9, 29, 23, 59, 59, 0, DateTimeKind.Utc), false, "YP100UPT", new Guid("651EB6F4-137B-4885-8D32-6A6E2D6A5D8F"), new DateTime(2023, 9, 29, 0, 0, 0, 0, DateTimeKind.Utc) }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("3DADC51D-D08B-4D19-B556-237991A785FF"));

            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("E7AE6452-1D55-4989-9879-22E4F02E78FA"));

            migrationBuilder.DropColumn(
                name: "HasTop",
                table: "Events");

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Description", "Diploma", "EndDate", "Name", "SecretKey", "StartDate" },
                values: new object[,]
                {
                    { new Guid("3DADC51D-D08B-4D19-B556-237991A785FF"), "YP100UPT Event", "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP100UPT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 280px;\r\n        left: 68%;\r\n    transform: translate(-50%, 0);\r\n}\r\n\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n      \r\n    </div>\r\n</body>\r\n</html>", null, "YP100UPT", new Guid("E8359B40-419C-4E96-A8FD-FEF3FD51979E"), null },
                    { new Guid("E7AE6452-1D55-4989-9879-22E4F02E78FA"), "YP20KQT Event", "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n  h2 {\r\n        text-align: center;\r\n        font-size: x-large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n    h3 {\r\n        text-align: center;\r\n        font-size: large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP20KQT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 240px;\r\n        left: 35%;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Timestamp{\r\n    position: absolute;\r\n        top: 485px;\r\n        left: 50%;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Rank{\r\n    position: absolute;\r\n        top: 240px;\r\n        left: 610px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Points{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 232px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.QSOs{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 358px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Bands{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 484px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Modes{\r\n    position: absolute;\r\n        top: 357px;\r\n        left: 610px;\r\n    transform: translate(-50%, 0);\r\n}\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n<div class=\"Points\"><h3>--Points--</h3></div>\r\n<div class=\"QSOs\"><h3>--QSOs--</h3></div>\r\n<div class=\"Bands\"><h3>--Bands--</h3></div>\r\n<div class=\"Modes\"><h3>--Modes--</h3></div>\r\n<div class=\"Rank\"><h2>--Rank--</h2></div>\r\n<div class=\"Timestamp\"><h3>--Timestamp--</h3></div>       \r\n    </div>\r\n</body>\r\n</html>", null, "YP20KQT", new Guid("651EB6F4-137B-4885-8D32-6A6E2D6A5D8F"), null }
                });
        }
    }
}
