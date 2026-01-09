namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record GenreId(ulong Value)
{
    public static implicit operator GenreId(ulong id) => new(id);
    public static implicit operator ulong(GenreId id) => id.Value;
}
