using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TegridyLibrary.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ProvideLibrarianSoftDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Library",
                table: "Librarians",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Library",
                table: "Librarians");
        }
    }
}
