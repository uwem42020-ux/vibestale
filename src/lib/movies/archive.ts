// src/lib/movies/archive.ts

type ArchiveMovie = {
  identifier: string;
  title: string;
  year?: string;
  description?: string;
  downloads?: number;
};

export async function fetchArchiveMovies(query: string = 'nollywood', limit = 20): Promise<ArchiveMovie[]> {
  try {
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=year&fl[]=description&fl[]=downloads&rows=${limit}&page=1&output=json`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return [];

    const data = await response.json();
    const docs = data.response?.docs || [];

    return docs.map((doc: any) => ({
      identifier: doc.identifier,
      title: doc.title,
      year: doc.year,
      description: doc.description,
      downloads: doc.downloads,
    }));
  } catch (error) {
    console.error('Archive fetch failed:', error);
    return [];
  }
}