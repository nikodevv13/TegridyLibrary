using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TegridyLibrary.API.Application.Entities;

namespace TegridyLibrary.API.Infrastructure.Database.Configurations;

internal sealed class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever().IsRequired();
        builder.Property(x => x.Title).HasMaxLength(200).IsRequired();
        builder.Property(x => x.OriginalTitle).HasMaxLength(200).IsRequired(false);
        builder.Property(x => x.Description).HasMaxLength(1000).IsRequired(false);
        builder.Property(x => x.Language).HasMaxLength(2).IsRequired();
        builder.Property(x => x.CreatedAt).HasDefaultValue(DateTime.UnixEpoch).IsRequired();
        
        builder.Property(x => x.Isbn).HasMaxLength(13).IsRequired(false);
        builder.Property(x => x.PublicationDate).HasDefaultValue(DateTime.UnixEpoch).IsRequired();
        builder.Property(x => x.IsDeleted).HasDefaultValue(false).IsRequired();

        builder.HasOne(x => x.Genre)
            .WithMany()
            .HasForeignKey(x => x.GenreId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
        
        builder.HasOne(x => x.Author)
            .WithMany()
            .HasForeignKey(x => x.AuthorId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
        
        builder.HasOne(x => x.Publisher)
            .WithMany()
            .HasForeignKey(x => x.PublisherId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
        
        builder.HasMany(x => x.Copies)
            .WithOne(x => x.Book)
            .HasForeignKey(x => x.BookId)
            .HasPrincipalKey(x => x.Id)
            .IsRequired();
    }
}