namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record PublisherId(ulong Value)
{
    public static implicit operator PublisherId(ulong id) => new(id);
    public static implicit operator ulong(PublisherId id) => id.Value;
}
