import type { Locator, Page } from '@playwright/test';

export interface CallbackFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
}

export type EmployeeCount = '1-10' | '11-50' | '51-500' | '500+';

/** Interactions with the callback-request landing page. */
export class CallbackPage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly companyInput: Locator;
  readonly websiteInput: Locator;
  readonly employeesSelect: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByLabel('Name *', { exact: true });
    this.emailInput = page.getByLabel('Email *', { exact: true });
    this.phoneInput = page.getByLabel('Phone *', { exact: true });
    this.companyInput = page.getByLabel('Company', { exact: true });
    this.websiteInput = page.getByLabel('Website', { exact: true });
    this.employeesSelect = page.getByLabel('Number of Employees', { exact: true });
    this.submitButton = page.getByRole('button', {
      name: 'Request a call back',
      exact: true,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('https://test.netlify.app/');
  }

  async fillForm(data: CallbackFormData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.emailInput.fill(data.email);
    await this.phoneInput.fill(data.phone);
    await this.companyInput.fill(data.company);
    await this.websiteInput.fill(data.website);
  }

  async selectEmployeeCount(count: EmployeeCount): Promise<void> {
    await this.employeesSelect.selectOption({ label: count });
  }

  async takeScreenshot(path = 'before-submit.png'): Promise<void> {
    await this.page.screenshot({ path, fullPage: true });
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
