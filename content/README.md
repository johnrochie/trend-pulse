# Content Management System (CMS)

This is a simple, file-based CMS for Trend Pulse. All content is stored as Markdown files with frontmatter.

## Structure

```
content/
├── config/
│   └── site.json          # Site configuration (title, contact info, stats)
├── pages/
│   ├── about.md           # About page
│   ├── contact.md         # Contact page
│   ├── privacy.md         # Privacy Policy
│   └── terms.md           # Terms of Service
└── README.md              # This file
```

## File Format

Each Markdown file uses frontmatter (YAML at the top) for metadata:

```markdown
---
title: "Page Title"
description: "Page description for SEO"
slug: "page-slug"
order: 1
---

# Page Content

Your Markdown content here...
```

## Available Pages

### 1. Static Pages
- **About** (`/about`) - Company information and mission
- **Contact** (`/contact`) - Contact information and forms
- **Privacy** (`/privacy`) - Privacy policy
- **Terms** (`/terms`) - Terms of service

### 2. Configuration
- **Site Config** (`config/site.json`) - Global site settings

## How to Edit

### Option 1: Direct File Editing
Simply edit the Markdown files in `content/pages/`:
```bash
nano content/pages/about.md
```

### Option 2: API Access
Pages are available via API:
```
GET /api/pages?list=true          # List all pages (metadata only)
GET /api/pages?slug=about         # Get specific page with content
GET /api/pages                    # Get all pages with content
```

### Option 3: Manual Article Management
For manual article editing, edit the automation output:
```bash
# View current articles
cat ~/.openclaw/workspace/trend-pulse-automation/output/articles.json | jq '.articles[0:3]'

# Edit an article
nano ~/.openclaw/workspace/trend-pulse-automation/output/articles.json
```

## Adding New Pages

1. Create a new Markdown file in `content/pages/`:
```bash
cp content/pages/about.md content/pages/new-page.md
```

2. Edit the frontmatter and content:
```markdown
---
title: "New Page"
description: "New page description"
slug: "new-page"
order: 5
---

# New Page Content
```

3. The page will be automatically available at `/new-page`

## Site Configuration

Edit `config/site.json` to update:
- Site title and description
- Contact information
- Social media links
- Statistics and metrics
- Newsletter settings
- Automation schedule

## Automation Integration

The main news content is managed by the automation system:
- Location: `~/workspace/trend-pulse-automation/`
- Schedule: Every 6 hours
- Output: `output/articles.json`

To manually trigger content generation:
```bash
cd ~/.openclaw/workspace/trend-pulse-automation
node index.js full
```

## Best Practices

1. **Keep it Simple**: This is a lightweight CMS for static content
2. **Markdown First**: Use Markdown for formatting
3. **Frontmatter Required**: Every page needs title, description, slug
4. **Order Matters**: Use `order` field to control navigation sequence
5. **Regular Backups**: Backup the `content/` directory regularly

## Future Enhancements

Planned CMS features:
- [ ] Web-based editor interface
- [ ] Image upload and management
- [ ] Version history for pages
- [ ] Draft/publish workflow
- [ ] User permissions
- [ ] SEO optimization tools

## Troubleshooting

### Page Not Showing
- Check the slug matches the URL
- Verify the file has proper frontmatter
- Restart the Next.js dev server

### API Not Working
- Check if server is running on port 4002
- Verify `gray-matter` package is installed
- Check file permissions in `content/` directory

### Content Not Updating
- Clear Next.js cache: `rm -rf .next`
- Restart dev server
- Check for syntax errors in Markdown

---

**Note:** This is a minimal CMS designed for simplicity and speed. For more complex needs, consider integrating a headless CMS like Sanity, Contentful, or Strapi.