const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

test.describe('Supplier Mailing List UI Refresh', () => {

  // Function to create a dummy Excel file for testing
  const createTestExcelFile = (data, filePath) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, filePath);
  };

  const testFilePath = path.join(__dirname, 'test_data.xlsx');

  // Sample data that will result in multiple rows for the same supplier on Page 3
  const testData = [
    {
      'Company Name': 'TestCorp',
      'Month': 'Jan',
      'Supplier Name': 'Supplier A',
      'Type': 'Missing_2B_Cumulative',
      'Total GST': 100,
      'Document Number (2B)': 'DOC001',
      'Document Date (2B)': '01-01-2024',
    },
    {
      'Company Name': 'TestCorp',
      'Month': 'Jan',
      'Supplier Name': 'Supplier A',
      'Type': 'Missing_in_PR_Cumulative',
      'Total GST': 200,
      'Document Number (2B)': 'DOC002',
      'Document Date (2B)': '02-01-2024',
    },
    {
        'Company Name': 'TestCorp',
        'Month': 'Jan',
        'Supplier Name': 'Supplier B',
        'Type': 'Missing_2B_Cumulative',
        'Total GST': 50,
        'Document Number (2B)': 'DOC003',
        'Document Date (2B)': '03-01-2024',
    }
  ];

  // Before the test, create the Excel file
  test.beforeAll(() => {
    createTestExcelFile(testData, testFilePath);
  });

  // After the test, clean up the Excel file
  test.afterAll(() => {
    fs.unlinkSync(testFilePath);
  });

  test('changing one dropdown for a supplier should update all dropdowns for that same supplier', async ({ page }) => {
    // Navigate to the local HTML file
    await page.goto('file://' + path.resolve('GST Reconciliation.html'));

    // 1. Upload the test file
    await page.setInputFiles('#fileUploader', testFilePath);

    // Wait for the dashboard to be visible
    await expect(page.locator('#dashboard')).toBeVisible({ timeout: 10000 });

    // 2. Navigate to the Suppliers page (Page 3)
    await page.click('#tab3');
    await expect(page.locator('#page3')).toHaveClass(/active/);

    // Wait for the table to be populated
    await expect(page.locator('#supplier-analysis-body tr')).toHaveCount(3);

    // 3. Find all dropdowns for 'Supplier A'
    const supplierARows = page.locator('tr:has-text("Supplier A")');
    const dropdowns = supplierARows.locator('.add-to-select');

    // Expect to find two dropdowns for Supplier A
    await expect(dropdowns).toHaveCount(2);

    // 4. Check initial state (all should be 'None')
    for (const dropdown of await dropdowns.all()) {
      await expect(dropdown).toHaveValue('None');
    }

    // 5. Change the value of the FIRST dropdown to 'Admin'
    await dropdowns.first().selectOption('Admin');

    // 6. Verify that the SECOND dropdown for the same supplier is also updated to 'Admin'
    // This is the key assertion. If the UI doesn't refresh, this will fail.
    await expect(dropdowns.nth(1)).toHaveValue('Admin');

    // 7. Change the value of the SECOND dropdown back to 'None'
    await dropdowns.nth(1).selectOption('None');

    // 8. Verify that the FIRST dropdown is also updated back to 'None'
    await expect(dropdowns.first()).toHaveValue('None');

  });
});
