using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels.Librarians;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class DeleteLibrarianEndpoint : IEndpoint
{
    private record struct Request(ulong LibrarianId, LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapDelete("{librarianId:long}", Handler)
            .WithSummary(nameof(DeleteLibrarianEndpoint))
            .Produces<LibrarianDetailsReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(404)
            .RequireAuthorization();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (librarianId, dbContext) = request;

        var librarian = await dbContext.Librarians.FirstOrDefaultAsync(x => x.Id == librarianId && !x.IsDeleted, ct);
        if (librarian is null) return Results.NoContent();

        librarian.IsDeleted = true;
        await dbContext.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}