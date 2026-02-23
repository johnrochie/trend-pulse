# Domain Setup Guide: trendpulse.life

## 🎯 Overview

Setting up your custom domain `trendpulse.life` for Trend Pulse. This guide covers everything from DNS configuration to Vercel setup.

## 🚀 Quick Setup Steps

### **1. Vercel Configuration (5 minutes)**
### **2. DNS Configuration (5-10 minutes)**
### **3. Code Updates (Already Done)**
### **4. Verification & Testing (5 minutes)**

## 📋 Prerequisites

- **Domain:** `trendpulse.life` (purchased and accessible)
- **Vercel Account:** With Trend Pulse project deployed
- **DNS Access:** To your domain registrar

## 🔧 Step 1: Vercel Domain Configuration

### **A. Add Domain to Vercel:**

1. **Go to Vercel Dashboard:**
   - Navigate to: `https://vercel.com/your-username/trend-pulse`
   - Click on **"Settings"** tab
   - Select **"Domains"** from left sidebar

2. **Add Domain:**
   - Click **"Add"** button
   - Enter: `trendpulse.life`
   - Click **"Add"**

3. **Configure Domain:**
   - **Production:** Set as production domain
   - **Redirect:** Enable redirect from `trend-pulse.vercel.app`
   - **SSL:** Enable automatic SSL certificate

### **B. Verify Domain Ownership:**

Vercel will provide **DNS records** to add:
- **Option A:** Nameservers (recommended)
- **Option B:** CNAME/A records

**Recommended:** Use Vercel nameservers for easiest setup.

## 🌐 Step 2: DNS Configuration

### **Option A: Nameservers (Easiest)**

1. **Go to your domain registrar** (GoDaddy, Namecheap, etc.)
2. **Find DNS/Nameserver settings**
3. **Replace existing nameservers** with Vercel's:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
4. **Save changes**
5. **Wait 24-48 hours** for propagation

### **Option B: CNAME Records (Alternative)**

If you can't change nameservers, add these records:

1. **Add CNAME record:**
   - **Type:** CNAME
   - **Name/Host:** `@` or leave blank (root domain)
   - **Value/Target:** `cname.vercel-dns.com`
   - **TTL:** 3600 (or default)

2. **Add WWW record (optional):**
   - **Type:** CNAME
   - **Name/Host:** `www`
   - **Value/Target:** `cname.vercel-dns.com`
   - **TTL:** 3600

### **DNS Propagation:**
- **Typically:** 1-2 hours
- **Maximum:** 24-48 hours
- **Check:** Use `dig trendpulse.life` or online DNS checker

## 💻 Step 3: Code Updates (Already Done)

### **✅ Already Updated:**

#### **1. Configuration (`lib/config.ts`):**
```typescript
site: {
  url: 'https://trendpulse.life',
},
api: {
  baseUrl: 'https://trendpulse.life/api',
}
```

#### **2. Environment Template (`.env.example`):**
```bash
NEXT_PUBLIC_SITE_URL=https://trendpulse.life
```

#### **3. Articles API (`lib/articles-api.ts`):**
- Updated all canonical URLs to `trendpulse.life`
- Updated SEO metadata

#### **4. SEO & Metadata:**
- Sitemap will use new domain
- Robots.txt updated
- Open Graph tags updated

### **What Automatically Updates:**
- ✅ **Sitemap:** `app/sitemap.ts`
- ✅ **Robots.txt:** `app/robots.ts`
- ✅ **Canonical URLs:** All pages
- ✅ **Open Graph tags:** Social media sharing
- ✅ **Twitter cards:** Twitter sharing

## 🧪 Step 4: Testing & Verification

### **A. DNS Propagation Check:**
```bash
# Terminal check
dig trendpulse.life
nslookup trendpulse.life

# Online tools:
# - https://dnschecker.org
# - https://whatsmydns.net
```

### **B. Website Access Test:**
1. **Visit:** `https://trendpulse.life`
2. **Check SSL:** Padlock icon in browser
3. **Test pages:**
   - Homepage: `https://trendpulse.life`
   - Analytics: `https://trendpulse.life/analytics`
   - Article: `https://trendpulse.life/article/[slug]`

### **C. Redirect Test:**
- **Old URL:** `https://trend-pulse.vercel.app`
- **Should redirect to:** `https://trendpulse.life`

### **D. API Test:**
```bash
# Test API endpoint
curl https://trendpulse.life/api/articles?limit=1
```

## 🔍 Step 5: SEO & Search Engine Updates

### **A. Google Search Console:**
1. **Add property:** `https://trendpulse.life`
2. **Verify ownership:** Via DNS record or HTML file
3. **Submit sitemap:** `https://trendpulse.life/sitemap.xml`
4. **Request indexing:** Important pages

