using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.Genres;

[UsedImplicitly]
internal sealed class GetGenresEndpoint : IEndpoint
{
    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet(string.Empty, Handler)
            .WithSummary(nameof(GetGenresEndpoint))
            .Produces<IEnumerable<GenreReadModel>>();

    private static async Task<IResult> Handler([FromServices] LibraryDbContext dbContext, CancellationToken ct)
    {
        var readModels = await dbContext.Genres
            .AsNoTracking()
            .Select(x => new GenreReadModel
            {
                Id = x.Id.Value,
                Name = x.Name
            })
            .ToListAsync(ct);
        
        return Results.Ok(readModels);
    }
}