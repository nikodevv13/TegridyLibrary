using TegridyLibrary.API.Application.ValueObjects.Ids;
using TegridyLibrary.API.Application.ValueObjects;

namespace TegridyLibrary.API.Application.Entities;

internal sealed class Publisher
{
    public required PublisherId Id { get; init; }
    public required string Name { get; set; }
}