using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Genres;

[UsedImplicitly]
internal sealed class DeleteGenreEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong GenreId, LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapDelete("{genreId:long}", Handler)
            .WithSummary(nameof(DeleteGenreEndpoint))
            .RequireAuthorization()
            .Produces(204)
            .Produces<ErrorResult>(400);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (genreId, dbContext) = request;

        var genre = await dbContext.Genres.FirstOrDefaultAsync(g => g.Id == genreId, ct);
        if (genre is null) return Results.NoContent();
        
        try
        {
            dbContext.Remove(genre);
            await dbContext.SaveChangesAsync(ct);
            return Results.NoContent();
        }
        catch
        {
            return new ErrorResult("Genre in use", $"Genre with ID `{genreId}` is in use and cannot be deleted`");
        }
    }
}