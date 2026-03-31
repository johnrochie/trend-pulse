#!/usr/bin/env node
/**
 * Generate Daily Digest for Trend Pulse
 *
 * Fetches top articles from automation-output.json, uses DeepSeek to create
 * an AI-powered daily summary, outputs a digest article in the format
 * required by DAILY-DIGEST-SPEC.md.
 *
 * Usage:
 *   node scripts/generate-daily-digest.js
 *   node scripts/generate-daily-digest.js --date 2026-03-06
 *   node scripts/generate-daily-digest.js --articles-url ./automation-output.json
 *
 * Env: DEEPSEEK_API_KEY (required for AI generation)
 */

const ARTICLES_URL =
  process.env.ARTICLES_URL ||
  'https://raw.githubusercontent.com/johnrochie/trend-pulse/main/automation-output.json';
const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { date: null, articlesUrl: null, output: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--date' && args[i + 1]) opts.date = args[++i];
    else if (args[i] === '--articles-url' && args[i + 1])
      opts.articlesUrl = args[++i];
    else if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
  }
  return opts;
}

function getDate(opts) {
  if (opts.date) {
    const d = new Date(opts.date);
    if (isNaN(d.getTime())) throw new Error(`Invalid date: ${opts.date}`);
    return d;
  }
  return new Date();
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

function formatDatePretty(d) {
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

async function fetchArticles(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch articles: ${res.status}`);
  const json = await res.json();
  const list = Array.isArray(json) ? json : json.articles || [];
  return list.filter((a) => a.type !== 'daily-digest');
}

function pickTopArticles(articles, limit = 10) {
  return articles
    .filter((a) => !a.slug?.startsWith('daily-digest-'))
    .sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))
    .slice(0, limit);
}

function buildPrompt(articles, dateStr, datePretty) {
  const summaries = articles.map(
    (a, i) =>
      `${i + 1}. [${a.category.toUpperCase()}] ${a.title}\n${(a.content || a.excerpt || '').slice(0, 500)}`
  );

  return `You are a senior news editor and analyst at Trend Pulse. Your job is to write a comprehensive daily briefing that goes beyond the headlines — providing original context, analysis, and insight that readers cannot get from just reading individual articles.

Today's date: ${datePretty}

Below are today's top stories with their key details:

${summaries.join('\n\n---\n\n')}

Write a substantive daily briefing (minimum 900 words) using the EXACT section markers below. Every section must provide original analysis, not just a re-summary. Explain WHY stories matter and what they mean for readers. Include specific names, numbers, and facts from the articles. Do not use vague filler language.

---

**DAILY DIGEST — ${datePretty}**

## 🔥 Top Story

[Write 4-6 sentences on the single most important story of the day. State the key facts, then explain why this story matters — what it signals for the industry, consumers, or the economy. Include at least one specific number or statistic.]

## 📰 Today's Key Stories

**[Story 2 headline]**
[3-4 sentences: what happened, why it matters, what happens next]

**[Story 3 headline]**
[3-4 sentences: what happened, why it matters, what happens next]

**[Story 4 headline]**
[3-4 sentences: what happened, why it matters, what happens next]

## 📈 Market & Business Pulse

[4-5 sentences synthesizing all business/finance/market news from today's stories. Identify the common thread or trend across business stories. If no business news, discuss the business implications of today's top stories.]

## 💡 Tech & Innovation Watch

[4-5 sentences on the technology stories. What patterns are emerging? What does this mean for consumers, workers, or companies? Be specific.]

## 🔑 Key Takeaways

Distill today's news into 5 actionable insights:

• [Takeaway 1 — one specific, non-obvious insight from today's stories]
• [Takeaway 2 — one specific, non-obvious insight]
• [Takeaway 3 — one specific, non-obvious insight]
• [Takeaway 4 — one specific, non-obvious insight]
• [Takeaway 5 — what to watch in the next 24-48 hours]

## ❓ Frequently Asked Questions

**Q: [Question a reader would ask about today's top story]**
A: [2-3 sentence answer with specific facts]

**Q: [Question about the broader trend these stories represent]**
A: [2-3 sentence answer explaining the bigger picture]

**Q: [Question about what readers should do or watch next]**
A: [2-3 sentence forward-looking answer]

## 🔮 Tomorrow's Outlook

[3-4 sentences on what to watch next. Name specific upcoming events, decisions, or releases that are relevant. Give readers a reason to come back tomorrow.]

---

📖 **Full Coverage:** ${articles.map((a) => a.title).join(' | ')}`;
}

async function callDeepSeek(prompt, apiKey) {
  const res = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            'You are a senior news editor and analyst. Write substantive, analytical content with specific facts and genuine insight. Never use vague filler phrases like "it is worth noting" or "this is significant because". Output only the briefing content using the exact section markers provided — no preamble, no closing commentary.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error('No content in DeepSeek response');
  return content;
}

function buildDigestArticle(content, dateStr, datePretty, topArticle) {
  const lines = content.split('\n').filter((l) => l.trim());
  const bulletLines = lines.filter(
    (l) => l.trim().startsWith('•') || l.trim().startsWith('-')
  );
  const excerpt =
    bulletLines.length > 0
      ? bulletLines.slice(0, 2).join(' ').replace(/^[•\-]\s*/, '').trim()
      : 'Your AI-powered summary of today\'s top stories across tech, business, and markets.';

  const id = 900000 + parseInt(dateStr.replace(/-/g, '').slice(0, 8), 10);

  // Estimate read time: ~200 words per minute
  const wordCount = content.split(/\s+/).length;
  const readMinutes = Math.max(5, Math.round(wordCount / 200));

  return {
    id,
    title: `Daily Briefing: ${datePretty} — Top Stories, Analysis & Key Takeaways`,
    excerpt: excerpt.slice(0, 200) + (excerpt.length > 200 ? '...' : ''),
    content,
    category: 'General',
    readTime: `${readMinutes} min`,
    views: 0,
    trendingScore: 90,
    tags: ['Daily Digest', 'AI Summary', 'News'],
    publishedAt: `${dateStr}T18:00:00.000Z`,
    publishedAtSite: `${dateStr}T18:00:00.000Z`,
    color: 'from-purple-600 to-pink-600',
    url: `https://www.trendpulse.life/daily-digest/${dateStr}`,
    imageUrl: topArticle?.imageUrl || '',
    sourceName: 'Trend Pulse AI',
    slug: `daily-digest-${dateStr}`,
    type: 'daily-digest',
  };
}

async function main() {
  const opts = parseArgs();
  const date = getDate(opts);
  const dateStr = formatDate(date);
  const datePretty = formatDatePretty(date);

  const articlesUrl = opts.articlesUrl || ARTICLES_URL;
  console.error(`Fetching articles from ${articlesUrl}...`);

  const articles = await fetchArticles(articlesUrl);
  const topArticles = pickTopArticles(articles);

  if (topArticles.length === 0) {
    throw new Error('No articles available to generate digest');
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error(
      'DEEPSEEK_API_KEY is required. Set it in .env or environment.'
    );
  }

  console.error(`Generating digest for ${datePretty} from ${topArticles.length} articles...`);

  const prompt = buildPrompt(topArticles, dateStr, datePretty);
  const content = await callDeepSeek(prompt, apiKey);
  const digest = buildDigestArticle(
    content,
    dateStr,
    datePretty,
    topArticles[0]
  );

  const output = JSON.stringify(digest, null, 2);

  if (opts.output) {
    const fs = await import('fs');
    fs.writeFileSync(opts.output, output);
    console.error(`Wrote digest to ${opts.output}`);
  } else {
    console.log(output);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
