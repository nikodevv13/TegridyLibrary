namespace TegridyLibrary.API.Infrastructure.Endpoints.Results;

internal static class SharedErrors
{
    private static class Types
    {
        public const string ValidationError = nameof(ValidationError);
        public const string UnauthorizedError = nameof(UnauthorizedError);
    }

    public static ErrorResult UnauthorizedError => new(Types.UnauthorizedError, "Missing or invalid credentials.", 401);
    public static ErrorResult ValidationError(IEnumerable<ErrorResult.DetailModel>? details = null) => new(Types.ValidationError, "Validation error.") { Details = details ?? [] };
}