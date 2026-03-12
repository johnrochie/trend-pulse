# Where Articles Come From

This document clarifies how Trend Pulse gets its articles and daily digests.

## Summary

| What | Where it runs | What it does |
|------|---------------|--------------|
| **Article storage** | GitHub (`automation-output.json`) | Single source of truth; all articles live here |
| **Website** | Vercel (trendpulse.life) | Reads from GitHub via `/api/articles`; no local storage |
| **Article creation** | `trend-pulse-automation` (separate repo) | Runs on a server or local machine on a schedule (e.g. every 6 hours) |
| **Daily digest** | GitHub Actions (this repo) | Runs at 6 PM GMT; generates digest, merges, pushes to GitHub |

---

## Flow

```
[NewsAPI + DeepSeek]  →  trend-pulse-automation  →  Pushes to GitHub  →  trend-pulse (Vercel) reads
                                                          ↑
[Daily digest script]  →  GitHub Actions 6 PM GMT  ───────┘
```

## 1. Regular news articles

- **Produced by:** `trend-pulse-automation` (separate repository)
- **Where it runs:** Typically a cron job on a server (e.g. every 6 hours), or a local machine
- **Steps:**
  1. Fetch news from NewsAPI
  2. Generate full articles with DeepSeek
  3. Merge with existing articles
  4. Push `automation-output.json` to the `trend-pulse` GitHub repo

- **Config:** Automation uses its own `.env` (e.g. `NEWSAPI_KEY`, `DEEPSEEK_API_KEY`, `GITHUB_*`).

## 2. Daily digests

- **Produced by:** `scripts/generate-daily-digest.js` in this repo
- **Where it runs:** GitHub Actions on a schedule (6 PM GMT) – no local or Vercel server required
- **Steps:**
  1. GitHub Actions runs the script
  2. Script pulls articles from the GitHub raw URL
  3. Calls DeepSeek to build the digest
  4. Merges into `automation-output.json` and pushes to GitHub

- **Config:** GitHub repo secret `DEEPSEEK_API_KEY`.

## 3. How the website gets articles

- **Source:** `automation-output.json` in the `trend-pulse` GitHub repo
- **Fetch path:** `lib/articles-api.ts` → GitHub raw URL  
  `https://raw.githubusercontent.com/johnrochie/trend-pulse/main/automation-output.json`
- **Usage:** `/api/articles` route in this Next.js app calls `fetchArticles()`, which uses that URL
- **Fallback:** If GitHub fails, mock articles are used

The Vercel site does not run the automation or digest generation; it only reads the JSON file from GitHub.

## 4. Local development

- In dev, the site still uses the GitHub raw URL (or mock data if offline)
- To point at local automation output, you can override `ARTICLES_URL` when running scripts
- The site itself has no dependency on a local `trend-pulse-automation` instance

## Quick reference

| Question | Answer |
|----------|--------|
| Is there an API on the site? | Yes – `/api/articles` fetches from GitHub and serves the data |
| Are articles stored in a database? | No – only in `automation-output.json` in GitHub |
| Where does automation run? | Outside this repo: `trend-pulse-automation` (server or local machine) |
| Where does daily digest run? | In this repo – GitHub Actions at 6 PM GMT |
