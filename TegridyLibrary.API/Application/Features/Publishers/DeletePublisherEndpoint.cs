using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Publishers;

[UsedImplicitly]
internal sealed class DeletePublisherEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong PublisherId, LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapDelete("{publisherId:long}", Handler)
            .WithSummary(nameof(DeletePublisherEndpoint))
            .RequireAuthorization()
            .Produces(204)
            .Produces<ErrorResult>(400);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (publisherId, dbContext) = request;

        var publisher = await dbContext.Publishers.FirstOrDefaultAsync(g => g.Id == publisherId, ct);
        if (publisher is null) return Results.NoContent();
        
        try
        {
            dbContext.Remove(publisher);
            await dbContext.SaveChangesAsync(ct);
            return Results.NoContent();
        }
        catch
        {
            return new ErrorResult("Publisher in use", $"Publisher with ID `{publisherId}` is in use and cannot be deleted`");
        }
    }
}