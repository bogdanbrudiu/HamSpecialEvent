using HamEvent.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;

namespace HamEvent
{
    public sealed class InitializationService : IHostedService
    {
        #region Constructor and dependencies

        private readonly IServiceProvider _serviceProvider;
        private readonly Options _options;

        public InitializationService(IServiceProvider serviceProvider, IOptions<Options> options)
        {
            _serviceProvider = serviceProvider;
            _options = options.Value;
        }

        #endregion

        public async Task StartAsync(
            // Use this token to detect the application stopping
            CancellationToken cancellationToken
        )
        {
            using var serviceScope = _serviceProvider.CreateScope();
            var serviceProvider = serviceScope.ServiceProvider;

            if (!_options.SkipMigration)
            {
                var context = serviceProvider.GetRequiredService<HamEventContext>();

                await context.Database.MigrateAsync(cancellationToken);
            }

            // ... Other initialization logic of the application. (e.g. a seeding of an initial data)
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

        public sealed class Options
        {
            public const string Position = "Initialization";

            public bool SkipMigration { get; set; }

            // ... Other options for initialization service
        }
    }

    public static class InitializationServiceExtensions
    {
        public static void AddInitializationService(this IServiceCollection serviceCollection)
        {
            serviceCollection.AddHostedService<InitializationService>();

            serviceCollection
                .AddOptions<InitializationService.Options>()
                .BindConfiguration(InitializationService.Options.Position);
        }
    }
}
