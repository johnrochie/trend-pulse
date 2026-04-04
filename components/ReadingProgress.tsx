'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollable = documentHeight - windowHeight;
      if (scrollable <= 0) {
        setProgress(100);
        return;
      }
      setProgress((scrollY / scrollable) * 100);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-100 origin-left"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}
