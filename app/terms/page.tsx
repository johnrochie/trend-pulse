import React from 'react';
import { Metadata } from 'next';
import PageTemplate from '@/components/PageTemplate';
import { getPage } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing your use of Trend Pulse',
};

async function getPageContent() {
  try {
    const result = await getPage('terms');
    return result.data;
  } catch (error) {
    // Fallback content
    return {
      title: 'Terms of Service',
      content: `# Terms of Service

*Last updated: February 2026*

## 1. Acceptance of Terms

By accessing and using Trend Pulse ("the Site"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this Site's particular services, you shall be subject to any posted guidelines or rules applicable to such services.

If you do not agree to these Terms of Service, please do not use this Site.

## 2. Description of Service

Trend Pulse provides real-time news and analysis across technology, business, and entertainment topics. The service includes:

- News articles and analysis
- Trend monitoring and reporting
- Newsletter subscriptions
- Access to archived content

## 3. User Responsibilities

### 3.1 Account Security
If you create an account on the Site, you are responsible for maintaining the security of your account and password.

### 3.2 Acceptable Use
You agree not to use the Site to:
- Violate any laws or regulations
- Infringe on intellectual property rights
- Transmit harmful or malicious content
- Interfere with Site operations
- Attempt to gain unauthorized access

## 4. Intellectual Property

### 4.1 Our Content
All content on the Site, including text, graphics, logos, and software, is the property of Trend Pulse or its content suppliers and protected by copyright laws.

### 4.2 Your Content
You retain ownership of any content you submit, but grant us license to use it.

### 4.3 Trademarks
"Trend Pulse" and our logos are trademarks of Trend Pulse. You may not use them without our prior written permission.

## 5. Disclaimer of Warranties

THE SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. WE MAKE NO WARRANTIES, EXPRESS OR IMPLIED, REGARDING THE SITE'S OPERATION OR THE INFORMATION, CONTENT, OR MATERIALS INCLUDED.

## 6. Limitation of Liability

TO THE FULLEST EXTENT PERMITTED BY LAW, TREND PULSE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF THE SITE.

## 7. Indemnification

You agree to indemnify and hold harmless Trend Pulse and its affiliates from any claims, damages, or expenses arising from your use of the Site or violation of these Terms.

## 8. Termination

We may terminate or suspend your access to the Site immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.

## 9. Changes to Terms

We reserve the right to modify these Terms at any time. We will notify users of any changes by updating the "Last updated" date. Your continued use of the Site after changes constitutes acceptance.

## 10. Governing Law

These Terms shall be governed by the laws of [Your Jurisdiction], without regard to its conflict of law provisions.

## 11. Contact Information

For questions about these Terms, please contact us:

- **Email:** hello@trendpulse.ai
- **Website:** trendpulse.ai/contact

## 12. Newsletter Terms

### 12.1 Subscription
By subscribing to our newsletter, you consent to receive email communications from us.

### 12.2 Unsubscribing
You may unsubscribe at any time using the link in any newsletter email or by contacting us directly.

### 12.3 Frequency
We typically send newsletters daily, but frequency may vary based on news developments.

## 13. Content Disclaimer

### 13.1 News Accuracy
While we strive for accuracy, news develops rapidly. We cannot guarantee the absolute accuracy of all information at all times.

### 13.2 Financial Information
Any financial information provided is for informational purposes only and not financial advice.

### 13.3 Third-Party Content
We may link to third-party websites. We are not responsible for the content or practices of these sites.

## 14. Automated Content

### 14.1 AI-Assisted Content
Some content on our Site is generated with assistance from automated systems. All content undergoes editorial review before publication.

### 14.2 Source Attribution
We attribute information to original sources whenever possible.

## 15. User Feedback

We welcome feedback about our Site and services. By submitting feedback, you grant us the right to use it to improve our services.

## 16. Accessibility

We strive to make our Site accessible to all users. If you encounter accessibility issues, please contact us.

---

*These Terms of Service are designed to create a clear understanding between you and Trend Pulse regarding your use of our services.*`
    };
  }
}

export default async function TermsPage() {
  const page = await getPageContent();

  return (
    <PageTemplate 
      title={page.title || 'Terms of Service'}
      content={page.content || ''}
      showStats={false}
      ctaText="Back to Home"
      ctaLink="/"
    />
  );
}