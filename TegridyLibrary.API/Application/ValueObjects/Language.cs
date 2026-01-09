using System.Globalization;

namespace TegridyLibrary.API.Application.ValueObjects;

internal sealed record Language
{
    public string TwoLetterIsoLanguageName { get; init; } = null!;

    public static Language? From(string twoLetterIsoLanguageName)
    {
        var language = CultureInfo.GetCultures(CultureTypes.AllCultures)
            .FirstOrDefault(x => string.Equals(x.TwoLetterISOLanguageName, twoLetterIsoLanguageName,
                StringComparison.InvariantCultureIgnoreCase));

        return language is null
            ? null
            : new Language
            {
                TwoLetterIsoLanguageName = language.TwoLetterISOLanguageName,
            };
    }
}