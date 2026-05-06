import { NextRequest, NextResponse } from 'next/server';

// WhatsApp Business API configuration
const WHATSAPP_API_VERSION = 'v21.0';
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || '1047975088407521';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || 'EAAsB3D6DI6MBRcehuFQNDufXsZAmD0mZCgRAgZBNy2EYR2sSh01q9DOXRTJHiDCMMbPXm9VPzwQtw5cIDYZBRhOGBq8oiiXZBcoTluLmp7ZCGytZCAyGwvgHIbWYq15U2EN4sfrsELv5ze239IoSDaZAujFP4ZCGQYVeJdtfAQhwp90vZA7yRHywiphZBCLlFadVG6N8qpYdvGnGlJA5g5gYjz3L7gUGsThetLi7mOpszyIZAb62vrgxyP0J0kXQwlKjFMOYhXyzsUpV57cbfCjUmHcoFe7ZCSBZCvC42QymZA5NLsZD';

// PS Medical Devices phone number (destination - the business receives messages)
const BUSINESS_PHONE = '13052449340'; // +1 (305) 244-9340

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, message, email, subject } = body;

    if (!message || !phone) {
      return NextResponse.json(
        { error: 'Phone and message are required' },
        { status: 400 }
      );
    }

    // Format the message for WhatsApp
    let formattedMessage = '*New message from PS Medical Devices website*\n\n';

    if (name) {
      formattedMessage += `*Name:* ${name}\n`;
    }
    if (email) {
      formattedMessage += `*Email:* ${email}\n`;
    }
    formattedMessage += `*Phone:* ${phone}\n`;
    if (subject) {
      formattedMessage += `*Subject:* ${subject}\n`;
    }

    formattedMessage += `\n*Message:*\n${message}\n\n`;
    formattedMessage += `---\nSent from website contact form`;

    // Send via WhatsApp Business API text message
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
          to: BUSINESS_PHONE,
          type: 'text',
          text: {
            preview_url: false,
            body: formattedMessage,
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log('WhatsApp message sent successfully:', data);
      return NextResponse.json({
        success: true,
        messageId: data.messages?.[0]?.id,
      });
    } else {
      const errorData = await response.json();
      console.error('WhatsApp API error:', JSON.stringify(errorData));
      return NextResponse.json(
        {
          success: false,
          error: errorData.error?.message || 'Failed to send message via WhatsApp',
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('WhatsApp send error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
