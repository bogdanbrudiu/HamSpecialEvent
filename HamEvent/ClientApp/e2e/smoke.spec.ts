import { expect, test } from '@playwright/test';

test.describe('Public smoke @smoke', () => {
  test('home page loads and navigates to events', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Welcome to HamEvent!' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Recover admin links' })).toBeVisible();

    await page.getByRole('button', { name: 'Search an event' }).click();

    await expect(page).toHaveURL(/\/events$/);
    await expect(page.getByRole('heading', { name: 'Ham Events' })).toBeVisible();
  });

  test('recovery form validates the email field', async ({ page }) => {
    await page.goto('/recover');

    await expect(page.getByRole('heading', { name: 'Recover admin links' })).toBeVisible();

    const sendRecoveryEmail = page.getByRole('button', { name: 'Send recovery email' });
    await sendRecoveryEmail.click();
    await expect(page.getByText('Email is required')).toBeVisible();

    await page.getByRole('textbox', { name: 'Email' }).fill('invalid-email');
    await sendRecoveryEmail.click();
    await expect(page.getByText('Enter a valid email')).toBeVisible();
  });
});