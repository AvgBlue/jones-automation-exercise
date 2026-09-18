import { expect, type TestInfo } from '@playwright/test';
import type { CallbackFormData, CallbackPage, EmployeeCount } from '../models/CallbackPage';

/** Start a callback scenario on the form page. */
export async function openCallbackForm(callbackPage: CallbackPage): Promise<void> {
  await callbackPage.goto();
}

/** Verify that the callback form is ready for user interaction. */
export async function verifyCallbackFormReady(callbackPage: CallbackPage): Promise<void> {
  const elements = [
    callbackPage.nameInput,
    callbackPage.emailInput,
    callbackPage.phoneInput,
    callbackPage.companyInput,
    callbackPage.websiteInput,
    callbackPage.employeesSelect,
    callbackPage.submitButton,
  ];

  for (const element of elements) {
    await expect(element).toBeVisible();
  }
}

/** Verify that every text field contains the expected test data. */
export async function verifyCallbackFormValues(
  callbackPage: CallbackPage,
  data: CallbackFormData,
): Promise<void> {
  const fields = [
    { input: callbackPage.nameInput, value: data.name },
    { input: callbackPage.emailInput, value: data.email },
    { input: callbackPage.phoneInput, value: data.phone },
    { input: callbackPage.companyInput, value: data.company },
    { input: callbackPage.websiteInput, value: data.website },
  ];

  for (const { input, value } of fields) {
    await expect(input).toHaveValue(value);
  }
}

/** Fill the callback form and confirm its entered values. */
export async function fillAndVerifyCallbackForm(
  callbackPage: CallbackPage,
  data: CallbackFormData,
): Promise<void> {
  await callbackPage.fillForm(data);
  await verifyCallbackFormValues(callbackPage, data);
}

/** Change and verify the employee count. */
export async function selectAndVerifyEmployeeCount(
  callbackPage: CallbackPage,
  count: EmployeeCount,
): Promise<void> {
  await callbackPage.selectEmployeeCount(count);
  await expect(callbackPage.employeesSelect).toHaveValue(count);
}

/** Capture the form before submission and attach the screenshot to the test result. */
export async function capturePreSubmissionScreenshot(
  callbackPage: CallbackPage,
  testInfo: TestInfo,
): Promise<void> {
  const screenshotPath = testInfo.outputPath('callback-before-submit.png');
  await callbackPage.takeScreenshot(screenshotPath);
  await testInfo.attach('callback-before-submit', {
    path: screenshotPath,
    contentType: 'image/png',
  });
}
