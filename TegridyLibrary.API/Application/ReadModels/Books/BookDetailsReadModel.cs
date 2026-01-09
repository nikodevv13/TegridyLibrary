using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.ReadModels.BookCopies;

namespace TegridyLibrary.API.Application.ReadModels.Books;

internal sealed record BookDetailsReadModel
{
    public required ulong Id { get; init; }
    public required string Title { get; set; }
    public required string? OriginalTitle { get; set; }
    public required string? Description { get; set; }
    public required string TwoLetterIsoLanguageName { get; set; }
    public required string? Isbn { get; set; }
    public required DateTime PublicationDate { get; set; }

    public required GenreReadModel? Genre { get; init; }
    public required AuthorReadModel? Author { get; init; }
    public required PublisherReadModel? Publisher { get; init; }

    public required IEnumerable<BookCopyDetailsReadModel> Copies { get; init; }
}

internal static class BookDetailsReadModelExtensions
{
    public static IQueryable<BookDetailsReadModel> SelectReadModel(this IQueryable<Book> query) =>
        query.AsNoTrackingWithIdentityResolution()
            .Include(x => x.Genre)
            .Include(x => x.Publisher)
            .Include(x => x.Author)
            .Include(x => x.Copies.Where(y => !y.IsDeleted)).Select(MapExpression);

    extension(BookDetailsReadModel)
    {
        public static BookDetailsReadModel From(Book book) => MapFunction(book);
    }

    private static readonly Expression<Func<Book, BookDetailsReadModel>> MapExpression = book => new BookDetailsReadModel
    {
        Id = book.Id,
        Title = book.Title,
        OriginalTitle = book.OriginalTitle,
        Description = book.Description,
        TwoLetterIsoLanguageName = book.Language.TwoLetterIsoLanguageName,
        Genre = book.GenreId == null
            ? null
            : new GenreReadModel
            {
                Id = book.Genre!.Id,
                Name = book.Genre.Name
            },
        Author = book.AuthorId == null
            ? null
            : new AuthorReadModel
            {
                Id = book.Author!.Id,
                FirstName = book.Author.FirstName,
                LastName = book.Author.LastName
            },
        Publisher = book.PublisherId == null
            ? null
            : new PublisherReadModel
            {
                Id = book.Publisher!.Id,
                Name = book.Publisher.Name
            },
        Copies = book.Copies.Where(x => !x.IsDeleted).Select(bc => new BookCopyDetailsReadModel
        {
            Id = bc.Id,
            InventoryNumber = bc.InventoryNumber,
            AcquiredDate = bc.AcquiredDate,
            EstimatedPrice = bc.EstimatedPrice,
        }),
        Isbn = book.Isbn,
        PublicationDate = book.PublicationDate,
    };

    private static readonly Func<Book, BookDetailsReadModel> MapFunction = MapExpression.Compile();
}
