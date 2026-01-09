using Microsoft.IdentityModel.JsonWebTokens;
using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.ValueObjects;
using TegridyLibrary.API.Application.ValueObjects.Ids;

namespace TegridyLibrary.API.Infrastructure.Services;

internal static class CookieUserStorage
{
    public const string AccessTokenCookieKey = "tegridy_library_access_token";

    extension(HttpContext httpContext)
    {
        public void SetAccessTokenCookie(AccessToken accessToken)
        {
            var accessTokenCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = accessToken.ExpiresAt,
            };

            httpContext.Response.Cookies.Append(AccessTokenCookieKey, accessToken.Value, accessTokenCookieOptions);
        }

        public LibrarianId? GetCurrentLibrarianId()
        {
            if (httpContext.User.Claims.FirstOrDefault(x => x.Type == AccessTokenProvider.RoleClaimType) is not { Value: nameof(Librarian) })
                return null;

            var userIdClaim = httpContext.User.Claims.FirstOrDefault(x => x.Type == AccessTokenProvider.IdClaimType);
            return userIdClaim is not null && ulong.TryParse(userIdClaim.Value, out var id)
                ? new LibrarianId(id)
                : null;
        }

        public ReaderId? GetCurrentReaderId()
        {
            if (httpContext.User.Claims.FirstOrDefault(x => x.Type == AccessTokenProvider.RoleClaimType) is not { Value: nameof(Reader) })
                return null;

            var userIdClaim = httpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub);
            return userIdClaim is not null && ulong.TryParse(userIdClaim.Value, out var id)
                ? new ReaderId(id)
                : null;
        }

        public void ClearAccessTokenCookie()
        {
            var accessTokenCookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UnixEpoch,
            };

            httpContext.Response.Cookies.Append(AccessTokenCookieKey, string.Empty, accessTokenCookieOptions);
        }
    }
}