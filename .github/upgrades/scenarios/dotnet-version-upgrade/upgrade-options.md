# Upgrade Options — HamEventMVP

Assessment: Three SDK-style projects (two net9.0, one netstandard2.0); one incompatible/deprecated package, seven recommended package upgrades, three binary/source API changes, and ELMAH logging.

## Strategy

### Upgrade Strategy
Small modern-.NET solution with two projects to retarget and a short dependency chain.

| Value | Description |
|-------|-------------|
| **All-at-Once** (selected) | Update app and tests together, then validate the complete solution. |
| Top-Down | Update the application first and maintain incremental compatibility with tests. |

## Project Structure

### Package Management
Three SDK-style projects use per-project PackageReference and do not use central package management; there is no version-conflict signal.

| Value | Description |
|-------|-------------|
| **Per-Project (defer CPM to post-migration)** (selected) | Keep existing version declarations; reconsider CPM after upgrade stabilizes. |
| Central Package Management (CPM) | Move NuGet versions to Directory.Packages.props. |

## Compatibility

### Unsupported Packages
The assessment flags xunit as deprecated/incompatible with the target; investigate replacement before removal.

| Value | Description |
|-------|-------------|
| **Resolve Inline** (selected) | Research and resolve the package within the upgrade task, without stubs. |
| Defer Resolution | Use temporary stubs and a later replacement task. |
| Compatibility Mode | Retain incompatible assembly references with runtime risk; only appropriate for transitive packages. |

### Unsupported API Handling
The app has one binary and two source incompatible API uses; tests have eight behavioral changes to verify.

| Value | Description |
|-------|-------------|
| **Fix Inline** (selected) | Fix identified API issues in their task, then test behavior. |
| Defer Complex Changes | Stub complex changes and resolve in follow-up subtasks. |

## Modernization

### Logging Framework
The app references elmahcore; changing logging during a framework upgrade broadens scope.

| Value | Description |
|-------|-------------|
| **Keep Existing Logging Framework** (selected) | Preserve functioning ELMAH Core integration for this upgrade. |
| Migrate to Microsoft.Extensions.Logging | Replace ELMAH integration with the built-in logging abstraction. |
