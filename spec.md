# Star Broadband Receipt Manager

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- A receipt management app for Star Broadband ISP
- Form to fill customer receipt fields:
  - Receipt No. (auto-incremented)
  - Date and Date of Expiry
  - User ID
  - Mobile Number
  - Customer Name
  - Address
  - Installation Charges (Non-refundable)
  - Package Value (text input)
  - Speed Plan selection: 20/30/40/50/75/100 MBPS
  - Duration selection: 1/3/6/12 Months
  - Total, Balance, GST, Grand Total
  - Payment status (Paid/Unpaid)
- Save customer receipts to backend (persistent list)
- View all saved customers in a list/table
- Print individual receipt: renders a styled receipt matching the Star Broadband format with all company branding details pre-filled
  - Company name: STAR BROADBAND, Stay Connected
  - Address: Mahatma Jyotiba Phule Nagar, Nr. Water Tank, Ambernath (W).
  - Phones: 8855001127, 9764744578, 9022119244
  - GST No.: 27AAMCS9406K1ZR, AGR No: 821-80/2014-DS
  - "Customer Copy" label and SALE label
  - Terms & Conditions section
  - Receiver's Signature area
  - QR code placeholder
- Print button triggers browser print for just the receipt area

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan
1. Backend: Store receipts with all fields. CRUD operations: create receipt, list all receipts, get receipt by ID, delete receipt.
2. Frontend:
   - Main page: List of all receipts with customer name, receipt no., date, and print button
   - Add Receipt form (modal or page): all fields
   - Print view: styled receipt matching Star Broadband format, print-only CSS
   - Auto-calculate Grand Total = Total + GST - Balance
