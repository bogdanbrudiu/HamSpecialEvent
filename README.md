# Platform for Ham special event stations

[![CI](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/ci.yml/badge.svg)](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/ci.yml)
[![Deploy TEST](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/deploy-test.yml/badge.svg)](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/deploy-test.yml)
[![Deploy PROD](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/deploy-prod.yml/badge.svg)](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/deploy-prod.yml)
[![Sync PROD DB to TEST](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/sync-prod-db-to-test.yml/badge.svg)](https://github.com/bogdanbrudiu/HamSpecialEvent/actions/workflows/sync-prod-db-to-test.yml)

# What is HAM radio

Ham radio operators, also known as amateur radio operators or simply "hams", are individuals who have obtained a license to use radio frequencies for personal, non-commercial purposes. These individuals use various types of radio equipment to communicate with other hams around the world, and they often participate in emergency communications and public service activities.

Ham radio operators often participate in special events that are organized to promote amateur radio and provide an opportunity for hams to communicate with others who share similar interests. Some examples of special events that hams participate in include:
Contests, Field Day, SOTA, WFF, Special Event Stations etc. 

# Special Event Stations - What

These are temporary ham radio stations that are set up to commemorate a particular event or anniversary, such as a historic battle, a famous person's birthday, or a significant scientific discovery. These events often attract a large number of hams who want to make contact with the special event station.

Participating in these special events can be a fun way for hams to test their skills, make new contacts, and promote the hobby of amateur radio to the public.

Participants are interested not only in having a QSO with the special event station but also receiving a memorial/diploma.

# How it works - How

Organizer - The event organizer setups the event with
Description, StartDate/EndDate; Rules; Diploma template

Chased stations - Special event station submits (in real time) log information to the system

Log example:
QSO:  3500 PH 2020-12-20 1400 YP1989TM 59 YO2MKL 59 
QSO:  3500 PH 2020-12-20 1400 YP1989TM 59 YO2MIT 59  
QSO:  3500 PH 2020-12-20 1401 YP1989TM 59  YO2BCS  59  
QSO:  3500 PH 2020-12-20 1402 YP1989TM 59 YO2LRK 59
QSO:  3500 PH 2020-12-20 1402 YP1989TM 59 YO2CXJ 59 
QSO:  3500 PH 2020-12-20 1403 YP1989TM 59 YO2MJZ 59

Participants - The system checks if the system log contain the QSOs needed (based on the rules) and if the participant qualifies diploma is generated for download
Awards will be issued for having worked at least once in the Award time all/at least one of the Special Event Stations.

# Why?
Help HAMs community. HAM is a hobby that tries to get involved in a lot of public service activities. Special event station events are to commemorate a particular event or anniversary, such as a historic battle, a famous person's birthday, or a significant scientific discovery.
YO2KQT (Ham radio club from Timisoara) has a special event in 2023 celebrating 20 years of activity, special event YP20KQT and such an app would help them generate the diplomas.

# Extra
On request print QSLs/diplomas and ship them. 

# Email Delivery

The application sends transactional emails for:
- event creation confirmation
- admin link recovery
- email verification

Email delivery is implemented directly in the HamEvent application using MailKit and Razor-based email templates.

Relevant files:
- `HamEvent/Services/SmtpEmailService.cs`
- `HamEvent/Services/RazorEmailTemplateRenderer.cs`
- `HamEvent/Views/Shared/AddEvent.cshtml`
- `HamEvent/Views/Shared/RecoverEvents.cshtml`
- `HamEvent/Views/Shared/ValidateEmail.cshtml`

# Mail Configuration

Configure SMTP in `HamEvent/appsettings.json` or environment-specific settings:

```json
"MailerSettings": {
	"From": "from@email.address",
	"Username": "smtpusername",
	"Password": "smtppassword",
	"Host": "smtphost",
	"Port": 587,
	"EnableSSL": true
}
```

Notes:
- `EnableSSL` enables TLS negotiation for MailKit SMTP connections.
- If your SMTP server does not require authentication, leave `Username` empty.
- Email templates are rendered from Razor views under `HamEvent/Views/Shared`.

# Deployment Operations

The repository now uses separate GitHub Actions workflows for CI, TEST deployment, PROD deployment, and PROD-to-TEST database sync.

## Workflows

- `CI`: builds, tests, and publishes the application artifact.
- `Deploy TEST`: automatically deploys successful builds from `feature/*`, `bugfix/*`, and `hotfix/*` branches to the TEST environment.
- `Deploy PROD`: deploys to PROD only through manual trigger.
- `Sync PROD DB to TEST`: runs on a daily schedule and on manual trigger; imports the PROD database into TEST only when the database content changed.

Workflow files:
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-test.yml`
- `.github/workflows/deploy-prod.yml`
- `.github/workflows/sync-prod-db-to-test.yml`

## Health Checks

The application exposes two operational endpoints:

- `GET /health/live`: process liveness check.
- `GET /health/ready`: readiness check that verifies the application can connect to the database and query core data.

Deployment workflows wait for `/health/ready` before considering TEST or PROD healthy.

## GitHub Environments

Create two GitHub environments:

- `test`
- `prod`

Recommended PROD protection:

- one required reviewer
- self-review allowed

## Environment Secrets

Set these secrets in both `test` and `prod` environments:

- `WEBSITE_NAME`
- `SERVER_COMPUTER_NAME`
- `SERVER_USERNAME`
- `SERVER_PASSWORD`
- `MAILER_SETTINGS_FROM`
- `MAILER_SETTINGS_USERNAME`
- `MAILER_SETTINGS_PASSWORD`
- `MAILER_SETTINGS_HOST`
- `MAILER_SETTINGS_PORT`
- `MAILER_SETTINGS_ENABLESSL`
- `TOKEN_SECRET`

Additional environment-specific secrets:

- `test`: `TEST_BASE_URL`
- `prod`: `PROD_BASE_URL`

Expected values for the current hosting setup:

- TEST site: `hameventtest.brudiu.ro`
- PROD site: `hamevent.brudiu.ro`
- Web Deploy endpoint: `https://web24.livehosting.ro:8172`

## TEST Deployment Flow

1. Push to a branch matching `feature/*`, `bugfix/*`, or `hotfix/*`.
2. `CI` runs build, tests, and publish.
3. `Deploy TEST` downloads the CI artifact and deploys it to TEST.
4. The deployment preserves `App_Data/QSOs.db`.
5. The workflow waits for `/health/ready`.
6. Playwright smoke tests run against TEST.

## PROD Deployment Flow

1. Run the `Deploy PROD` workflow manually from GitHub Actions.
2. Provide the `ci_run_id` of the successful CI run you want to promote.
3. Type `YES` into `confirm_prod_deploy`.
4. The workflow backs up the PROD database before deployment.
5. The deployment preserves `App_Data/QSOs.db`.
6. The workflow waits for `/health/ready` before completion.

This keeps PROD deployment artifact-based and prevents automatic releases on push to `main`.

## PROD Database Backup And TEST Sync

The `Sync PROD DB to TEST` workflow does the following:

1. Fetches the PROD database snapshot.
2. Fetches the TEST database snapshot.
3. Compares SHA-256 hashes.
4. If there is no change, it exits without importing.
5. If there is a change, it uploads a versioned PROD database backup artifact.
6. It imports the PROD database into TEST.
7. It restarts TEST and waits for `/health/ready`.

Current retention behavior:

- daily PROD DB snapshot artifacts: short retention
- versioned change-triggered PROD DB backup artifacts: 90 days

For a small SQLite database this is a reasonable short-term safety net. If the database grows substantially, move long-term backup retention to server-side or external storage and keep GitHub artifacts for short-term recovery only.

## Operational Notes

- Normal application deploys do not overwrite `App_Data/QSOs.db`.
- Database schema updates rely on EF Core startup migrations.
- After importing PROD DB into TEST, the TEST application restarts and applies any pending migrations at startup.
- If deployment credentials are exposed in chat, logs, or terminals, rotate them immediately and update the GitHub environment secrets.
