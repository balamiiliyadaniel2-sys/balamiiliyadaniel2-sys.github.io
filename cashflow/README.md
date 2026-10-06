# Cash Flow Lab

A self-contained HTML/CSS/JavaScript learning project by Daniel Balami, extending the portfolio's cash-flow forecasting idea. The portfolio describes mathematics studies, financial reporting experience, web development learning, and data annotation skills. Those details inform the project; they are not financial training data.

Open index.html directly in a browser. No installation, API key, or backend is required. Data is kept in browser memory and is not uploaded or persisted.

## Input

CSV header: `month,income,expenses`. Supply at least six consecutive months in ascending YYYY-MM order, with nonnegative amounts and no thousands separators. Each row represents total monthly cash inflows and outflows, not accounting profit. Select the matching currency; currency selection does not convert amounts. Enter the cash balance at the end of the final historical month.

## Forecast method

Income and expenses each compare last-month, three-month-average, and drift forecasts. Models are scored using expanding-window one-month-ahead mean absolute error, beginning after three historical observations. The lowest-scoring model is fit to all history. Predictions are clipped at zero. Revenue and expense scenario percentages apply once to each forecast amount, not as compounded growth. Future cash balance equals starting cash plus cumulative forecast income minus expenses.

Historical scores are model-selection results, not independent holdout accuracy. The app does not validate multi-month accuracy, estimate prediction intervals, or model seasonality, taxes, debt schedules, and unexpected events. Sample records are fictional.

Reference: https://otexts.com/fpp3/tscv.html

## Validation

Checked CSV parsing and rejection of missing, negative, and duplicate-month records; six-month forecast date rollover; cumulative cash-balance identity; -100% income scenario; and constant-series benchmark errors. Browser visual testing remains outstanding.


## Document uploads

Import CSV, Excel (.xlsx/.xls), Word (.docx), and text-based PDF documents. Readers are downloaded on demand from pinned CDN URLs: SheetJS 0.20.3, Mammoth 1.11.0, PDF.js 5.4.296. File contents are processed in the browser, not sent to a server. Internet access is needed for reader code, PDF workers and font resources.

Choose a worksheet or Word table. Tables need Month / Income / Expenses headers (Revenue / Inflows and Costs / Outflows aliases are supported). Excel and Word allow reordered columns. Dates support YYYY-MM, YYYY-MM-DD, Month YYYY, and Excel date cells. Amounts support nonnegative numbers, grouped thousands and NGN/USD/GBP/EUR currency prefixes. Totals and note rows are explicitly reported as excluded; malformed monthly rows stop the import. Imported data appears in an editable CSV preview and is not forecast automatically. Previous forecasts are cleared during imports and data edits.

PDF support is limited to simple selectable-text tables with Month / Income / Expenses columns in that order. Scans need OCR before importing. Word .doc must be converted to .docx. Limits: 20 MB per file, 100 pages per PDF. Six consecutive months are still required. Document layout extraction can be imperfect; review every imported figure.

Validation: actual generated XLSX, DOCX, and selectable-text PDF fixtures each produced six valid monthly rows using the pinned readers. Additional checks cover reordered columns, aliases, thousands separators, missing amounts, invalid dates, total rows, malformed PDF rows and forecast arithmetic. Browser UI testing is unavailable in this environment.
