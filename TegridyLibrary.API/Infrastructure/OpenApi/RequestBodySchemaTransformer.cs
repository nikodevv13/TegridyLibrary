using Microsoft.AspNetCore.OpenApi;
using Microsoft.OpenApi;
using TegridyLibrary.API.Infrastructure.Endpoints;

namespace TegridyLibrary.API.Infrastructure.OpenApi;

internal class RequestBodySchemaTransformer : IOpenApiSchemaTransformer
{
	public Task TransformAsync(OpenApiSchema schema, OpenApiSchemaTransformerContext context, CancellationToken cancellationToken)
	{
		var type = context.JsonTypeInfo.Type;

		if (!type.IsNested) return Task.CompletedTask;

		if (type.DeclaringType?.IsAssignableTo(typeof(IResult)) ?? false)
		{
			schema.Title = $"{type.DeclaringType.Name}.{type.Name}";
			schema.Metadata?["x-schema-id"] = $"{type.DeclaringType.Name}.{type.Name}";
		} else if (type.DeclaringType?.DeclaringType?.IsAssignableTo(typeof(IEndpoint)) ?? false)
		{
			schema.Title = $"{type.DeclaringType.DeclaringType.Name}.{type.Name}";
			schema.Metadata?["x-schema-id"] = $"{type.DeclaringType.DeclaringType.Name}.{type.Name}";
		}

		return Task.CompletedTask;
	}
}