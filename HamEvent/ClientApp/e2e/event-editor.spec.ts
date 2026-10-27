import { expect, test } from '@playwright/test';

const eventId = 'a3ab2fa8-aad7-49b4-8337-3e6072ac09cb';
const eventSecret = 'b0252004-0b4b-461c-b8b3-5e2c52887553';
const adminKey = 'editor-test-master-key';
const uploadCredential = 'a'.repeat(64);
const event = {
  id: eventId,
  secretKey: uploadCredential,
  name: 'Editor regression event',
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T00:00:00Z',
  description: { en: 'Editor test' },
  rules: { en: '<p>Rules for the current regression event only.</p>' },
  email: 'editor@example.test',
  diploma: '',
  hasTop: true,
  excludeCallsigns: '',
};

test.describe('Event editor feedback and links', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/admin/validate', route => route.fulfill({ body: 'OK', contentType: 'text/plain' }));
    await page.route('**/api/hamevent/**', route => {
      const request = route.request();
      if (new URL(request.url()).pathname.includes('/hamevents')) {
        return route.fulfill({ json: { data: [event], count: 1 } });
      }
      if (/\/(QSOs|Top)\//i.test(new URL(request.url()).pathname)) {
        return route.fulfill({ json: { data: [], count: 0 } });
      }
      if (/\/Live\//i.test(new URL(request.url()).pathname)) {
        return route.fulfill({ json: [] });
      }
      return route.fulfill({ json: event });
    });
  });

  test('legacy email link opens a single editor and event-secret save shows confirmation', async ({ page }) => {
    await page.goto(`/${eventId}/${eventSecret}`);
    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${eventSecret}/edit$`));
    await expect(page.locator('input[name="name"]')).toHaveValue(event.name);
    await expect(page.locator('event-editor form')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Update', exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.locator('event-editor [role="status"]')).toHaveText('Event updated successfully.');
    await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${eventSecret}/edit$`));
    await page.getByRole('button', { name: 'Browse events', exact: true }).click();
    await expect(page).toHaveURL(/\/events$/);
  });

  test('master-key save returns to the list with visible confirmation', async ({ page }) => {
    await page.goto(`/admin/${eventId}/${adminKey}/edit`);
    await expect(page.locator('input[name="name"]')).toHaveValue(event.name);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/admin/${adminKey}$`));
    await expect(page.locator('mat-snack-bar-container')).toContainText('Event updated successfully.');
    await expect(page.getByRole('button', { name: 'Create New Event' })).toBeVisible();
  });

  test('master-key upload examples use the real host and event-scoped credential', async ({ page, baseURL }) => {
    await page.goto(`/admin/${eventId}/${adminKey}/edit`);
    const instructions = page.locator('.api-upload-instructions');
    await expect(instructions).toBeVisible();
    const uploadUrl = `${baseURL!.replace(/\/$/, '')}/api/hamevent/${eventId}/${uploadCredential}/upload`;
    await expect(instructions).toContainText(uploadUrl);
    await expect(instructions).toContainText(`$url = '${uploadUrl}'`);
    await expect(instructions).not.toContainText('your-host');
    await expect(instructions).not.toContainText(adminKey);
  });

  test('Rules shows the current event and Participate Now matches dummy actions', async ({ page }) => {
    await page.goto(`/event/${eventId}`);
    const participate = page.getByRole('button', { name: /Participate Now/ });
    await expect(participate).toBeDisabled();
    await expect(participate).toHaveAttribute('title', 'Needs repair before announcement');
    await expect(participate.locator('.needs_fix_icon')).toHaveText('priority_high');
    await page.getByRole('button', { name: /Rules/ }).click();
    await expect(page.locator('app-event-rules-tab .event-rules')).toHaveText('Rules for the current regression event only.');
    await expect(page.locator('app-event-rules-tab')).not.toContainText('YP20KQT');
  });

  for (const [label, secret] of [['SuperAdmin', adminKey], ['event admin', eventSecret]]) {
    test(`${label} retains access across Rankings and OnAir round trips`, async ({ page }) => {
      await page.goto(`/admin/${eventId}/${secret}/qsos`);
      await expect(page.locator('h1')).toContainText(event.name);
      await page.getByRole('button', { name: 'Rankings', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/event/${eventId}\\?tab=rankings$`));
      await expect(page.locator('app-event-rankings-tab')).toBeVisible();
      const toolbar = page.locator('app-responsive-toolbar');
      await toolbar.getByRole('button', { name: /Admin QSOs/ }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secret}/qsos$`));
      await expect(page.locator('h1')).toContainText(event.name);
      await page.getByRole('button', { name: 'On Air', exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`/event/${eventId}/live$`));
      await toolbar.getByRole('button', { name: /Edit Event/ }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secret}/edit$`));
      await expect(page.locator('input[name="name"]')).toHaveValue(event.name);
    });
  }

  test('public visitors have no admin return actions', async ({ page }) => {
    await page.goto(`/event/${eventId}?tab=rankings`);
    await expect(page.locator('app-event-rankings-tab')).toBeVisible();
    const toolbar = page.locator('app-responsive-toolbar');
    await expect(toolbar.getByRole('button', { name: /Admin QSOs/ })).toHaveCount(0);
    await expect(toolbar.getByRole('button', { name: /Edit Event/ })).toHaveCount(0);
  });

  for (const [label, secret] of [['SuperAdmin', adminKey], ['event admin', eventSecret]]) {
    test(`${label} editor shares public navigation with extra admin actions`, async ({ page }) => {
      await page.goto(`/admin/${eventId}/${secret}/edit`);
      const toolbar = page.locator('app-responsive-toolbar');
      await expect(toolbar).toBeVisible();
      await expect(toolbar.getByRole('button', { name: /Rules/ })).toBeVisible();
      await expect(toolbar.getByRole('button', { name: /Admin QSOs/ })).toBeVisible();
      await toolbar.getByRole('button', { name: /Rules/ }).click();
      await expect(page).toHaveURL(new RegExp(`/event/${eventId}\\?tab=rules$`));
      await toolbar.getByRole('button', { name: /Edit Event/ }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secret}/edit$`));
      await toolbar.getByRole('button', { name: /Admin QSOs/ }).click();
      await expect(page).toHaveURL(new RegExp(`/admin/${eventId}/${secret}/qsos$`));
      await expect(toolbar.getByRole('button', { name: 'Export All', exact: true })).toBeVisible();
      await expect(toolbar.getByRole('button', { name: 'Delete All', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: /Edit Event/ })).toHaveCount(1);
    });
  }
});
