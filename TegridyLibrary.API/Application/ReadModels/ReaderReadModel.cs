using TegridyLibrary.API.Application.Entities.Users;

namespace TegridyLibrary.API.Application.ReadModels;

internal sealed class ReaderReadModel
{
    public required ulong Id { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Email { get; set; }

    public static ReaderReadModel From(Reader reader) => new()
    {
        Id = reader.Id,
        FirstName = reader.FirstName,
        LastName = reader.LastName,
        Email = reader.Email
    };
}