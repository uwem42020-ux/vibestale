import crypto from 'crypto';

export function generateStoryHash(title: string): string {
  const normalized = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\b(the|a|an|in|on|at|to|for|of|and|or|but|is|are|was|were|nigeria|nigerian|says|report|reports)\b/g, '')
    .trim()
    .split(/\s+/)
    .sort()
    .join(' ');
  return crypto.createHash('sha256').update(normalized).digest('hex');
}