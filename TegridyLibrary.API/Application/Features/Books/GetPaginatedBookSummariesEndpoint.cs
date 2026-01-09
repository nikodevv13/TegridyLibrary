using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Application.ReadModels.Books;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.Books;

[UsedImplicitly]
internal sealed class GetPaginatedBookSummariesEndpoint : IEndpoint
{
    private record struct Request(
        [FromQuery] int PageNumber,
        [FromQuery] int PageSize,
        [FromQuery] string SearchPhrase,
        [FromServices] LibraryDbContext DbContext
    );

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet(string.Empty, Handler)
            .WithSummary(nameof(GetPaginatedBookSummariesEndpoint))
            .Produces<Paginated<BookSummaryReadModel>>();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (pageNumber, pageSize, searchPhrase, dbContext) = request;

        var query = dbContext.Books
            .AsNoTracking()
            .Where(x => !x.IsDeleted && x.Title.Contains(searchPhrase))
            .Select(x => new BookSummaryReadModel
            {
                Id = x.Id,
                Title = x.Title,
                Isbn = x.Isbn,
                TwoLetterIsoLanguageName = x.Language.TwoLetterIsoLanguageName,
                Genre = x.Genre == null ? "-" : x.Genre.Name,
                Author = x.Author == null ? "-" : $"{x.Author.FirstName} {x.Author.LastName}",
                Publisher = x.Publisher == null ? "-" : x.Publisher.Name,
                CopiesCount = (uint)x.Copies.Count(y => !y.IsDeleted)
            });

        var readModel = await Paginated.Create(query, pageNumber, pageSize);
        return Results.Ok(readModel);
    }
}