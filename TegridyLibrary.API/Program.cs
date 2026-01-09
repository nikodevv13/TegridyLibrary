using Scalar.AspNetCore;
using TegridyLibrary.API.Application.Features;
using TegridyLibrary.API.Infrastructure;
using TegridyLibrary.API.Infrastructure.OpenApi;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;
var services = builder.Services;

services.AddInfrastructure(configuration);

const string corsPolicyName = "TegridyLibraryCors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: corsPolicyName,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});


services.AddEndpointsApiExplorer();
services.AddOpenApi(options =>
{
    options.AddSchemaTransformer<RequestBodySchemaTransformer>();
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference("/docs", options => options
        .WithTitle("CADR API")
        .WithTheme(ScalarTheme.Default)
        .EnableDarkMode()
        .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Axios)
        .WithDocumentDownloadType(DocumentDownloadType.Both)
        .WithDotNetFlag()
        .ExpandAllTags());
}

app.UseCors(corsPolicyName);

app.UseAuthentication();
app.UseAuthorization();

app.MapLibraryEndpoints();

app.Run();
