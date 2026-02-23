import React from 'react';
import { Metadata } from 'next';
import PageTemplate from '@/components/PageTemplate';
import { getPage } from '@/lib/api';
import { Shield, Cookie, Settings, Eye, Ban } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy - Trend Pulse',
  description: 'Learn how we use cookies and similar technologies on Trend Pulse',
};

async function getPageContent() {
  try {
    const result = await getPage('cookies');
    return result.data;
  } catch (error) {
    // Fallback content
    return {
      title: 'Cookie Policy',
      content: `# Cookie Policy

*Last updated: February 2026*

## Introduction

Welcome to Trend Pulse's Cookie Policy. This policy explains how we use cookies and similar tracking technologies on our website trendpulse.ai (the "Site"). 

By using our Site, you consent to the use of cookies as described in this policy.

## What Are Cookies?

Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit websites. They are widely used to make websites work more efficiently and provide information to the site owners.

## Types of Cookies We Use

### 1. Essential Cookies (Strictly Necessary)
These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you such as setting your privacy preferences, logging in, or filling in forms.

**Examples:**
- Session management
- Security features
- Load balancing

### 2. Performance Cookies
These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.

**Examples:**
- Google Analytics (anonymous tracking)
- Performance monitoring
- Error tracking

### 3. Functional Cookies
These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.

**Examples:**
- Language preferences
- Region settings
- Font size preferences

### 4. Targeting/Advertising Cookies
These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.

**Examples:**
- Google AdSense cookies
- Social media pixels
- Retargeting cookies

## Specific Cookies We Use

### Google AdSense Cookies
As we use Google AdSense for advertising, the following Google cookies may be set:

| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| _gads / _gac | Advertising cookies | 13 months |
| IDE | DoubleClick advertising cookie | 1 year |
| DSID | Advertising cookie | 2 weeks |
| test_cookie | Check if browser accepts cookies | Session |

### Analytics Cookies
| Cookie Name | Purpose | Duration |
|-------------|---------|----------|
| _ga | Google Analytics - distinguish users | 2 years |
| _gid | Google Analytics - distinguish users | 24 hours |
| _gat | Google Analytics - throttle request rate | 1 minute |

## Your Cookie Choices

### Browser Controls
You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.

**How to manage cookies in popular browsers:**
- **Chrome:** Settings → Privacy and security → Cookies and other site data
- **Firefox:** Options → Privacy & Security → Cookies and Site Data
- **Safari:** Preferences → Privacy → Cookies and website data
- **Edge:** Settings → Cookies and site permissions → Cookies and data stored

### Opt-Out Tools
- **Google Analytics Opt-Out:** [Google Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout)
- **Advertising Opt-Out:** [Your Online Choices](http://www.youronlinechoices.com/)
- **Network Advertising Initiative:** [NAI Opt-Out](http://optout.networkadvertising.org/)

## GDPR Compliance

### Lawful Basis for Processing
We process cookies based on the following lawful bases under GDPR:

1. **Consent:** For non-essential cookies (performance, functional, advertising)
2. **Legitimate Interest:** For essential cookies necessary for site operation
3. **Contract:** For cookies necessary to provide services you request

### Your GDPR Rights
Under GDPR, you have the right to:
1. **Access:** Know what cookies are being used
2. **Control:** Manage your cookie preferences
3. **Withdraw Consent:** Change your mind at any time
4. **Complain:** Contact your data protection authority

### Data Transfers
Some cookies may involve transferring data outside the EU/EEA. We ensure such transfers comply with GDPR requirements through:
- EU Standard Contractual Clauses
- Privacy Shield framework (where applicable)
- Other approved transfer mechanisms

## Cookie Consent Management

### First Visit
On your first visit to our site, you will see a cookie consent banner that allows you to:
- Accept all cookies
- Reject non-essential cookies
- Customize your preferences
- Learn more about our cookie policy

### Changing Preferences
You can change your cookie preferences at any time by:
1. Clicking the "Cookie Settings" link in our footer
2. Clearing your browser cookies
3. Using browser settings to block cookies

## Third-Party Cookies

We work with third parties that may set cookies on our site, including:

### Advertising Partners
- Google AdSense
- Other advertising networks

### Analytics Providers
- Google Analytics
- Other analytics services

### Social Media
- Twitter (X)
- Facebook
- LinkedIn

These third parties have their own privacy policies. We encourage you to review them.

## Cookie Duration

Cookies have different lifespans:

| Duration Type | Description | Examples |
|---------------|-------------|----------|
| Session | Deleted when browser closes | Authentication cookies |
| Persistent | Remain until expiry date | Analytics, advertising |
| Permanent | Remain until manually deleted | Some preference cookies |

## Security

We take appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of cookie data. These include internal reviews of our data collection, storage, and processing practices.

## Children's Privacy

Our Site is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are under 16, please do not use our Site.

## Changes to This Policy

We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.

## Contact Us

If you have questions about this Cookie Policy, please contact us:

**Email:** privacy@trendpulse.ai  
**Address:** [Your Business Address]  
**Website:** trendpulse.ai/cookies

## Additional Resources

- [Information Commissioner's Office (ICO) - Cookies](https://ico.org.uk/for-the-public/online/cookies/)
- [European Data Protection Board](https://edpb.europa.eu/)
- [Google's Privacy & Terms](https://policies.google.com/privacy)

---

*This Cookie Policy was last updated on February 23, 2026.*`
    };
  }
}

export default async function CookiePolicyPage() {
  const pageData = await getPageContent();

  return (
    <PageTemplate
      title={pageData.title}
      content={pageData.content}
    >
      {/* Additional GDPR information */}
      <div className="mt-12 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-green-500" />
          GDPR Compliance Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Your Rights Under GDPR
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span><strong>Right to Access:</strong> Know what data we collect</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span><strong>Right to Rectification:</strong> Correct inaccurate data</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span><strong>Right to Erasure:</strong> Request data deletion</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span><strong>Right to Restrict Processing:</strong> Limit how we use your data</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              Cookie Management
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span><strong>Essential Cookies:</strong> Required for site operation</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span><strong>Optional Cookies:</strong> Require your consent</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span><strong>Manage Preferences:</strong> Change anytime via browser settings</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <span><strong>Opt-Out:</strong> Available for advertising cookies</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
          <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-400" />
            How to Disable Cookies
          </h4>
          <p className="text-gray-400">
            You can disable cookies in your browser settings. However, please note that disabling essential cookies may affect the functionality of our website.
          </p>
        </div>
      </div>
    </PageTemplate>
  );
}