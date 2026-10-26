import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { loadCompanyInfo, type CompanyInfo } from '@/lib/company';

// DeepSeek API key comes only from the environment (Render > Environment > DEEPSEEK_API_KEY)
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY?.trim() || '';

function buildSystemPrompt(company: CompanyInfo): string {
  return `You are the AI assistant for ${company.name}, a company that buys, sells, refurbishes and services medical equipment, mainly diagnostic imaging and ophthalmology systems. You are warm, professional, and knowledgeable. Your goal is to help customers find the right equipment, answer questions about products and services, and guide them to make informed decisions.

CRITICAL RULES:
1. ALWAYS respond in the SAME LANGUAGE the user writes in. If they write in Spanish, respond in Spanish. If in English, respond in English.
2. Be conversational and natural - do NOT sound robotic or use generic template responses.
3. Give specific, helpful answers based on the product knowledge provided.
4. When discussing pricing, explain that prices vary based on specifications, condition, and configuration, and guide them to request a personalized quote.
5. Always offer next steps (call, email, visit website, request quote) at appropriate moments.
6. Keep responses concise (3-5 sentences) unless the user asks for detailed information.
7. Never make up specifications, prices, availability, certifications, statistics, years of experience, partnerships, response times or warranty terms - only use the information provided. Warranty and return terms are set per product or invoice; tell the customer they are confirmed in the written quote.

COMPANY INFORMATION:
- Name: ${company.name}
- Established: ${company.foundedYear}
- Address: ${company.address}
- Phone: ${company.phone}
- Email: ${company.email}
- Hours: ${company.hours.replace(/\n/g, '; ')}
- Website: https://psmedicaldevices.com

PRODUCT CATEGORIES:
1. Imaging equipment: CT, MRI, X-Ray, Ultrasound, Mammography, C-Arm
2. Ophthalmology equipment: OCT, slit lamps, retinal cameras, visual field, tonometers, and more
3. Parts & accessories

Current availability is listed in the online catalog (/catalog). Do not name specific models as in stock unless they appear in the knowledge base below.

SERVICES:
- Sale of new and refurbished medical equipment
- Purchase of used equipment (customers can request an offer at /sell-equipment)
- Repair, maintenance and related services - ask the customer to contact the team for scope and availability`;
}

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

    const company = await loadCompanyInfo();

    // Load knowledge entries from database for additional context
    let knowledgeContext = '';
    try {
      const knowledgeEntries = await db.aiKnowledge.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      if (knowledgeEntries.length > 0) {
        knowledgeContext = '\n\nADDITIONAL KNOWLEDGE BASE (use this to answer customer questions accurately):\n';
        for (const entry of knowledgeEntries) {
          knowledgeContext += `- Q: ${entry.question} -> A: ${entry.answer}\n`;
        }
      }
    } catch (dbError) {
      console.error('Could not load knowledge base:', dbError);
    }

    const fullSystemPrompt = buildSystemPrompt(company) + knowledgeContext;

    // Load recent conversation history for multi-turn context (last 10 messages)
    const conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    try {
      const recentMessages = await db.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });
      for (const msg of recentMessages) {
        conversationHistory.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      }
    } catch (historyError) {
      console.error('Could not load conversation history:', historyError);
    }

    // Build messages array with system prompt, history, and new message
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: fullSystemPrompt },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    let assistantMessage: string = '';
    let aiSource: string = '';

    // ═══ PRIMARY: DeepSeek AI ═══
    if (!DEEPSEEK_API_KEY) {
      console.error('DeepSeek skipped: DEEPSEEK_API_KEY is not set');
    } else try {
      console.log('Calling DeepSeek API...');
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.7,
          max_tokens: 800,
          presence_penalty: 0.6,
          frequency_penalty: 0.3,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        assistantMessage = data?.choices?.[0]?.message?.content || '';
        if (assistantMessage) {
          aiSource = 'deepseek';
          console.log('DeepSeek response successful');
        }
      } else {
        const errorText = await response.text();
        console.error('DeepSeek API error:', response.status, errorText);
      }
    } catch (aiError) {
      console.error('DeepSeek connection error:', aiError);
    }

    // ═══ FALLBACK 1: z-ai-web-dev-sdk ═══
    if (!assistantMessage) {
      try {
        console.log('Falling back to z-ai-web-dev-sdk...');
        const ZAI = (await import('z-ai-web-dev-sdk')).default;
        const zai = await ZAI.create();
        const sdkMessages = messages.map(m => ({
          role: m.role as 'system' | 'user' | 'assistant',
          content: m.content,
        }));
        const completion = await zai.chat.completions.create({
          messages: sdkMessages,
        });
        assistantMessage = completion?.choices?.[0]?.message?.content || '';
        if (assistantMessage) {
          aiSource = 'z-ai-sdk';
          console.log('z-ai-web-dev-sdk response successful');
        }
      } catch (sdkError) {
        console.error('z-ai-web-dev-sdk error:', sdkError);
      }
    }

    // ═══ FALLBACK 2: Keyword-based smart responses ═══
    if (!assistantMessage) {
      console.log('Falling back to keyword-based responses...');
      assistantMessage = await getSmartFallback(message, company);
      aiSource = 'keyword-fallback';
    }

    // Save messages to database for conversation history
    try {
      await db.chatMessage.createMany({
        data: [
          { sessionId, role: 'user', content: message },
          { sessionId, role: 'assistant', content: assistantMessage },
        ],
      });
    } catch (saveError) {
      console.error('Could not save chat history:', saveError);
    }

    return NextResponse.json({
      message: assistantMessage,
      sessionId,
      source: aiSource,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      {
        message: 'Lo siento, encontré un error temporal. Por favor intente de nuevo o contáctenos directamente al +1 (305) 244-9340.',
        error: true,
      },
      { status: 200 }
    );
  }
}

