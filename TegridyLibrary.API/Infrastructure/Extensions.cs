using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Exceptions;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;
using TegridyLibrary.API.Infrastructure.Settings;

namespace TegridyLibrary.API.Infrastructure;

internal static class Extensions
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
		var sqlServerSettings = configuration.GetSettings<SqlServerSettings>();
        
        services.AddDbContext<LibraryDbContext>(options => options.UseSqlServer(sqlServerSettings.ConnectionString, x => x.MigrationsHistoryTable("__EFMigrationsHistory")));
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        services.AddSingleton<IAccessTokenTokenProvider, AccessTokenProvider>();
        services.AddSingleton<ISnowflakeIdProvider, SnowflakeIdProvider>();

        services.AddSettingsWithOptions<AccessTokensSettings>(configuration);
        var accessTokensSettings = configuration.GetSettings<AccessTokensSettings>();

        services.AddAuthentication().AddJwtBearer(options =>
        {
            options.MapInboundClaims = false;
            options.TokenValidationParameters = AccessTokenProvider.GetTokenValidationParameters(accessTokensSettings);
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies[CookieUserStorage.AccessTokenCookieKey];
                    return Task.CompletedTask;
                },
                OnChallenge = context =>
                {
                    context.HandleResponse();
                    return SharedErrors.UnauthorizedError.ExecuteAsync(context.HttpContext);
                },
            };
        });
        services.AddAuthorization();
    }

    public static void Map<TEndpoint>(this IEndpointRouteBuilder builder) where TEndpoint : class, IEndpoint =>
        TEndpoint.Map(builder);

    public static T GetSettings<T>(this IConfiguration configuration) where T : ISettings
        => configuration.GetSection(T.SectionName).Get<T>()
           ?? throw new TegridyLibraryException($"Invalid configuration section `{T.SectionName}`");

    public static void AddSettingsWithOptions<T>(this IServiceCollection services, IConfiguration configuration) where T : class, ISettings
        => services.AddOptions<T>().Bind(configuration.GetSection(T.SectionName)).ValidateOnStart();
}