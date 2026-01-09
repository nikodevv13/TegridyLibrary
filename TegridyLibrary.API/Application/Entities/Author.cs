using TegridyLibrary.API.Application.ValueObjects.Ids;

namespace TegridyLibrary.API.Application.Entities;

internal sealed class Author
{
    public required AuthorId Id { get; init; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}