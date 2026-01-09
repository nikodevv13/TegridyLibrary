namespace TegridyLibrary.API.Infrastructure.Settings;

public sealed record SqlServerSettings(string ConnectionString) : ISettings
{
    public static string SectionName => "SqlServer";
}