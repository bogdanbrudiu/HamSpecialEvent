# 03-angular-client: Upgrade Angular client to latest stable

Update the Angular 21 client in HamEvent/ClientApp to the verified latest stable Angular 22.2.3, including compatible Angular Material/CDK, CLI, build tools, TypeScript and runtime packages and lockfile. Review obsolete Angular flex-layout and other dependencies; use Angular migrations where available, preserving existing UI and tests. The local Node.js 26 runtime meets Angular 22's reported engine range.

**Done when**: The client installs with a consistent lockfile, builds, and its runnable tests and i18n checks pass without upgrade-related errors; any unsupported third-party dependencies are recorded.
