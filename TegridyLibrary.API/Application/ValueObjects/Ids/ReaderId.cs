namespace TegridyLibrary.API.Application.ValueObjects.Ids;

internal sealed record ReaderId(ulong Value)
{
    public static implicit operator ReaderId(ulong id) => new(id);
    public static implicit operator ulong(ReaderId id) => id.Value;
}
