# .NET 10 and Angular Upgrade Plan

## Overview

**Target**: Upgrade HamEvent and UnitTests from net9.0 to net10.0 and HamEvent/ClientApp from Angular 21 to the latest stable Angular 22.2.3; review other outdated dependencies.
**Scope**: Three SDK-style projects (one netstandard2.0 library retained for compatibility), one Angular app, approximately 4,895 lines of .NET code. The assessment found seven recommended NuGet upgrades, one deprecated package, and three .NET binary/source API issues.

### Selected Strategy
**All-At-Once** — All .NET projects upgraded simultaneously in a single operation.
**Rationale**: Two projects require net10.0; the .NET Standard library already supports their dependency graph. The modern .NET solution has a short dependency chain and limited API migration scope.

## Tasks

### 01-prerequisites: Verify upgrade toolchain

Confirm the .NET 10 SDK, global.json compatibility, Angular 22's Node.js requirements, and package registry accessibility before editing project and client manifests. The solution builds a SPA from HamEvent/ClientApp, so both toolchains must be available. Preserve the independent AdifLib submodule and existing user changes.

**Done when**: A suitable .NET 10 SDK and Node.js runtime are available and registry and baseline build/test limitations are documented.

---

### 02-dotnet-projects: Upgrade .NET application and tests together

Upgrade HamEvent/HamEvent.csproj and UnitTests/UnitTests.csproj together to net10.0, including aligned EF Core, SpaProxy, MVC.Testing and ConfigurationManager dependencies. Address the assessment's three incompatible app API uses and investigate the deprecated xunit flag; remove redundant System.Text.RegularExpressions if safe. Keep AdifLib at netstandard2.0 and keep existing logging integration as confirmed.

**Done when**: Both .NET 9 projects target net10.0, their required packages restore without vulnerabilities or compatibility errors, and the solution builds without warnings and its .NET tests pass.

---

### 03-angular-client: Upgrade Angular client to latest stable

Update the Angular 21 client in HamEvent/ClientApp to the verified latest stable Angular 22.2.3, including compatible Angular Material/CDK, CLI, build tools, TypeScript and runtime packages and lockfile. Review obsolete Angular flex-layout and other dependencies; use Angular migrations where available, preserving existing UI and tests. The local Node.js 26 runtime meets Angular 22's reported engine range.

**Done when**: The client installs with a consistent lockfile, builds, and its runnable tests and i18n checks pass without upgrade-related errors; any unsupported third-party dependencies are recorded.

---

### 04-integration-validation: Validate solution and report remaining updates

Validate the .NET solution, Angular build and client tests together, checking publish/integration where possible. Audit NuGet and npm for remaining outdated, deprecated or vulnerable packages and record follow-up recommendations (including potential SqlClient modernization, logging replacement, and centralized package management) without expanding the confirmed upgrade scope.

**Done when**: All available solution and client checks have results, failures are addressed or clearly documented as blockers, and a concrete list of remaining suggested updates is recorded.
