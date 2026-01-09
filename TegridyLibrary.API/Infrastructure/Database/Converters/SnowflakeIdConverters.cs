using JetBrains.Annotations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TegridyLibrary.API.Application.ValueObjects.Ids;

namespace TegridyLibrary.API.Infrastructure.Database.Converters;

[UsedImplicitly]
internal sealed class AuthorIdConverter()
    : ValueConverter<AuthorId, ulong>(x => x.Value, value => new AuthorId(value));

[UsedImplicitly]
internal sealed class BookCopyIdConverter()
    : ValueConverter<BookCopyId, ulong>(x => x.Value, value => new BookCopyId(value));

[UsedImplicitly]
internal sealed class BookIdConverter()
    : ValueConverter<BookId, ulong>(x => x.Value, value => new BookId(value));

[UsedImplicitly]
internal sealed class BookLoanIdConverter()
    : ValueConverter<BookLoanId, ulong>(x => x.Value, value => new BookLoanId(value));

[UsedImplicitly]
internal sealed class GenreIdConverter()
    : ValueConverter<GenreId, ulong>(x => x.Value, value => new GenreId(value));

[UsedImplicitly]
internal sealed class LibrarianIdConverter()
    : ValueConverter<LibrarianId, ulong>(x => x.Value, value => new LibrarianId(value));

[UsedImplicitly]
internal sealed class PublisherIdConverter()
    : ValueConverter<PublisherId, ulong>(x => x.Value, value => new PublisherId(value));

[UsedImplicitly]
internal sealed class ReaderIdConverter()
    : ValueConverter<ReaderId, ulong>(x => x.Value, value => new ReaderId(value));