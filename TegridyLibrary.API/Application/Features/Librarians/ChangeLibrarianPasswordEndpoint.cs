using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class ChangeLibrarianPasswordEndpoint : IEndpoint
{
    private record struct Request(
        HttpContext HttpContext,
        Request.BodyModel Body)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string CurrentPassword, string NewPassword);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("current/change-password", Handler)
            .WithSummary(nameof(ChangeLibrarianPasswordEndpoint))
            .Produces(204)
            .Produces<ErrorResult>(400)
            .RequireAuthorization();

    private static async Task<IResult> Handler(
        [AsParameters] Request request,
        IAccessTokenTokenProvider accessTokenTokenProvider,
        IDateTimeProvider dateTimeProvider,
        LibraryDbContext dbContext)
    {
        var (currentPassword, newPassword) = request.Body;

        var librarianId = request.HttpContext.GetCurrentLibrarianId();
        
        var librarian = await dbContext.Librarians
            .FirstAsync(x => x.Id == librarianId);

        if (!HashingService.IsValid(currentPassword, librarian.HashedPassword))
            return new ErrorResult("Invalid current password", "Given current password is incorrect");

        librarian.HashedPassword = HashingService.Hash(newPassword);
        await dbContext.SaveChangesAsync();

        return Results.NoContent();
    }
}