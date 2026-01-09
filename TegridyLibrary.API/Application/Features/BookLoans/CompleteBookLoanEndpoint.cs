using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Contracts;
using TegridyLibrary.API.Application.ReadModels.BookLoans;
using TegridyLibrary.API.Infrastructure.Database;
using TegridyLibrary.API.Infrastructure.Endpoints;
using TegridyLibrary.API.Infrastructure.Endpoints.Results;
using TegridyLibrary.API.Infrastructure.Services;

namespace TegridyLibrary.API.Application.Features.BookLoans;

[UsedImplicitly]
internal sealed class CompleteBookLoanEndpoint : IEndpoint
{
    private record struct Request(
        [FromRoute] ulong BookLoanId,
        IDateTimeProvider DateTimeProvider,
        HttpContext HttpContext,
        [FromServices] LibraryDbContext DbContext
    );

    public static void Map(IEndpointRouteBuilder builder) =>
        builder.MapPost("{bookLoanId:long}/complete", Handler)
            .WithSummary(nameof(CompleteBookLoanEndpoint))
            .Produces<BookLoanReadModel>()
            .Produces<ErrorResult>(400)
            .RequireAuthorization();

    private static async Task<IResult> Handler([AsParameters] Request request, CancellationToken ct)
    {
        var (bookLoanId, dateTimeProvider, httpContext, dbContext) = request;
        
        if (await dbContext.BookLoans.FirstOrDefaultAsync(x => x.Id == bookLoanId, ct) is not { } bookLoan)
            return new ErrorResult("Book loan not found", "Book loan does not exist");

        if (bookLoan.CompletedAt is not null)
            return new ErrorResult("Book loan already completed", "Book loan already has been marked as completed");
            
        bookLoan.CompletedAt = dateTimeProvider.GetUtcNow();
        bookLoan.CompletedByLibrarianId = httpContext.GetCurrentLibrarianId();

        await dbContext.SaveChangesAsync(ct);
        
        var readModel = await dbContext.BookLoans
            .Where(x => x.Id == bookLoan.Id)
            .SelectReadModel()
            .FirstOrDefaultAsync(ct);
        
        return Results.Ok(readModel);
    }
}