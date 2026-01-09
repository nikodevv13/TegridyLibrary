using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.ValueObjects.Ids;

namespace TegridyLibrary.API.Application.Entities;

internal sealed class BookLoan
{
    public required BookLoanId Id { get; init; }

    public required BookCopyId BookCopyId { get; init; }
    public BookCopy? BookCopy { get; init; }
    
    public required ReaderId ReaderId { get; init; }
    public Reader? Reader { get; init; }

    public required LibrarianId StartedByLibrarianId { get; init; }
    public Librarian? StartedByLibrarian { get; init; }

    public LibrarianId? CompletedByLibrarianId { get; set; }
    public Librarian? CompletedByLibrarian { get; set; }
    
    public DateTime StartedAt { get; init; }
    public DateTime? CompletedAt { get; set; }
}