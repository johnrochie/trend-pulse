import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Trend Pulse',
  description:
    'How Trend Pulse collects, uses, and protects your personal data. GDPR-compliant privacy policy.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-space text-4xl sm:text-5xl font-bold text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm">Last updated: March 2026</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 space-y-6 text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4 first:mt-0">
              Data controller
            </h2>
            <p>
              Trend Pulse is the data controller for personal data collected
              through this website. We are committed to protecting your privacy in
              line with the EU General Data Protection Regulation (GDPR) and other
              applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Information we collect
            </h2>
            <p>
              <strong>Newsletter and contact:</strong> When you subscribe to our
              newsletter or contact us, we collect your email address and any
              details you provide. We use this solely to send you updates and
              respond to your enquiry.
            </p>
            <p>
              <strong>Analytics (with consent):</strong> If you accept analytics
              cookies, we use Vercel Web Analytics and Google Analytics to collect
              anonymised usage data (e.g. page views). IP anonymisation is enabled.
              Data is aggregated and not sold to third parties. See{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Google&apos;s Privacy Policy
              </a>{' '}
              for how Google processes data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Legal basis
            </h2>
            <p>
              We process your data on the following bases:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>
                <strong>Consent:</strong> Newsletter subscriptions and contact
                enquiries; analytics, only when you accept cookies.
              </li>
              <li>
                <strong>Legitimate interest:</strong> Improving our services,
                security, and legal compliance.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              How we use your information
            </h2>
            <p>
              We use the information you provide to send you newsletter updates,
              respond to enquiries, and improve our website. We do not sell or share your personal data with
              third parties for marketing purposes.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Cookies and similar technologies
            </h2>
            <p>
              <strong>Strictly necessary:</strong> We use local storage to remember
              your cookie consent choice. This is required for compliance and
              cannot be disabled.
            </p>
            <p>
              <strong>Analytics (optional):</strong> With your consent, we use
              Vercel Web Analytics and Google Analytics. We use anonymised
              data for aggregate insights. You can accept or reject this via our
              cookie banner, and change your choice anytime via{' '}
              <Link href="/privacy#cookies" className="text-blue-400 hover:text-blue-300 underline">
                Cookie preferences
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Data retention
            </h2>
            <p>
              Newsletter and contact data is kept only as long as needed to fulfil your
              request and our legal obligations. Analytics data is aggregated and
              retained according to our provider&apos;s policy. You may request
              deletion at any time.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Your rights (GDPR)
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong>Access</strong> – request a copy of your personal data</li>
              <li><strong>Rectification</strong> – correct inaccurate data</li>
              <li><strong>Erasure</strong> – request deletion of your data</li>
              <li><strong>Restriction</strong> – limit how we process your data</li>
              <li><strong>Portability</strong> – receive your data in a structured format</li>
              <li><strong>Object</strong> – object to processing based on legitimate interest</li>
              <li><strong>Withdraw consent</strong> – withdraw consent for analytics at any time</li>
            </ul>
            <p className="mt-4">
              To exercise these rights,{' '}
              <a href="mailto:hello@trendpulse.life" className="text-blue-400 hover:text-blue-300 underline">
                contact us
              </a>
              {' '}at hello@trendpulse.life. You may also lodge a complaint with your local data protection
              authority.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              International transfers
            </h2>
            <p>
              Our hosting and tools (e.g. Vercel) may process data outside
              the UK/EEA. We ensure appropriate safeguards (e.g. adequacy
              decisions, standard contractual clauses) where required.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Changes
            </h2>
            <p>
              We may update this policy from time to time. The &quot;Last updated&quot; date
              above indicates when changes were last made.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Contact
            </h2>
            <p>
              For questions about this privacy policy or your data,{' '}
              <a href="mailto:hello@trendpulse.life" className="text-blue-400 hover:text-blue-300 underline">
                get in touch
              </a>
              {' '}at hello@trendpulse.life.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-800/30 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Informed</h3>
            <p className="text-gray-300 mb-6">
              Subscribe to our daily newsletter for the latest news and analysis
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
