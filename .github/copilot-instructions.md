# GitHub Copilot Workspace Instructions

## Purpose
This workspace hosts a .NET/Angular platform for managing HAM radio special event stations, including event setup, real-time log submission, award/diploma generation, and email notifications.

## Key Build & Test Commands
- **.NET Solution:**
  - Build: `dotnet build HamEventMVP.sln`
  - Test: `dotnet test HamEventMVP.sln` or run tests in `UnitTests/`
  - Watch/Run: `dotnet watch run --project HamEventMVP.sln`
- **Angular Client (HamEvent/ClientApp):**
  - Install: `npm install`
  - Dev server: `npm run start` (see `package.json` for OS-specific scripts)
  - Build: `npm run build`
  - Unit tests: `npm run test`
  - E2E tests: `npm run e2e`

## Architecture & Conventions
- **Backend:** .NET projects under solution `HamEventMVP.sln` (main: `HamEvent/`, library: `AdifLib/`, mail: `CoreMailer/`).
- **Frontend:** Angular app in `HamEvent/ClientApp/` (see its README for Angular CLI usage).
- **Email:** Transactional emails use MailKit and Razor templates. Configure SMTP in `HamEvent/appsettings.json`.
- **Deployment:** See `simply-web-deploy/README.md` for GitHub Actions Web Deploy setup.
- **Tests:**
  - .NET: Place tests in `UnitTests/` or project-specific test folders.
  - Angular: Use `ng test` for unit, Playwright for E2E.

## Project-Specific Notes
- **Diploma/award generation** is based on event rules and log validation.
- **Email templates** are Razor views in `HamEvent/Views/Shared/`.
- **Common pitfalls:**
  - Ensure SMTP settings are correct for email delivery.
  - For Angular dev server, use the correct OS-specific `start` script.
  - Keep `appsettings.*.json` secrets out of version control.

## Documentation
- See root and subproject `README.md` files for more details.
- For deployment, see `simply-web-deploy/README.md`.
- For mailer integration, see `CoreMailer/README.md`.

## Testing
- backend tests: dotnet test HamEventMVP.sln
- playright tests: npm run e2e
- ui tests: npm test -- --watch=false --browsers=ChromeHeadless 