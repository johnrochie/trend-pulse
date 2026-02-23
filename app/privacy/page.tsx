import React from 'react';
import { Metadata } from 'next';
import PageTemplate from '@/components/PageTemplate';
import { getPage } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use, and protect your information',
};

async function getPageContent() {
  try {
    const result = await getPage('privacy');
    return result.data;
  } catch (error) {
    // Fallback content
    return {
      title: 'Privacy Policy',
      content: `# Privacy Policy

*Last updated: February 2026*

## Introduction

Trend Pulse ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website trendpulse.ai (the "Site").

Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.

## Information We Collect

### Personal Data
We may collect personally identifiable information that you voluntarily provide to us when you:
- Subscribe to our newsletter
- Contact us via email
- Participate in surveys or feedback

This may include:
- Email address
- Name (if provided)
- Communication preferences

### Usage Data
We automatically collect certain information when you visit our Site:
- IP address
- Browser type and version
- Pages visited and time spent
- Referring website
- Date and time of access
- Device information

### Cookies and Tracking Technologies
We use cookies and similar tracking technologies to track activity on our Site and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.

## How We Use Your Information

We use the information we collect for various purposes:
- To provide and maintain our Site
- To send newsletter updates (if subscribed)
- To notify you about changes to our Site
- To allow you to participate in interactive features
- To provide customer support
- To gather analysis or valuable information to improve our Site
- To monitor usage of our Site
- To detect, prevent, and address technical issues

## Data Security

We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

## Your Data Protection Rights

Depending on your location, you may have the following rights regarding your personal information:

### Right to Access
You have the right to request copies of your personal information.

### Right to Rectification
You have the right to request correction of inaccurate information.

### Right to Erasure
You have the right to request deletion of your personal information.

### Right to Restrict Processing
You have the right to request restriction of processing your personal information.

### Right to Object to Processing
You have the right to object to our processing of your personal information.

### Right to Data Portability
You have the right to request transfer of your data to another organization.

To exercise these rights, please contact us at hello@trendpulse.ai.

## Third-Party Services

We may employ third-party companies and individuals to facilitate our Site ("Service Providers"), provide the Site on our behalf, perform Site-related services, or assist us in analyzing how our Site is used.

These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.

### Analytics
We may use third-party Service Providers to monitor and analyze the use of our Site, such as Google Analytics.

### Advertising
We may use third-party advertising partners to serve ads. These partners may use cookies and similar technologies.

## Children's Privacy

Our Site is not intended for individuals under the age of 16. We do not knowingly collect personally identifiable information from children under 16.

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.

## Contact Us

If you have any questions about this Privacy Policy, please contact us:

- **Email:** hello@trendpulse.ai
- **Address:** [Your Business Address]
- **Website:** trendpulse.ai/contact

---

*This Privacy Policy is designed to help you understand how we collect, use, and protect your information. We're committed to being transparent about our data practices.*`
    };
  }
}

export default async function PrivacyPage() {
  const page = await getPageContent();

  return (
    <PageTemplate 
      title={page.title || 'Privacy Policy'}
      content={page.content || ''}
      showStats={false}
      ctaText="Back to Home"
      ctaLink="/"
    />
  );
}