using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TegridyLibrary.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class ProvideBookLoans : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookLoans",
                schema: "Library");
        }
    }
}
