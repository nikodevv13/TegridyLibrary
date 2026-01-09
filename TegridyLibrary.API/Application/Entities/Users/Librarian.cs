using TegridyLibrary.API.Application.Enums;
using TegridyLibrary.API.Application.ValueObjects.Ids;

namespace TegridyLibrary.API.Application.Entities.Users;

internal sealed class Librarian
{
    public required LibrarianId Id { get; init; }
    public required string Email { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }

    public required string HashedPassword { get; set; }
    public required DateTime? LastLoggedInAt { get; set; }
    
    public bool IsDeleted { get; set; } = false;

    public ICollection<LibrarianPermissions> Permissions { get; set; } = [];
}