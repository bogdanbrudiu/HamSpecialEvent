﻿// <auto-generated />
using System;
using HamEvent.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace HamEvent.Data.Migrations
{
    [DbContext(typeof(HamEventContext))]
    partial class HamEventContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "7.0.5");

            modelBuilder.Entity("HamEvent.Data.Model.Event", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<string>("Diploma")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("TEXT");

                    b.Property<Guid>("SecretKey")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Events");

                    b.HasData(
                        new
                        {
                            Id = new Guid("cf8c1aa9-33c0-4cfb-8b5e-87d3365827d7"),
                            Description = "YP20KQT Event",
                            Diploma = "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n    h3 {\r\n        text-align: center;\r\n        font-size: large;\r\n        margin-top: 20px;\r\n        margin-bottom: 10px;\r\n    }\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP20KQT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 375px;\r\n        left: 50%;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Points{\r\n    position: absolute;\r\n        top:60px;\r\n        left: 126px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.QSOs{\r\n    position: absolute;\r\n        top:60px;\r\n        left: 224px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Bands{\r\n    position: absolute;\r\n        top:60px;\r\n        left: 618px;\r\n    transform: translate(-50%, 0);\r\n}\r\n.Modes{\r\n    position: absolute;\r\n        top:60px;\r\n        left: 716px;\r\n    transform: translate(-50%, 0);\r\n}\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n<div class=\"Points\"><h3>--Points--</h3></div>\r\n<div class=\"QSOs\"><h3>--QSOs--</h3></div>\r\n<div class=\"Bands\"><h3>--Bands--</h3></div>\r\n<div class=\"Modes\"><h3>--Modes--</h3></div>\r\n       \r\n    </div>\r\n</body>\r\n</html>",
                            Name = "YP20KQT",
                            SecretKey = new Guid("900eb0fd-5e13-42f2-84a4-5aa2e9dd71db")
                        },
                        new
                        {
                            Id = new Guid("fd4e191b-9e95-433c-a01f-067c25fbe373"),
                            Description = "YP100UPT Event",
                            Diploma = "<STYLE type=\"text/css\">\r\n    html, body {\r\n        margin: 0;\r\n        padding: 0;\r\n    }\r\n\r\n    h1 {\r\n        text-align: center;\r\n        font-size: xx-large;\r\n        margin-bottom: 20px;\r\n    }\r\n\r\n    .background {\r\n        background-image: url(https://hamevent.brudiu.ro/static/YP100UPT.jpg);\r\n        width: 842px;\r\n        height: 595px;\r\n        margin: 0;\r\n        padding: 0;\r\n        background-position: center center;\r\n        background-size: 100%;\r\n        background-repeat: no-repeat;\r\n        position: relative;\r\n    }\r\n\r\n    .diploma {\r\n        position: absolute;\r\n        top: 50%;\r\n        left: 50%;\r\n        -ms-transform: translate(-50%, -50%);\r\n        transform: translate(-50%, -50%);\r\n        margin: 0 auto;\r\n        padding: 30px;\r\n    }\r\n.callsign{\r\n    position: absolute;\r\n        top: 300px;\r\n        left: 68%;\r\n    transform: translate(-50%, 0);\r\n}\r\n\r\n</STYLE>\r\n<html>\r\n<body>\r\n    <div class=\"background\">\r\n<div class=\"callsign\"><h1>--callsign2--</h2></div>\r\n      \r\n    </div>\r\n</body>\r\n</html>",
                            Name = "YP100UPT",
                            SecretKey = new Guid("25bd2ac3-9c2e-498d-9760-95d846936142")
                        });
                });

            modelBuilder.Entity("HamEvent.Data.Model.QSO", b =>
                {
                    b.Property<string>("Callsign1")
                        .HasColumnType("TEXT");

                    b.Property<string>("Callsign2")
                        .HasColumnType("TEXT");

                    b.Property<string>("Band")
                        .HasColumnType("TEXT");

                    b.Property<string>("Mode")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("TEXT");

                    b.Property<Guid>("EventId")
                        .HasColumnType("TEXT");

                    b.Property<string>("RST1")
                        .HasColumnType("TEXT");

                    b.Property<string>("RST2")
                        .HasColumnType("TEXT");

                    b.HasKey("Callsign1", "Callsign2", "Band", "Mode", "Timestamp", "EventId");

                    b.HasIndex("EventId");

                    b.ToTable("QSOs");
                });

            modelBuilder.Entity("HamEvent.Data.Model.QSO", b =>
                {
                    b.HasOne("HamEvent.Data.Model.Event", "Event")
                        .WithMany("QSOs")
                        .HasForeignKey("EventId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Event");
                });

            modelBuilder.Entity("HamEvent.Data.Model.Event", b =>
                {
                    b.Navigation("QSOs");
                });
#pragma warning restore 612, 618
        }
    }
}
