using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.Enums;

namespace TegridyLibrary.API.Application.ReadModels.Librarians;

internal sealed class LibrarianDetailsReadModel
{
    public required ulong Id { get; init; }
    public required string Email { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required IEnumerable<LibrarianPermissions> Permissions { get; set; }

    public static LibrarianDetailsReadModel From(Librarian librarian) => new()
    {
        Id = librarian.Id,
        Email = librarian.Email,
        FirstName = librarian.FirstName,
        LastName = librarian.LastName,
        Permissions = librarian.Permissions,
    };
}