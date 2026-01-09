using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.ValueObjects;
using TegridyLibrary.API.Infrastructure.Settings;

namespace TegridyLibrary.API.Infrastructure.Services;

internal sealed class AccessTokenProvider(IOptions<AccessTokensSettings> accessTokensSettings) : IAccessTokenTokenProvider
{
    public const string IdClaimType = JwtRegisteredClaimNames.Sub;
    public const string RoleClaimType = "role";

    private readonly AccessTokensSettings _accessTokensSettings = accessTokensSettings.Value;
    private static readonly JsonWebTokenHandler JsonWebTokenHandler = new() { MapInboundClaims = false };

    public AccessToken Generate(Librarian librarian, DateTime generationDateTime)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_accessTokensSettings.Secret));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var expiresAt = generationDateTime.Add(_accessTokensSettings.Lifetime);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity([
                new Claim(IdClaimType, librarian.Id.Value.ToString()),
                new Claim(RoleClaimType, nameof(Librarian)),
            ]),
            Expires = expiresAt,
            SigningCredentials = credentials,
            Issuer = _accessTokensSettings.Issuer,
            Audience = _accessTokensSettings.Audience,
        };

        var accessToken = JsonWebTokenHandler.CreateToken(tokenDescriptor);
        return new AccessToken(accessToken, expiresAt);
    }

    public AccessToken Generate(Reader reader, DateTime generationDateTime)
    {
        throw new NotImplementedException();
    }

    public static TokenValidationParameters GetTokenValidationParameters(AccessTokensSettings accessTokensSettings) => new()
    {
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidateIssuer = true,
        ValidIssuer = accessTokensSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = accessTokensSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(accessTokensSettings.Secret))
    };
}