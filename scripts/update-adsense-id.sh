#!/bin/bash

# Script to update AdSense Publisher ID
# Usage: ./scripts/update-adsense-id.sh YOUR_PUBLISHER_ID

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Please provide your AdSense Publisher ID"
  echo "Usage: ./scripts/update-adsense-id.sh YOUR_PUBLISHER_ID"
  echo "Example: ./scripts/update-adsense-id.sh 1234567890123456"
  exit 1
fi

PUBLISHER_ID="$1"
META_CONTENT="ca-pub-$PUBLISHER_ID"
ADS_CONTENT="pub-$PUBLISHER_ID"

echo "🔧 Updating AdSense Publisher ID: $PUBLISHER_ID"
echo ""

# Update layout.tsx meta tag
echo "📝 Updating meta tag in layout.tsx..."
sed -i "s/content=\"ca-pub-YOUR_PUBLISHER_ID_HERE\"/content=\"$META_CONTENT\"/g" app/layout.tsx

# Update ads.txt
echo "📝 Updating ads.txt..."
sed -i "s/pub-YOUR_PUBLISHER_ID_HERE/$ADS_CONTENT/g" public/ads.txt

echo ""
echo "✅ AdSense ID updated successfully!"
echo ""
echo "📋 Files updated:"
echo "  1. app/layout.tsx - Meta tag"
echo "  2. public/ads.txt - ads.txt file"
echo ""
echo "🚀 Next steps:"
echo "  1. Commit changes: git add . && git commit -m 'Update AdSense Publisher ID'"
echo "  2. Push to GitHub: git push origin main"
echo "  3. Vercel will auto-deploy"
echo "  4. Verify in AdSense dashboard"
echo ""
echo "🔍 Verification check:"
echo "  Meta tag should show: <meta name=\"google-adsense-account\" content=\"$META_CONTENT\">"
echo "  ads.txt should show: google.com, $ADS_CONTENT, DIRECT, f08c47fec0942fa0"