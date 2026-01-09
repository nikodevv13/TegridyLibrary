namespace TegridyLibrary.API.Application.ReadModels.BookCopies;

internal sealed class BookCopyDetailsReadModel
{
    public required ulong Id { get; init; }

    public required string InventoryNumber { get; init; }
    public DateTime AcquiredDate { get; init; }
    public required decimal EstimatedPrice { get; init; }
}