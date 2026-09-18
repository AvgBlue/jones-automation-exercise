import { test, expect } from '@playwright/test';
import { validCallbackData, desiredEmployeeCount } from './fixtures/callbackData';
import { verifyCallbackFormReady, verifyCallbackFormValues } from './keywords/callback.keywords';
import { CallbackPage } from './models/CallbackPage';
import { ThankYouPage } from './models/ThankYouPage';

// Each test gets a fresh Playwright page and starts from the callback form.
test.beforeEach('Open callback form', async ({ page }) => {
  await new CallbackPage(page).goto();
});

test('callback form submission flow', async ({ page }, testInfo) => {
  const callbackPage = new CallbackPage(page);
  const thankYouPage = new ThankYouPage(page);

  await test.step('Verify callback form is ready', async () => {
    await verifyCallbackFormReady(callbackPage);
  });

  await test.step('Fill form with valid data', async () => {
    await callbackPage.fillForm(validCallbackData);
    await verifyCallbackFormValues(callbackPage, validCallbackData);
  });

  await test.step('Change employee count to 51-500', async () => {
    await callbackPage.selectEmployeeCount(desiredEmployeeCount);
    await expect(callbackPage.employeesSelect).toHaveValue(desiredEmployeeCount);
  });

  await test.step('Take screenshot before submission', async () => {
    await callbackPage.takeScreenshot(testInfo.outputPath('callback-before-submit.png'));
  });

  await test.step('Submit form and verify thank-you page', async () => {
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
  });
});
