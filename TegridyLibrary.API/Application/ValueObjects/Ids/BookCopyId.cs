namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record BookCopyId(ulong Value)
{
    public static implicit operator BookCopyId(ulong id) => new(id);
    public static implicit operator ulong(BookCopyId id) => id.Value;
}
