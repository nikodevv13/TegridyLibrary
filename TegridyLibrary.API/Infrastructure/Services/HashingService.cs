using System.Security.Cryptography;
using Microsoft.AspNetCore.Identity;

namespace TegridyLibrary.API.Infrastructure.Services;

internal static class HashingService
{
    private static readonly PasswordHasher<object> Hasher = new();

    public static string Hash(string value) => Hasher.HashPassword(null!, value);

    public static bool IsValid(string value, string hashedValue)
        => Hasher.VerifyHashedPassword(null!, hashedValue, value) is PasswordVerificationResult.Success;

    public static string GenerateTemporaryPassword()
    {
        var bytes = new byte[6];
        RandomNumberGenerator.Fill(bytes);
        return Convert.ToBase64String(bytes);
    }
}