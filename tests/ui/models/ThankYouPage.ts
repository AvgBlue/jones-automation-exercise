import type { Locator, Page } from '@playwright/test';

/** Destination after submitting the callback form. */
export class ThankYouPage {
  readonly expectedUrl = /\/thank-you\.html(?:\?|$)/;
  readonly confirmationHeading: Locator;

  constructor(private readonly page: Page) {
    this.confirmationHeading = page.getByRole('heading', {
      name: /thank\s*you/i,
    });
  }

  async waitForDestination(): Promise<void> {
    await this.page.waitForURL(this.expectedUrl);
  }

  async waitForConfirmation(): Promise<void> {
    await this.confirmationHeading.waitFor();
  }
}
