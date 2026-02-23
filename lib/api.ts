// API utilities for Trend Pulse

import { config, getApiUrl } from './config';

// Generic fetch wrapper with error handling
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    throw error;
  }
}

// Specific API functions
export async function getArticles(params?: {
  limit?: number;
  category?: string;
  id?: string;
  slug?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.category) queryParams.set('category', params.category);
  if (params?.id) queryParams.set('id', params.id);
  if (params?.slug) queryParams.set('slug', params.slug);
  
  const queryString = queryParams.toString();
  const endpoint = `/articles${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<{
    success: boolean;
    data: any[];
    meta: any;
  }>(endpoint);
}

export async function getPage(slug: string) {
  return fetchApi<{
    success: boolean;
    data: {
      title: string;
      description: string;
      slug: string;
      order: number;
      content: string;
      file: string;
    };
  }>(`/pages?slug=${slug}`);
}

export async function getPages(listOnly: boolean = false) {
  return fetchApi<{
    success: boolean;
    data: any[];
    meta: any;
  }>(`/pages${listOnly ? '?list=true' : ''}`);
}

// Server-side API functions (for use in getServerSideProps, etc.)
export async function getArticlesServer(params?: {
  limit?: number;
  category?: string;
  id?: string;
  slug?: string;
}) {
  // This would be used in getServerSideProps
  // For now, it's the same as client-side
  return getArticles(params);
}

export async function getPageServer(slug: string) {
  // Server-side version
  return getPage(slug);
}

// Helper to check if API is available
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(getApiUrl('/articles?limit=1'), {
      method: 'HEAD',
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}