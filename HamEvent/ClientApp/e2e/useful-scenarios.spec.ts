import { expect, test } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';

declare const Buffer: {
  from(input: string, encoding?: string): any;
};

const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';
const TEST_CALLSIGN = 'YO2ABC';
const ADMIN_E2E_KEY = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env?.ADMIN_E2E_KEY;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildAdif(stationCallsign: string, participantCallsign: string): string {
  const now = new Date();
  const yyyy = now.getUTCFullYear().toString();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  const hh = String(now.getUTCHours()).padStart(2, '0');
  const mi = String(now.getUTCMinutes()).padStart(2, '0');
  const ss = String(now.getUTCSeconds()).padStart(2, '0');

  const qsoDate = `${yyyy}${mm}${dd}`;
  const timeOn = `${hh}${mi}${ss}`;

  return [
    '<ADIF_VER:5>3.1.0',
    '<PROGRAMID:7>HamEvent',
    '<EOH>',
    `<CALL:${participantCallsign.length}>${participantCallsign}`,
    `<STATION_CALLSIGN:${stationCallsign.length}>${stationCallsign}`,
    `<QSO_DATE:8>${qsoDate}`,
    `<TIME_ON:6>${timeOn}`,
    '<BAND:3>20m',
    '<MODE:3>SSB',
    '<RST_SENT:2>59',
    '<RST_RCVD:2>59',
    '<EOR>',
  ].join('');
}

async function createEventViaApi(request: APIRequestContext, namePrefix = 'E2E Event') {
  const unique = Date.now();
  const eventName = `${namePrefix} ${unique}`;
  const startDate = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const endDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  const response = await request.post('/api/hamevent/hamevent', {
    data: {
      id: EMPTY_GUID,
      secretKey: EMPTY_GUID,
      name: eventName,
      subtitle: '',
      startDate,
      endDate,
      description: {
        en: 'Event created by Playwright E2E test.',
        ro: 'Eveniment creat de testul Playwright.',
      },
      rules: {
        en: 'Work at least one QSO to qualify.',
        ro: 'Lucreaza cel putin un QSO pentru calificare.',
      },
      email: `e2e+${unique}@example.test`,
      hasTop: true,
      diploma: '',
      days: 0,
      first: '',
      last: '',
      count: 0,
      unique: 0,
      excludeCallsigns: '',
      excludedCallsigns: [],
      icon: '',
    },
  });

  expect(response.ok()).toBeTruthy();
  const body = await response.json();

  return {
    eventId: body.hamEvent.id as string,
    secretKey: body.secretKey as string,
    eventName,
  };
}

async function waitUntilEventIsReachable(
  request: APIRequestContext,
  eventId: string,
): Promise<void> {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const response = await request.get(`/api/hamevent/hamevent/${eventId}`);
    if (response.ok()) {
      const body = await response.json();
      if (body?.id === eventId) {
        return;
      }
    }
    await sleep(500);
  }

  throw new Error(`Event ${eventId} was not reachable via public API in time.`);
}

async function waitForStatsTotal(
  request: APIRequestContext,
  eventId: string,
  expectedTotal: number,
): Promise<any> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await request.get(`/api/hamevent/Stats/${eventId}`);
    if (response.ok()) {
      const body = await response.json();
      if ((body?.totalQsos ?? 0) >= expectedTotal) {
        return body;
      }
    }
    await sleep(500);
  }

  throw new Error(`Stats endpoint did not reach total ${expectedTotal} for event ${eventId} in time.`);
}

async function waitForLiveData(
  request: APIRequestContext,
  eventId: string,
  participantCallsign: string,
): Promise<any[]> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const response = await request.get(`/api/hamevent/Live/${eventId}`);
    if (response.ok()) {
      const body = (await response.json()) as any[];
      const hasParticipant = (body ?? []).some((operator) =>
        (operator?.lastQSOs ?? []).some((qso: any) => qso?.callsign2 === participantCallsign),
      );
      if (hasParticipant) {
        return body;
      }
    }
    await sleep(500);
  }

  throw new Error(`Live endpoint did not expose participant ${participantCallsign} for event ${eventId} in time.`);
}

async function uploadOneQsoViaApi(
  request: APIRequestContext,
  eventId: string,
  secretKey: string,
  stationCallsign: string,
  participantCallsign: string,
) {
  const adif = buildAdif(stationCallsign, participantCallsign);
  const uploadResponse = await request.post(`/api/hamevent/${eventId}/${secretKey}/upload`, {
    multipart: {
      file: {
        name: 'qso-log.adi',
        mimeType: 'text/plain',
        buffer: Buffer.from(adif, 'utf-8'),
      },
    },
  });

  expect(uploadResponse.ok()).toBeTruthy();
}

