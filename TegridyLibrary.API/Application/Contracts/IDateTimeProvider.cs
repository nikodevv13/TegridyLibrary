namespace TegridyLibrary.API.Application.Contracts;

internal interface IDateTimeProvider
{
    public DateTime GetUtcNow();
}