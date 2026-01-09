using JetBrains.Annotations;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.Librarians;

[UsedImplicitly]
internal sealed class LogoutLibrarianEndpoint : IEndpoint
{
    private record struct Request(HttpContext HttpContext);

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("current/logout", Handler)
            .WithSummary(nameof(LogoutLibrarianEndpoint))
            .RequireAuthorization()
            .Produces(204);

    private static IResult Handler([AsParameters] Request request)
    {
        request.HttpContext.ClearAccessTokenCookie();
        return Results.NoContent();
    }
}