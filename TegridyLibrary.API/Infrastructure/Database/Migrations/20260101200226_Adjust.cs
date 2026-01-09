using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TegridyLibrary.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class Adjust : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookEditions_Publisher_PublisherId",
                schema: "Library",
                table: "BookEditions");

            migrationBuilder.DropForeignKey(
                name: "FK_Books_Genres_GenreId",
                schema: "Library",
                table: "Books");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Publisher",
                schema: "Library",
                table: "Publisher");

            migrationBuilder.RenameTable(
                name: "Publisher",
                schema: "Library",
                newName: "Publishers",
                newSchema: "Library");

            migrationBuilder.AddColumn<string>(
                name: "Permissions",
                schema: "Library",
                table: "Librarians",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "[]");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Publishers",
                schema: "Library",
                table: "Publishers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BookEditions_Publishers_PublisherId",
                schema: "Library",
                table: "BookEditions",
                column: "PublisherId",
                principalSchema: "Library",
                principalTable: "Publishers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Genres_GenreId",
                schema: "Library",
                table: "Books",
                column: "GenreId",
                principalSchema: "Library",
                principalTable: "Genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_BookEditions_Publishers_PublisherId",
                schema: "Library",
                table: "BookEditions");

            migrationBuilder.DropForeignKey(
                name: "FK_Books_Genres_GenreId",
                schema: "Library",
                table: "Books");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Publishers",
                schema: "Library",
                table: "Publishers");

            migrationBuilder.DropColumn(
                name: "Permissions",
                schema: "Library",
                table: "Librarians");

            migrationBuilder.RenameTable(
                name: "Publishers",
                schema: "Library",
                newName: "Publisher",
                newSchema: "Library");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Publisher",
                schema: "Library",
                table: "Publisher",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_BookEditions_Publisher_PublisherId",
                schema: "Library",
                table: "BookEditions",
                column: "PublisherId",
                principalSchema: "Library",
                principalTable: "Publisher",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Genres_GenreId",
                schema: "Library",
                table: "Books",
                column: "GenreId",
                principalSchema: "Library",
                principalTable: "Genres",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
