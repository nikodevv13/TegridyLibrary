using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TegridyLibrary.API.Infrastructure.Database.Migrations
{
    /// <inheritdoc />
    public partial class AdjustEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookEditionCopies",
                schema: "Library");

            migrationBuilder.DropTable(
                name: "BookEditions",
                schema: "Library");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                schema: "Library",
                table: "Books",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Isbn",
                schema: "Library",
                table: "Books",
                type: "nvarchar(13)",
                maxLength: 13,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PublicationDate",
                schema: "Library",
                table: "Books",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc));

            migrationBuilder.AddColumn<decimal>(
                name: "PublisherId",
                schema: "Library",
                table: "Books",
                type: "decimal(20,0)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "BookCopies",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    InventoryNumber = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    AcquiredDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)),
                    EstimatedPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
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

            migrationBuilder.CreateIndex(
                name: "IX_Books_PublisherId",
                schema: "Library",
                table: "Books",
                column: "PublisherId");

            migrationBuilder.CreateIndex(
                name: "IX_BookCopies_BookId",
                schema: "Library",
                table: "BookCopies",
                column: "BookId");

            migrationBuilder.AddForeignKey(
                name: "FK_Books_Publishers_PublisherId",
                schema: "Library",
                table: "Books",
                column: "PublisherId",
                principalSchema: "Library",
                principalTable: "Publishers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Books_Publishers_PublisherId",
                schema: "Library",
                table: "Books");

            migrationBuilder.DropTable(
                name: "BookCopies",
                schema: "Library");

            migrationBuilder.DropIndex(
                name: "IX_Books_PublisherId",
                schema: "Library",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                schema: "Library",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "Isbn",
                schema: "Library",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "PublicationDate",
                schema: "Library",
                table: "Books");

            migrationBuilder.DropColumn(
                name: "PublisherId",
                schema: "Library",
                table: "Books");

            migrationBuilder.CreateTable(
                name: "BookEditions",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    PublisherId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    BookId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    Isbn = table.Column<string>(type: "nvarchar(13)", maxLength: 13, nullable: true),
                    PublicationDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookEditions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookEditions_Books_BookId",
                        column: x => x.BookId,
                        principalSchema: "Library",
                        principalTable: "Books",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BookEditions_Publishers_PublisherId",
                        column: x => x.PublisherId,
                        principalSchema: "Library",
                        principalTable: "Publishers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BookEditionCopies",
                schema: "Library",
                columns: table => new
                {
                    Id = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    AcquiredDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValue: new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)),
                    BookEditionId = table.Column<decimal>(type: "decimal(20,0)", nullable: false),
                    EstimatedPrice = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    InventoryNumber = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookEditionCopies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookEditionCopies_BookEditions_BookEditionId",
                        column: x => x.BookEditionId,
                        principalSchema: "Library",
                        principalTable: "BookEditions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookEditionCopies_BookEditionId",
                schema: "Library",
                table: "BookEditionCopies",
                column: "BookEditionId");

            migrationBuilder.CreateIndex(
                name: "IX_BookEditions_BookId",
                schema: "Library",
                table: "BookEditions",
                column: "BookId");

            migrationBuilder.CreateIndex(
                name: "IX_BookEditions_PublisherId",
                schema: "Library",
                table: "BookEditions",
                column: "PublisherId");
        }
    }
}
