namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record BookId(ulong Value)
{
    public static implicit operator BookId(ulong id) => new(id);
    public static implicit operator ulong(BookId id) => id.Value;
}
