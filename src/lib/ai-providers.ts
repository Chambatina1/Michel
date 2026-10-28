// AI providers, tried in order. Keys come only from the environment (Render > Environment).
// Both use the same OpenAI-style chat completions API.
export const AI_PROVIDERS = [
  {
    name: 'openai',
    url: 'https://api.openai.com/v1/chat/completions',
    key: process.env.OPENAI_API_KEY?.trim() || '',
    model: process.env.OPENAI_MODEL?.trim() || 'gpt-4o-mini',
  },
  {
    name: 'deepseek',
    url: 'https://api.deepseek.com/v1/chat/completions',
    key: process.env.DEEPSEEK_API_KEY?.trim() || '',
    model: 'deepseek-chat',
  },
];

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

// Sends one chat completion to the first configured provider that answers.
// Throws if no key is set or every provider fails.
export async function completeChat(
  messages: ChatMessage[],
  options: { maxTokens?: number; temperature?: number; json?: boolean } = {}
): Promise<{ text: string; provider: string }> {
  const configured = AI_PROVIDERS.filter((p) => p.key);
  if (configured.length === 0) {
    throw new Error('No AI key configured (OPENAI_API_KEY or DEEPSEEK_API_KEY)');
  }
  let lastError = '';
  for (const provider of configured) {
    try {
      const res = await fetch(provider.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${provider.key}` },
        body: JSON.stringify({
          model: provider.model,
          messages,
          temperature: options.temperature ?? 0.6,
          max_tokens: options.maxTokens ?? 1500,
          ...(options.json ? { response_format: { type: 'json_object' } } : {}),
        }),
      });
      if (!res.ok) {
        lastError = `${provider.name} ${res.status}: ${(await res.text()).slice(0, 200)}`;
        console.error('AI completion error:', lastError);
        continue;
      }
      const data = await res.json();
      const text: string = data?.choices?.[0]?.message?.content || '';
      if (text) return { text, provider: provider.name };
      lastError = `${provider.name}: empty response`;
    } catch (error) {
      lastError = `${provider.name}: ${(error as Error).message}`;
      console.error('AI completion error:', lastError);
    }
  }
  throw new Error(lastError || 'AI request failed');
}
