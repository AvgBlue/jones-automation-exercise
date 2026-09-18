import { test, expect } from '@playwright/test';
import { validCallbackData, desiredEmployeeCount } from './fixtures/callbackData';
import { CallbackPage } from './models/CallbackPage';
import { ThankYouPage } from './models/ThankYouPage';

test('callback form submission flow', async ({ page }, testInfo) => {
  const callbackPage = new CallbackPage(page);
  const thankYouPage = new ThankYouPage(page);

  await test.step('Navigate to callback form', async () => {
    await callbackPage.goto();
    
    const visibleElements = [
      callbackPage.nameInput,
      callbackPage.emailInput,
      callbackPage.phoneInput,
      callbackPage.companyInput,
      callbackPage.websiteInput,
      callbackPage.employeesSelect,
      callbackPage.submitButton
    ];
    await Promise.all(visibleElements.map(element => expect(element).toBeVisible()));
  });

  await test.step('Fill form with valid data', async () => {
    await callbackPage.fillForm(validCallbackData);
    
    const fieldValues = [
      { input: callbackPage.nameInput, value: validCallbackData.name },
      { input: callbackPage.emailInput, value: validCallbackData.email },
      { input: callbackPage.phoneInput, value: validCallbackData.phone },
      { input: callbackPage.companyInput, value: validCallbackData.company },
      { input: callbackPage.websiteInput, value: validCallbackData.website }
    ];
    await Promise.all(fieldValues.map(({ input, value }) => expect(input).toHaveValue(value)));
  });

  await test.step('Change employee count to 51-500', async () => {
    await callbackPage.selectEmployeeCount(desiredEmployeeCount);
    await expect(callbackPage.employeesSelect).toHaveValue(desiredEmployeeCount);
  });

  await test.step('Take screenshot before submission', async () => {
    await callbackPage.takeScreenshot(testInfo.outputPath('callback-before-submit.png'));
  });

  await test.step('Submit form and verify thank-you page', async () => {
    const responsePromise = page.waitForNavigation();
    await callbackPage.submit();
    const response = await responsePromise;

    await thankYouPage.waitForDestination();
    expect(response?.status(), 'thank-you page should return a successful response').toBe(200);
    await expect(page).toHaveURL(/\/thank-you\.html/);
    await expect(await page.title()).not.toMatch(/404|not found/i);
    await expect(await page.locator('body').textContent()).not.toMatch(/page not found|404/i);
    await expect(thankYouPage.confirmationHeading).toBeVisible();
    console.log('Successfully reached thank-you page after callback form submission');
  });
});
