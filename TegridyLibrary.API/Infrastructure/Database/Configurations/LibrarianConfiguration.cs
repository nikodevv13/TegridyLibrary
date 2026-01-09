using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TegridyLibrary.API.Application.Entities.Users;

namespace TegridyLibrary.API.Infrastructure.Database.Configurations;

internal sealed class LibrarianConfiguration : IEntityTypeConfiguration<Librarian>
{
    public void Configure(EntityTypeBuilder<Librarian> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever().IsRequired();
        builder.Property(x => x.Email).HasMaxLength(320).IsRequired();
        builder.Property(x => x.FirstName).HasMaxLength(50).IsRequired();
        builder.Property(x => x.LastName).HasMaxLength(50).IsRequired();
        builder.Property(x => x.HashedPassword).HasMaxLength(256).IsRequired();
        builder.Property(x => x.LastLoggedInAt).HasDefaultValue(DateTime.UnixEpoch).IsRequired(false);
        builder.Property(x => x.IsDeleted).HasDefaultValue(false).IsRequired();
        builder.PrimitiveCollection(x => x.Permissions);
    }
}