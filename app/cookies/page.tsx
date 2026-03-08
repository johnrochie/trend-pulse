import React from 'react';
import { Metadata } from 'next';
import PageTemplate from '@/components/PageTemplate';
import { Shield, Cookie, Settings, Eye, Ban } from 'lucide-react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export const metadata: Metadata = {
  title: 'Cookie Policy - Trend Pulse',
  description: 'Learn how we use cookies and similar technologies on Trend Pulse',
};

// Read the markdown file directly at build time
function getPageContent() {
  try {
    const filePath = path.join(process.cwd(), 'content', 'pages', 'cookies.md');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    
    return {
      title: frontmatter.title || 'Cookie Policy',
      content: content || '',
      ...frontmatter
    };
  } catch (error) {
    console.error('Failed to read cookies.md:', error);
    // Fallback content
    return {
      title: 'Cookie Policy',
      content: `# Cookie Policy\n\n*Last updated: February 2026*\n\n## Introduction\n\nWelcome to Trend Pulse's Cookie Policy. This policy explains how we use cookies and similar tracking technologies on our website.\n\nBy using our Site, you consent to the use of cookies as described in this policy.\n\n## What Are Cookies?\n\nCookies are small text files that are placed on your device when you visit websites. They are widely used to make websites work more efficiently and provide information to the site owners.\n\n## Your Cookie Choices\n\nYou can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.\n\n## Contact Us\n\nIf you have questions about this Cookie Policy, please [contact us](/contact).`
    };
  }
}

export default function CookiePolicyPage() {
  const pageData = getPageContent();

  return (
    <PageTemplate
      title={pageData.title}
      content={pageData.content}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Cookie Policy' }]}
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