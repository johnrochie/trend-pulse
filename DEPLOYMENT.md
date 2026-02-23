# Deployment Guide for Trend Pulse

This guide covers deploying the Trend Pulse news website to production.

## 🎯 Deployment Options

### Option 1: Vercel (Recommended)
**Best for:** Easy deployment, automatic SSL, CDN, serverless functions
**Cost:** Free tier available, scales with usage

### Option 2: Railway / Render
**Best for:** Full-stack with automation on same platform
**Cost:** Starts free, pay as you grow

### Option 3: Self-hosted (VPS)
**Best for:** Full control, lowest long-term cost
**Cost:** $5-20/month (DigitalOcean, Linode, AWS Lightsail)

## 🚀 Vercel Deployment (Recommended)

### Step 1: Prepare Repository
```bash
# Ensure all code is committed
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project settings

### Step 3: Environment Variables
Set these in Vercel dashboard (Settings → Environment Variables):

```bash
# Required
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Trend Pulse
NEXT_PUBLIC_SITE_DESCRIPTION=Real-time news and analysis
NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api

# Automation Integration (if automation runs separately)
AUTOMATION_ARTICLES_PATH=/path/to/automation/output/articles.json
AUTOMATION_API_PATH=/path/to/automation/output/api/articles.json

# Optional
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NODE_ENV=production
```

### Step 4: Deploy
1. Vercel will auto-deploy from GitHub
2. First build may take 2-3 minutes
3. Get your deployment URL (e.g., `https://trend-pulse.vercel.app`)

### Step 5: Custom Domain
1. In Vercel dashboard: Settings → Domains
2. Add your domain (e.g., `trendpulse.ai`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## 🖥️ Self-Hosted Deployment (VPS)

### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Clone repository
git clone https://github.com/yourusername/trend-pulse.git
cd trend-pulse
npm install
npm run build
```

### Step 2: Environment Setup
```bash
# Create environment file
cp .env.example .env.production
nano .env.production

# Set production values
NEXT_PUBLIC_SITE_URL=https://trendpulse.ai
NEXT_PUBLIC_API_BASE_URL=https://trendpulse.ai/api
NODE_ENV=production
# ... other variables
```

### Step 3: PM2 Configuration
```bash
# Start with PM2
pm2 start npm --name "trend-pulse" -- start

# Save PM2 process list
pm2 save

# Set PM2 to start on boot
pm2 startup
# Run the command provided by PM2
```

### Step 4: Nginx Configuration
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/trendpulse
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name trendpulse.ai www.trendpulse.ai;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/trendpulse /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d trendpulse.ai -d www.trendpulse.ai

# Auto-renewal is set up automatically
```

## 🤖 Automation Server Setup

### Option A: Same Server as Website
```bash
# Clone automation repository
cd /opt
git clone https://github.com/yourusername/trend-pulse-automation.git
cd trend-pulse-automation

# Install dependencies
npm install

# Configure environment
cp .env.example .env
nano .env  # Add NewsAPI and DeepSeek keys

# Test manual run
node index.js full

# Set up cron job
crontab -e
# Add: 0 */6 * * * cd /opt/trend-pulse-automation && node index.js full >> /var/log/trend-pulse-automation.log 2>&1

# Ensure website can read output
# Either: Symlink output to website directory
# Or: Update AUTOMATION_ARTICLES_PATH in website .env
```

### Option B: Separate Automation Server
1. Set up automation on separate server
2. Use SSH/rsync to copy output files to web server
3. Or use shared storage (NFS, S3, etc.)
4. Update website environment variables to point to shared location

## 🔧 Post-Deployment Checklist

### 1. Verify Website
- [ ] Homepage loads correctly
- [ ] Articles display (check API)
- [ ] Static pages work (About, Contact, etc.)
- [ ] Mobile responsive
- [ ] SSL certificate valid

### 2. Verify Automation
- [ ] Manual automation run works
- [ ] Articles appear on website
- [ ] Cron job scheduled
- [ ] Logs being written

### 3. Security Checks
- [ ] Environment variables not in code
- [ ] API keys secured
- [ ] SSL working
- [ ] No exposed admin interfaces
- [ ] Regular updates scheduled

### 4. Performance
- [ ] Page load < 3 seconds
- [ ] Images optimized
- [ ] CDN configured (if using)
- [ ] Caching enabled

## 📊 Monitoring & Maintenance

### Logs
```bash
# Website logs
pm2 logs trend-pulse

# Automation logs
tail -f /var/log/trend-pulse-automation.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Updates
```bash
# Update website
cd /path/to/trend-pulse
git pull
npm install
npm run build
pm2 restart trend-pulse

# Update automation
cd /path/to/trend-pulse-automation
git pull
npm install
# Restart not needed for cron jobs
```

### Backups
```bash
# Backup database (automation)
cp /path/to/trend-pulse-automation/articles.db /backup/articles-$(date +%Y%m%d).db

# Backup content
tar -czf /backup/trend-pulse-content-$(date +%Y%m%d).tar.gz /path/to/trend-pulse/content/

# Backup environment files
cp /path/to/trend-pulse/.env.production /backup/
cp /path/to/trend-pulse-automation/.env /backup/
```

## 🚨 Troubleshooting

### Website Won't Start
```bash
# Check logs
pm2 logs trend-pulse --lines 100

# Check port
sudo netstat -tlnp | grep :3000

# Check Node.js version
node --version

# Rebuild
npm run build
```

### Articles Not Showing
```bash
# Check API endpoint
curl https://your-domain.com/api/articles

# Check automation output
ls -la /path/to/automation/output/

# Check file permissions
ls -la /path/to/automation/output/articles.json

# Test automation manually
cd /path/to/trend-pulse-automation
node index.js full
```

### SSL Issues
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check Nginx config
sudo nginx -t
```

## 📈 Scaling Considerations

### Traffic Growth
- **< 10K visitors/day:** Current setup fine
- **10-100K visitors/day:** Consider Vercel Pro or larger VPS
- **> 100K visitors/day:** Load balancer, CDN, database optimization

### Content Growth
- **Current:** 5 articles/6 hours = 20/day
- **Scale up:** Increase automation frequency (requires NewsAPI paid tier)
- **Scale out:** Add more news categories

### Cost Optimization
- **Vercel:** Monitor bandwidth usage
- **Self-hosted:** Optimize server size
- **Automation:** Use free tiers where possible
- **CDN:** Cloudflare free tier

## 🔄 Continuous Deployment

### GitHub Actions (Example)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Automation Updates
Consider setting up automation to:
1. Auto-deploy website when automation updates
2. Send notifications on automation failures
3. Monitor article generation success rate

## 🎯 Final Steps

1. **Set up analytics** (Google Analytics, Plausible, etc.)
2. **Configure SEO** (sitemap, meta tags verification)
3. **Submit to search engines** (Google Search Console, Bing Webmaster)
4. **Set up monitoring** (UptimeRobot, Pingdom)
5. **Create social media accounts** (Twitter, LinkedIn, etc.)
6. **Plan content promotion** (SEO, social media, newsletters)

## 📞 Support

- **Documentation:** [README.md](./README.md)
- **Issues:** GitHub repository issues
- **Email:** hello@trendpulse.ai

---

**Deployment Status:** Ready 🚀
**Estimated Time:** 30-60 minutes for initial setup
**Difficulty:** Beginner to Intermediate