using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Enums;
using TegridyLibrary.API.Application.ReadModels.Librarians;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class UpdateLibrarianEndpoint : IEndpoint
{
    private record struct Request(ulong LibrarianId, Request.BodyModel Body, LibraryDbContext DbContext)
    {
        [UsedImplicitly]
        public sealed record BodyModel(string Email, string FirstName, string LastName, List<LibrarianPermissions> Permissions);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPut("{librarianId:long}", Handler)
            .WithSummary(nameof(UpdateLibrarianEndpoint))
            .Produces<LibrarianDetailsReadModel>()
            .Produces<ErrorResult>(400)
            .Produces<ErrorResult>(404)
            .RequireAuthorization();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (librarianId, body, dbContext) = request;
        var (email, firstName, lastName, permissions) = body;

        if (await dbContext.Librarians.FirstOrDefaultAsync(x => x.Id == librarianId, ct) is not { } librarian)
            return new ErrorResult("Librarian not found", $"Librarian with ID `{librarianId}` does not exist");

        if (await dbContext.Librarians.AnyAsync(x => x.Email == email && x.Id != librarianId && !x.IsDeleted, ct))
            return new ErrorResult("Email already in use.", $"Email `{email}` is already in use by other librarian");

        librarian.Email = email;
        librarian.FirstName = firstName;
        librarian.LastName = lastName;
        librarian.Permissions = permissions;

        await dbContext.SaveChangesAsync(ct);

        var readModel = LibrarianDetailsReadModel.From(librarian);
        return Results.Ok(readModel);
    }
}