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
