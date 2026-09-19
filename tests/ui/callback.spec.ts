import { test } from '@playwright/test';
import { validCallbackData, desiredEmployeeCount } from './fixtures/callbackData';
import {
  openCallbackForm,
  verifyCallbackFormReady,
  fillAndVerifyCallbackForm,
  selectAndVerifyEmployeeCount,
  capturePreSubmissionScreenshot,
} from './keywords/callback.keywords';
import { submitAndVerifyThankYouPage } from './keywords/thankYou.keywords';
import { CallbackPage } from './models/CallbackPage';
import { ThankYouPage } from './models/ThankYouPage';

// Each test gets a fresh Playwright page and starts from the callback form.
test.beforeEach('Open callback form', ({ page }) =>
  openCallbackForm(new CallbackPage(page))
);

test('callback form submission flow', async ({ page }, testInfo) => {
  const callbackPage = new CallbackPage(page);
  const thankYouPage = new ThankYouPage(page);

  await test.step('Verify callback form is ready', () =>
    verifyCallbackFormReady(callbackPage)
  );

  await test.step('Fill form with valid data', () =>
    fillAndVerifyCallbackForm(callbackPage, validCallbackData)
  );

  await test.step('Change employee count to 51-500', () =>
    selectAndVerifyEmployeeCount(callbackPage, desiredEmployeeCount)
  );

  await test.step('Take screenshot before submission', () =>
    capturePreSubmissionScreenshot(callbackPage, testInfo)
  );

  await test.step('Submit form and verify thank-you page', () =>
    submitAndVerifyThankYouPage(callbackPage, thankYouPage, page)
  );
});
