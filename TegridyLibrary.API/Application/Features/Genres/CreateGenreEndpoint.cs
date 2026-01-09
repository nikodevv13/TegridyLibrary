using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Genres;

[UsedImplicitly]
internal sealed class CreateGenreEndpoint : IEndpoint
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
            .WithSummary(nameof(CreateGenreEndpoint))
            .RequireAuthorization()
            .Produces<GenreReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (body, snowflakeIdProvider, dbContext) = request;

        if (await dbContext.Genres.AnyAsync(x => x.Name == body.Name, ct))
            return new ErrorResult("Genre already exists", $"Genre with name `{body.Name}` already exists", 409);
        
        var genre = new Genre
        {
            Id = snowflakeIdProvider.Generate(),
            Name = body.Name,
        };

        await dbContext.Genres.AddAsync(genre, ct);
        await dbContext.SaveChangesAsync(ct);

        var readModel = new GenreReadModel
        {
            Id = genre.Id,
            Name = genre.Name
        };

        return Results.Created($"api/genres/{genre.Id}", readModel);
    }
}