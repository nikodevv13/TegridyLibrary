namespace TegridyLibrary.API.Application.ReadModels.Books;

internal sealed class BookSummaryReadModel
{
    public required ulong Id { get; init; }
    public required string Title { get; init; }
    public required string? Isbn { get; init; }
    public required string TwoLetterIsoLanguageName { get; init; }

    public required string Genre { get; init; }
    public required string Author { get; init; }
    public required string Publisher { get; init; }

    public required uint CopiesCount { get; init; }
}
