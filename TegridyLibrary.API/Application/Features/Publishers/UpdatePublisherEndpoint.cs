using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Publishers;

[UsedImplicitly]
internal sealed class UpdatePublisherEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong PublisherId, Request.BodyModel Body, LibraryDbContext DbContext)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string Name);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPut("{publisherId:long}", Handler)
            .WithSummary(nameof(UpdatePublisherEndpoint))
            .RequireAuthorization()
            .Produces<PublisherReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (publisherId, body, dbContext) = request;

        if (await dbContext.Publishers.FirstOrDefaultAsync(x => x.Id == publisherId, ct) is not { } publisher)
            return new ErrorResult("Publisher not found", $"Publisher with ID `{publisherId}` does not exists", 404);

        if (await dbContext.Publishers.AnyAsync(x => x.Name == body.Name && x.Id != publisherId, ct))
            return new ErrorResult("Publisher already exists", $"Publisher with name `{body.Name}` already exists", 409);

        publisher.Name = body.Name;

        await dbContext.SaveChangesAsync(ct);

        var readModel = new PublisherReadModel
        {
            Id = publisher.Id,
            Name = publisher.Name
        };

        return Results.Ok(readModel);
    }
}