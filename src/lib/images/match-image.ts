import fs from 'fs';
import path from 'path';

// Common English stop words to ignore when extracting keywords
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'but', 'is', 'are',
  'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could', 'it', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'them', 'his', 'her', 'its',
  'our', 'your', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'what', 'which', 'who',
  'whom', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 's', 't', 'don', 'now', 'just', 'also', 'about', 'after', 'before', 'during', 'from',
  'into', 'through', 'between', 'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
  'very', 's', 't', 'don', 'now', 'just', 'also'
]);

// Normalize a string: lowercase, remove special chars, split into words
function normalizeString(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
}

// Get the list of image files in public/newsimages
function getImageFiles(): string[] {
  const dir = path.join(process.cwd(), 'public', 'newsimages');
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jfif', '.png', '.jpg', '.jpeg', '.webp', '.gif'].includes(ext);
  });
}

// Match headline keywords against image filenames
export function matchImage(headline: string): string | null {
  const keywords = normalizeString(headline);
  if (keywords.length === 0) return null;

  const imageFiles = getImageFiles();
  if (imageFiles.length === 0) return null;

  const scored = imageFiles.map(file => {
    const fileWords = normalizeString(path.basename(file, path.extname(file)));
    let score = 0;
    for (const kw of keywords) {
      if (fileWords.includes(kw)) score++;
    }
    return { file, score };
  });

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // If no file has score > 0, return null
  if (scored[0].score === 0) return null;

  // Find the highest score
  const topScore = scored[0].score;
  const topFiles = scored.filter(item => item.score === topScore);

  // Randomly pick one among the top matches
  const chosen = topFiles[Math.floor(Math.random() * topFiles.length)];

  // Construct URL with proper encoding
  const encodedFilename = encodeURIComponent(chosen.file);
  return `/newsimages/${encodedFilename}`;
}