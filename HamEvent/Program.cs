using ElmahCore;
using ElmahCore.Mvc;
using HamEvent;
using HamEvent.Data;
using HamEvent.Mapping;
using HamEvent.Services;
using Mapster;
using Microsoft.EntityFrameworkCore;
using NReco.Logging.File;
using System.Configuration;
using System.Net;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<MailerSettings>(builder.Configuration.GetSection("MailerSettings"));
builder.Services.AddScoped<IEmailTemplateRenderer, RazorEmailTemplateRenderer>();
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews();
MapsterConfig.Register(TypeAdapterConfig.GlobalSettings);
var tokenSecret = builder.Configuration["Token:Secret"] ?? throw new ConfigurationErrorsException("Token secret is not configured.");

builder.Services.AddSingleton<TokenService>(provider => new TokenService(tokenSecret));

builder.Services.AddDbContext<HamEventContext>(options =>
{
    options.EnableSensitiveDataLogging();
    options.LogTo(Console.WriteLine, LogLevel.Information);
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddHostedService<InitializationService>();
IPWhitelist wl = new IPWhitelist();
builder.Configuration.GetSection("IPWhitelist").Bind(wl);
builder.Services.AddElmah<XmlFileErrorLog>(options =>
{
    options.Filters.Add(new MyElmahFilter());
    options.OnPermissionCheck = context => {
                try {
                    var remote = context.Connection.RemoteIpAddress;
                    if (remote != null && IPAddress.IsLoopback(remote)) return true;
                    return wl.Whitelist.Any(ip => IPAddress.Parse(ip).Equals(remote));
                } catch {
                    return false;
                }
            };
    options.LogPath = "~/log";
    options.Path = "/api/elmah";
});
builder.Services.AddLogging(loggingBuilder => {
    var loggingSection = builder.Configuration.GetSection("Logging");
    loggingBuilder.AddFile(loggingSection);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseDefaultFiles();
app.UseStaticFiles();
app.UseRouting();

app.UseElmah();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();

// Expose Program class for WebApplicationFactory in integration tests
public partial class Program { }
