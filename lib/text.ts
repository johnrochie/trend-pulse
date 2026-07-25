// Text cleanup utilities for article display

/**
 * Strip source name suffix from article titles (e.g. "Story - IGN" → "Story")
 * NewsAPI often appends the source name to the title with " - " or " | "
 */
export function cleanTitle(title: string, sourceName?: string): string {
  if (!title) return title;
  // If we have the exact source name, try to strip it specifically
  if (sourceName) {
    const suffixDash = ` - ${sourceName}`;
    const suffixPipe = ` | ${sourceName}`;
    if (title.endsWith(suffixDash)) return title.slice(0, -suffixDash.length).trim();
    if (title.endsWith(suffixPipe)) return title.slice(0, -suffixPipe.length).trim();
  }
  // Generic: if the last segment after " - " or " | " looks like a source name
  // (short, ≤40 chars, no sentence structure), strip it
  const dashParts = title.split(' - ');
  if (dashParts.length >= 2) {
    const lastPart = dashParts[dashParts.length - 1];
    if (lastPart.length <= 40 && !lastPart.includes(' the ') && !lastPart.includes(' and ')) {
      return dashParts.slice(0, -1).join(' - ').trim();
    }
  }
  return title;
}
