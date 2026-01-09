namespace TegridyLibrary.API.Infrastructure.Endpoints;

public interface IEndpoint
{
    public static abstract void Map(IEndpointRouteBuilder builder);
}