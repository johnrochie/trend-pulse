# Brand Assets

This directory contains branding assets for Trend Pulse.

## Logo
- `logo.svg` - Animated SVG logo with gradient and pulse effects
- `logo-simple.svg` - Simplified version for favicons and social media

## Social Media Images
To generate proper social media images (1200x630 for Open Graph, 1200x600 for Twitter),
you'll need to create them manually or use a design tool.

Recommended tools:
1. **Figma** - Free design tool
2. **Canva** - Easy social media templates
3. **Adobe Express** - Free social media image creator

## Required Social Images:
1. `og-image.jpg` - 1200x630 pixels (Facebook, LinkedIn, etc.)
2. `twitter-image.jpg` - 1200x600 pixels (Twitter Cards)

## Favicons
Basic favicons are included. For production, generate a complete set using:
- https://realfavicongenerator.net/
- https://favicon.io/

## Colors
- Primary Gradient: #3B82F6 (blue) to #8B5CF6 (purple)
- Background: #0f172a (dark blue-gray)
- Text: #f3f4f6 (light gray)

## Fonts
- Headings: Space Grotesk (Google Fonts)
- Body: Inter (Google Fonts)

## Next Steps for Production:
1. Create high-quality social media images
2. Generate complete favicon set
3. Add Apple touch icons
4. Create email newsletter template
5. Design social media banner images

Note: The automated asset generation script requires ImageMagick and Inkscape.
Run: `sudo apt install imagemagick inkscape` then `./scripts/generate-brand-assets.sh`
