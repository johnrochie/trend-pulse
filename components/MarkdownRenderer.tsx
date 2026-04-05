'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { appendAffiliateTag, getAmazonAffiliateUrl } from '@/lib/amazon-affiliate';
import { injectProductLinks } from '@/lib/product-asin-map';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const processedContent = injectProductLinks(content, (asin) =>
    getAmazonAffiliateUrl(asin)
  );

  return (
    <div className={`prose prose-lg prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-white mb-6 mt-2">{children}</h1>
          ),
          h2: ({ children }) => {
            const text = String(children);
            // Style "TL;DR" and "Key Takeaways" sections differently
            if (text === 'TL;DR') {
              return (
                <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2 mt-0">
                  {children}
                </h2>
              );
            }
            if (text === 'Key Takeaways') {
              return (
                <h2 className="text-lg font-bold text-white mt-10 mb-3 flex items-center gap-2">
                  <span className="inline-block w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
                  {children}
                </h2>
              );
            }
            return (
              <h2 className="text-2xl font-bold text-white mt-10 mb-4 pb-2 border-b border-gray-700">
                {children}
              </h2>
            );
          },
          h3: ({ children }) => (
            <h3 className="text-xl font-bold text-white mt-8 mb-3 flex items-center gap-2">
              <span className="inline-block w-1 h-4 rounded-full bg-blue-500" />
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-bold text-gray-200 mt-6 mb-2 uppercase tracking-wide text-xs">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 mb-5 leading-relaxed text-[1.05rem]">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-5 text-gray-300 space-y-2 pl-0 list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-5 text-gray-300 space-y-2 pl-0 list-none counter-reset-[item]">
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // Check if it's inside an ol (ordered list)
            const isOrdered = (props as any).ordered;
            return isOrdered ? (
              <li className="flex gap-3 mb-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
                  {(props as any).index + 1}
                </span>
                <span className="text-gray-300 leading-relaxed">{children}</span>
              </li>
            ) : (
              <li className="flex gap-3 mb-2">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5" />
                <span className="text-gray-300 leading-relaxed">{children}</span>
              </li>
            );
          },
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-200">{children}</em>
          ),
          a: ({ href, children }) => {
            const finalHref = href && href.includes('amazon.') ? appendAffiliateTag(href) : href;
            return (
              <a
                href={finalHref}
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-blue-400/40 hover:decoration-blue-300 transition-colors"
                target="_blank"
                rel={href?.includes('amazon.') ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="relative my-6 pl-5 border-l-[3px] border-blue-500 bg-blue-500/5 rounded-r-xl py-4 pr-4 not-italic">
              <div className="absolute -left-[1px] top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
              <div className="text-gray-200 text-[1.05rem] leading-relaxed font-medium [&>p]:mb-0 [&>p]:text-gray-200">
                {children}
              </div>
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-gray-900 border border-gray-700 px-2 py-0.5 rounded text-sm font-mono text-blue-300">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-900 border border-gray-700 p-4 rounded-xl overflow-x-auto my-6">
              {children}
            </pre>
          ),
          hr: () => (
            <div className="my-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-800" />
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <div className="w-1 h-1 rounded-full bg-gray-600" />
                <div className="w-1 h-1 rounded-full bg-gray-600" />
              </div>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-gray-700">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="text-left py-2 px-3 font-semibold text-gray-300 uppercase text-xs tracking-wide">{children}</th>
          ),
          td: ({ children }) => (
            <td className="py-2 px-3 text-gray-400 border-b border-gray-800">{children}</td>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
