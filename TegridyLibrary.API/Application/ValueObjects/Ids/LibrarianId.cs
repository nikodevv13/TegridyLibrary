namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record LibrarianId(ulong Value)
{
    public static implicit operator LibrarianId(ulong id) => new(id);
    public static implicit operator ulong(LibrarianId id) => id.Value;
}
