import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'ps_medical_verify_2024';

/**
 * GET - Webhook verification (Meta requires this)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified successfully');
    return new NextResponse(challenge || '', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

/**
 * POST - Receive incoming WhatsApp messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if this is a WhatsApp webhook event
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages?.[0]) {
        const msg = value.messages[0];
        const from = msg.from; // Sender's phone number
        const msgType = msg.type;
        const msgBody = msg.text?.body || '';

        console.log(`Received WhatsApp message from ${from}: ${msgBody}`);

        // Save incoming message to database
        try {
          await prisma.chatMessage.create({
            data: {
              sessionId: `whatsapp_${from}`,
              role: 'user',
              content: `WhatsApp (${from}): ${msgBody}`,
            },
          });
        } catch (dbError) {
          console.error('Could not save WhatsApp message:', dbError);
        }

        // Auto-reply with a welcome message
        await sendAutoReply(from, msgBody);
      }
    }

    // Always return 200 to Meta
    return NextResponse.json({ status: 'received' });
  } catch (error: any) {
    console.error('WhatsApp webhook error:', error);
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}

async function sendAutoReply(to: string, userMessage: string) {
  try {
    const WHATSAPP_API_VERSION = 'v21.0';
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '1047975088407521';
    const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'EAAsB3D6DI6MBRcehuFQNDufXsZAmD0mZCgRAgZBNy2EYR2sSh01q9DOXRTJHiDCMMbPXm9VPzwQtw5cIDYZBRhOGBq8oiiXZBcoTluLmp7ZCGytZCAyGwvgHIbWYq15U2EN4sfrsELv5ze239IoSDaZAujFP4ZCGQYVeJdtfAQhwp90vZA7yRHywiphZBCLlFadVG6N8qpYdvGnGlJA5g5gYjz3L7gUGsThetLi7mOpszyIZAb62vrgxyP0J0kXQwlKjFMOYhXyzsUpV57cbfCjUmHcoFe7ZCSBZCvC42QymZA5NLsZD';

    const lower = userMessage.toLowerCase();

    // Smart keyword-based auto-reply
    let reply = 'Thank you for contacting PS Medical Devices! 🏥\n\nOur team will respond to you shortly. For immediate assistance:\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n🌐 ps-medical-devices.onrender.com\n\nHours: Mon-Fri, 8:00 AM - 6:00 PM CST';

    if (lower.includes('precio') || lower.includes('price') || lower.includes('cotización') || lower.includes('quote') || lower.includes('cost')) {
      reply = 'Thank you for your interest! 💰\n\nFor personalized pricing and quotes, please provide:\n- Equipment type you need\n- Brand preference\n- New or refurbished\n- Your facility location\n\nOur team will prepare a custom quote. You can also call us directly:\n📞 +1 (305) 244-9340';
    } else if (lower.includes('vender') || lower.includes('sell') || lower.includes('compra') || lower.includes('buyback')) {
      reply = 'We buy used medical equipment! ♻️\n\nTo get an offer, please share:\n- Equipment type and model\n- Year of manufacture\n- Current condition\n- Your location\n\nWe handle pickup logistics and offer fair prices.\n📞 +1 (305) 244-9340 for immediate assistance.';
    } else if (lower.includes('repar') || lower.includes('service') || lower.includes('mantenimiento') || lower.includes('repair')) {
      reply = 'PS Medical Devices offers expert repair services! 🔧\n\nOur certified technicians provide:\n- Preventive maintenance\n- Emergency repairs\n- Equipment calibration\n- Software updates\n\n📞 Call +1 (305) 244-9340 for service requests';
    } else if (lower.includes('ct') || lower.includes('mri') || lower.includes('rayos') || lower.includes('x-ray') || lower.includes('ultraso') || lower.includes('ecogra') || lower.includes('oftalm')) {
      reply = 'Great choice! We have extensive inventory in that category. 🏥\n\nFor current availability and pricing:\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n\nOr visit our website:\n🌐 ps-medical-devices.onrender.com';
    }

    const response = await fetch(
      `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            preview_url: false,
            body: reply,
          },
        }),
      }
    );

    if (response.ok) {
      console.log(`Auto-reply sent to ${to}`);
      // Save auto-reply to database
      try {
        await prisma.chatMessage.create({
          data: {
            sessionId: `whatsapp_${to}`,
            role: 'assistant',
            content: `WhatsApp Auto-reply: ${reply}`,
          },
        });
      } catch (dbError) {
        console.error('Could not save auto-reply:', dbError);
      }
    } else {
      const err = await response.json();
      console.error('Failed to send auto-reply:', JSON.stringify(err));
    }
  } catch (error: any) {
    console.error('Auto-reply error:', error);
  }
}
