using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Authors;

[UsedImplicitly]
internal sealed class UpdateAuthorEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong AuthorId, Request.BodyModel Body, LibraryDbContext DbContext)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string FirstName, string LastName);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPut("{authorId:long}", Handler)
            .WithSummary(nameof(UpdateAuthorEndpoint))
            .RequireAuthorization()
            .Produces<GenreReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (authorId, body, dbContext) = request;

        if (await dbContext.Authors.FirstOrDefaultAsync(x => x.Id == authorId, ct) is not { } author)
            return new ErrorResult("Genre not found", $"Genre with ID `{authorId}` does not exists", 404);

        if (await dbContext.Authors.AnyAsync(x => x.FirstName == body.FirstName && x.LastName == body.LastName && x.Id != authorId, ct))
            return new ErrorResult("Author already exists", $"Author `{body.FirstName} {body.LastName}` already exists", 409);

        author.FirstName = body.FirstName;
        author.LastName = body.LastName;

        await dbContext.SaveChangesAsync(ct);

        var readModel = AuthorReadModel.From(author);
        return Results.Ok(readModel);
    }
}