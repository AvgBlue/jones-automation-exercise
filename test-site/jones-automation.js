import { chromium } from 'playwright';

(async () => {
  console.log('Starting automation...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Navigate to the test site
    await page.goto('https://test.netlify.app/');
    console.log('Navigated to test site');
    
    // Fill in the form fields
    await page.fill('input[name="name"]', 'David Becker');
    await page.fill('input[name="email"]', 'david@example.com');
    await page.fill('input[name="phone"]', '555-123-4567');
    await page.fill('input[name="company"]', 'Jones Automation');
    await page.fill('input[name="website"]', 'https://example.com');
    console.log('Form fields filled');
    
    // Change Number of Employees from 1-10 to 51-500 (Bonus task)
    await page.selectOption('select[name="number_of_employees"]', '51-500');
    console.log('Number of Employees changed to 51-500');
    
    // Take screenshot before clicking the button
    await page.screenshot({ 
      path: 'test-site-before-submit.png',
      fullPage: true 
    });
    console.log('Screenshot saved: test-site-before-submit.png');
    
    // Click the "Request a call back" button
    await page.click('button.primary.button');
    console.log('Clicked "Request a call back" button');
    
    // Wait for thank you page to load
    await page.waitForURL('**/thank-you*', { waitUntil: 'networkidle' });
    console.log('Thank you page reached!');
    
    // Take screenshot of thank you page
    await page.screenshot({ 
      path: 'test-site-after-submit.png',
      fullPage: true 
    });
    console.log('Screenshot saved: test-site-after-submit.png');
    
  } catch (error) {
    console.error('Automation error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
