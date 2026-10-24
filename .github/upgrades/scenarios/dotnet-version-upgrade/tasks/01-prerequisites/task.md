# 01-prerequisites: Verify upgrade toolchain

Confirm the .NET 10 SDK, global.json compatibility, Angular 22's Node.js requirements, and package registry accessibility before editing project and client manifests. The solution builds a SPA from HamEvent/ClientApp, so both toolchains must be available. Preserve the independent AdifLib submodule and existing user changes.

**Done when**: A suitable .NET 10 SDK and Node.js runtime are available and registry and baseline build/test limitations are documented.

## Research Findings
- The solution has three SDK-style projects: HamEvent and UnitTests on net9.0, AdifLib (independent git submodule) on netstandard2.0.
- Installed SDKs include 10.0.113 and 10.0.302; Node.js v26.5.1 satisfies Angular 22.2.3's registry-reported `>=26.0.0` engine range.
- No global.json was found in initial file search; verify at repository/submodule roots. Both web and test projects can use `dotnet build` (SDK-style, no Windows desktop/legacy tooling).
- Public registry HTTP request succeeds; the configured npm registry returns E401, so package-manager access must be resolved or bypassed before Angular installation.
- Baseline build and tests will be measured before making package or code changes; no task decomposition is needed for this single toolchain/diagnostic concern.
- Baseline solution build succeeds; 49/49 UnitTests pass on net9.0. npm can query public npm with `--registry=https://registry.npmjs.org/ --userconfig=NUL`, which avoids the configured Azure Artifacts feed's E401 without editing repository/user config. Public registry confirms Angular core 22.2.3 and CLI 22.2.4.
