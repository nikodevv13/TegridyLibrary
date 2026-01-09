using TegridyLibrary.API.Application.ValueObjects.Ids;

namespace TegridyLibrary.API.Application.Entities;

internal sealed class BookCopy
{
    public required BookCopyId Id { get; init; }
    public required string InventoryNumber { get; set; }
    public DateTime AcquiredDate { get; set; }
    public required decimal EstimatedPrice { get; set; }

    public bool IsDeleted { get; set; } = false;
    
    public required BookId BookId { get; init; }
    public Book? Book { get; init; }

    public ICollection<BookLoan> Loans { get; init; } = [];
}