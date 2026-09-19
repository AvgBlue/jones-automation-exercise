import { expect, type Page } from '@playwright/test';
import type { CallbackPage } from '../models/CallbackPage';
import type { ThankYouPage } from '../models/ThankYouPage';

/** Submit the callback form and verify the browser reaches a successful confirmation page. */
export async function submitAndVerifyThankYouPage(
  callbackPage: CallbackPage,
  thankYouPage: ThankYouPage,
  page: Page,
): Promise<void> {
  const responsePromise = page.waitForResponse(response =>
    response.request().isNavigationRequest() &&
    new URL(response.url()).pathname === '/thank-you.html'
  );

  await callbackPage.submit();
  const response = await responsePromise;

  expect(response.status(), 'thank-you page should return HTTP 200').toBe(200);
  await thankYouPage.waitForDestination();
  await expect(thankYouPage.confirmationHeading).toBeVisible();
  console.log('Successfully reached thank-you page after callback form submission');
}
