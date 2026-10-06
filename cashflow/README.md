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


## General report workflow (supersedes earlier monthly minimum)

Reports covering at least 30 days are accepted even when there is only one period-total row. The user confirms coverage in the report-coverage input; the software does not infer duration from a balance-sheet date. Monthly records require one or more period rows, not six. With fewer than six period observations, forecast amounts repeat the latest reported totals with explicit scenario adjustments and no historical accuracy score. Daily records still require 30 consecutive daily entries for the daily trend workflow.

Different tabular layouts can be mapped by choosing the header row, date/description column, income/debit/amount column, and expense/credit column. Line-item statements require explicit per-row Income / Expense / Ignore selection, and a reporting month. Subtotals must be ignored when their detail rows are included. Signs are retained in line amounts and account balances. Negative aggregate income/expense totals are rejected for the current nonnegative model. Mapping debit/credit reports without account codes assigns row identifiers. These are user-reviewed mappings, not automatic financial classification.

Trial balances default to a whole-report scenario for every account, with account-level selection still available. The report-level rate applies equally to each signed balance, and the result is not a balanced forecast statement or an inferred cash-flow statement. Report basis distinguishes cash records from accrual or unclassified figures. Cumulative arithmetic is shown for either basis, but cash-shortfall labels require the user to select cash records.

Supported containers remain Excel .xlsx/.xls, Word .docx tables, CSV, and simple text PDF tables. Scans require OCR; complex or unseparable PDF layouts require conversion. There is no promise to automatically interpret every financial report. Original uploads stay out of the published repository.

Validation: full-script execution, one-period totals accepted, coverage below 30 rejected, short-history baseline calculations, no short-history MAE claim, single-period table imports, preserved daily forecasts, and all-account projection across the supplied workbook. Browser visual testing remains outstanding.


## Build 6: multi-document trial balance converter

Select up to ten Excel, Word, selectable-text PDF, or CSV files (20 MB per file and 50 MB total). Pick one worksheet/table per document, its reporting date, header row, and column mappings. Separate Debit/Credit mode preserves signed figures. Signed Balance mode uses the explicitly stated positive-debit/negative-credit convention and splits each net balance onto its balance side. Optional account codes default to unique source-row identifiers when absent. Monthly income/expense summaries cannot establish missing debit/credit journal entries and are not automatically converted to a trial balance.

Documents are read sequentially in the browser. Identical byte-for-byte files are excluded by default and cannot both be included for the same reporting date. Inclusion of complementary reports requires user review and confirmation; different files containing overlapping records are not automatically deduplicated. Totals labelled Total are excluded, but other subtotal rows must be removed from the source or omitted before combining. Dates and coverage are user-confirmed, not inferred as historical activity from snapshot balances.

Included accounts aggregate by account code AND description within a reporting date only. Different dates remain separate sheets. No balancing entries are created. Review totals/differences, download Converted_Trial_Balance.xlsx, or load a selected converted report directly into the forecast scenario. Export includes reporting date, currency label, coverage, Code/Description/Debit/Credit columns and totals. The generated workbook reimports into the trial-balance parser. Forecasting across historical account snapshots is not automatically fitted; each selected trial balance still uses the explicit account-growth scenario workflow.

Validation: full-script mocked-DOM execution; actual uploaded Excel queue; exact duplicate detection/exclusion; same-period combining; separate-date output; cent arithmetic; generated XLSX roundtrip preserving totals and reporting date; and confirmation/export states. Browser visual testing remains outstanding. Conversion sources are never included in published application code.


## Build 7: bundled readers

Reader code is embedded as gzip/base64 assets and decompressed into local JavaScript Blob URLs at runtime. Excel, Word, PDF display API and PDF worker code no longer require external reader downloads. Modern browsers supporting DecompressionStream are required. PDF text extraction uses system fonts and disables font-face loading; specialized PDFs may still require font/CMap resources not bundled here. Scanned PDFs still need OCR.

Embedded pinned readers: SheetJS 0.20.3, Mammoth 1.11.0, PDF.js 5.4.296. Original library source notices are retained inside embedded reader bytes. Validation: all four assets decompress byte-for-byte to the previously tested readers; real XLSX and DOCX files parse via bundled Blob script loading without external reader requests. Complete JavaScript syntax passes. Full browser testing is still unavailable.


## Build 8: automatic account history forecasts

Calculate converted reports, then generate automatic forecasts across multiple reporting dates. One document may contribute multiple worksheets/tables via Add another worksheet/table. Dates must be consecutive daily, monthly, quarterly or yearly snapshots with a consistent convention (month-end supported). Code-plus-description matching is the default; unique description matching is an explicit alternative. Duplicate matching identities are rejected. Accounts absent from any included reporting date are excluded and listed, not treated as zero.

Two or three dates produce repeat-last baselines with no model-selection score. Four or five dates compare last balance, 3-period average, drift and linear regression using expanding-window one-period mean absolute error, starting after three observations; these are selection scores only. With six or more dates, selection uses all observations except the final period; its separate absolute holdout error is reported. Future models then use all history. This protects the holdout from model-selection leakage but one holdout is limited evidence and does not establish multi-period accuracy. Signed balances are preserved, including predictions crossing debit/credit sides. Prediction intervals, seasonal models and accounting adjustments are not implemented.

Account and aggregate charts show historical solid lines and forecast dashed lines. Aggregate net debit-side and net credit-side totals sum predictions for comparable accounts only, not raw historical debit/credit turnover. Forecast totals may be unbalanced: no accounting balancing entries or cash-flow classifications are invented. A clearly labelled fictional demo is separate from user reports.

Automatic_Report_Forecast.xlsx contains summary totals, account forecasts with model/error fields, comparable history, and methods/issues. It is a forecast workbook, not a formally balanced future trial balance. Currency remains a label; records must already share a currency.

Validation: complete script and fictional demo; signed trend forecasting; rolling errors; latest-period holdout isolation; limited-history baselines; missing-account exclusion; ambiguous-identity rejection; irregular-date validation; month-end and fixed-date anchoring; aggregate arithmetic; generated forecast XLSX roundtrip; and bundled XLSX/DOCX reader regression checks. Browser visual testing remains outstanding.

Method references: https://otexts.com/fpp3/tscv.html and https://otexts.com/fpp3/accuracy.html
