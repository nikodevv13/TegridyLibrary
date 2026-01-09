namespace TegridyLibrary.API.Application.Contracts;

internal interface ISnowflakeIdProvider
{
    public ulong Generate();
}