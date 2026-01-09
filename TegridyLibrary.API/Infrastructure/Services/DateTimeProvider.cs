using TegridyLibrary.API.Application.Contracts;

namespace TegridyLibrary.API.Infrastructure.Services;

internal sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime GetUtcNow() => DateTime.UtcNow;
}