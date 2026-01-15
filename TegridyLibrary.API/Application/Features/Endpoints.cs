using TegridyLibrary.API.Application.Features.Analytics;
using TegridyLibrary.API.Application.Features.Authors;
using TegridyLibrary.API.Application.Features.BookLoans;
using TegridyLibrary.API.Application.Features.Books;
using TegridyLibrary.API.Application.Features.Genres;
using TegridyLibrary.API.Application.Features.Librarians;
using TegridyLibrary.API.Application.Features.Publishers;
using TegridyLibrary.API.Application.Features.Readers;
using TegridyLibrary.API.Infrastructure;

namespace TegridyLibrary.API.Application.Features;

internal static class Endpoints
{
    public static void MapLibraryEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var apiGroup = endpoints.MapGroup("api");

        var librariansGroup = apiGroup.MapGroup("librarians")
            .WithTags("Librarians");

        librariansGroup.Map<ChangeLibrarianPasswordEndpoint>();
        librariansGroup.Map<CreateLibrarianEndpoint>();
        librariansGroup.Map<LoginLibrarianEndpoint>();
        librariansGroup.Map<LogoutLibrarianEndpoint>();
        librariansGroup.Map<ResetLibrarianPassword>();
        librariansGroup.Map<UpdateLibrarianEndpoint>();
        librariansGroup.Map<GetCurrentLibrarianEndpoint>();
        librariansGroup.Map<GetLibrariansEndpoint>();
        librariansGroup.Map<DeleteLibrarianEndpoint>();

        var genresGroup = apiGroup.MapGroup("genres")
            .WithTags("Librarians - Genres");

        genresGroup.Map<GetGenresEndpoint>();
        genresGroup.Map<CreateGenreEndpoint>();
        genresGroup.Map<UpdateGenreEndpoint>();
        genresGroup.Map<DeleteGenreEndpoint>();
        
        var publishersGroup = apiGroup.MapGroup("publishers")
            .WithTags("Publishers");

        publishersGroup.Map<GetPublishersEndpoint>();
        publishersGroup.Map<CreatePublisherEndpoint>();
        publishersGroup.Map<UpdatePublisherEndpoint>();
        publishersGroup.Map<DeletePublisherEndpoint>();
        
        var authorsGroup = apiGroup.MapGroup("authors")
            .WithTags("Authors");

        authorsGroup.Map<GetAuthorsEndpoint>();
        authorsGroup.Map<CreateAuthorEndpoint>();
        authorsGroup.Map<UpdateAuthorEndpoint>();
        authorsGroup.Map<DeleteAuthorEndpoint>();
        
        var booksGroup = apiGroup.MapGroup("books")
            .WithTags("Books");

        booksGroup.Map<CreateBookEndpoint>();
        booksGroup.Map<GetBookDetailsEndpoint>();
        booksGroup.Map<GetPaginatedBookSummariesEndpoint>();
        booksGroup.Map<UpdateBookEndpoint>();
        booksGroup.Map<DeleteBookEndpoint>();

        var readersGroup = apiGroup.MapGroup("readers")
            .WithTags("Readers");
        
        readersGroup.Map<GetReadersEndpoint>();
        readersGroup.Map<CreateReaderEndpoint>();
        readersGroup.Map<UpdateReaderEndpoint>();
        readersGroup.Map<DeleteReaderEndpoint>();
        
        var bookLoansGroup = apiGroup.MapGroup("book-loans")
            .WithTags("Book Loans");
        
        bookLoansGroup.Map<CreateBookLoanEndpoint>();
        bookLoansGroup.Map<GetPaginatedBookLoansEndpoint>();
        bookLoansGroup.Map<GetPaginatedBooksForBookLoanCreationEndpoint>();
        bookLoansGroup.Map<CompleteBookLoanEndpoint>();
        
        var analytics = apiGroup.MapGroup("analytics")
            .WithTags("Analytics");
        
        analytics.Map<GetGlobalAnalyticsEndpoint>();
    }
}