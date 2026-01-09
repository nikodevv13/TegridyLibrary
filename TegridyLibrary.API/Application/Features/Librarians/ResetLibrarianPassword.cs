using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.ReadModels.Librarians;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class ResetLibrarianPassword : IEndpoint
{
    private record struct Request(
        ulong LibrarianId,
        LibraryDbContext DbContext
    );

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("{librarianId}/reset-password", Handler)
            .WithSummary(nameof(ResetLibrarianPassword))
            .RequireAuthorization()
            .Produces<LibrarianTemporaryPasswordReadModel>()
            .Produces<ErrorResult>(404);

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (librarianId, dbContext) = request;

        if (await dbContext.Librarians.FirstOrDefaultAsync(x => x.Id == librarianId, ct) is not { } librarian)
            return new ErrorResult("Librarian not found", $"Librarian with ID `{librarianId}` does not exist", 404);

        var temporaryPassword = HashingService.GenerateTemporaryPassword();
        librarian.HashedPassword = HashingService.Hash(temporaryPassword);
        await dbContext.SaveChangesAsync(ct);

        var readModel = new LibrarianTemporaryPasswordReadModel
        {
            TemporaryPassword = temporaryPassword
        };

        return Results.Ok(readModel);
    }
}