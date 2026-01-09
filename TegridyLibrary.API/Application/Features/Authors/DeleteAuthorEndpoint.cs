using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Authors;

[UsedImplicitly]
internal sealed class DeleteAuthorEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong AuthorId, LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapDelete("{authorId:long}", Handler)
            .WithSummary(nameof(DeleteAuthorEndpoint))
            .RequireAuthorization()
            .Produces(204)
            .Produces<ErrorResult>(400);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (authorId, dbContext) = request;

        var genre = await dbContext.Authors.FirstOrDefaultAsync(g => g.Id == authorId, ct);
        if (genre is null) return Results.NoContent();
        
        try
        {
            dbContext.Remove(genre);
            await dbContext.SaveChangesAsync(ct);
            return Results.NoContent();
        }
        catch
        {
            return new ErrorResult("Author in use", $"Author with ID `{authorId}` is in use and cannot be deleted`");
        }
    }
}