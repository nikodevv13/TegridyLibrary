namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record AuthorId(ulong Value)
{
    public static implicit operator AuthorId(ulong id) => new(id);
    public static implicit operator ulong(AuthorId id) => id.Value;
}
