using TegridyLibrary.API.Application.ValueObjects;
using TegridyLibrary.API.Application.ValueObjects.Ids;

namespace TegridyLibrary.API.Application.Entities;

internal sealed class Book
{
    public required BookId Id { get; init; }

    public required string Title { get; set; }
    public required string? OriginalTitle { get; set; }
    public required string? Description { get; set; }
    public required Language Language { get; set; }
    
    public required string? Isbn { get; set; }
    public required DateTime PublicationDate { get; set; }
    
    public required GenreId? GenreId { get; set; }
    public Genre? Genre { get; set; }
    
    public required AuthorId? AuthorId { get; set; }
    public Author? Author { get; set; }

    public required PublisherId? PublisherId { get; set; }
    public Publisher? Publisher { get; set; }
    
    public required DateTime CreatedAt { get; init; }

    public bool IsDeleted { get; set; } = false;

    public ICollection<BookCopy> Copies { get; set; } = [];
}