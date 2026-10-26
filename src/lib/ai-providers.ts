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
