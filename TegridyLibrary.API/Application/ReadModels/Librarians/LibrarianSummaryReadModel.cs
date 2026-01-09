namespace TegridyLibrary.API.Application.ReadModels.Librarians;

internal sealed class LibrarianSummaryReadModel
{
    public required ulong Id { get; init; }
    public required string Email { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
}