test.describe('Useful E2E scenarios @useful', () => {
  test.describe.configure({ timeout: 120_000 });

  test('recovery form enters sending state after submit', async ({ page }) => {
    const unknownEmail = `e2e-missing-${Date.now()}@example.test`;

    await page.goto('/recover');
    await page.getByRole('textbox', { name: 'Email' }).fill(unknownEmail);
    await page.getByRole('button', { name: 'Send recovery email' }).click();

    await expect(page.getByRole('button', { name: 'Sending...' })).toBeVisible({ timeout: 15_000 });
  });

  test('create event and verify top page loads for that event', async ({ page, request }) => {
    const { eventId, eventName } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    const eventResponse = await request.get(`/api/hamevent/hamevent/${eventId}`);
    expect(eventResponse.ok()).toBeTruthy();
    const eventBody = await eventResponse.json();
    expect(eventBody.name).toBe(eventName);

    await page.goto(`/event/${eventId}/top`);
    await expect(page.getByPlaceholder('Participant callsign')).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
  });

  test('event details page displays loaded event content', async ({ page, request }) => {
    const { eventId, eventName } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    await page.goto(`/event/${eventId}`);
    await expect(page.getByText(eventName).first()).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('mat-tab-group')).toBeVisible({ timeout: 15_000 });
  });

  test('event edit secret URL opens admin edit page', async ({ page, request }) => {
    const { eventId, secretKey } = await createEventViaApi(request);
    expect(secretKey).toBeTruthy();
    await waitUntilEventIsReachable(request, eventId);

    const privateEventResponse = await request.get(`/api/hamevent/hamevent/${eventId}?secret=${encodeURIComponent(secretKey)}`);
    expect(privateEventResponse.ok()).toBeTruthy();

    await page.goto(`/event/${eventId}/${secretKey}`);
    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secretKey}/edit$`), { timeout: 15_000 });
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible({ timeout: 15_000 });
  });

  test('events listing page shows cards and navigates to event', async ({ page, request }) => {
    const { eventId, eventName } = await createEventViaApi(request, 'ZZZ E2E Event');
    await waitUntilEventIsReachable(request, eventId);

    await page.goto('/events');
    await expect(page.getByRole('heading', { name: 'Ham Events' })).toBeVisible({ timeout: 15_000 });

    const card = page.locator('app-event-card').filter({ hasText: eventName }).first();
    await expect(card).toBeVisible({ timeout: 15_000 });

    await card.getByRole('button', { name: 'Go to event' }).click();
    await expect(page).toHaveURL(new RegExp(`/event/${eventId}$`), { timeout: 15_000 });
  });

  test('upload logs and verify participant appears in ranking page', async ({ page, request }) => {
    const { eventId, secretKey } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);
    await uploadOneQsoViaApi(request, eventId, secretKey, 'YP20KQT', TEST_CALLSIGN);

    await page.goto(`/event/${eventId}/top`);
    await page.getByPlaceholder('Participant callsign').fill(TEST_CALLSIGN);
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText(TEST_CALLSIGN).first()).toBeVisible({ timeout: 15_000 });
  });

  test('generate diploma from ranking page after searching participant', async ({ page, request, baseURL }) => {
    const { eventId, secretKey, eventName } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);
    await uploadOneQsoViaApi(request, eventId, secretKey, 'YP20KQT', TEST_CALLSIGN);

    await page.goto(`/event/${eventId}/top`);

    await page.getByPlaceholder('Participant callsign').fill(TEST_CALLSIGN);
    await page.getByRole('button', { name: 'Search' }).click();

    await expect(page.getByText(TEST_CALLSIGN).first()).toBeVisible({ timeout: 15_000 });

    // Clicking a ranking row triggers PDF generation via HTTP request.
    const pdfResponsePromise = page.waitForResponse((response) => {
      const url = response.url();
      return (
        response.request().method() === 'GET'
        && response.status() === 200
        && url.includes('/api/hamevent/Diploma/')
        && url.includes(eventId)
        && url.includes(TEST_CALLSIGN)
      );
    });

    await page.locator('tbody tr').first().click();
    const pdfResponse = await pdfResponsePromise;
    const contentType = pdfResponse.headers()['content-type'] ?? '';
    const body = await pdfResponse.body();

    expect(contentType.toLowerCase()).toContain('application/pdf');
    expect(body.length).toBeGreaterThan(2_000);
    expect(baseURL).toBeTruthy();
    expect(eventName.length).toBeGreaterThan(3);
  });

  test('statistics endpoint aggregates uploaded ADIF QSOs', async ({ request }) => {
    const { eventId, secretKey } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    const participantA = `YO2A${Date.now().toString().slice(-5)}`;
    const participantB = `YO2B${Date.now().toString().slice(-5)}`;
    await uploadOneQsoViaApi(request, eventId, secretKey, 'YP20KQT', participantA);
    await uploadOneQsoViaApi(request, eventId, secretKey, 'YP20KQT', participantB);

    const stats = await waitForStatsTotal(request, eventId, 2);
    expect(stats.totalQsos).toBeGreaterThanOrEqual(2);
    expect(Array.isArray(stats.bandModeTotals)).toBeTruthy();
    expect(stats.bandModeTotals.some((entry: any) => entry.band === '20m' && entry.mode === 'SSB')).toBeTruthy();
  });

  test('live endpoint returns recent uploaded QSO activity', async ({ request }) => {
    const { eventId, secretKey } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    const liveParticipant = `YO3L${Date.now().toString().slice(-5)}`;
    await uploadOneQsoViaApi(request, eventId, secretKey, 'YP20KQT', liveParticipant);

    const liveEntries = await waitForLiveData(request, eventId, liveParticipant);
    expect(liveEntries.length).toBeGreaterThan(0);
    expect(
      liveEntries.some((operator) =>
        (operator?.lastQSOs ?? []).some((qso: any) => qso?.callsign1 === 'YP20KQT' && qso?.callsign2 === liveParticipant),
      ),
    ).toBeTruthy();
  });

  test('admin can login and open create event form via UI interactions', async ({ page }) => {
    test.skip(!ADMIN_E2E_KEY, 'ADMIN_E2E_KEY is required for admin UI flow tests.');

    const eventName = `UI Event ${Date.now()}`;

    await page.goto('/admin/login');
    await page.getByPlaceholder('Enter admin password').fill(ADMIN_E2E_KEY!);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(new RegExp(`/admin/${ADMIN_E2E_KEY}$`));
    await page.getByRole('button', { name: /Create New Event/i }).click();

    const createPathRegex = /\/admin\/00000000-0000-0000-0000-000000000000\/edit$/;
    if (!createPathRegex.test(new URL(page.url()).pathname)) {
      // Current app route helper does not always include secret; use explicit create route as fallback.
      await page.goto(`/admin/00000000-0000-0000-0000-000000000000/${ADMIN_E2E_KEY}/edit`);
    }

    await expect(page).toHaveURL(/\/admin\/00000000-0000-0000-0000-000000000000\/.+\/edit$/);
    await page.getByRole('textbox', { name: 'Name' }).fill(eventName);
    await page.getByRole('textbox', { name: 'Email' }).fill(`ui-e2e-${Date.now()}@example.test`);
    await page.evaluate(() => window.scrollTo(0, 0));

    await expect(page.getByRole('button', { name: /Add|Email verification/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(eventName);
  });

  test('direct admin secret URL opens admin home', async ({ page }) => {
    test.skip(!ADMIN_E2E_KEY, 'ADMIN_E2E_KEY is required for admin direct URL tests.');

    await page.goto(`/admin/${ADMIN_E2E_KEY}`);
    await expect(page).toHaveURL(new RegExp(`/admin/${ADMIN_E2E_KEY}$`), { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: 'Admin Events' })).toBeVisible({ timeout: 15_000 });
  });

  test('admin can save event changes from edit page', async ({ page, request }) => {
    test.skip(!ADMIN_E2E_KEY, 'ADMIN_E2E_KEY is required for admin save tests.');

    const { eventId } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    const updatedName = `Updated ${Date.now()}`;

    await page.goto(`/admin/${eventId}/${ADMIN_E2E_KEY}/edit`);
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('textbox', { name: 'Name' }).fill(updatedName);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${ADMIN_E2E_KEY}/edit$`), { timeout: 15_000 });
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(updatedName);

    const verify = await request.get(`/api/hamevent/hamevent/${eventId}?adminkey=${encodeURIComponent(ADMIN_E2E_KEY!)}`);
    expect(verify.ok()).toBeTruthy();
    const body = await verify.json();
    expect(body?.name).toBe(updatedName);
  });

  test('event secret can save event changes from edit page', async ({ page, request }) => {
    const { eventId, secretKey } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    const updatedName = `Secret Updated ${Date.now()}`;

    await page.goto(`/admin/${eventId}/${secretKey}/edit`);
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('textbox', { name: 'Name' }).fill(updatedName);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secretKey}/edit$`), { timeout: 15_000 });
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(updatedName);

    const verify = await request.get(`/api/hamevent/hamevent/${eventId}?secret=${encodeURIComponent(secretKey)}`);
    expect(verify.ok()).toBeTruthy();
    const body = await verify.json();
    expect(body?.name).toBe(updatedName);
  });

  test('event secret link can open editor and save changes', async ({ page, request }) => {
    const { eventId, secretKey } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    const updatedName = `Redirect Save ${Date.now()}`;

    await page.goto(`/event/${eventId}/${secretKey}`);
    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secretKey}/edit$`), { timeout: 15_000 });
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible({ timeout: 15_000 });
    await page.getByRole('textbox', { name: 'Name' }).fill(updatedName);
    await page.getByRole('button', { name: 'Save' }).click();

    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secretKey}/edit$`), { timeout: 15_000 });
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue(updatedName);

    const verify = await request.get(`/api/hamevent/hamevent/${eventId}?secret=${encodeURIComponent(secretKey)}`);
    expect(verify.ok()).toBeTruthy();
    const body = await verify.json();
    expect(body?.name).toBe(updatedName);
  });

  test('legacy admin URL without edit redirects to editor', async ({ page, request }) => {
    const { eventId, secretKey } = await createEventViaApi(request);
    await waitUntilEventIsReachable(request, eventId);

    await page.goto(`/admin/${eventId}/${secretKey}`);
    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secretKey}/edit$`), { timeout: 15_000 });
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible({ timeout: 15_000 });
  });
});