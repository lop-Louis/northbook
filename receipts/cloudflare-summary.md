# Cloudflare analytics snapshot — Sat, 15 Feb 2025 12:00:00 GMT

Window: 2025-02-14T12:00:00.000Z → 2025-02-15T12:00:00.000Z (1 day)
Baseline: not supplied
_Mode: dry-run sample data_

| Signal                            | Value                    | Δ vs baseline | Status     | Notes                   |
| --------------------------------- | ------------------------ | ------------- | ---------- | ----------------------- |
| `adoption.pages_touched`          | 29 unique slugs          | —             | 🟢 Healthy | >=25 unique slugs (29)  |
| `adoption.time_to_answer`         | Median 52.0s (p80 68.0s) | —             | 🟢 Healthy | Median 52.0s, p80 68.0s |
| `quality.lab_pass_rate`           | 93.6% pass (44/47)       | —             | 🟢 Healthy | 93.6%                   |
| `quality.broken_links`            | 6.0 per day (6 total)    | —             | 🔴 Breach  | >=5/day (6.0)           |
| `credibility.state_freshness`     | 0 days since update      | —             | 🟢 Healthy | <=30 days (0)           |
| `credibility.exceptions_resolved` | 80.0% on time (4/5)      | —             | 🔴 Breach  | 80.0%                   |

> Source: Cloudflare GraphQL aggregates + custom events. Generated via `pnpm run analytics:snapshot`.
