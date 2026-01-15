using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels.Analytics;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.Analytics;

[UsedImplicitly]
internal sealed class GetGlobalAnalyticsEndpoint : IEndpoint
{
    private record struct Request(LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet("global", Handler)
            .WithSummary(nameof(GetGlobalAnalyticsEndpoint))
            .RequireAuthorization()
            .Produces<GlobalAnalyticsReadModel>();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var dbContext = request.DbContext;

        var readModel = await dbContext.Librarians
            .Select(_ => new GlobalAnalyticsReadModel
            {
                TotalBooks = dbContext.Books.Count(),
                TotalCopies = dbContext.BookCopies.Count(),
                TotalActiveBookLoans = dbContext.BookLoans.Count(x => x.CompletedAt == null),
                TotalBookLoans = dbContext.BookLoans.Count(),
                TotalReaders = dbContext.Readers.Count(),
            })
            .FirstAsync(cancellationToken: ct);
        
        return Results.Ok(readModel);
    }
}