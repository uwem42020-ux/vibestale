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

export interface AIAnalysis {
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  keyEntities: string[];
  confidenceScore: number;
  category: string;
}

export async function generateCommentary(title: string): Promise<AIAnalysis> {
  // Try OpenAI first
  try {
    return await generateWithOpenAI(title);
  } catch (openAIError) {
    console.warn('OpenAI failed, trying Mistral fallback...', openAIError);
  }

  // Try Mistral on OpenRouter
  try {
    return await generateWithOpenRouter(title, 'mistralai/mistral-7b-instruct:free');
  } catch (mistralError) {
    console.warn('Mistral fallback failed, trying Gemma...', mistralError);
  }

  // Try Gemma on OpenRouter
  try {
    return await generateWithOpenRouter(title, 'google/gemma-2-9b-it:free');
  } catch (gemmaError) {
    console.warn('Gemma fallback failed, trying NVIDIA...', gemmaError);
  }

  // Try NVIDIA on OpenRouter
  try {
    return await generateWithOpenRouter(title, 'nvidia/nemotron-3.5-lightning:free');
  } catch (nvidiaError) {
    console.warn('NVIDIA fallback failed, using generic summary...', nvidiaError);
  }

  // Final fallback: guaranteed success
  return createGenericAnalysis(title);
}

async function generateWithOpenAI(title: string): Promise<AIAnalysis> {
  const completion = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a senior Nigerian news analyst for VibeStale, a platform that explains the news with clarity and depth. ' +
          'Given a headline, write a rich, 4-5 sentence analysis that:\n' +
          '- Provides necessary context and background\n' +
          '- Identifies key people, organisations, and places involved\n' +
          '- Explains why the story matters to Nigerians (economic, political, social, or cultural impact)\n' +
          '- Is neutral, factual, and free of speculation or opinion\n' +
          '- Avoids repeating the headline\n\n' +
          'Return ONLY valid JSON in this exact format:\n' +
          '{\n' +
          '  "summary": "your 4-5 sentence analysis",\n' +
          '  "sentiment": "positive" | "negative" | "neutral",\n' +
          '  "key_entities": ["Name1", "Place1", "Organisation1"],\n' +
          '  "confidence_score": 0.85,\n' +
          '  "category": "politics" | "business" | "sports" | "tech" | "entertainment" | "general"\n' +
          '}\n\n' +
          'Keep the summary engaging and informative, as if written by a knowledgeable journalist.',
      },
      {
        role: 'user',
        content: `Headline: "${title}"\n\nAnalyse it and return the JSON.`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 400,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty OpenAI response');
  const parsed = JSON.parse(content);
  return {
    summary: parsed.summary,
    sentiment: parsed.sentiment || 'neutral',
    keyEntities: parsed.key_entities || [],
    confidenceScore: parsed.confidence_score || 0.8,
    category: parsed.category || 'general',
  };
}

async function generateWithOpenRouter(
  title: string,
  model: string
): Promise<AIAnalysis> {
  const completion = await openRouter.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are a Nigerian news analyst for VibeStale. Provide a concise, neutral, 4-5 sentence analysis. ' +
          'Respond with ONLY a JSON object in this exact format: {"summary": "...", "sentiment": "...", "key_entities": [...], "confidence_score": 0.8, "category": "politics"}',
      },
      {
        role: 'user',
        content: `Analyze this headline: "${title}". Return only the JSON object.`,
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
    summary: parsed.summary || '',
    sentiment: parsed.sentiment || 'neutral',
    keyEntities: parsed.key_entities || [],
    confidenceScore: parsed.confidence_score || 0.5,
    category: parsed.category || 'general',
  };
}

function createGenericAnalysis(title: string): AIAnalysis {
  return {
    summary: `This headline discusses "${title}". It is relevant to current events in Nigeria.`,
    sentiment: 'neutral',
    keyEntities: [],
    confidenceScore: 0.3,
    category: 'general',
  };
}