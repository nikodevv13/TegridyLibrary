using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Genres;

[UsedImplicitly]
internal sealed class UpdateGenreEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong GenreId, Request.BodyModel Body, LibraryDbContext DbContext)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string Name);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPut("{genreId:long}", Handler)
            .WithSummary(nameof(UpdateGenreEndpoint))
            .RequireAuthorization()
            .Produces<GenreReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (genreId, body, dbContext) = request;

        if (await dbContext.Genres.FirstOrDefaultAsync(x => x.Id == genreId, ct) is not { } genre)
            return new ErrorResult("Genre not found", $"Genre with ID `{genreId}` does not exists", 404);

        if (await dbContext.Genres.AnyAsync(x => x.Name == body.Name && x.Id != genreId, ct))
            return new ErrorResult("Genre already exists", $"Genre with name `{body.Name}` already exists", 409);

        genre.Name = body.Name;

        await dbContext.SaveChangesAsync(ct);

        var readModel = new GenreReadModel
        {
            Id = genre.Id,
            Name = genre.Name
        };

        return Results.Ok(readModel);
    }
}