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


## Trial balance mode

Excel and Word tables with Code / Description / Debit / Credit headers are detected separately from monthly cash-flow records. Select one worksheet or table at a time. Unlabelled derived columns are ignored; signed net balances are computed from debit minus credit. Negative debit/credit entries remain signed, empty amounts are explicitly counted and treated as zero, totals rows are excluded from account sums and reconciled separately, and duplicate account codes remain individual rows. Amounts and totals are calculated in integer cents.

A single-date trial balance supports account-level scenarios, not statistical trend estimation or inferred cash flows. Choose an account, base month, assumed monthly rate (-100% to 100%), and 1–24 months. Projected signed balance = base signed balance × (1 + rate/100)^month, rounded to cents. A positive rate increases the magnitude of a credit balance as well as a debit balance. This does not produce a balanced future trial balance. Currency changes labels only. Additional period history is required to estimate trends.

Validation: tested parsing and reconciliation against the user-provided assumed-data workbook, including its negative entries, blank amount cells, duplicate account codes and separate duplicate worksheets. Full script execution and scenario calculations were checked with a mocked DOM. Browser visual testing remains outstanding. The workbook itself and its account data are not embedded in the published application or this repository.


## Daily forecasting and 30-day scenarios

Daily cash-flow records use `date,income,expenses` with real YYYY-MM-DD dates and at least 30 consecutive daily rows. Include zero values on inactive days. Date/Day table headers preserve full dates in Excel, Word and simple text PDF imports; Month headers retain monthly aggregation. Header choice determines frequency. Daily forecasts default to 30 days with a 1–90 day horizon; monthly data continues to require six months with a 1–24 month horizon. Model comparisons use one-day or one-month rolling forecasts according to frequency. A 30-day forecast has not been independently validated by the one-day selection score. The three-period average is labelled in days for daily records. Daily sample data is fictional.

Trial-balance account scenarios default to daily steps and 30 days, starting the day after the selected base date. The user supplies a daily percentage change; projected signed balance = initial signed balance × (1 + daily rate/100)^day. Monthly steps remain available. Switching frequency resets the assumed rate to zero to prevent accidentally reusing a monthly rate as a daily rate. Each projection remains an assumption-driven account balance scenario, not a cash flow or balanced future trial balance.

Validation: full-script mocked-DOM execution; 30-day CSV/table/PDF-text ingestion; invalid, duplicate, and missing dates; required 30-row minimum; daily forecast balance arithmetic; leap-day and year rollover; preserved monthly forecasting; original trial-balance totals; and 30-day signed account scenarios. Browser visual testing remains outstanding.
