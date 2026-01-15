using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TegridyLibrary.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class MergeMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Library");

            migrationBuilder.CreateTable(
                name: "Authors",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Authors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Genres",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Genres", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Librarians",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HashedPassword = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    LastLoggedInAt = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    Permissions = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Librarians", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Publishers",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publishers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Readers",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(320)", maxLength: 320, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Readers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Books",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    OriginalTitle = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Language = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Isbn = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: true),
                    PublicationDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)),
                    GenreId = table.Column<decimal>(type: "decimal(20,0)", nullable: true),
                    AuthorId = table.Column<decimal>(type: "decimal(20,0)", nullable: true),
                    PublisherId = table.Column<decimal>(type: "decimal(20,0)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Books", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Books_Authors_AuthorId",
                        column: x => x.AuthorId,
                        principalSchema: "Library",
                        principalTable: "Authors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Books_Genres_GenreId",
                        column: x => x.GenreId,
                        principalSchema: "Library",
                        principalTable: "Genres",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Books_Publishers_PublisherId",
                        column: x => x.PublisherId,
                        principalSchema: "Library",
                        principalTable: "Publishers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BookCopies",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    InventoryNumber = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    AcquiredDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)),
                    EstimatedPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    BookId = table.Column<decimal>(type: "decimal(20,0)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookCopies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookCopies_Books_BookId",
                        column: x => x.BookId,
                        principalSchema: "Library",
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BookLoans",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    BookCopyId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    ReaderId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    StartedByLibrarianId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    CompletedByLibrarianId = table.Column<decimal>(type: "decimal(20,0)", nullable: true),
                    StartedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookLoans", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookLoans_BookCopies_BookCopyId",
                        column: x => x.BookCopyId,
                        principalSchema: "Library",
                        principalTable: "BookCopies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookLoans_Librarians_CompletedByLibrarianId",
                        column: x => x.CompletedByLibrarianId,
                        principalSchema: "Library",
                        principalTable: "Librarians",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookLoans_Librarians_StartedByLibrarianId",
                        column: x => x.StartedByLibrarianId,
                        principalSchema: "Library",
                        principalTable: "Librarians",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BookLoans_Readers_ReaderId",
                        column: x => x.ReaderId,
                        principalSchema: "Library",
                        principalTable: "Readers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookCopies_BookId",
                schema: "Library",
                table: "BookCopies",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_BookLoans_BookCopyId",
                schema: "Library",
                table: "BookLoans",
                column: "BookCopyId");

            migrationBuilder.CreateIndex(
                name: "IX_BookLoans_CompletedByLibrarianId",
                schema: "Library",
                table: "BookLoans",
                column: "CompletedByLibrarianId");

            migrationBuilder.CreateIndex(
                name: "IX_BookLoans_ReaderId",
                schema: "Library",
                table: "BookLoans",
                column: "ReaderId");

            migrationBuilder.CreateIndex(
                name: "IX_BookLoans_StartedByLibrarianId",
                schema: "Library",
                table: "BookLoans",
                column: "StartedByLibrarianId");

            migrationBuilder.CreateIndex(
                name: "IX_Books_AuthorId",
                schema: "Library",
                table: "Books",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Books_GenreId",
                schema: "Library",
                table: "Books",
                column: "GenreId");

            migrationBuilder.CreateIndex(
                name: "IX_Books_PublisherId",
                schema: "Library",
                table: "Books",
                column: "PublisherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookLoans",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "BookCopies",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "Librarians",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "Readers",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "Books",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "Authors",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "Genres",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "Publishers",
                schema: "Library");
        }
    }
}
