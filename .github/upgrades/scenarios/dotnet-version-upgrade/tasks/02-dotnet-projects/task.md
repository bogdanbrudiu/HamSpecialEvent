# 02-dotnet-projects: Upgrade .NET application and tests together

Upgrade HamEvent/HamEvent.csproj and UnitTests/UnitTests.csproj together to net10.0, including aligned EF Core, SpaProxy, MVC.Testing and ConfigurationManager dependencies. Address the assessment's three incompatible app API uses and investigate the deprecated xunit flag; remove redundant System.Text.RegularExpressions if safe. Keep AdifLib at netstandard2.0 and keep existing logging integration as confirmed.

**Done when**: Both .NET 9 projects target net10.0, their required packages restore without vulnerabilities or compatibility errors, and the solution builds without warnings and its .NET tests pass.
