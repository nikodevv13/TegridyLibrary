using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Application.ReadModels.BookLoans;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.BookLoans;

[UsedImplicitly]
internal sealed class GetPaginatedBooksForBookLoanCreationEndpoint : IEndpoint
{
    private record struct Request(
        [FromQuery] int PageNumber,
        [FromQuery] int PageSize,
        [FromQuery] string SearchPhrase,
        [FromServices] LibraryDbContext DbContext
    );

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet("available-books", Handler)
            .WithSummary(nameof(GetPaginatedBooksForBookLoanCreationEndpoint))
            .Produces<Paginated<BookForBookLoanReadModel>>();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (pageNumber, pageSize, searchPhrase, dbContext) = request;

        var query = dbContext.Books
            .Where(x => !x.IsDeleted)
            .Include(x => x.Copies.Where(y => !y.IsDeleted && y.Loans.All(z => z.CompletedAt != null)))
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(searchPhrase))
        {
            query = query.Where(x =>
                x.Title.Contains(searchPhrase) ||
                x.Isbn!.Contains(searchPhrase) ||
                x.Copies.Any(y => y.InventoryNumber.Contains(searchPhrase)));
        }

        var finalQuery = query.Select(x => new BookForBookLoanReadModel
        {
            BookId = x.Id,
            Title = x.Title,
            Isbn = x.Isbn,
            Copies = x.Copies.Where(y => !y.IsDeleted && y.Loans.All(z => z.CompletedAt != null)).Select(y => new BookForBookLoanReadModel.BookCopyModel
            {
                BookCopyId = y.Id,
                InventoryNumber = y.InventoryNumber
            })
        });

        var readModel = await Paginated.Create(finalQuery, pageNumber, pageSize);
        return Results.Ok(readModel);
    }
}