using TegridyLibrary.API.Application.ValueObjects.Ids;
using TegridyLibrary.API.Application.ValueObjects;

namespace TegridyLibrary.API.Application.Entities.Users;

internal sealed class Reader
{
    public required ReaderId Id { get; init; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }
}