# Daily Digest Spec for Automation

This document defines the schema and behavior required for daily digest articles in `automation-output.json`. The website's Daily Digest feature filters articles by `type: 'daily-digest'` and expects a specific structure.

## Required Fields

Each daily digest article in the `articles` array must include:

| Field | Type | Example | Notes |
|-------|------|---------|-------|
| `id` | number | `1001` | Unique, distinct from regular articles |
| `title` | string | `"Daily Digest: March 6, 2026"` | Human-readable title |
| `excerpt` | string | `"AI-powered summary of today's top stories..."` | Shown in cards and meta |
| `content` | string | See content format below | Markdown-like structure |
| `category` | string | `"General"` | Typically "General" for digests |
| `readTime` | string | `"5 min"` | Estimated read time |
| `views` | number | `0` | Can start at 0 |
| `trendingScore` | number | `90` | Optional engagement metric |
| `tags` | string[] | `["Daily Digest", "AI Summary"]` | Optional tags |
| `publishedAt` | string | `"2026-03-06T18:00:00.000Z"` | ISO 8601 date |
| `publishedAtSite` | string | Same as `publishedAt` | |
| `color` | string | `"from-purple-600 to-pink-600"` | Tailwind gradient class |
| `url` | string | Article URL or site path | |
| `imageUrl` | string | Image URL or empty | Uses Unsplash fallback if empty |
| `sourceName` | string | `"Trend Pulse AI"` | |
| **`slug`** | string | **`"daily-digest-2026-03-06"`** | **Required.** Format: `daily-digest-YYYY-MM-DD` |
| **`type`** | string | **`"daily-digest"`** | **Required.** Used for filtering |

## Content Format

The website parses `content` for these section markers (case-sensitive):

- `**DAILY DIGEST:**` – Header/title
- `🔥 **TOP STORY:**` – Top story summary
- `📈 **MARKET MOVERS:**` – Market updates
- `💡 **TECH SPOTLIGHT:**` – Tech highlights
- `🌍 **GLOBAL WATCH:**` – Global news
- `🔮 **TOMORROW'S OUTLOOK:**` – Outlook section
- `📖 **READ THE FULL ARTICLES:**` – Links or article list

Bullet points (`•` or `-`) in `content` are used for "Today's Highlights" on the homepage card.

## Example Article

```json
{
  "id": 1001,
  "title": "Daily Digest: March 6, 2026 - Top Stories Summary",
  "excerpt": "Your AI-powered summary of today's top stories across tech, business, and markets.",
  "content": "**DAILY DIGEST:** March 6, 2026\n\n🔥 **TOP STORY:** ...\n\n• Key point one\n• Key point two\n\n📈 **MARKET MOVERS:** ...\n\n💡 **TECH SPOTLIGHT:** ...\n\n🌍 **GLOBAL WATCH:** ...\n\n🔮 **TOMORROW'S OUTLOOK:** ...\n\n📖 **READ THE FULL ARTICLES:**\n- Article 1\n- Article 2",
  "category": "General",
  "readTime": "5 min",
  "views": 0,
  "trendingScore": 90,
  "tags": ["Daily Digest", "AI Summary", "News"],
  "publishedAt": "2026-03-06T18:00:00.000Z",
  "publishedAtSite": "2026-03-06T18:00:00.000Z",
  "color": "from-purple-600 to-pink-600",
  "url": "https://www.trendpulse.life/daily-digest/2026-03-06",
  "imageUrl": "",
  "sourceName": "Trend Pulse AI",
  "slug": "daily-digest-2026-03-06",
  "type": "daily-digest"
}
```

## Merge Strategy

- Append daily digest articles to the `articles` array (before or after regular articles).
- One digest per calendar day; slug must be unique per date.
- Digest articles are separate from the 50 regular articles; decide whether they count toward that limit or are kept in addition.
- Deduplicate by `slug` when merging with existing articles from GitHub.

## URLs

- Archive: `/daily-digest`
- Individual digest: `/daily-digest/YYYY-MM-DD` (e.g. `/daily-digest/2026-03-06`)

The date segment comes from `slug.replace('daily-digest-', '')`.

---

## Scripts (trend-pulse repo)

Two scripts are provided to generate and merge daily digests:

### 1. Generate digest

```bash
# Requires DEEPSEEK_API_KEY in env
node scripts/generate-daily-digest.js

# Optional: specific date, local articles file, output file
node scripts/generate-daily-digest.js --date 2026-03-06
node scripts/generate-daily-digest.js --articles-url ./automation-output.json
node scripts/generate-daily-digest.js --output ./digest-today.json
```

### 2. Merge digest into articles

```bash
# Stdin: articles JSON  |  output: merged JSON
node scripts/generate-daily-digest.js --output /tmp/digest.json
cat automation-output.json | node scripts/merge-digest-into-articles.js /tmp/digest.json > automation-output-new.json

# Or with file args
node scripts/merge-digest-into-articles.js digest.json automation-output.json > merged.json
```

### 3. Integration with trend-pulse-automation

Add a daily step (e.g. cron at 6 PM UTC):

1. Fetch current `automation-output.json` from GitHub (or use local output).
2. Run `node scripts/generate-daily-digest.js` (or call from automation dir if scripts are copied).
3. Run `merge-digest-into-articles.js` to merge digest + articles.
4. Commit and push `automation-output.json` to GitHub.

Alternatively, copy `scripts/generate-daily-digest.js` into trend-pulse-automation and call it from `index.js` during the publish step, then merge the result before pushing.
