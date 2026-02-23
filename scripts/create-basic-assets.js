// Create basic brand assets without external dependencies
const fs = require('fs');
const path = require('path');

console.log('🎨 Creating basic brand assets for Trend Pulse...');

// Create directories
const brandDir = path.join(__dirname, '..', 'public', 'brand');
const faviconsDir = path.join(__dirname, '..', 'public', 'favicons');

if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });
if (!fs.existsSync(faviconsDir)) fs.mkdirSync(faviconsDir, { recursive: true });

// Create basic manifest files
console.log('📝 Creating manifest files...');

// site.webmanifest
const manifest = {
  name: 'Trend Pulse',
  short_name: 'TrendPulse',
  description: 'Real-time news and analysis',
  start_url: '/',
  display: 'standalone',
  background_color: '#0f172a',
  theme_color: '#3B82F6',
  icons: [
    {
      src: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png'
    },
    {
      src: '/favicon-192x192.png',
      sizes: '192x192',
      type: 'image/png'
    },
    {
      src: '/favicon-512x512.png',
      sizes: '512x512',
      type: 'image/png'
    }
  ]
};

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'site.webmanifest'),
  JSON.stringify(manifest, null, 2)
);

// browserconfig.xml
const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/mstile-70x70.png"/>
      <square150x150logo src="/mstile-150x150.png"/>
      <square310x310logo src="/mstile-310x310.png"/>
      <wide310x150logo src="/mstile-310x150.png"/>
      <TileColor>#3B82F6</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'browserconfig.xml'),
  browserconfig
);

// Create a simple README for brand assets
const brandReadme = `# Brand Assets

This directory contains branding assets for Trend Pulse.

## Logo
- \`logo.svg\` - Animated SVG logo with gradient and pulse effects
- \`logo-simple.svg\` - Simplified version for favicons and social media

## Social Media Images
To generate proper social media images (1200x630 for Open Graph, 1200x600 for Twitter),
you'll need to create them manually or use a design tool.

Recommended tools:
1. **Figma** - Free design tool
2. **Canva** - Easy social media templates
3. **Adobe Express** - Free social media image creator

## Required Social Images:
1. \`og-image.jpg\` - 1200x630 pixels (Facebook, LinkedIn, etc.)
2. \`twitter-image.jpg\` - 1200x600 pixels (Twitter Cards)

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
Run: \`sudo apt install imagemagick inkscape\` then \`./scripts/generate-brand-assets.sh\`
`;

fs.writeFileSync(
  path.join(brandDir, 'README.md'),
  brandReadme
);

// Copy the simple logo as a basic favicon
const simpleSvg = fs.readFileSync(
  path.join(__dirname, '..', 'public', 'logo-simple.svg'),
  'utf8'
);

// Create a note about image generation
const imageNote = `# Image Generation Required

For production deployment, you need to create:

## 1. Social Media Images
- \`public/og-image.jpg\` (1200x630) - Open Graph/Facebook/LinkedIn
- \`public/twitter-image.jpg\` (1200x600) - Twitter Cards

## 2. Favicon Set
Generate at: https://realfavicongenerator.net/
Upload: public/logo-simple.svg

## 3. Apple Touch Icons
- \`public/apple-touch-icon.png\` (180x180)
- Various sizes for different devices

## Quick Solution:
1. Go to https://realfavicongenerator.net/
2. Upload public/logo-simple.svg
3. Download the package
4. Extract to public/ directory
5. Update manifest files if needed

## Manual Creation:
Use any design tool (Figma, Canva, Photoshop) to create:
- 1200x630 image with "Trend Pulse - Real-Time News & Analysis"
- 1200x600 version for Twitter
- Save as high-quality JPG in public/ directory
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'public', 'IMAGE-GENERATION.md'),
  imageNote
);

console.log('✅ Basic brand assets created!');
console.log('');
console.log('📁 Created files:');
console.log('  - public/site.webmanifest (PWA manifest)');
console.log('  - public/browserconfig.xml (Microsoft tiles)');
console.log('  - public/brand/README.md (brand guidelines)');
console.log('  - public/IMAGE-GENERATION.md (next steps)');
console.log('');
console.log('🚀 Next steps for production:');
console.log('  1. Create social media images (og-image.jpg, twitter-image.jpg)');
console.log('  2. Generate favicon set at: https://realfavicongenerator.net/');
console.log('  3. Update layout.tsx with correct image paths');
console.log('');
console.log('💡 Quick fix: Use the SVG logos directly for now, generate images before final deployment.');