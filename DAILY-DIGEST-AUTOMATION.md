# Daily Digest Automation

This guide covers the full daily digest flow: generation, publishing, newsletter, and social sharing.

## Overview

| Step | When | What |
|------|------|------|
| 1. Generate + publish | 6:00 PM GMT | GitHub Actions generates digest, merges into `automation-output.json`, pushes to GitHub |
| 2. Site update | ~2 min after push | Vercel redeploys; new digest appears on site |
| 3. Newsletter | 6:05 PM GMT | Vercel cron sends digest to subscribers via Resend Broadcast |
| 4. Social (optional) | When you connect | IFTTT/Zapier watches RSS and posts to Twitter, Facebook, Instagram |

## Setup

### 1. GitHub Actions (digest generation)

Add these **repository secrets** in GitHub → Settings → Secrets and variables → Actions:

- **`DEEPSEEK_API_KEY`** – Your DeepSeek API key for AI digest generation

The workflow runs at 6 PM GMT daily. You can also trigger it manually: Actions → Daily Digest → Run workflow.

### 2. Resend (newsletter)

1. Go to [resend.com](https://resend.com) and create an Audience (or Segment).
2. Get the **Audience ID** and **Segment ID** from the Resend dashboard.
3. Add these to your Vercel project environment variables:

   - **`RESEND_AUDIENCE_ID`** – Used when subscribers sign up (adds contact to list)
   - **`RESEND_SEGMENT_ID`** – Used when sending the daily digest broadcast
   - **`RESEND_API_KEY`** – Your Resend API key
   - **`RESEND_FROM`** – Sender email (e.g. `Trend Pulse <news@yourdomain.com>`)
   - **`CRON_SECRET`** – Random secret (16+ chars) to protect the cron endpoint

Vercel sends `Authorization: Bearer CRON_SECRET` when calling the cron route. Create a strong random value for `CRON_SECRET`.

### 3. Social sharing (no API cost)

Use **IFTTT** or **Zapier** (free tiers) to auto-post when a new digest is published:

1. **RSS feed for daily digests:**  
   `https://www.trendpulse.life/feed/daily-digest.xml`

2. **IFTTT**  
   - Create Applet: **If** "RSS Feed" → "New feed item" → paste feed URL  
   - **Then** "Twitter" → "Post a tweet" (or Facebook/Instagram)

3. **Zapier**  
   - Trigger: RSS by Zapier → New Item in Feed  
   - Action: Twitter / Facebook / etc. → Create Post

The digest RSS feed updates when a new digest is published. These tools poll the feed and post the new item—no paid social APIs needed.

## Share links in the newsletter

The newsletter includes pre-filled share links (Twitter, Facebook, LinkedIn). Recipients click to share on their own accounts.

## URLs

- **Site:** `https://www.trendpulse.life`
- **Daily digest archive:** `/daily-digest`
- **Digest RSS:** `/feed/daily-digest.xml`
- **Main site RSS:** `/feed.xml`
