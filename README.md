# GST Reconciliation Dashboard

## Overview

This is a powerful, standalone HTML-based dashboard designed to streamline the GST reconciliation process. It allows users to upload their transaction data from an Excel file, identify discrepancies between different ledgers (like GSTR-2B and Purchase Registers), and manage the follow-up process efficiently. The entire application runs locally in the browser, ensuring data privacy, and uses IndexedDB to persist data, eliminating the need for repeated file uploads.

## Key Features

*   **Interactive KPI Dashboard:** Get a high-level overview of the reconciliation status with key performance indicators like "Missing 2B Cumulative," "Missing PR Cumulative," "Total Recovered," and "Success Rate."
*   **Transaction Drilldown:** Search, filter, and inspect individual transactions with ease. Users can filter by supplier name and document number.
*   **Supplier-Level Analysis:** View a summary of total GST amounts grouped by supplier and discrepancy type (tag), helping to prioritize follow-ups with high-impact suppliers.
*   **Mailing List Management:** Categorize suppliers into custom mailing lists (e.g., "Admin," "HR," "IT") directly from the supplier analysis page for targeted communication.
*   **Automated Validation with Books:** Upload a separate "Books" Excel file to automatically cross-reference and update the status of "Missing in PR" transactions to "Invoice Received."
*   **Client-Side Data Storage:** The application uses the browser's IndexedDB to save transaction data, actions, and mailing list assignments. This allows users to close the dashboard and resume their work later without re-uploading the primary Excel file.
*   **Data Export:** Export filtered transaction lists and supplier analysis tables to CSV format for reporting or offline analysis.
*   **AI-Powered Chatbot ("Ask MGST"):** A simple chatbot assistant to help users filter the data by company, month, or tag, or to quickly pull up details for a specific supplier.

## How to Use

1.  **Open the File:** Simply open the `GST Reconciliation.html` file in any modern web browser (like Chrome, Firefox, or Edge).
2.  **Load Data:** On the initial screen, you have two options:
    *   **Upload New Excel File:** Click this to load your primary transaction data from an `.xlsx` or `.xls` file. The file must contain a sheet named "Transactions."
    *   **Use Saved Data:** If you have previously uploaded a file, click this to load your last session's data from the browser's internal storage.
3.  **Navigate the Dashboard:** Once the data is loaded, use the tabs at the top to switch between different views:
    *   **KPIs:** View the main dashboard with key metrics.
    *   **Transactions:** See a detailed table of all transactions. Use the search boxes to filter by supplier or document number.
    *   **Suppliers:** Analyze data grouped by supplier and tag.
    *   **Mailing List:** View and export the mailing lists you've created.
4.  **Filter Data:** Use the slicers at the top of the page (Company, Month, Tag) to filter the data across the entire dashboard.
5.  **Validate with Books (Optional):**
    *   Navigate to the "Validate with Books" tab.
    *   Upload your "Books" Excel file. The file should contain columns named "Voucher Ref. No." and "GSTIN/UIN."
    *   The application will automatically find matches and update the status of the relevant "Missing in PR" transactions.

## Technical Details

*   **Frontend:** The application is a single, self-contained HTML file.
*   **Styling:** Uses **Tailwind CSS** via a CDN for a modern UI.
*   **Excel Parsing:** Uses the **SheetJS (xlsx.full.min.js)** library to read `.xlsx` files directly in the browser.
*   **Data Persistence:** Leverages **IndexedDB** for client-side storage of all data, actions, and assignments.
