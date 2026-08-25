import OpenAI from 'openai';

// Primary provider: OpenAI
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// OpenRouter fallback client
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
  // Try OpenAI first
  try {
    return await generateWithOpenAI(title);
  } catch (openAIError) {
    console.warn('OpenAI music review failed, trying Mistral fallback...', openAIError);
  }

  // Try Mistral on OpenRouter
  try {
    return await generateWithOpenRouter(title, 'mistralai/mistral-7b-instruct:free');
  } catch (mistralError) {
    console.warn('Mistral music review failed, trying Gemma...', mistralError);
  }

  // Try Gemma on OpenRouter
  try {
    return await generateWithOpenRouter(title, 'google/gemma-2-9b-it:free');
  } catch (gemmaError) {
    console.warn('Gemma music review failed, trying NVIDIA...', gemmaError);
  }

  // Try NVIDIA on OpenRouter
  try {
    return await generateWithOpenRouter(title, 'nvidia/nemotron-3.5-lightning:free');
  } catch (nvidiaError) {
    console.warn('NVIDIA music review failed, using generic review...', nvidiaError);
  }

  // Final fallback: guaranteed success
  return createGenericReview(title);
}

async function generateWithOpenAI(title: string): Promise<MusicAnalysis> {
  const completion = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a Nigerian music critic for VibeStale. Write a short, neutral 2-3 sentence review of this new release. Determine the genre (afrobeats, amapiano, hip-hop, highlife, etc.) and confidence. Respond only in valid JSON with keys: review, genre, confidence_score.',
      },
      {
        role: 'user',
        content: `New release: "${title}". Provide a review.`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 250,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty OpenAI response');
  const parsed = JSON.parse(content);
  return {
    review: parsed.review || '',
    genre: parsed.genre || 'afrobeats',
    confidenceScore: parsed.confidence_score || 0.8,
  };
}

async function generateWithOpenRouter(
  title: string,
  model: string
): Promise<MusicAnalysis> {
  const completion = await openRouter.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are a Nigerian music critic for VibeStale. Provide a concise, neutral review. Respond with ONLY a JSON object in this exact format: {"review": "...", "genre": "...", "confidence_score": 0.8}',
      },
      {
        role: 'user',
        content: `New release: "${title}". Provide a review.`,
      },
    ],
    max_tokens: 300,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty OpenRouter response');

  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (parseError) {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch (innerError) {
        throw new Error('Invalid JSON from OpenRouter');
      }
    } else {
      throw new Error('No JSON found in OpenRouter response');
    }
  }

  return {
    review: parsed.review || '',
    genre: parsed.genre || 'afrobeats',
    confidenceScore: parsed.confidence_score || 0.5,
  };
}

function createGenericReview(title: string): MusicAnalysis {
  return {
    review: `This is a new Nigerian music release titled "${title}". More details will be added soon.`,
    genre: 'afrobeats',
    confidenceScore: 0.3,
  };
}