### **B. Bing Webmaster Tools:**
1. **Add site:** `https://trendpulse.life`
2. **Submit sitemap**
3. **Verify ownership**

### **C. Update Social Media:**
1. **Twitter:** Update card previews
2. **Facebook:** Update Open Graph tags
3. **LinkedIn:** Update shared links

## 🎯 Step 6: Analytics Updates

### **A. Google Analytics 4:**
1. **Update property settings:**
   - Default URL: `https://trendpulse.life`
   - Referral exclusion: Add old domain
2. **Update data streams** if needed

### **B. Vercel Analytics:**
- **Automatic:** No changes needed
- **Will track:** New domain automatically

### **C. Custom Analytics Dashboard:**
- **URL:** `https://trendpulse.life/analytics`
- **Already updated:** Uses config-based URLs

## 📧 Step 7: Email & Newsletter

### **If using newsletter service:**
1. **Update confirmation emails** with new domain
2. **Update unsubscribe links**
3. **Update tracking pixels**

### **Custom email addresses:**
- **Consider:** `contact@trendpulse.life`
- **Setup:** Through your domain registrar or email service

## 🔒 Step 8: Security & SSL

### **Vercel Automatic SSL:**
- ✅ **Free SSL:** Provided by Vercel
- ✅ **Auto-renewal:** Automatic
- ✅ **HTTPS enforcement:** Automatic

### **Check SSL:**
```bash
# Check SSL certificate
openssl s_client -connect trendpulse.life:443 -servername trendpulse.life
```

## 🚨 Troubleshooting

### **Issue: DNS Not Propagating**
**Solution:**
1. Wait 24-48 hours
2. Clear DNS cache: `sudo dscacheutil -flushcache` (Mac)
3. Try different DNS: `1.1.1.1` (Cloudflare) or `8.8.8.8` (Google)

### **Issue: SSL Certificate Error**
**Solution:**
1. Check Vercel domain settings
2. Ensure DNS is correctly pointed
3. Wait for SSL provisioning (up to 24 hours)

### **Issue: Mixed Content Warnings**
**Solution:**
1. Ensure all assets use `https://`
2. Update any hardcoded `http://` URLs
3. Check browser console for warnings

### **Issue: Redirect Loop**
**Solution:**
1. Check Vercel redirect settings
2. Clear browser cache
3. Test in incognito mode

## 📊 Monitoring After Setup

### **Day 1:**
- ✅ DNS propagation complete
- ✅ SSL certificate active
- ✅ Website accessible
- ✅ Redirects working

### **Week 1:**
- ✅ Analytics tracking new domain
- ✅ Search engines notified
- ✅ Social media links updated
- ✅ Email deliverability verified

### **Month 1:**
- ✅ SEO rankings stabilizing
- ✅ Traffic migrating to new domain
- ✅ User experience confirmed
- ✅ Performance optimized

## 🎉 Success Checklist

### **Immediate (Day 1):**
- [ ] Domain added to Vercel
- [ ] DNS configured correctly
- [ ] Website accessible via `https://trendpulse.life`
- [ ] SSL certificate active
- [ ] Redirect from old domain working

### **Short-term (Week 1):**
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] Analytics tracking new domain
- [ ] Social media links updated
- [ ] Email setup complete (if needed)

### **Long-term (Month 1):**
- [ ] SEO rankings recovered/improved
- [ ] Traffic fully migrated
- [ ] User feedback positive
- [ ] Performance metrics good

## 📚 Additional Resources

### **Vercel Documentation:**
- [Custom Domains](https://vercel.com/docs/projects/domains)
- [DNS Configuration](https://vercel.com/docs/projects/domains#dns-configuration)
- [Troubleshooting](https://vercel.com/docs/projects/domains/troubleshooting)

### **DNS Tools:**
- [DNS Checker](https://dnschecker.org)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)
- [Website Speed Test](https://pagespeed.web.dev/)

### **SEO Tools:**
- [Google Search Console](https://search.google.com/search-console)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [Screaming Frog SEO Spider](https://www.screamingfrog.co.uk/seo-spider/)

## 🚀 Ready to Launch!

### **Next Actions:**

1. **Add domain to Vercel** (5 minutes)
2. **Configure DNS** (5-10 minutes)
3. **Wait for propagation** (1-48 hours)
4. **Test everything** (15 minutes)
5. **Update analytics/search consoles** (30 minutes)

### **Estimated Timeline:**
- **Immediate:** Website accessible within hours
- **24 hours:** Full DNS propagation
- **48 hours:** Search engines starting to index
- **1 week:** Full migration complete

### **Final URL:**
**🌐 Production Site:** `https://trendpulse.life`
**📊 Analytics:** `https://trendpulse.life/analytics`
**🗺️ Sitemap:** `https://trendpulse.life/sitemap.xml`

**Your professional news site is ready for its custom domain!** 🎯