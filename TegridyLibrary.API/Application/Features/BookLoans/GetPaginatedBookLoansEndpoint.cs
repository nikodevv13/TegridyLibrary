using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Application.ReadModels.BookLoans;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.BookLoans;

[UsedImplicitly]
internal sealed class GetPaginatedBookLoansEndpoint : IEndpoint
{
    private record struct Request(
        [FromQuery] int PageNumber,
        [FromQuery] int PageSize,
        [FromQuery] string SearchPhrase,
        [FromServices] LibraryDbContext DbContext
    );

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet(string.Empty, Handler)
            .WithSummary(nameof(GetPaginatedBookLoansEndpoint))
            .Produces<Paginated<BookLoanReadModel>>();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (pageNumber, pageSize, searchPhrase, dbContext) = request;

        var query = dbContext.BookLoans
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchPhrase))
        {
            query = query.Where(x => x.BookCopy!.InventoryNumber.Contains(searchPhrase)
                                     || x.BookCopy!.Book!.Title.Contains(searchPhrase)
                                     || (x.BookCopy!.Book!.Isbn != null &&
                                         x.BookCopy!.Book!.Isbn.Contains(searchPhrase))
                                     || (x.Reader!.FirstName + " " + x.Reader.LastName + " " + x.Reader.Email).Contains(
                                         searchPhrase)
                                     || (x.StartedByLibrarian!.FirstName + " " + x.StartedByLibrarian.LastName + " " +
                                         x.StartedByLibrarian.Email).Contains(searchPhrase)
                                     || x.CompletedByLibrarian != null &&
                                     (x.CompletedByLibrarian!.FirstName + " " + x.CompletedByLibrarian.LastName + " " +
                                      x.CompletedByLibrarian.Email).Contains(searchPhrase));
        }

        var finalQuery = query.OrderByDescending(x => x.CompletedAt == null)
            .ThenBy(x => x.StartedAt)
            .SelectReadModel();

        var readModel = await Paginated.Create(finalQuery, pageNumber, pageSize);
        return Results.Ok(readModel);
    }
}