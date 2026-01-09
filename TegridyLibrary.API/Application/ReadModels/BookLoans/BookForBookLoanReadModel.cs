using JetBrains.Annotations;

namespace TegridyLibrary.API.Application.ReadModels.BookLoans;

[UsedImplicitly]
internal sealed class BookForBookLoanReadModel
{
    public required ulong BookId { get; init; }
    public required string Title { get; init; }
    public required string? Isbn { get; init; }
    public required IEnumerable<BookCopyModel> Copies { get; init; }

    [UsedImplicitly]
    public sealed class BookCopyModel
    {
        public required ulong BookCopyId { get; init; }
        public required string InventoryNumber { get; init; }
    }
}