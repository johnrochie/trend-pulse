# Automation & GitHub Integration Guide

## 🎯 Overview

This document explains how the Trend Pulse automation system integrates with GitHub to ensure:
1. **New articles are added** to the site
2. **Existing articles are preserved** (not overwritten)
3. **Vercel deployment always has fresh content**
4. **Article rotation** (old articles eventually removed)

## 🔄 How It Works

### **Complete Automation Flow:**

```
[NewsAPI] → [Fetch News] → [Database] → [AI Generation] → [Publish] → [GitHub] → [Vercel]
```

### **Step-by-Step Process:**

#### **1. News Fetching (Every 6 Hours)**
- Fetches latest news from NewsAPI
- Stores in SQLite database (`articles.db`)
- Checks for duplicates using `source_id`

#### **2. AI Content Generation**
- Takes fetched articles without AI content
- Uses DeepSeek API to generate full articles
- Updates database with AI-generated content

#### **3. Publishing to Site**
- Takes AI-generated articles
- Formats for website display
- Creates `articles.json` in automation output

#### **4. GitHub Integration (NEW)**
- **Fetches current articles** from GitHub (`automation-output.json`)
- **Merges with new articles** (new first, remove duplicates)
- **Keeps only 50 articles** for performance
- **Pushes updated file** back to GitHub

#### **5. Vercel Deployment**
- **Reads from GitHub** raw URL
- **Always fresh content** (updated every 6 hours)
- **Fallback system** if GitHub fails

## 📊 Article Management Strategy

### **Article Lifecycle:**

```
New Article → Published → Displayed on Site → Rotated Out (after 50 articles)
```

### **Duplicate Prevention:**
- **By ID:** Uses `article.id` as primary identifier
- **By Title:** Fallback to title comparison (case-insensitive)
- **No duplicates:** Same article never appears twice

### **Rotation Strategy:**
- **Max 50 articles** kept in GitHub file
- **Newest first:** Most recent articles shown
- **Oldest removed:** After 50 articles, oldest are removed
- **Performance optimized:** 50 articles = fast loading

## 🚀 GitHub Integration Details

### **Files:**
1. **`automation-output.json`** - Main articles file in GitHub
2. **`update-github.js`** - Script that manages GitHub updates

### **Update Process:**
```javascript
// 1. Load current articles from GitHub
const currentArticles = await loadCurrentArticles(); // 28 articles

// 2. Load new articles from automation
const newArticles = await loadNewArticles(); // 5 new articles

// 3. Merge (new first, remove duplicates)
const merged = [...newArticles, ...currentArticles]
  .removeDuplicates()
  .slice(0, 50); // Keep 50 most recent

// 4. Save and push to GitHub
await saveArticles(merged); // Now 33 articles
await commitAndPush();
```

### **GitHub Raw URL:**
```
https://raw.githubusercontent.com/johnrochie/trend-pulse/main/automation-output.json
```

## 🔧 Configuration

### **Environment Variables (.env):**
```bash
# GitHub Integration
GITHUB_REPO_PATH=/home/jr/.openclaw/workspace/digital-growth-insider
GIT_USER=johnrochie
GIT_EMAIL=john.roche@ictservices.ie

# Automation
NEWSAPI_KEY=your_key
DEEPSEEK_API_KEY=your_key
MAX_ARTICLES_PER_CYCLE=5
FETCH_INTERVAL_HOURS=6
```

### **Cron Job (Production):**
```bash
# Every 6 hours
0 */6 * * * cd /home/jr/.openclaw/workspace/trend-pulse-automation && node index.js full >> automation.log 2>&1
```

## 🎯 Benefits of This System

### **For Vercel Deployment:**
✅ **Always fresh content** - Updated every 6 hours  
✅ **No local file access** - Uses GitHub raw URLs  
✅ **Fast loading** - GitHub CDN + Next.js optimization  
✅ **Reliable** - Multiple fallback sources  

### **For Article Management:**
✅ **New articles added** - Site stays current  
✅ **Existing articles preserved** - No content loss  
✅ **Duplicate prevention** - Clean, unique content  
✅ **Automatic rotation** - Old articles removed after 50  

### **For Performance:**
✅ **Limited to 50 articles** - Fast API responses  
✅ **CDN cached** - GitHub raw URLs are cached  
✅ **Optimized images** - Next.js Image component  
✅ **Efficient merging** - Smart duplicate detection  

## 📈 Article Count Examples

### **Initial State:**
- GitHub: 14 articles
- Automation: 14 articles (same)
- Result: 14 articles (no duplicates)

### **After First Update (5 new articles):**
- GitHub: 14 articles
- Automation: 5 new articles
- Result: 19 articles (14 + 5 new)

### **After Multiple Updates:**
- Day 1: 20 articles
- Day 2: 35 articles  
- Day 3: 50 articles (max reached)
- Day 4: 50 articles (oldest 5 removed, 5 new added)

### **Maximum Capacity:**
- **Always 50 articles** (optimal for performance)
- **Newest first** (most relevant content)
- **Oldest removed** (automatic cleanup)

## 🛠️ Manual Operations

### **Run Full Automation:**
```bash
cd trend-pulse-automation
node index.js full
```

### **Update GitHub Only:**
```bash
cd trend-pulse-automation
node index.js github
```

### **Check Database Stats:**
```bash
cd trend-pulse-automation
node index.js stats
```

### **Test GitHub URL:**
```bash
curl https://raw.githubusercontent.com/johnrochie/trend-pulse/main/automation-output.json | jq '.articles | length'
```

## 🔍 Troubleshooting

### **No Articles on Vercel:**
1. Check GitHub URL is accessible
2. Verify automation ran successfully
3. Check `automation.log` for errors
4. Test API endpoint: `/api/articles?limit=3`

### **Duplicate Articles:**
1. Check article IDs are unique
2. Verify duplicate detection is working
3. Check database for duplicate `source_id`

### **GitHub Push Fails:**
1. Check git credentials in `.env`
2. Verify repository has write access
3. Check internet connectivity
4. Look for git errors in logs

## 🎉 Success Metrics

### **Automation Health:**
- ✅ **Articles fetched** (5 per cycle)
- ✅ **AI content generated** (5 per cycle)  
- ✅ **GitHub updated** (every 6 hours)
- ✅ **Vercel shows content** (immediately)

### **Content Quality:**
- ✅ **No duplicates** (unique articles only)
- ✅ **Fresh content** (updated every 6 hours)
- ✅ **Category balance** (tech, business, entertainment)
- ✅ **SEO optimized** (meta descriptions, titles)

### **Performance:**
- ✅ **Fast loading** (< 2 seconds)
- ✅ **Mobile responsive** (all devices)
- ✅ **No errors** (clean console)
- ✅ **High availability** (multiple fallbacks)

## 📅 Maintenance Schedule

### **Daily:**
- Check automation logs
- Verify GitHub updates
- Test Vercel deployment

### **Weekly:**
- Review article quality
- Check database size
- Verify API performance

### **Monthly:**
- Update dependencies
- Review SEO performance
- Analyze traffic patterns

## 🚀 Ready for Production

The system is now **100% production-ready** with:

1. **✅ Full automation** - Runs every 6 hours
2. **✅ GitHub integration** - Updates Vercel deployment
3. **✅ Article preservation** - Existing content kept
4. **✅ Performance optimized** - 50 article limit
5. **✅ Fallback system** - Mock data if all else fails

**Next:** Monitor automation, track AdSense approval, and begin promotion!