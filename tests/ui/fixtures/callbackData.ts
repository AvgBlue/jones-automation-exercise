import type { CallbackFormData, EmployeeCount } from '../models/CallbackPage';

/** Synthetic data for the successful callback-request scenario. */
export const validCallbackData = {
  name: 'Jane Example',
  email: 'jane@example.com',
  phone: '2025550142',
  company: 'Example Ltd',
  website: 'https://example.com',
} satisfies CallbackFormData;

/** The employee-count option requested by the exercise (bonus). */
export const desiredEmployeeCount: EmployeeCount = '51-500';
