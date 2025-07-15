using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CaseStudy_Quitq.Migrations
{
    /// <inheritdoc />
    public partial class CustomerToken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Customers",
                newName: "Username");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Customers",
                newName: "UserId");
        }
    }
}
