using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HamEvent.Data.Migrations
{
    /// <inheritdoc />
    public partial class LocalizeDescriptionRules : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Wrap legacy plain-text values into JSON {"en": "..."}
            migrationBuilder.Sql(
                "UPDATE Events SET Description = json_object('en', Description) WHERE Description IS NOT NULL AND TRIM(Description) <> '' AND (substr(Description,1,1) <> '{' OR json_valid(Description) = 0);");

            migrationBuilder.Sql(
                "UPDATE Events SET Rules = json_object('en', Rules) WHERE Rules IS NOT NULL AND TRIM(Rules) <> '' AND (substr(Rules,1,1) <> '{' OR json_valid(Rules) = 0);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // On rollback, try to extract english value; if missing, leave as-is
            migrationBuilder.Sql(
                "UPDATE Events SET Description = COALESCE(json_extract(Description, '$.en'), Description) WHERE Description IS NOT NULL AND json_valid(Description) = 1;");

            migrationBuilder.Sql(
                "UPDATE Events SET Rules = COALESCE(json_extract(Rules, '$.en'), Rules) WHERE Rules IS NOT NULL AND json_valid(Rules) = 1;");
        }
    }
}
