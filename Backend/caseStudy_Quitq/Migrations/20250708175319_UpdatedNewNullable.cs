using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CaseStudy_Quitq.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedNewNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wallets_SellerId",
                table: "Wallets");

            migrationBuilder.AlterColumn<int>(
                name: "SellerId",
                table: "Wallets",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_SellerId",
                table: "Wallets",
                column: "SellerId",
                unique: true,
                filter: "[SellerId] IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Wallets_SellerId",
                table: "Wallets");

            migrationBuilder.AlterColumn<int>(
                name: "SellerId",
                table: "Wallets",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Wallets_SellerId",
                table: "Wallets",
                column: "SellerId",
                unique: true);
        }
    }
}
