import { expect } from '@playwright/test';
import type { CallbackFormData, CallbackPage } from '../models/CallbackPage';

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
