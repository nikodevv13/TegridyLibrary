using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TegridyLibrary.API.Application.Entities;

namespace TegridyLibrary.API.Infrastructure.Database.Configurations;

internal sealed class BookCopyConfiguration : IEntityTypeConfiguration<BookCopy>
{
    public void Configure(EntityTypeBuilder<BookCopy> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever().IsRequired();
        builder.Property(x => x.InventoryNumber).HasMaxLength(200).IsRequired();
        builder.Property(x => x.EstimatedPrice).HasPrecision(18, 2).IsRequired();
        builder.Property(x => x.AcquiredDate).HasDefaultValue(DateTime.UnixEpoch).IsRequired();
        builder.Property(x => x.IsDeleted).HasDefaultValue(false).IsRequired();
    }
}