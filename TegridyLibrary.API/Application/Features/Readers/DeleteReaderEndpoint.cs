using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Readers;

[UsedImplicitly]
internal sealed class DeleteReaderEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong ReaderId, LibraryDbContext DbContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapDelete("{readerId:long}", Handler)
            .WithSummary(nameof(DeleteReaderEndpoint))
            .RequireAuthorization()
            .Produces(204)
            .Produces<ErrorResult>(400);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (readerId, dbContext) = request;

        var reader = await dbContext.Readers.FirstOrDefaultAsync(g => g.Id == readerId, ct);
        if (reader is null) return Results.NoContent();
        
        try
        {
            dbContext.Remove(reader);
            await dbContext.SaveChangesAsync(ct);
            return Results.NoContent();
        }
        catch
        {
            return new ErrorResult("Reader in use", $"Reader with ID `{readerId}` is in use and cannot be deleted`");
        }
    }
}