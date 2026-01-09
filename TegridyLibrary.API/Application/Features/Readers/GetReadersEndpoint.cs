using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.Readers;

[UsedImplicitly]
internal sealed class GetReadersEndpoint : IEndpoint
{
    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet(string.Empty, Handler)
            .WithSummary(nameof(GetReadersEndpoint))
            .Produces<IEnumerable<PublisherReadModel>>();

    private static async Task<IResult> Handler([FromServices] LibraryDbContext dbContext, CancellationToken ct)
    {
        var readModels = await dbContext.Readers
            .AsNoTracking()
            .Select(x => ReaderReadModel.From(x))
            .ToListAsync(ct);
        
        return Results.Ok(readModels);
    }
}