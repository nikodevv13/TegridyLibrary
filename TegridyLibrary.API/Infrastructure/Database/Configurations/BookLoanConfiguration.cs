using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TegridyLibrary.API.Application.Entities;

namespace TegridyLibrary.API.Infrastructure.Database.Configurations;

internal sealed class BookLoanConfiguration : IEntityTypeConfiguration<BookLoan>
{
    public void Configure(EntityTypeBuilder<BookLoan> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever().IsRequired();
        builder.Property(x => x.StartedAt).HasDefaultValueSql("GETUTCDATE()").IsRequired();
        builder.Property(x => x.CompletedAt).IsRequired(false);

        builder.HasOne(x => x.BookCopy)
            .WithMany(x => x.Loans)
            .HasForeignKey(x => x.BookCopyId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired();
        
        builder.HasOne(x => x.StartedByLibrarian)
            .WithMany()
            .HasForeignKey(x => x.StartedByLibrarianId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired();
        
        builder.HasOne(x => x.CompletedByLibrarian)
            .WithMany()
            .HasForeignKey(x => x.CompletedByLibrarianId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired(false);
        
        builder.HasOne(x => x.Reader)
            .WithMany()
            .HasForeignKey(x => x.ReaderId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict)
            .IsRequired();
    }
}