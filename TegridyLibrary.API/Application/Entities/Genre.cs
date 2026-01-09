using TegridyLibrary.API.Application.ValueObjects.Ids;
using TegridyLibrary.API.Application.ValueObjects;

namespace TegridyLibrary.API.Application.Entities;

internal sealed class Genre
{
    public required GenreId Id { get; init; }
    public required string Name { get; set; }
}