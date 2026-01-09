using Microsoft.EntityFrameworkCore;
using TegridyLibrary.API.Application.Entities;
using TegridyLibrary.API.Application.Entities.Users;
using TegridyLibrary.API.Application.ValueObjects;
using TegridyLibrary.API.Application.ValueObjects.Ids;
using TegridyLibrary.API.Infrastructure.Database.Converters;

namespace TegridyLibrary.API.Infrastructure.Database;

internal sealed class LibraryDbContext(DbContextOptions<LibraryDbContext> dbContextOptions) : DbContext(dbContextOptions)
{
    private const string SchemaName = "Library";
    
    public required DbSet<Librarian> Librarians { get; init; } = null!;
    public required DbSet<Book> Books { get; init; } = null!;
    public required DbSet<BookCopy> BookCopies { get; init; } = null!;
    public required DbSet<Publisher> Publishers { get; init; } = null!;
    public required DbSet<Genre> Genres { get; init; } = null!;
    public required DbSet<Author> Authors { get; init; } = null!;
    public required DbSet<Reader> Readers { get; init; } = null!;
    public required DbSet<BookLoan> BookLoans { get; init; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.HasDefaultSchema(SchemaName);
        builder.ApplyConfigurationsFromAssembly(typeof(Extensions).Assembly);
        base.OnModelCreating(builder);
    }
    
    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        configurationBuilder.Properties<BookCopyId>().HaveConversion<BookCopyIdConverter>();
        configurationBuilder.Properties<BookLoanId>().HaveConversion<BookLoanIdConverter>();
        configurationBuilder.Properties<BookId>().HaveConversion<BookIdConverter>();
        configurationBuilder.Properties<GenreId>().HaveConversion<GenreIdConverter>();
        configurationBuilder.Properties<LibrarianId>().HaveConversion<LibrarianIdConverter>();
        configurationBuilder.Properties<PublisherId>().HaveConversion<PublisherIdConverter>();
        configurationBuilder.Properties<ReaderId>().HaveConversion<ReaderIdConverter>();
        configurationBuilder.Properties<AuthorId>().HaveConversion<AuthorIdConverter>();
        
        configurationBuilder.Properties<Language>().HaveConversion<LanguageConverter>();
    }
}