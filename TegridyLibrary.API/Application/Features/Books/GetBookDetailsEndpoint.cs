using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels.Books;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Books;

[UsedImplicitly]
internal sealed class GetBookDetailsEndpoint : IEndpoint
{
    private record struct Request(
        [FromRoute] ulong BookId,
        LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet("{bookId:long}", Handler)
            .WithSummary(nameof(GetBookDetailsEndpoint))
            .Produces<BookDetailsReadModel>()
            .Produces<ErrorResult>(404);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (bookId, dbContext) = request;

        var book = await dbContext.Books
            .AsNoTrackingWithIdentityResolution()
            .Where(x => x.Id == bookId)
            .AsSplitQuery()
            .SelectReadModel()
            .FirstOrDefaultAsync(ct);

        return book is null
            ? new ErrorResult("Book not found", $"Book with ID `{bookId}` does not exist")
            : Results.Ok(book);
    }
}