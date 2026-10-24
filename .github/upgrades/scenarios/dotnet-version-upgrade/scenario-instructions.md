# .NET 10 and Angular Upgrade

## Preferences
- **Flow Mode**: Automatic
- **Target Framework**: net10.0
- **Angular Target**: Latest stable at initialization, 22.2.3 (verified against npm registry)
- **Scope**: Upgrade the .NET 9 application and tests and Angular client; assess other outdated dependencies. Preserve AdifLib's netstandard2.0 compatibility unless assessment requires a change.

## Source Control
- **Source Branch**: updateversions
- **Working Branch**: upgrade-dotnet-10
- **Commit Strategy**: After Each Task
- **Branch Sync**: Auto (Merge)
- **Existing Changes**: Preserved in commit 7861185 on source branch before creating working branch, as approved.

## Key Decisions Log
- User approved these upgrade targets, branch, and preservation of existing edits at initialization.
- User confirmed the upgrade options recorded in upgrade-options.md.

## Upgrade Options
**Source**: .github/upgrades/scenarios/dotnet-version-upgrade/upgrade-options.md

### Strategy
- Upgrade Strategy: All-at-Once

### Project Structure
- Package Management: Per-Project (defer CPM to post-migration)

### Compatibility
- Unsupported Packages: Resolve Inline (1 flagged package)
- Unsupported API Handling: Fix Inline

### Modernization
- Logging Framework: Keep Existing Logging Framework

## Strategy
**Selected**: All-at-Once
**Rationale**: Two net9.0 projects to retarget, one compatible netstandard2.0 dependency, limited breaking API scope.

### Execution Constraints
- Upgrade both net9.0 projects and their framework-dependent package references together; do not introduce tier-by-tier TFMs.
- Restore and build the complete solution after the atomic .NET change; fix all warnings in modified projects.
- Run affected .NET tests after the atomic change and Angular checks after the client change.
- Preserve the netstandard2.0 submodule and current ELMAH integration as confirmed.
- Report deferred upgrades in final validation; do not silently migrate logging or data-access providers.

## Build Tool Decisions
- **HamEvent.csproj**: dotnet build (SDK-style modern .NET web project)
- **UnitTests.csproj**: dotnet build (SDK-style modern .NET test project)
- **AdifLib.csproj**: dotnet build (SDK-style netstandard2.0 library)

## Environment
- npm's configured Azure Artifacts registry returns E401. For Angular operations, pass `--registry=https://registry.npmjs.org/ --userconfig=NUL` instead of altering repository configuration.
