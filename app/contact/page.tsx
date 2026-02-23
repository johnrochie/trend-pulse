import React from 'react';
import { Metadata } from 'next';
import PageTemplate from '@/components/PageTemplate';
import { getPage } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Contact Trend Pulse',
  description: 'Get in touch with the Trend Pulse team',
};

async function getPageContent() {
  try {
    const result = await getPage('contact');
    return result.data;
  } catch (error) {
    // Fallback content
    return {
      title: 'Contact Trend Pulse',
      content: `# Contact Trend Pulse

We'd love to hear from you! Whether you have questions, feedback, or partnership inquiries, here's how to reach us.

## 📧 Email

**General Inquiries:** hello@trendpulse.ai  
**News Tips:** tips@trendpulse.ai  
**Advertising:** ads@trendpulse.ai  
**Support:** support@trendpulse.ai  

## 🌐 Social Media

**Twitter:** [@trendpulse](https://twitter.com/trendpulse)  
**LinkedIn:** [Trend Pulse](https://linkedin.com/company/trendpulse)  
**GitHub:** [trendpulse](https://github.com/trendpulse)  

## 📬 Mailing Address

*[Your Business Address]  
[City, State, ZIP Code]  
[Country]*

*Note: We primarily operate digitally. For fastest response, please use email.*

## ⏰ Response Times

We strive to respond to all inquiries within:
- **General Inquiries:** 24-48 hours
- **Technical Support:** 24 hours
- **Partnership Inquiries:** 2-3 business days
- **Press Inquiries:** 24 hours

## 🌍 Global Reach

While based in [Your Location], we serve readers worldwide. Our content focuses on global trends with particular attention to:
- Technology innovation
- Business developments
- Entertainment industry
- Market trends

## 📈 Business Hours

**Office Hours:** Monday-Friday, 9 AM-6 PM [Your Timezone]  
**Emergency Contact:** For urgent matters outside business hours, email **urgent@trendpulse.ai**

*Note: Our automated news system operates 24/7 regardless of business hours.*

## 💡 Newsletter Management

**Subscribe:** Use the form on our homepage  
**Unsubscribe:** Click "unsubscribe" in any newsletter email  
**Manage Preferences:** Email **newsletter@trendpulse.ai**

---

*We're committed to being accessible and responsive to our readers, partners, and the broader community. Thank you for reaching out!*

*Last updated: February 2026*`
    };
  }
}

export default async function ContactPage() {
  const page = await getPageContent();

  return (
    <PageTemplate 
      title={page.title || 'Contact Trend Pulse'}
      content={page.content || ''}
      showStats={false}
      ctaText="View Latest News"
      ctaLink="/"
    />
  );
}