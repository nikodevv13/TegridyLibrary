using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Books;

[UsedImplicitly]
internal sealed class DeleteBookEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong BookId, LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapDelete("{bookId:long}", Handler)
            .WithSummary(nameof(DeleteBookEndpoint))
            .RequireAuthorization()
            .Produces(204)
            .Produces<ErrorResult>(400);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (bookId, dbContext) = request;

        var book = await dbContext.Books.FirstOrDefaultAsync(x => x.Id == bookId && !x.IsDeleted, ct);
        if (book is null) return Results.NoContent();

        book.IsDeleted = true;
        await dbContext.SaveChangesAsync(ct);
        return Results.NoContent();
    }
}