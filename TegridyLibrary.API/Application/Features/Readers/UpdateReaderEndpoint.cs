using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Readers;

[UsedImplicitly]
internal sealed class UpdateReaderEndpoint : IEndpoint
{
    private record struct Request([FromRoute] ulong ReaderId, Request.BodyModel Body, LibraryDbContext DbContext)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string FirstName, string LastName, string Email);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPut("{readerId:long}", Handler)
            .WithSummary(nameof(UpdateReaderEndpoint))
            .RequireAuthorization()
            .Produces<ReaderReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (readerId, body, dbContext) = request;

        if (await dbContext.Readers.FirstOrDefaultAsync(x => x.Id == readerId, ct) is not { } reader)
            return new ErrorResult("Reader not found", $"Reader with ID `{readerId}` does not exists", 404);

        if (await dbContext.Readers.AnyAsync(x => x.Email == body.Email && x.Id != readerId, ct))
            return new ErrorResult("Reader already exists", $"Reader with email `{body.Email}` already exists", 409);

        reader.FirstName = body.FirstName;
        reader.LastName = body.LastName;
        reader.Email = body.Email;

        await dbContext.SaveChangesAsync(ct);

        var readModel = ReaderReadModel.From(reader);
        return Results.Ok(readModel);
    }
}