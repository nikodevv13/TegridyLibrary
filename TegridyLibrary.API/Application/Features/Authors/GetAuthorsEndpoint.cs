using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Application.Features.Authors;

[UsedImplicitly]
internal sealed class GetAuthorsEndpoint : IEndpoint
{
    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapGet(string.Empty, Handler)
            .WithSummary(nameof(GetAuthorsEndpoint))
            .Produces<IEnumerable<AuthorReadModel>>();

    private static async Task<IResult> Handler([FromServices] LibraryDbContext dbContext, CancellationToken ct)
    {
        var readModels = await dbContext.Authors
            .AsNoTracking()
            .Select(x => AuthorReadModel.From(x))
            .ToListAsync(ct);
        
        return Results.Ok(readModels);
    }
}