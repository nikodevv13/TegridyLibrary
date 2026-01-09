using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Publishers;

[UsedImplicitly]
internal sealed class CreatePublisherEndpoint : IEndpoint
{
    private record struct Request(
        Request.BodyModel Body,
        ISnowflakeIdProvider SnowflakeIdProvider,
        LibraryDbContext DbContext
    )
    {
        [UsedImplicitly]
        public sealed record BodyModel(string Name);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("create", Handler)
            .WithSummary(nameof(CreatePublisherEndpoint))
            .RequireAuthorization()
            .Produces<PublisherReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (body, snowflakeIdProvider, dbContext) = request;

        if (await dbContext.Publishers.AnyAsync(x => x.Name == body.Name, ct))
            return new ErrorResult("Publisher already exists", $"Publisher with name `{body.Name}` already exists", 409);
        
        var publisher = new Publisher
        {
            Id = snowflakeIdProvider.Generate(),
            Name = body.Name,
        };

        await dbContext.Publishers.AddAsync(publisher, ct);
        await dbContext.SaveChangesAsync(ct);

        var readModel = new PublisherReadModel
        {
            Id = publisher.Id,
            Name = publisher.Name
        };

        return Results.Created($"api/publishers/{publisher.Id}", readModel);
    }
}