using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.ReadModels;
using TegridyLibrary.API.Application.ReadModels.BookLoans;
using TegridyLibrary.API.Application.ReadModels.Books;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.BookLoans;

[UsedImplicitly]
internal sealed class CreateBookLoanEndpoint : IEndpoint
{
    private record struct Request(
        HttpContext HttpContext,
        ISnowflakeIdProvider SnowflakeIdProvider,
        IDateTimeProvider DateTimeProvider,
        [FromBody] Request.BodyModel Body,
        [FromServices] LibraryDbContext DbContext
    )
    {
        public sealed record BodyModel(ulong ReaderId, ulong BookCopyId);
    }

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("create", Handler)
            .WithSummary(nameof(GetPaginatedBookLoansEndpoint))
            .Produces<BookLoanReadModel>()
            .Produces<ErrorResult>(400)
            .RequireAuthorization();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (httpContext, snowflakeIdProvider, dateTimeProvider, body, dbContext) = request;
        var (readerId, bookCopyId) = body;
        
        if (!await dbContext.BookCopies.AnyAsync(x => x.Id == bookCopyId, ct))
            return new ErrorResult("Book copy not found", "Book copy does not exist");
        
        if (!await dbContext.Readers.AnyAsync(x => x.Id == readerId, ct))
            return new ErrorResult("Reader not found", "Reader does not exist");

        if (await dbContext.BookLoans.AnyAsync(x => x.BookCopyId == bookCopyId && x.CompletedAt == null, ct))
            return new ErrorResult("Book already has book loan ", "Book is borrowed by other reader");

        var bookLoan = new BookLoan
        {
            Id = snowflakeIdProvider.Generate(),
            BookCopyId = bookCopyId,
            ReaderId = readerId,
            StartedByLibrarianId = httpContext.GetCurrentLibrarianId()!,
            CompletedByLibrarianId = null,
            StartedAt = dateTimeProvider.GetUtcNow(),
            CompletedAt = null
        };
        
        await dbContext.AddAsync(bookLoan, ct);
        await dbContext.SaveChangesAsync(ct);
        
        var readModel = await dbContext.BookLoans
            .Where(x => x.Id == bookLoan.Id)
            .SelectReadModel()
            .FirstOrDefaultAsync(ct);
        
        return Results.Created("/api/library/book-loans/create", readModel);
    }
}