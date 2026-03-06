'use client';

import { useState } from 'react';
import Link from 'next/link';
import { sendContactEmail } from '@/app/actions/send-contact';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);
    if (result.ok) {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
      setErrorMessage(result.error ?? 'Something went wrong.');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-space text-4xl sm:text-5xl font-bold text-white mb-6">
            Contact us
          </h1>
          <p className="text-gray-300 text-lg">
            Send us a message and we&apos;ll get back to you as soon as we can. Include a way to reach you in your message if you&apos;d like a reply.
          </p>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8">
          {status === 'success' ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-white mb-4">Message sent</h2>
              <p className="text-gray-300 mb-6">
                Thanks for getting in touch. We&apos;ll respond as soon as possible.
              </p>
              <Link
                href="/"
                className="inline-flex px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all"
              >
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website_url">Leave blank</label>
                <input type="text" id="website_url" name="website_url" tabIndex={-1} autoComplete="off" />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-y"
                />
              </div>
              {status === 'error' && (
                <p className="text-red-400 text-sm">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm">
          <Link href="/privacy" className="text-blue-400 hover:underline">
            Privacy Policy
          </Link>
          {' · '}
          <Link href="/" className="text-blue-400 hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
