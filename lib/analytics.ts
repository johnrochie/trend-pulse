/**
 * Analytics utilities for Trend Pulse
 * 
 * Integrates:
 * 1. Google Analytics 4 (GA4)
 * 2. Vercel Analytics (via @vercel/analytics)
 * 3. Custom event tracking
 */

// TypeScript definitions for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

// Google Analytics 4 Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Check if GA is enabled
export const isGAEnabled = GA_MEASUREMENT_ID.length > 0;

// Page view tracking
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && isGAEnabled) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Event tracking
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && isGAEnabled) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Article-specific events
export const trackArticleView = (articleId: number, title: string, category: string) => {
  event({
    action: 'article_view',
    category: 'Content',
    label: title,
    value: articleId,
  });
  
  // Also track category view
  event({
    action: 'category_view',
    category: 'Content',
    label: category,
  });
};

export const trackArticleShare = (articleId: number, platform: string) => {
  event({
    action: 'article_share',
    category: 'Social',
    label: platform,
    value: articleId,
  });
};

export const trackSearch = (query: string, results: number) => {
  event({
    action: 'search',
    category: 'User Interaction',
    label: query,
    value: results,
  });
};

export const trackNewsletterSignup = (email: string) => {
  event({
    action: 'newsletter_signup',
    category: 'Conversion',
    label: email,
  });
};

export const trackAdClick = (adPosition: string) => {
  event({
    action: 'ad_click',
    category: 'Monetization',
    label: adPosition,
  });
};

export const trackAutomationUpdate = (articlesCount: number) => {
  event({
    action: 'automation_update',
    category: 'System',
    label: 'Articles Updated',
    value: articlesCount,
  });
};

// User engagement metrics
export const trackTimeOnPage = (pageUrl: string, seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'Engagement',
    label: pageUrl,
    value: seconds,
  });
};

export const trackScrollDepth = (pageUrl: string, percentage: number) => {
  event({
    action: 'scroll_depth',
    category: 'Engagement',
    label: pageUrl,
    value: percentage,
  });
};

// Error tracking
export const trackError = (errorType: string, message: string) => {
  event({
    action: 'error',
    category: 'System',
    label: `${errorType}: ${message}`,
  });
};

// Performance tracking
export const trackPageLoad = (pageUrl: string, loadTime: number) => {
  event({
    action: 'page_load',
    category: 'Performance',
    label: pageUrl,
    value: loadTime,
  });
};

// Custom dimensions (for enhanced tracking)
export const setCustomDimensions = (dimensions: Record<string, any>) => {
  if (typeof window !== 'undefined' && isGAEnabled) {
    window.gtag('set', dimensions);
  }
};

// User properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && isGAEnabled) {
    window.gtag('set', 'user_properties', properties);
  }
};

// E-commerce tracking (for future AdSense revenue)
export const trackRevenue = (amount: number, currency: string = 'EUR') => {
  event({
    action: 'revenue',
    category: 'Monetization',
    label: currency,
    value: amount,
  });
};

// Automation health tracking
export const trackAutomationHealth = (
  status: 'success' | 'warning' | 'error',
  message: string,
  articlesProcessed: number
) => {
  event({
    action: 'automation_health',
    category: 'System',
    label: `${status}: ${message}`,
    value: articlesProcessed,
  });
};

// Export all tracking functions
export default {
  pageview,
  event,
  trackArticleView,
  trackArticleShare,
  trackSearch,
  trackNewsletterSignup,
  trackAdClick,
  trackAutomationUpdate,
  trackTimeOnPage,
  trackScrollDepth,
  trackError,
  trackPageLoad,
  setCustomDimensions,
  setUserProperties,
  trackRevenue,
  trackAutomationHealth,
};