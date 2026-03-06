import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Trend Pulse',
  description: 'Get in touch with Trend Pulse. Send us a message and we\'ll respond as soon as we can.',
};

export default function ContactLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
