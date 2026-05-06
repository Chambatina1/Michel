import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const status: Record<string, string> = {};

  // Check Z-AI SDK
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default;
    const zai = await ZAI.create();
    status['z-ai-sdk'] = 'loaded';

    // Test a simple completion
    const testStart = Date.now();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Respond with only: OK' },
        { role: 'user', content: 'test' },
      ],
      max_tokens: 5,
    });
    const testEnd = Date.now();
    status['z-ai-sdk-test'] = completion?.choices?.[0]?.message?.content || 'no response';
    status['z-ai-sdk-latency'] = `${testEnd - testStart}ms`;
  } catch (error: any) {
    status['z-ai-sdk'] = `error: ${error.message}`;
  }

  // Check OpenAI
  status['openai-key-set'] = process.env.OPENAI_API_KEY ? 'yes' : 'no';

  // Check database
  try {
    const knowledgeCount = await prisma.aiKnowledge.count();
    status['db-connected'] = 'yes';
    status['knowledge-entries'] = String(knowledgeCount);
  } catch (error: any) {
    status['db-connected'] = `error: ${error.message}`;
  }

  // Check env
  status['node-env'] = process.env.NODE_ENV || 'unknown';
  status['database-url-set'] = process.env.DATABASE_URL ? 'yes' : 'no (using hardcoded)';

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    service: 'ps-medical-v2',
    backends: status,
  });
}
