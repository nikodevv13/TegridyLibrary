namespace TegridyLibrary.API.Infrastructure.Settings;

internal sealed class AccessTokensSettings : ISettings
{
    public static string SectionName => "AccessTokens";

    public required string Secret { get; set; }
    public required TimeSpan Lifetime { get; set; }
    public required string Issuer { get; set; }
    public required string Audience { get; set; }
}