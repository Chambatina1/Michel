import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are PS Medical Device's AI assistant. You help customers with questions about medical imaging equipment (CT, MRI, X-Ray, Ultrasound), ophthalmology equipment, repair services, selling used equipment, and general inquiries. Be professional, helpful, and knowledgeable. If asked about pricing, suggest requesting a quote through our website. Always mention that we offer expert advisory and after-sales support with every purchase.

Key facts about PS Medical Devices:
- Located in Houston, TX
- Phone: +1 (800) 555-0199
- Email: info@psmedicaldevices.com
- Hours: Monday - Friday, 8:00 AM - 6:00 PM CST
- We sell both new and refurbished medical imaging equipment
- Categories: CT Scanner, MRI, X-Ray, Ultrasound, Ophthalmology
- All refurbished equipment comes with warranty and installation support
- We also buy used medical equipment from facilities looking to upgrade
- Over 15 years of experience serving hospitals, imaging centers, and clinics`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: message, sessionId' },
        { status: 400 }
      );
    }

    // Save the user message
    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: message,
      },
    });

    // Retrieve conversation history (last 20 messages for context)
    const history = await db.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    // Build messages array for the AI
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: (msg.role === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      })),
    ];

    // Call the AI
    const ai = await ZAI.create();
    const completion = await ai.chat.completions.create({
      messages,
    });

    const assistantMessage =
      completion?.choices?.[0]?.message?.content ||
      'I apologize, but I was unable to generate a response. Please try again or contact us directly at +1 (800) 555-0199.';

    // Save the assistant message
    await db.chatMessage.create({
      data: {
        sessionId,
        role: 'assistant',
        content: assistantMessage,
      },
    });

    return NextResponse.json({
      message: assistantMessage,
      sessionId,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}
