import OpenAI from 'openai';

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const openRouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  timeout: 15000,
});

export interface MusicAnalysis {
  review: string;
  genre: string;
  confidenceScore: number;
}

export async function generateMusicReview(title: string): Promise<MusicAnalysis> {
  try {
    return await generateWithOpenAI(title);
  } catch {
    return await generateWithOpenRouter(title);
  }
}

async function generateWithOpenAI(title: string): Promise<MusicAnalysis> {
  const completion = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a Nigerian music critic for VibeStale. Write a short, neutral 2-3 sentence review of this new release. Determine genre (afrobeats, amapiano, hip-hop, highlife, etc.) and confidence. Respond in JSON: {"review": "...", "genre": "...", "confidence_score": 0.8}',
      },
      {
        role: 'user',
        content: `New release: "${title}". Provide review.`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 250,
  });
  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty response');
  const parsed = JSON.parse(content);
  return {
    review: parsed.review,
    genre: parsed.genre || 'afrobeats',
    confidenceScore: parsed.confidence_score || 0.8,
  };
}

async function generateWithOpenRouter(title: string): Promise<MusicAnalysis> {
  const completion = await openRouter.chat.completions.create({
    model: 'nvidia/nemotron-3.5-lightning:free',
    messages: [
      {
        role: 'system',
        content: 'Respond with ONLY JSON: {"review": "...", "genre": "...", "confidence_score": 0.8}',
      },
      {
        role: 'user',
        content: `Review this Nigerian music release: "${title}"`,
      },
    ],
    max_tokens: 250,
  });
  let content = completion.choices[0].message.content || '';
  try {
    const parsed = JSON.parse(content);
    return { review: parsed.review, genre: parsed.genre || 'afrobeats', confidenceScore: parsed.confidence_score || 0.5 };
  } catch {
    return { review: `New release: ${title}`, genre: 'afrobeats', confidenceScore: 0.3 };
  }
}