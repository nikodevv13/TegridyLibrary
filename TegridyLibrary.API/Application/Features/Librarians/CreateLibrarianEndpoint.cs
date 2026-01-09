using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.Enums;
using TegridyLibrary.API.Application.ReadModels.Librarians;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class CreateLibrarianEndpoint : IEndpoint
{
    private record struct Request(Request.BodyModel Body)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string Email, string FirstName, string LastName, List<LibrarianPermissions> Permissions);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("create", Handler)
            .WithSummary(nameof(CreateLibrarianEndpoint))
            .Produces<LibrarianTemporaryPasswordReadModel>()
            .Produces<ErrorResult>(409);

    private static async Task<IResult> Handler(
        [AsParameters] Request request,
        IAccessTokenTokenProvider accessTokenTokenProvider,
        IDateTimeProvider dateTimeProvider,
        ISnowflakeIdProvider snowflakeIdProvider,
        LibraryDbContext dbContext)
    {
        var (email, firstName, lastName, permissions) = request.Body;

        if (await dbContext.Librarians.AnyAsync(x => x.Email == email && !x.IsDeleted))
            return new ErrorResult("Email already in use.", $"Email `{email}` is already in use by other librarian", 409);

        var temporaryPassword = HashingService.GenerateTemporaryPassword();
        var librarian = new Librarian
        {
            Id = snowflakeIdProvider.Generate(),
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            HashedPassword = HashingService.Hash(temporaryPassword),
            LastLoggedInAt = null,
            Permissions = permissions,
        };

        await dbContext.Librarians.AddAsync(librarian);
        await dbContext.SaveChangesAsync();

        var readModel = new LibrarianTemporaryPasswordReadModel
        {
            TemporaryPassword = temporaryPassword
        };

        return Results.Ok(readModel);
    }
}