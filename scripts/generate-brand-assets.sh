#!/bin/bash

# Generate Brand Assets for Trend Pulse
# Creates favicons, social media images, and branding assets

set -e

echo "🎨 Generating Trend Pulse Brand Assets..."

# Create output directories
mkdir -p public/brand
mkdir -p public/favicons

# Check if required tools are installed
command -v convert >/dev/null 2>&1 || { echo "ImageMagick is required. Install with: sudo apt install imagemagick"; exit 1; }
command -v inkscape >/dev/null 2>&1 || { echo "Inkscape is recommended for SVG conversion. Install with: sudo apt install inkscape"; exit 1; }

# Convert SVG logo to PNG for various sizes
echo "📐 Converting logo to various sizes..."

# Create PNG from SVG (using Inkscape for better quality)
if command -v inkscape >/dev/null 2>&1; then
  # Using Inkscape for high-quality conversion
  inkscape -w 512 -h 512 public/logo-simple.svg -o public/brand/logo-512x512.png
  inkscape -w 1024 -h 1024 public/logo-simple.svg -o public/brand/logo-1024x1024.png
  inkscape -w 192 -h 192 public/logo-simple.svg -o public/brand/logo-192x192.png
else
  # Fallback to ImageMagick
  convert -background none -resize 512x512 public/logo-simple.svg public/brand/logo-512x512.png
  convert -background none -resize 1024x1024 public/logo-simple.svg public/brand/logo-1024x1024.png
  convert -background none -resize 192x192 public/logo-simple.svg public/brand/logo-192x192.png
fi

# Generate favicons
echo "🎯 Generating favicons..."
convert public/brand/logo-512x512.png -resize 16x16 public/favicons/favicon-16x16.png
convert public/brand/logo-512x512.png -resize 32x32 public/favicons/favicon-32x32.png
convert public/brand/logo-512x512.png -resize 48x48 public/favicons/favicon-48x48.png
convert public/brand/logo-512x512.png -resize 64x64 public/favicons/favicon-64x64.png
convert public/brand/logo-512x512.png -resize 128x128 public/favicons/favicon-128x128.png
convert public/brand/logo-512x512.png -resize 256x256 public/favicons/favicon-256x256.png

# Apple touch icons
echo "🍎 Generating Apple touch icons..."
convert public/brand/logo-512x512.png -resize 180x180 public/favicons/apple-touch-icon.png
convert public/brand/logo-512x512.png -resize 167x167 public/favicons/apple-touch-icon-167x167.png
convert public/brand/logo-512x512.png -resize 152x152 public/favicons/apple-touch-icon-152x152.png
convert public/brand/logo-512x512.png -resize 120x120 public/favicons/apple-touch-icon-120x120.png

# Android/Chrome icons
echo "🤖 Generating Android/Chrome icons..."
convert public/brand/logo-512x512.png -resize 192x192 public/favicons/android-chrome-192x192.png
convert public/brand/logo-512x512.png -resize 512x512 public/favicons/android-chrome-512x512.png

# Microsoft tiles
echo "🪟 Generating Microsoft tiles..."
convert public/brand/logo-512x512.png -resize 70x70 public/favicons/mstile-70x70.png
convert public/brand/logo-512x512.png -resize 144x144 public/favicons/mstile-144x144.png
convert public/brand/logo-512x512.png -resize 150x150 public/favicons/mstile-150x150.png
convert public/brand/logo-512x512.png -resize 310x150 public/favicons/mstile-310x150.png
convert public/brand/logo-512x512.png -resize 310x310 public/favicons/mstile-310x310.png

# Create favicon.ico (multiple sizes in one file)
echo "📄 Creating favicon.ico..."
convert public/favicons/favicon-16x16.png \
        public/favicons/favicon-32x32.png \
        public/favicons/favicon-48x48.png \
        public/favicons/favicon-64x64.png \
        public/favicons/favicon-128x128.png \
        public/favicons/favicon-256x256.png \
        -colors 256 public/favicon.ico

# Copy 32x32 favicon as default
cp public/favicons/favicon-32x32.png public/favicon.png

# Generate social media images
echo "📱 Generating social media images..."

# Open Graph image (1200x630)
convert -size 1200x630 xc:'#0f172a' \
  -fill '#1e293b' -draw 'rectangle 0,0,1200,630' \
  public/brand/social-background.png

# Add gradient overlay
convert public/brand/social-background.png \
  \( -size 1200x630 gradient:'#3B82F6'-'#8B5CF6' -alpha set -channel A -evaluate multiply 0.3 \) \
  -composite public/brand/social-gradient.png

# Add logo
composite -gravity center -geometry +0-100 public/brand/logo-512x512.png \
  public/brand/social-gradient.png public/brand/og-template.png

# Add text (simplified - in production you'd want more sophisticated text rendering)
convert public/brand/og-template.png \
  -font Arial -pointsize 72 -fill white -gravity center -annotate +0+100 'Trend Pulse' \
  -font Arial -pointsize 36 -fill '#CBD5E1' -gravity center -annotate +0+180 'Real-Time News & Analysis' \
  -font Arial -pointsize 24 -fill '#94A3B8' -gravity south -annotate +0+100 'trendpulse.ai' \
  public/og-image.jpg

# Twitter card image (1200x600)
convert public/og-image.jpg -resize 1200x600 public/twitter-image.jpg

# Create site.webmanifest
echo "📝 Generating web app manifest..."
cat > public/site.webmanifest << EOF
{
  "name": "Trend Pulse",
  "short_name": "TrendPulse",
  "description": "Real-time news and analysis",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/favicons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

# Create browserconfig.xml for Microsoft tiles
echo "📝 Generating browserconfig.xml..."
cat > public/browserconfig.xml << EOF
<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="/favicons/mstile-70x70.png"/>
      <square150x150logo src="/favicons/mstile-150x150.png"/>
      <square310x310logo src="/favicons/mstile-310x310.png"/>
      <wide310x150logo src="/favicons/mstile-310x150.png"/>
      <TileColor>#3B82F6</TileColor>
    </tile>
  </msapplication>
</browserconfig>
EOF

# Clean up temporary files
rm -f public/brand/social-background.png public/brand/social-gradient.png public/brand/og-template.png

echo "✅ Brand assets generated successfully!"
echo ""
echo "📁 Generated files:"
echo "  - public/favicon.ico (multi-size favicon)"
echo "  - public/favicon.png (32x32 favicon)"
echo "  - public/favicons/ (various icon sizes)"
echo "  - public/og-image.jpg (Open Graph image)"
echo "  - public/twitter-image.jpg (Twitter card)"
echo "  - public/site.webmanifest (PWA manifest)"
echo "  - public/browserconfig.xml (Microsoft tiles)"
echo ""
echo "🎨 To update the design:"
echo "  1. Edit public/logo-simple.svg"
echo "  2. Run this script again: ./scripts/generate-brand-assets.sh"
echo ""
echo "🚀 Assets are ready for production deployment!"