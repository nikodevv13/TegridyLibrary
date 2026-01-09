using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.ReadModels.Books;
using TegridyLibrary.API.Application.ValueObjects;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Books;

[UsedImplicitly]
internal sealed class UpdateBookEndpoint : IEndpoint
{
    private record struct Request(
        ulong BookId,
        Request.BodyModel Body,
        LibraryDbContext DbContext,
        ISnowflakeIdProvider SnowflakeIdProvider
    )
    {
        [UsedImplicitly]
        public sealed record BodyModel(
            string Title,
            ulong? GenreId,
            ulong? AuthorId,
            ulong? PublisherId,
            string? OriginalTitle,
            string? Description,
            string TwoLetterIsoLanguageName,
            string? Isbn,
            DateTime PublicationDate,
            ICollection<BodyModel.BookCopyModel> Copies)
        {
            [UsedImplicitly]
            public sealed record BookCopyModel(
                ulong? Id,
                string InventoryNumber,
                DateTime AcquiredDate,
                decimal EstimatedPrice);
        }
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPut("{bookId:long}", Handler)
            .WithSummary(nameof(UpdateBookEndpoint))
            .RequireAuthorization()
            .Produces<BookDetailsReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(404)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (bookId, body, dbContext, snowflakeIdProvider) = request;
        var (title, genreId, authorId, publisherId, originalTitle, description, twoLetterIsoLanguageName, isbn,
            publicationDate, copies) = body;

        if (await dbContext.Books.Include(x => x.Copies).FirstOrDefaultAsync(x => x.Id == bookId, ct) is not { } book)
            return new ErrorResult("Book not found", $"Book with ID `{bookId}` does not exist", 404);

        if (await dbContext.Books.AnyAsync(x => x.Title == title && x.Id != bookId, ct))
            return new ErrorResult("Book already exists", $"Book with  title `{title}` already exists", 409);

        if (isbn is not null && await dbContext.Books.AnyAsync(x => x.Isbn == isbn && x.Id != bookId, ct))
            return new ErrorResult("Book already exists", $"Book with ISBN `{isbn}` already exists", 409);

        if (Language.From(twoLetterIsoLanguageName) is not { } language)
            return new ErrorResult("Invalid language",
                $"Language with ISO (2-letter) `{twoLetterIsoLanguageName}` does not exist");

        if (body.GenreId != null && !await dbContext.Genres.AnyAsync(x => x.Id == body.GenreId, cancellationToken: ct))
            return new ErrorResult("Invalid genre", $"Genre with ID `{body.GenreId}` does not exist");
        
        if (body.AuthorId != null && !await dbContext.Authors.AnyAsync(x => x.Id == body.AuthorId, cancellationToken: ct))
            return new ErrorResult("Invalid genre", $"Author with ID `{body.AuthorId}` does not exist");
        
        if (body.PublisherId != null && !await dbContext.Publishers.AnyAsync(x => x.Id == body.PublisherId, cancellationToken: ct))
            return new ErrorResult("Invalid genre", $"Publisher with ID `{body.PublisherId}` does not exist");

        var duplicatedCopies = copies.GroupBy(x => x.InventoryNumber, StringComparer.InvariantCultureIgnoreCase)
            .Where(x => x.Count() > 1)
            .Select(x => x.Key)
            .ToList();

        if (duplicatedCopies.Count > 0)
            return new ErrorResult("Invalid copies",
                $"Given copies are not unique: {string.Join(", ", duplicatedCopies)}");

        book.Title = title;
        book.GenreId = genreId;
        book.AuthorId = authorId;
        book.PublisherId = publisherId;
        book.OriginalTitle = originalTitle;
        book.Description = description;
        book.Language = language;
        book.Isbn = isbn;
        book.PublicationDate = publicationDate;

        foreach (var bookCopy in book.Copies)
        {
            if (copies.FirstOrDefault(x => x.Id == bookCopy.Id) is { } updatedCopy)
            {
                bookCopy.InventoryNumber = updatedCopy.InventoryNumber;
                bookCopy.AcquiredDate = updatedCopy.AcquiredDate;
                bookCopy.EstimatedPrice = updatedCopy.EstimatedPrice;
            }
            else
            {
                bookCopy.IsDeleted = true;
            }
        }

        var newCopies = copies.Where(x => book.Copies.FirstOrDefault(y => y.Id == x.Id) is null)
            .Select(copy => new BookCopy
            {
                Id = snowflakeIdProvider.Generate(),
                InventoryNumber = copy.InventoryNumber,
                AcquiredDate = copy.AcquiredDate,
                EstimatedPrice = copy.EstimatedPrice,
                BookId = bookId
            });
        
        await dbContext.BookCopies.AddRangeAsync(newCopies, ct);
        
        await dbContext.SaveChangesAsync(ct);

        var readModel = await dbContext.Books.Where(x => x.Id == bookId)
            .SelectReadModel()
            .FirstOrDefaultAsync(cancellationToken: ct);

        return Results.Ok(readModel);
    }
}