using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.ReadModels.Librarians;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class LoginLibrarianEndpoint : IEndpoint
{
    private record struct Request(
        HttpContext HttpContext,
        Request.BodyModel Body)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string Email, string Password);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("login", Handler)
            .WithSummary(nameof(LoginLibrarianEndpoint))
            .Produces<LibrarianDetailsReadModel>()
            .Produces<ErrorResult>(400);

    private static async Task<IResult> Handler(
        [AsParameters] Request request,
        IAccessTokenTokenProvider accessTokenTokenProvider,
        IDateTimeProvider dateTimeProvider,
        LibraryDbContext dbContext)
    {
        var (email, password) = request.Body;

        var librarian = await dbContext.Librarians
            .FirstOrDefaultAsync(x => x.Email == email);

        if (librarian is null || !HashingService.IsValid(password, librarian.HashedPassword))
            return new ErrorResult("Invalid login credentials",
                "Invalid email or password!");

        var loginDateTime = dateTimeProvider.GetUtcNow();
        var tokens = accessTokenTokenProvider.Generate(librarian, loginDateTime);

        librarian.LastLoggedInAt = loginDateTime;
        await dbContext.SaveChangesAsync();

        request.HttpContext.SetAccessTokenCookie(tokens);

        var readModel = LibrarianDetailsReadModel.From(librarian);
        return Results.Ok(readModel);
    }
}