const { test, expect } = require('@playwright/test');

test('verify application is not blank', async ({ page }) => {
  // Listen for all console events and log them to the test output
  page.on('console', msg => {
    console.log(`Browser Console [${msg.type()}]: ${msg.text()}`);
  });

  await page.goto('http://localhost:8000/GST%20Reconciliation.html');

  // Add a short delay to allow JavaScript to execute
  await page.waitForTimeout(1000);

  // Take a screenshot before the assertion
  await page.screenshot({ path: 'tests/screenshot.png' });

  // Wait for the startup screen to be visible
  const startupScreen = page.locator('#startupScreen');
  await expect(startupScreen).toBeVisible();

  // Wait for the main elements to be visible
  await expect(page.locator('h2:has-text("GST Reconciliation Pro")')).toBeVisible();
  await expect(page.locator('label:has-text("Upload New Excel File")')).toBeVisible();
});
