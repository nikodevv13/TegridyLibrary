using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TegridyLibrary.API.Application.ValueObjects;

namespace TegridyLibrary.API.Infrastructure.Database.Converters;

[UsedImplicitly]
internal sealed class LanguageConverter() : ValueConverter<Language, string>(x => x.TwoLetterIsoLanguageName, value => new Language { TwoLetterIsoLanguageName = value});