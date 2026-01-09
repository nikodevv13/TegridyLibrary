using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Readers;

[UsedImplicitly]
internal sealed class CreateReaderEndpoint : IEndpoint
{
    private record struct Request(
        Request.BodyModel Body,
        ISnowflakeIdProvider SnowflakeIdProvider,
        LibraryDbContext DbContext
    )
    {
        [UsedImplicitly]
        public sealed record BodyModel(string FirstName, string LastName, string Email);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("create", Handler)
            .WithSummary(nameof(CreateReaderEndpoint))
            .RequireAuthorization()
            .Produces<ReaderReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (body, snowflakeIdProvider, dbContext) = request;

        if (await dbContext.Readers.AnyAsync(x => x.Email == body.Email, ct))
            return new ErrorResult("Reader already exists", $"Reader with email `{body.Email}` already exists", 409);
        
        var reader = new Reader
        {
            Id = snowflakeIdProvider.Generate(),
            FirstName = body.FirstName,
            LastName = body.LastName,
            Email = body.Email,
        };

        await dbContext.Readers.AddAsync(reader, ct);
        await dbContext.SaveChangesAsync(ct);

        var readModel = ReaderReadModel.From(reader);

        return Results.Created($"api/readers/{reader.Id}", readModel);
    }
}