
import asyncio
from playwright.async_api import async_playwright, expect
import os
import subprocess
import time
import xlsxwriter

def create_test_excel_file(data, file_path):
    workbook = xlsxwriter.Workbook(file_path)
    worksheet = workbook.add_worksheet('Transactions')

    headers = list(data[0].keys())
    for col_num, header in enumerate(headers):
        worksheet.write(0, col_num, header)

    for row_num, row_data in enumerate(data):
        for col_num, header in enumerate(headers):
            worksheet.write(row_num + 1, col_num, row_data[header])

    workbook.close()

async def main():
    test_file_path = os.path.abspath('jules-scratch/verification/test_data.xlsx')
    test_data = [
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
    ]
    create_test_excel_file(test_data, test_file_path)

    server_process = None
    try:
        # Start a simple HTTP server
        server_process = subprocess.Popen(['python3', '-m', 'http.server', '8000'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(2) # Give server time to start

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()

            await page.goto('http://localhost:8000/GST%20Reconciliation.html')

            await page.set_input_files('#fileUploader', test_file_path)

            # Wait for loader to appear, then disappear
            await expect(page.locator('#loader-overlay')).to_be_visible(timeout=5000)
            await expect(page.locator('#loader-overlay')).to_be_hidden(timeout=10000)

            # Now check for the dashboard
            await expect(page.locator('#dashboard')).to_be_visible(timeout=5000)

            await page.click('#tab3')

            await expect(page.locator('#supplier-analysis-body tr')).to_have_count(3)

            supplier_a_rows = page.locator('tr:has-text("Supplier A")')
            dropdowns = supplier_a_rows.locator('.add-to-select')
            await expect(dropdowns).to_have_count(2)

            await dropdowns.first.select_option('Admin')

            await page.screenshot(path="jules-scratch/verification/verification.png")

            await expect(dropdowns.nth(1)).to_have_value('Admin')

            await browser.close()
            print("Verification script ran successfully.")

    finally:
        if server_process:
            server_process.terminate()
        if os.path.exists(test_file_path):
            os.remove(test_file_path)

if __name__ == "__main__":
    asyncio.run(main())
