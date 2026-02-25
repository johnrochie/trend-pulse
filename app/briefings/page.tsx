import { redirect } from 'next/navigation';

export default function BriefingsPage() {
  // Redirect to the daily-digest archive page
  redirect('/daily-digest');
}

// This page will never render content because of the redirect
// The redirect happens on the server side before any content is sent to the client