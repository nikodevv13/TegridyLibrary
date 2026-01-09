using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels.Librarians;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class GetLibrariansEndpoint : IEndpoint
{
    [UsedImplicitly]
    public record struct Request(LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet("", Handler)
            .WithSummary(nameof(GetLibrariansEndpoint))
            .Produces<IEnumerable<LibrarianDetailsReadModel>>()
            .RequireAuthorization();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var dbContext = request.DbContext;

        var readModels = await dbContext.Librarians
            .Where(x => !x.IsDeleted)
            .Select(x => LibrarianDetailsReadModel.From(x))
            .ToListAsync(ct);

        return Results.Ok(readModels);
    }
}