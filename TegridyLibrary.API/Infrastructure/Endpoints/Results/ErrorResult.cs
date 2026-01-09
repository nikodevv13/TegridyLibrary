using System.Text.Json.Serialization;

namespace TegridyLibrary.API.Infrastructure.Endpoints.Results;

internal record ErrorResult(string Type, string Message, [property: JsonIgnore] int StatusCode = 400) : IResult
{
    public IEnumerable<DetailModel> Details { get; init; } = [];

    public Task ExecuteAsync(HttpContext httpContext)
    {
        httpContext.Response.StatusCode = StatusCode;
        httpContext.Response.WriteAsJsonAsync(this);

        return Task.CompletedTask;
    }

    public sealed record DetailModel(string Context, IEnumerable<string> Messages);
}
