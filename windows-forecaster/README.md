# Daniel Financial Forecaster — Windows source

A Windows desktop application based on the working Financial Forecast Lab (Build 8). It processes documents locally and bundles its Excel, Word and PDF reader code.

## Run on Windows

1. Install Node.js 22 or newer (a supported LTS release) from https://nodejs.org/.
2. Extract the complete ZIP into a folder on your laptop.
3. Open PowerShell in that folder and run:

```powershell
npm ci
npm start
```

Internet access is required to install dependencies and build tools. Once installed, the app's document readers do not require external downloads.

## Create Windows executables

Run these commands on Windows:

```powershell
npm run dist:win
```

The `dist` folder will contain an x64 NSIS setup installer and a portable `.exe`. These executables are unsigned unless you configure code signing. The supplied deliverable is source code, not a prebuilt or Windows-tested executable.

## Features

- Import Excel (.xlsx/.xls), Word (.docx tables), CSV and selectable-text PDF reports.
- Review and map account columns across several documents.
- Convert reviewed reports into a downloadable trial-balance workbook.
- Keep different reporting dates on separate worksheets; add multiple tables from one file.
- Calculate assumption-based account scenarios and automatic forecasts from consistent account history.
- Chart account balances and overall comparable totals, and export Excel forecasts.
- Forecast cash receipts/payments from explicitly identified cash-flow data.
- Save projects with Ctrl+S and reopen with Ctrl+O.

Project files contain table data, previews, mappings and settings. They are plain JSON and are not encrypted. Original file bytes are not retained in projects. Review the restored tables and confirm them before combining; calculated outputs are regenerated. Automatic demo outputs are not saved as user data. Avoid including the same underlying records twice across different source reports: duplicate-byte detection cannot reconstruct original file identity after a project is reopened.

## Use the fictional cash-flow test

Upload `examples/Fictional_Cashflow_Forecast_Test.xlsx` through the single-file importer. Select Fictional Cash History, choose cash records as the basis, enter starting cash 6580000, a horizon of 3 months, and adjustments of 0%. The expected ending cash is NGN 8,650,000. The workbook explains the expected results. These are fictional figures, not actual company records.

## Financial limitations

A trial balance forecasts account balances; it does not establish cash receipts/payments on its own. A single report uses explicit assumptions or a repeat-period baseline. Automatic account model comparisons require at least four consecutive reporting dates, and an independent latest-period holdout is used from six dates. Missing accounts are excluded, not imputed as zero. Forecast totals are not forced to balance. Complex PDFs may require conversion; scanned PDFs need OCR. Specialized PDF fonts or CMaps may not be available offline.

## Structure

- `src/main.cjs`: native window, file dialogs, restricted IPC and project validation.
- `src/preload.cjs`: minimal isolated project-save/open bridge.
- `src/project.cjs`: saved-project validation and size limits.
- `renderer/index.html`, `style.css`, `app.js`: prepared forecaster interface and bundled readers.
- `renderer/desktop.js`: desktop controls and project state.
- `scripts/prepare.cjs`: prepares renderer files from `../cashflow/index.html` when working inside the portfolio repository; the ZIP already includes them.
- `test/project.test.cjs`: meaningful project validation checks.

The renderer has no Node integration, uses context isolation and sandboxing, and cannot navigate to remote pages. HTTP/HTTPS requests are blocked at runtime. Project file paths are chosen through native dialogs, not supplied by page code. Financial export downloads also use a native save dialog.

## Validation

```powershell
npm test
```

Checked: JavaScript syntax, project roundtrip and validation, unsafe settings/values, inconsistent balance rejection, size limits, existing forecasting mathematics, bundled reader parsing, and desktop state capture/restore with mocked DOM controls. Native Windows launching, document dialogs, PDF workers, installer creation, and SmartScreen behaviour still require a Windows smoke test.

## Build references

- https://www.electronjs.org/docs/latest/tutorial/security
- https://www.electron.build/nsis/
