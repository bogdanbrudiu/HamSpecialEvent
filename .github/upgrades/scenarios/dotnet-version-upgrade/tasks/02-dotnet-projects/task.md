# 02-dotnet-projects: Upgrade .NET application and tests together

Upgrade HamEvent/HamEvent.csproj and UnitTests/UnitTests.csproj together to net10.0, including aligned EF Core, SpaProxy, MVC.Testing and ConfigurationManager dependencies. Address the assessment's three incompatible app API uses and investigate the deprecated xunit flag; remove redundant System.Text.RegularExpressions if safe. Keep AdifLib at netstandard2.0 and keep existing logging integration as confirmed.

**Done when**: Both .NET 9 projects target net10.0, their required packages restore without vulnerabilities or compatibility errors, and the solution builds without warnings and its .NET tests pass.

## Scope Inventory & Research Findings
- Affected SDK-style projects: HamEvent/HamEvent.csproj (app) and UnitTests/UnitTests.csproj (dependent tests), with AdifLib retained on netstandard2.0. Neither project imports Directory.Build.props or central package versions. No `// STUB:` markers detected.
- Package versions: align Microsoft.AspNetCore.SpaProxy, Microsoft.EntityFrameworkCore, Sqlite, Tools, Microsoft.AspNetCore.Mvc.Testing, and EFCore.InMemory from 9.0.21 to the assessment-supported 10.0.13. Moq.EntityFrameworkCore is used by `ReturnsDbSet` in HamEventControllerTests.cs and supports net10.0 at 10.0.0.2; upgrade alongside EF Core. System.Text.RegularExpressions 4.3.1 is built into the new TFM and can be removed from UnitTests.
- Program.cs uses legacy ConfigurationErrorsException for a missing secret and configures MailerSettings using the framework options extension. Replace only the legacy exception with InvalidOperationException and remove unused ConfigurationManager package/using if validation confirms no other consumers; keep the options registration unless build/runtime tests show a break.
- xunit 2.9.3 is compatible with net10.0 (NuGet supported version is still 2.9.3), but its v2 line is deprecated for features. A v3 test-runner migration is independent and should be reported as a follow-up, not silently mixed into this TFM upgrade.
- Assessment flags eight behavioral uses of HttpContent, Uri and JsonDocument in tests; rerun all integration/unit tests to verify rather than rewriting working assertions speculatively.
- Two related projects/one atomic TFM+EF10 transition; no 3+-project MUST breakdown hint or stub marker. Keep dependent tests aligned within the same task as required by all-at-once strategy.
- Restore identified NU1902/NU1903 for transitive System.Security.Cryptography.Pkcs 10.0.0 via MailKit → MimeKit. NuGet's stable 10.0.13 is available; pin it directly in HamEvent to resolve the entire app/test dependency graph (no warning suppression). A concurrent test and clean build briefly contended over AdifLib.dll output; rerun validations sequentially.
