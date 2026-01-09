using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels.Librarians;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class GetCurrentLibrarianEndpoint : IEndpoint
{
    [UsedImplicitly]
    public record struct Request(HttpContext HttpContext, LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
    builder.MapGet("current", Handler)
    .WithSummary(nameof(GetCurrentLibrarianEndpoint))
        .Produces<LibrarianDetailsReadModel>()
    .Produces<ErrorResult>(409)
    .RequireAuthorization();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (httpContext, dbContext) = request;

        var librarianId = httpContext.GetCurrentLibrarianId();
        
        var librarian = await dbContext.Librarians
            .FirstAsync(x => x.Id == librarianId, ct);

        var readModel = LibrarianDetailsReadModel.From(librarian);
        return Results.Ok(readModel);
    }
}
