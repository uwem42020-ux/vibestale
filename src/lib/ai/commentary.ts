import OpenAI from 'openai';

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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
}

export async function generateCommentary(title: string): Promise<AIAnalysis> {
  try {
    return await generateWithOpenAI(title);
  } catch (openAIError) {
    console.warn('OpenAI failed, falling back to OpenRouter:', openAIError);
    return await generateWithOpenRouter(title);
  }
}

async function generateWithOpenAI(title: string): Promise<AIAnalysis> {
  const completion = await openAI.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You are a Nigerian news analyst for VibeStale. Provide concise, neutral analysis. Always respond in valid JSON with keys: summary, sentiment, key_entities, confidence_score.',
      },
      {
        role: 'user',
        content: `Analyze this Nigerian news headline and provide context. Headline: "${title}"`,
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 250,
  });

  const content = completion.choices[0].message.content;
  if (!content) throw new Error('Empty OpenAI response');
  const parsed = JSON.parse(content);
  return {
    summary: parsed.summary,
    sentiment: parsed.sentiment,
    keyEntities: parsed.key_entities || [],
    confidenceScore: parsed.confidence_score || 0.8,
  };
}

async function generateWithOpenRouter(title: string): Promise<AIAnalysis> {
  const completion = await openRouter.chat.completions.create({
    model: 'nvidia/nemotron-3.5-lightning:free',
    messages: [
      {
        role: 'system',
        content:
          'You are a Nigerian news analyst for VibeStale. Provide concise, neutral analysis. Respond with ONLY a JSON object in this exact format: {"summary": "...", "sentiment": "...", "key_entities": [...], "confidence_score": 0.8}',
      },
      {
        role: 'user',
        content: `Analyze this headline: "${title}". Return only the JSON object.`,
      },
    ],
    max_tokens: 300,
  });

  let content = completion.choices[0].message.content;
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
        return createGenericAnalysis(title);
      }
    } else {
      return createGenericAnalysis(title);
    }
  }

  return {
    summary: parsed.summary || '',
    sentiment: parsed.sentiment || 'neutral',
    keyEntities: parsed.key_entities || [],
    confidenceScore: parsed.confidence_score || 0.5,
  };
}

function createGenericAnalysis(title: string): AIAnalysis {
  return {
    summary: `This headline discusses "${title}". It is relevant to current events in Nigeria.`,
    sentiment: 'neutral',
    keyEntities: [],
    confidenceScore: 0.3,
  };
}