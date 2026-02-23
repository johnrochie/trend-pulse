# Trend Pulse - Real-Time News & Analysis Platform

A fully automated news website that generates and publishes articles using AI. Features a clean, professional design with real-time news updates every 6 hours.

## 🚀 Live Demo

- **Website:** [https://trendpulse.ai](https://trendpulse.ai) (Coming soon)
- **Local Development:** http://localhost:4002

## ✨ Features

### 🤖 Automated News Generation
- **Real-time news fetching** from NewsAPI (tech, business, entertainment)
- **AI-powered article writing** using DeepSeek AI
- **Automatic publishing** every 6 hours
- **Duplicate prevention** with SQLite tracking

### 🎨 Professional Design
- **Clean, minimalist aesthetic**
- **Mobile-responsive** layout
- **Dark mode** with gradient accents
- **Smooth animations** with Framer Motion

### 📱 Complete Website
- **Homepage** with trending articles grid
- **Individual article pages** with full content
- **Static pages** (About, Contact, Privacy, Terms)
- **Newsletter signup** integration
- **Category filtering** (Tech, Business, Finance, Lifestyle, Entertainment)

### 🛠️ Content Management
- **File-based micro-CMS** for static pages
- **API endpoints** for content delivery
- **CLI management tools** for content editing
- **Environment-based configuration**

## 🏗️ Architecture

```
trend-pulse/
├── frontend/                    # Next.js website
│   ├── app/                    # Next.js 13+ app router
│   ├── components/             # React components
│   ├── content/               # File-based CMS (Markdown)
│   ├── lib/                   # Utilities and config
│   └── scripts/               # Content management tools
└── automation/                 # News automation system
    ├── index.js               # Main automation script
    ├── output/                # Generated articles
    └── articles.db            # SQLite tracking database
```

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ and npm
- NewsAPI.org API key (free tier)
- DeepSeek API key (for AI content)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/trend-pulse.git
cd trend-pulse

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Development
```bash
# Start development server
npm run dev

# Open http://localhost:4002
```

### 4. Content Management
```bash
# List all pages
./scripts/manage-content.sh list

# Create new page
./scripts/manage-content.sh create faq

# Edit page
./scripts/manage-content.sh edit about

# Check status
./scripts/manage-content.sh status
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` based on `.env.example`:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:4002
NEXT_PUBLIC_SITE_NAME=Trend Pulse
NEXT_PUBLIC_SITE_DESCRIPTION=Real-time news and analysis

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:4002/api

# Automation Paths
AUTOMATION_ARTICLES_PATH=/path/to/automation/output/articles.json
AUTOMATION_API_PATH=/path/to/automation/output/api/articles.json

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Automation Setup
The automation system runs separately:
```bash
cd ~/trend-pulse-automation
npm install
cp .env.example .env
# Add NewsAPI and DeepSeek keys
node index.js full  # Test manual run
```

Set up cron job for automatic runs:
```bash
0 */6 * * * cd /path/to/trend-pulse-automation && node index.js full >> automation.log 2>&1
```

## 📁 Project Structure

### Frontend (`/`)
- `app/` - Next.js app router pages and API routes
- `components/` - Reusable React components
- `content/` - File-based CMS (Markdown pages)
- `lib/` - Utilities, configuration, API clients
- `scripts/` - Content management CLI tools
- `public/` - Static assets (images, favicons)

### Key Files
- `app/layout.tsx` - Root layout with metadata
- `app/page.tsx` - Homepage with trending articles
- `app/article/[slug]/page.tsx` - Dynamic article pages
- `app/api/articles/route.ts` - Articles API endpoint
- `app/api/pages/route.ts` - Pages API endpoint
- `lib/config.ts` - Configuration management
- `lib/api.ts` - API client utilities

## 🎨 Design System

### Colors
- **Primary:** Blue gradient (`#2563eb` to `#7c3aed`)
- **Background:** Dark gray (`#111827`)
- **Text:** Light gray (`#f3f4f6`)
- **Accents:** Teal, Purple, Pink gradients

### Typography
- **Headings:** Space Grotesk (bold, modern)
- **Body:** Inter (clean, readable)
- **Sizes:** Responsive scaling (mobile → desktop)

### Components
- `Navbar` - Sticky navigation with categories
- `Hero` - Main headline with stats
- `TrendingArticles` - 3-column article grid
- `FeaturesSection` - How it works explanation
- `NewsletterSignup` - Email subscription
- `Footer` - Site links and information
- `PageTemplate` - Reusable page layout
- `MarkdownRenderer` - Markdown content display

## 🔌 API Endpoints

### Articles API
```
GET /api/articles
GET /api/articles?slug=article-slug
GET /api/articles?category=tech
GET /api/articles?limit=10
```

### Pages API
```
GET /api/pages
GET /api/pages?slug=about
GET /api/pages?list=true
```

## 📊 Automation System

The separate automation system:
1. **Fetches news** from NewsAPI every 6 hours
2. **Generates articles** using DeepSeek AI
3. **Saves to JSON** files in `output/` directory
4. **Tracks processed articles** in SQLite database
5. **Website reads** from generated JSON files

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Connect GitHub repository
# Set environment variables in Vercel dashboard
# Deploy automatically on push
```

### Environment Variables for Production
```bash
NEXT_PUBLIC_SITE_URL=https://trendpulse.ai
NEXT_PUBLIC_API_BASE_URL=https://trendpulse.ai/api
AUTOMATION_ARTICLES_PATH=/var/www/automation/output/articles.json
# ... other production values
```

### Automation Server
Set up on separate server or same server:
```bash
# Install Node.js and dependencies
# Set up cron job for 6-hour runs
# Configure file sharing between automation and web server
```

## 📈 Monetization Ready

### AdSense Optimized
- **Clean content** (no affiliate links)
- **Professional design** (high approval chance)
- **Regular updates** (fresh content daily)
- **Mobile-friendly** (responsive design)

### Revenue Potential
- **AdSense RPM:** $5-15 (news content)
- **Monthly Traffic:** 50K visitors = $250-750
- **Scalability:** 600+ articles/month capacity

## 🔒 Security

### Protected Information
- API keys in `.env.local` (gitignored)
- No hardcoded credentials
- Environment-based configuration
- Secure API endpoints

### Best Practices
- Regular dependency updates
- Environment variable validation
- API rate limiting (if needed)
- Content sanitization

## 🛠️ Development

### Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # Code linting
```

### Adding New Features
1. Create component in `components/`
2. Add page in `app/` (if needed)
3. Update API in `app/api/` (if needed)
4. Test locally
5. Commit and push

### Content Updates
- Edit Markdown files in `content/pages/`
- Use `./scripts/manage-content.sh`
- Pages auto-update via API

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/trend-pulse/issues)
- **Email:** hello@trendpulse.ai
- **Documentation:** [CMS-STRATEGY.md](./CMS-STRATEGY.md)

## 🎯 Roadmap

### Phase 1 (Current) ✅
- [x] Automated news generation
- [x] Professional website design
- [x] File-based CMS
- [x] Deployment ready

### Phase 2 (Next 3 months)
- [ ] Social media auto-posting
- [ ] Email newsletter automation
- [ ] Advanced analytics dashboard
- [ ] User accounts (optional)

### Phase 3 (6+ months)
- [ ] Multiple language support
- [ ] Video content generation
- [ ] Mobile app
- [ ] Premium subscription tier

---

**Built with:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, NewsAPI, DeepSeek AI

**Status:** Production Ready 🚀