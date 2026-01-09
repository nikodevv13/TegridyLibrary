using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Authors;

[UsedImplicitly]
internal sealed class CreateAuthorEndpoint : IEndpoint
{
    private record struct Request(
        Request.BodyModel Body,
        ISnowflakeIdProvider SnowflakeIdProvider,
        LibraryDbContext DbContext
    )
    {
        [UsedImplicitly]
        public sealed record BodyModel(string FirstName, string LastName);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("create", Handler)
            .WithSummary(nameof(CreateAuthorEndpoint))
            .RequireAuthorization()
            .Produces<GenreReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (body, snowflakeIdProvider, dbContext) = request;

        if (await dbContext.Authors.AnyAsync(x => x.FirstName == body.FirstName && x.LastName == body.LastName, ct))
            return new ErrorResult("Author already exists", $"Author `{body.FirstName} {body.LastName}` already exists", 409);
        
        var author = new Author
        {
            Id = snowflakeIdProvider.Generate(),
            FirstName = body.FirstName,
            LastName= body.LastName,
        };

        await dbContext.Authors.AddAsync(author, ct);
        await dbContext.SaveChangesAsync(ct);

        var readModel = AuthorReadModel.From(author);

        return Results.Created($"api/authors/{author.Id}", readModel);
    }
}