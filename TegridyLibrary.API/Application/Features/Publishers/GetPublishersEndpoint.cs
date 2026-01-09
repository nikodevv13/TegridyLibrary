using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.Publishers;

[UsedImplicitly]
internal sealed class GetPublishersEndpoint : IEndpoint
{
    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet(string.Empty, Handler)
            .WithSummary(nameof(GetPublishersEndpoint))
            .Produces<IEnumerable<PublisherReadModel>>();

    private static async Task<IResult> Handler([FromServices] LibraryDbContext dbContext, CancellationToken ct)
    {
        var readModels = await dbContext.Publishers
            .AsNoTracking()
            .Select(x => new PublisherReadModel
            {
                Id = x.Id.Value,
                Name = x.Name
            })
            .ToListAsync(ct);
        
        return Results.Ok(readModels);
    }
}