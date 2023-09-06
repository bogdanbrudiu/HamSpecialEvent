using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HamEvent.Data.Migrations
{
    /// <inheritdoc />
    public partial class EventDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("fd99b134-8f84-429e-94d8-89a517abbd2a"));

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Events",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DiplomaURL",
                table: "Events",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Description", "DiplomaURL", "Name", "SecretKey" },
                values: new object[] { new Guid("a17c1722-dde5-478d-ba97-a7a007ba1d79"), "YP20KQT Event", "https://hamevent.brudiu.ro/static/diploma-background.jpg", "YP20KQT", new Guid("eab4a750-45a9-4b6a-9c55-963de26f70b5") });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Events",
                keyColumn: "Id",
                keyValue: new Guid("a17c1722-dde5-478d-ba97-a7a007ba1d79"));

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Events");

            migrationBuilder.DropColumn(
                name: "DiplomaURL",
                table: "Events");

            migrationBuilder.InsertData(
                table: "Events",
                columns: new[] { "Id", "Name", "SecretKey" },
                values: new object[] { new Guid("fd99b134-8f84-429e-94d8-89a517abbd2a"), "YO2KQT - TM2023", new Guid("aba8ed87-4f79-4a00-8f1e-67e12bbbff4a") });
        }
    }
}
