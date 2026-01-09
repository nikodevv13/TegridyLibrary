using TegridyLibrary.API.Application.Entities;

namespace TegridyLibrary.API.Application.ReadModels;

internal sealed class AuthorReadModel
{
    public required ulong Id { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }

    public static AuthorReadModel From(Author author) => new()
    {
        Id = author.Id,
        FirstName = author.FirstName,
        LastName = author.LastName,
    };
}