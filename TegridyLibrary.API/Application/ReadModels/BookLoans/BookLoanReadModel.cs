using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.ReadModels.Librarians;

namespace TegridyLibrary.API.Application.ReadModels.BookLoans;

internal sealed class BookLoanReadModel
{
    public required ulong Id { get; init; }

    public required BookLoanBookCopyModel Book { get; init; }
    public required ReaderReadModel Reader { get; init; }
    public required LibrarianSummaryReadModel StartedByLibrarian { get; init; }
    public required LibrarianSummaryReadModel? CompletedByLibrarian { get; init; }

    public required DateTime StartedAt { get; init; }
    public required DateTime? CompletedAt { get; init; }
    
    internal sealed class BookLoanBookCopyModel
    {
        public required ulong BookId { get; init; }
        public required ulong BookCopyId { get; init; }
        public required string Title { get; init; }
        public required string? Isbn { get; init; }
        public required string InventoryNumber { get; init; }
    }
}

internal static class BookLoanReadModelExtensions
{
    public static IQueryable<BookLoanReadModel> SelectReadModel(this IQueryable<BookLoan> query) =>
        query.AsNoTracking()
            .Include(x => x.Reader)
            .Include(x => x.BookCopy)
            .ThenInclude(x => x!.Book)
            .Include(x => x.StartedByLibrarian)
            .Include(x => x.CompletedByLibrarian)
            .Select(MapExpression);

    private static readonly Expression<Func<BookLoan, BookLoanReadModel>> MapExpression = bookLoan => new BookLoanReadModel
    {
        Id = bookLoan.Id,
        Book = new BookLoanReadModel.BookLoanBookCopyModel
        {
            BookId = bookLoan.BookCopy!.Book!.Id,
            BookCopyId = bookLoan.BookCopy.Id,
            Title = bookLoan.BookCopy.Book.Title,
            Isbn = bookLoan.BookCopy.Book.Isbn,
            InventoryNumber = bookLoan.BookCopy.InventoryNumber,
        },
        Reader = new ReaderReadModel
        {
            Id = bookLoan.Reader!.Id,
            FirstName = bookLoan.Reader.FirstName,
            LastName = bookLoan.Reader.FirstName,
            Email = bookLoan.Reader.Email
        },
        StartedByLibrarian = new LibrarianSummaryReadModel
        {
            Id = bookLoan.StartedByLibrarian!.Id,
            Email = bookLoan.StartedByLibrarian.Email,
            FirstName = bookLoan.StartedByLibrarian.FirstName,
            LastName = bookLoan.StartedByLibrarian.LastName,
        },
        CompletedByLibrarian = bookLoan.CompletedByLibrarianId == null ? null : new LibrarianSummaryReadModel
        {
            Id = bookLoan.CompletedByLibrarian!.Id,
            Email = bookLoan.CompletedByLibrarian.Email,
            FirstName = bookLoan.CompletedByLibrarian.FirstName,
            LastName = bookLoan.CompletedByLibrarian.LastName,
        },
        StartedAt = bookLoan.StartedAt,
        CompletedAt = bookLoan.CompletedAt
    };
}