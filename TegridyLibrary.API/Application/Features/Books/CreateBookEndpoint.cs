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
internal sealed class CreateBookEndpoint : IEndpoint
{
    private record struct Request(Request.BodyModel Body)
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
            public sealed record BookCopyModel(string InventoryNumber, DateTime AcquiredDate, decimal EstimatedPrice);
        }
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("create", Handler)
            .WithSummary(nameof(CreateBookEndpoint))
            .RequireAuthorization()
            .Produces<BookDetailsReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(404)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler(
        [AsParameters] Request request,
        ISnowflakeIdProvider snowflakeIdProvider,
        IDateTimeProvider dateTimeProvider,
        LibraryDbContext dbContext)
    {
        var body = request.Body;

        if (await dbContext.Books.AnyAsync(x => x.Title == body.Title))
            return new ErrorResult("Book already exists", $"Book with title `{body.Title}` already exists",409);

        if (body.Isbn is not null && await dbContext.Books.AnyAsync(x => x.Isbn == body.Isbn))
            return new ErrorResult("Book already exists", $"Book with ISBN `{body.Isbn}` already exists", 409);
        
        if (Language.From(body.TwoLetterIsoLanguageName) is not { } language)
            return new ErrorResult("Invalid language",
                $"Language with ISO (2-letter) `{body.TwoLetterIsoLanguageName}` does not exist");

        if (body.GenreId != null && !await dbContext.Genres.AnyAsync(x => x.Id == body.GenreId))
            return new ErrorResult("Invalid genre", $"Genre with ID `{body.GenreId}` does not exist");
        
        if (body.AuthorId != null && !await dbContext.Authors.AnyAsync(x => x.Id == body.AuthorId))
            return new ErrorResult("Invalid genre", $"Author with ID `{body.AuthorId}` does not exist");
        
        if (body.PublisherId != null && !await dbContext.Publishers.AnyAsync(x => x.Id == body.PublisherId))
            return new ErrorResult("Invalid genre", $"Publisher with ID `{body.PublisherId}` does not exist");

        var duplicatedCopies = body.Copies.GroupBy(x => x.InventoryNumber, StringComparer.InvariantCultureIgnoreCase)
            .Where(x => x.Count() > 1)
            .Select(x => x.Key)
            .ToList();
        
        if (duplicatedCopies.Count > 0)
            return new ErrorResult("Invalid copies", $"Given copies are not unique: {string.Join(", ", duplicatedCopies)}");

        var bookId = snowflakeIdProvider.Generate();
        
        var book = new Book
        {
            Id = bookId,
            Title = body.Title,
            OriginalTitle = body.OriginalTitle,
            Description = body.Description,
            Language = language,
            GenreId = request.Body.GenreId,
            AuthorId = request.Body.AuthorId,
            Isbn = request.Body.Isbn,
            PublicationDate = request.Body.PublicationDate,
            PublisherId = request.Body.PublisherId,
            CreatedAt = dateTimeProvider.GetUtcNow(),
        };
        
        await dbContext.Books.AddAsync(book);
        await dbContext.BookCopies.AddRangeAsync(body.Copies.Select(x => new BookCopy
        {
            Id = snowflakeIdProvider.Generate(),
            InventoryNumber = x.InventoryNumber,
            AcquiredDate = x.AcquiredDate,
            EstimatedPrice = x.EstimatedPrice,
            BookId = bookId
        }));
        
        await dbContext.SaveChangesAsync();

        var readModel = await dbContext.Books.Where(x => x.Id == bookId)
            .SelectReadModel()
            .FirstOrDefaultAsync();

        return Results.Created($"api/books/{book.Id}", readModel);
    }
}