// Smart fallback using knowledge base + keyword matching
async function getSmartFallback(message: string, company: CompanyInfo): Promise<string> {
  const lower = message.toLowerCase();

  try {
    const allKnowledge = await db.aiKnowledge.findMany({
      where: { isActive: true },
    });

    if (allKnowledge.length > 0) {
      const scored = allKnowledge.map((entry) => {
        const keywords = entry.keywords.toLowerCase().split(',').map(k => k.trim());
        const questionWords = entry.question.toLowerCase().split(/\s+/);
        let score = 0;

        for (const keyword of keywords) {
          if (keyword && lower.includes(keyword)) score += 3;
        }

        for (const word of questionWords) {
          if (word.length > 3 && lower.includes(word)) score += 1;
        }

        return { entry, score };
      });

      scored.sort((a, b) => b.score - a.score);

      if (scored[0].score >= 2) {
        return scored[0].entry.answer;
      }
    }
  } catch (error) {
    console.error('Knowledge base fallback error:', error);
  }

  return getKeywordBasedResponse(lower, company);
}

function getKeywordBasedResponse(lower: string, c: CompanyInfo): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(lower) ||
    lower.includes('hola') || lower.includes('gracias') ||
    lower.includes('necesito') || lower.includes('equipo') ||
    lower.includes('precio') || lower.includes('información') ||
    lower.includes('vender') || lower.includes('comprar') ||
    lower.includes('servicio') || lower.includes('contacto') ||
    lower.includes('buenos días') || lower.includes('buenas tardes') ||
    lower.includes('buenas noches') || lower.includes('cómo estás');

  const hours = c.hours.replace(/\n/g, ', ');
  const contactEs = `📞 ${c.phone}\n📧 ${c.email}`;
  const contactEn = `📞 ${c.phone}\n📧 ${c.email}`;

  if (/^(hi|hello|hey|hola|good morning|good afternoon|good evening|buenos días|buenas tardes|buenas noches|qué tal|que tal)/.test(lower)) {
    return isSpanish
      ? `¡Hola! Bienvenido a ${c.name}. Estamos aquí para ayudarle con equipos de imagenología médica y oftalmología. ¿En qué puedo asistirle? Puede preguntar sobre equipos, cotizaciones, servicios, o la venta de su equipo usado.`
      : `Hello! Welcome to ${c.name}. We are here to help you with medical imaging and ophthalmology equipment. How can I assist you? Feel free to ask about equipment, quotes, services, or selling your used equipment.`;
  }

  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('precio') || lower.includes('cuanto') || lower.includes('cuánto') || lower.includes('cotización') || lower.includes('valor')) {
    return isSpanish
      ? `Para cotizaciones personalizadas, contáctenos directamente. El precio depende del modelo, la configuración y la condición del equipo.\n\n${contactEs}\n\nTambién puede visitar nuestra página de Contacto para enviar su solicitud.`
      : `For personalized quotes, contact us directly. Pricing depends on the model, configuration and condition of the equipment.\n\n${contactEn}\n\nYou can also visit our Contact page to submit a quote request.`;
  }

  if (lower.includes('sell') || lower.includes('vender') || lower.includes('compr') || lower.includes('buyback') || lower.includes('compra') || lower.includes('venta')) {
    return isSpanish
      ? `¡Compramos equipos médicos usados!\n\n1. Visite "Sell Equipment" en nuestro sitio\n2. Ingrese los detalles de su equipo\n3. Nuestro equipo revisará la información y le contactará\n\n📞 ${c.phone}`
      : `We buy used medical equipment!\n\n1. Visit "Sell Equipment" on our website\n2. Enter your equipment details\n3. Our team will review the information and contact you\n\n📞 ${c.phone}`;
  }

  if (lower.includes('repair') || lower.includes('service') || lower.includes('mantenimiento') || lower.includes('soporte') || lower.includes('reparación') || lower.includes('technical')) {
    return isSpanish
      ? `Ofrecemos servicios relacionados con equipos médicos de imagenología y oftalmología. Contáctenos con la marca, el modelo y el problema para confirmar el alcance y la disponibilidad.\n\n${contactEs}`
      : `We offer services for medical imaging and ophthalmology equipment. Contact us with the brand, model and issue so we can confirm scope and availability.\n\n${contactEn}`;
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('llamar') || lower.includes('contacto') || lower.includes('teléfono') || lower.includes('ubicación') || lower.includes('location') || lower.includes('dirección')) {
    return isSpanish
      ? `Puede contactarnos:\n\n${contactEs}\n📍 ${c.address}\n🕐 ${hours}\n\nO visite nuestra página de Contacto.`
      : `You can reach us:\n\n${contactEn}\n📍 ${c.address}\n🕐 ${hours}\n\nOr visit our Contact page.`;
  }

  if (lower.includes('thank') || lower.includes('gracias') || lower.includes('thanks')) {
    return isSpanish
      ? '¡De nada! Fue un placer ayudarle. Si tiene más preguntas, no dude en escribirnos.'
      : 'You are welcome! It was a pleasure helping you. If you have more questions, feel free to ask.';
  }

  if (lower.includes('refurbish') || lower.includes('reacondicionado') || lower.includes('used equipment') || lower.includes('equipo usado') || lower.includes('garantía') || lower.includes('warranty')) {
    return isSpanish
      ? `Los términos de garantía y lo que incluye cada equipo (instalación, capacitación, accesorios) se confirman por escrito en la cotización de cada producto.\n\n${contactEs}`
      : `Warranty terms and what is included with each unit (installation, training, accessories) are confirmed in writing in the quote for that product.\n\n${contactEn}`;
  }

  if (lower.includes('ct') || lower.includes('scanner') || lower.includes('tomografía') || lower.includes('mri') || lower.includes('resonancia') || lower.includes('ultrasound') || lower.includes('ultrasonido') || lower.includes('x-ray') || lower.includes('rayos x') || lower.includes('ophthalmol') || lower.includes('oftalm') || lower.includes('oct')) {
    return isSpanish
      ? `Puede ver el inventario disponible en nuestro catálogo (/catalog). Si no encuentra el equipo que busca, contáctenos y le ayudamos a localizarlo.\n\n${contactEs}`
      : `You can browse current inventory in our catalog (/catalog). If you don't see the unit you need, contact us and we'll help you find it.\n\n${contactEn}`;
  }

  if (isSpanish) {
    return `Gracias por su interés en ${c.name}. Puedo ayudarle con:\n\n• Equipos de imagenología (CT, MRI, Rayos X, Ultrasonido)\n• Equipos de oftalmología\n• Partes y accesorios\n• Cotizaciones\n• Venta de equipos usados\n• Servicios\n\n${contactEs}\n\n¿Sobre qué tema le gustaría más información?`;
  }

  return `Thank you for your interest in ${c.name}. I can help you with:\n\n• Imaging equipment (CT, MRI, X-Ray, Ultrasound)\n• Ophthalmology equipment\n• Parts and accessories\n• Quotes\n• Selling your used equipment\n• Services\n\n${contactEn}\n\nWhat would you like to know more about?`;
}
