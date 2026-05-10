import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// DeepSeek API Key - fallback hardcoded in case env var is not set
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-7bb9cff20c1349a2b6c561b96da0b1c9';

const SYSTEM_PROMPT = `You are the AI assistant for P&S Medical Device Inc., a company specializing in medical imaging and ophthalmology equipment. You are warm, professional, and knowledgeable. Your goal is to help customers find the right equipment, answer questions about products and services, and guide them to make informed decisions.

CRITICAL RULES:
1. ALWAYS respond in the SAME LANGUAGE the user writes in. If they write in Spanish, respond in Spanish. If in English, respond in English.
2. Be conversational and natural - do NOT sound robotic or use generic template responses.
3. Give specific, helpful answers based on the product knowledge provided.
4. When discussing pricing, explain that prices vary based on specifications, condition, and configuration, and guide them to request a personalized quote.
5. Always offer next steps (call, email, visit website, request quote) at appropriate moments.
6. Keep responses concise (3-5 sentences) unless the user asks for detailed information.
7. Never make up specifications, prices, or availability - only use the information provided.

COMPANY INFORMATION:
- Name: P&S Medical Device Inc.
- Address: 2234 Winter Woods, Unidad 1000, Winter Park, FL 32792
- Phone: +1 (305) 244-9340
- Email: michelgg0102780@gmail.com
- Hours: Monday - Friday, 8:00 AM - 6:00 PM CST
- Website: https://ps-medical-devices.onrender.com
- Experience: Over 15 years serving hospitals, imaging centers, and clinics

PRODUCT CATEGORIES:
1. CT Scanners - GE Revolution (256-slice), Toshiba Aquilion ONE (320-row), Siemens SOMATOM series
2. MRI Systems - Siemens Magnetom Vida 3T, Hitachi Echelon Oval 1.5T, GE Signa series
3. X-Ray Equipment - Carestream DRX-Evolution (digital), GE Optima XR646, Shimadzu Sonialvision (R/F)
4. Ultrasound Systems - Philips IU Elite, Canon Aplio i800, GE LOGIQ E10
5. Ophthalmology Equipment - Zeiss Cirrus HD-OCT 6000, Topcon Maestro 2 OCT, Heidelberg Spectralis OCT

SERVICES:
- Sale of new and refurbished medical imaging equipment
- Equipment trade-in and purchase of used equipment
- Repair and maintenance services (preventive, emergency, calibration, software upgrades)
- Professional installation and staff training
- After-sales support and warranty
- Financing options available

BRANDS WE WORK WITH:
GE Healthcare, Siemens Healthineers, Philips, Canon Medical, Toshiba, Hitachi, Zeiss, Topcon, Carestream, Shimadzu

REFURBISHED EQUIPMENT:
All refurbished equipment undergoes rigorous inspection and certification. Includes warranty, professional installation, staff training, and post-sale technical support.`;

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

    const fullSystemPrompt = SYSTEM_PROMPT + knowledgeContext;

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

    // ═══ PRIMARY: DeepSeek AI ═══
    try {
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
          console.log('DeepSeek response successful:', assistantMessage.substring(0, 100));
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
        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'system', content: fullSystemPrompt },
            { role: 'user', content: message },
          ],
        });
        assistantMessage = completion?.choices?.[0]?.message?.content || '';
        if (assistantMessage) {
          console.log('z-ai-web-dev-sdk response successful');
        }
      } catch (sdkError) {
        console.error('z-ai-web-dev-sdk error:', sdkError);
      }
    }

    // ═══ FALLBACK 2: Keyword-based smart responses ═══
    if (!assistantMessage) {
      console.log('Falling back to keyword-based responses...');
      assistantMessage = await getSmartFallback(message);
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
      source: assistantMessage ? 'deepseek' : 'fallback',
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
async function getSmartFallback(message: string): Promise<string> {
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

  return getKeywordBasedResponse(lower);
}

function getKeywordBasedResponse(lower: string): string {
  const isSpanish = /[áéíóúñ¿¡]/.test(lower) ||
    lower.includes('hola') || lower.includes('gracias') ||
    lower.includes('necesito') || lower.includes('equipo') ||
    lower.includes('precio') || lower.includes('información') ||
    lower.includes('vender') || lower.includes('comprar') ||
    lower.includes('servicio') || lower.includes('contacto') ||
    lower.includes('buenos días') || lower.includes('buenas tardes') ||
    lower.includes('buenas noches') || lower.includes('cómo estás');

  if (/^(hi|hello|hey|hola|good morning|good afternoon|good evening|buenos días|buenas tardes|buenas noches|qué tal|que tal)/.test(lower)) {
    return isSpanish
      ? '¡Hola! Bienvenido a P&S Medical Device Inc. Estamos aquí para ayudarle con equipos de imagenología médica. ¿En qué puedo asistirle? Puede preguntar sobre equipos CT, MRI, Rayos X, Ultrasonido, Oftalmología, cotizaciones, servicios de reparación, o la venta de su equipo usado.'
      : 'Hello! Welcome to P&S Medical Device Inc. We are here to help you with medical imaging equipment. How can I assist you? Feel free to ask about CT, MRI, X-Ray, Ultrasound, Ophthalmology equipment, quotes, repair services, or selling your used equipment.';
  }

  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('precio') || lower.includes('cuanto') || lower.includes('cuánto') || lower.includes('cotización') || lower.includes('valor')) {
    return isSpanish
      ? 'Para cotizaciones personalizadas, contáctenos directamente. Ofrecemos precios competitivos en equipos nuevos y reacondicionados con opciones de financiamiento.\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n\nTambién puede visitar nuestra página de Contacto para enviar su solicitud.'
      : 'For personalized quotes, contact us directly. We offer competitive pricing on new and refurbished equipment with financing options.\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n\nYou can also visit our Contact page to submit a quote request.';
  }

  if (lower.includes('sell') || lower.includes('vender') || lower.includes('compr') || lower.includes('buyback') || lower.includes('compra') || lower.includes('venta')) {
    return isSpanish
      ? '¡Compramos equipos médicos usados! Ofrecemos precios justos y manejamos toda la logística de retiro.\n\n1. Visite "Vender su Equipo" en nuestro sitio\n2. Ingrese los detalles de su equipo\n3. Reciba una oferta en 48 horas\n\n📞 Llame al +1 (305) 244-9340 para atención inmediata.'
      : 'We buy used medical imaging equipment! We offer fair prices and handle all removal logistics.\n\n1. Visit "Sell Your Equipment" on our website\n2. Enter your equipment details\n3. Receive an offer within 48 hours\n\n📞 Call +1 (305) 244-9340 for immediate assistance.';
  }

  if (lower.includes('repair') || lower.includes('service') || lower.includes('mantenimiento') || lower.includes('soporte') || lower.includes('reparación') || lower.includes('technical')) {
    return isSpanish
      ? 'Ofrecemos servicios completos de reparación y mantenimiento para equipos de imagenología médica:\n\n• Mantenimiento preventivo\n• Reparación de emergencia\n• Calibración y certificación\n• Actualizaciones de software\n\n📞 +1 (305) 244-9340 para solicitudes de servicio.'
      : 'We offer comprehensive repair and maintenance services for medical imaging equipment:\n\n• Preventive maintenance programs\n• Emergency repair services\n• Equipment calibration and certification\n• Software upgrades\n\n📞 Call +1 (305) 244-9340 for service requests.';
  }

  if (lower.includes('ct') || lower.includes('scanner') || lower.includes('tomografía') || lower.includes('tac')) {
    return isSpanish
      ? 'Contamos con escáneres CT de las mejores marcas: GE Revolution (256 cortes), Toshiba Aquilion ONE (320 filas), Siemens SOMATOM. Todas las unidades reacondicionadas incluyen garantía, instalación y capacitación. Contáctenos para disponibilidad.'
      : 'We carry CT Scanners from top brands: GE Revolution (256-slice), Toshiba Aquilion ONE (320-row), Siemens SOMATOM. All refurbished units include warranty, installation, and training. Contact us for current availability.';
  }

  if (lower.includes('mri') || lower.includes('resonancia') || lower.includes('rmn')) {
    return isSpanish
      ? 'Nuestro inventario MRI incluye: Siemens Magnetom Vida 3T, Hitachi Echelon Oval 1.5T, GE Signa series. Sistemas nuevos y reacondicionados con paquetes completos de instalación y garantía.'
      : 'Our MRI inventory includes: Siemens Magnetom Vida 3T, Hitachi Echelon Oval 1.5T, GE Signa series. Both new and refurbished systems with full installation and warranty packages.';
  }

  if (lower.includes('ultrasound') || lower.includes('ecogra') || lower.includes('ultrasonido')) {
    return isSpanish
      ? 'Sistemas de ultrasonido disponibles: Philips IU Elite, Canon Aplio i800, GE LOGIQ E10. Ideales para radiología, cardiología, obstetricia y punto de atención.'
      : 'Available ultrasound systems: Philips IU Elite, Canon Aplio i800, GE LOGIQ E10. Ideal for radiology, cardiology, OB/GYN, and point-of-care.';
  }

  if (lower.includes('x-ray') || lower.includes('rayos x') || lower.includes('radiogra')) {
    return isSpanish
      ? 'Equipos de rayos X: Carestream DRX-Evolution (digital), GE Optima XR646, Shimadzu Sonialvision (R/F). Todos con instalación, capacitación y garantía incluidas.'
      : 'X-Ray equipment: Carestream DRX-Evolution (digital), GE Optima XR646, Shimadzu Sonialvision (R/F). All include installation, training, and warranty.';
  }

  if (lower.includes('ophthalmol') || lower.includes('oct') || lower.includes('eye') || lower.includes('oftalm') || lower.includes('ojo') || lower.includes('visión') || lower.includes('vision')) {
    return isSpanish
      ? 'Equipos oftalmológicos: Zeiss Cirrus HD-OCT 6000, Topcon Maestro 2 OCT, Heidelberg Spectralis OCT. Para manejo de glaucoma, enfermedades retinianas y cuidado ocular integral.'
      : 'Ophthalmology equipment: Zeiss Cirrus HD-OCT 6000, Topcon Maestro 2 OCT, Heidelberg Spectralis OCT. For glaucoma management, retinal disease assessment, and comprehensive eye care.';
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('llamar') || lower.includes('contacto') || lower.includes('teléfono') || lower.includes('ubicación') || lower.includes('location') || lower.includes('dirección')) {
    return isSpanish
      ? 'Puede contactarnos:\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n📍 2234 Winter Woods, Unidad 1000, Winter Park, FL 32792\n🕐 Lunes a Viernes, 8:00 AM - 6:00 PM CST\n\nO visite nuestra página de Contacto.'
      : 'You can reach us:\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n📍 2234 Winter Woods, Suite 1000, Winter Park, FL 32792\n🕐 Monday - Friday, 8:00 AM - 6:00 PM CST\n\nOr visit our Contact page.';
  }

  if (lower.includes('thank') || lower.includes('gracias') || lower.includes('thanks')) {
    return isSpanish
      ? '¡De nada! Fue un placer ayudarle. Si tiene más preguntas, no dude en escribirnos. Estamos aquí para asistirle. ¡Que tenga un excelente día!'
      : 'You are welcome! It was a pleasure helping you. If you have more questions, feel free to ask. We are always here to assist you. Have a great day!';
  }

  if (lower.includes('refurbish') || lower.includes('reacondicionado') || lower.includes('used equipment') || lower.includes('equipo usado') || lower.includes('garantía') || lower.includes('warranty')) {
    return isSpanish
      ? 'Todos nuestros equipos reacondicionados pasan por un riguroso proceso de inspección y certificación. Incluyen: garantía, instalación profesional, capacitación del personal, y soporte técnico post-venta. ¡La misma calidad a una fracción del precio!'
      : 'All our refurbished equipment undergoes rigorous inspection and certification. They include: warranty, professional installation, staff training, and post-sale technical support. Same quality at a fraction of the price!';
  }

  if (lower.includes('ge') || lower.includes('siemens') || lower.includes('philips') || lower.includes('toshiba') || lower.includes('canon') || lower.includes('hitachi') || lower.includes('zeiss') || lower.includes('topcon') || lower.includes('carestream') || lower.includes('shimadzu')) {
    return isSpanish
      ? 'Trabajamos con las marcas líderes del mercado: GE Healthcare, Siemens Healthineers, Philips, Canon Medical, Toshiba, Hitachi, Zeiss, Topcon, Carestream, Shimadzu, y más. ¿Hay alguna marca específica que le interese? Contáctenos para verificar disponibilidad.'
      : 'We work with leading brands: GE Healthcare, Siemens Healthineers, Philips, Canon Medical, Toshiba, Hitachi, Zeiss, Topcon, Carestream, Shimadzu, and more. Is there a specific brand you are interested in? Contact us for availability.';
  }

  if (isSpanish) {
    return 'Gracias por su interés en P&S Medical Device Inc. Puedo ayudarle con:\n\n• Escáneres CT y equipos MRI\n• Equipos de Rayos X y Ultrasonido\n• Equipos de Oftalmología\n• Cotizaciones y precios\n• Venta de equipos usados\n• Servicios de reparación y mantenimiento\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n\n¿Sobre qué tema le gustaría más información?';
  }

  return 'Thank you for your interest in P&S Medical Device Inc. I can help you with:\n\n• CT Scanners and MRI Systems\n• X-Ray and Ultrasound Equipment\n• Ophthalmology Equipment\n• Quotes and Pricing\n• Selling your used equipment\n• Repair and maintenance services\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com\n\nWhat would you like to know more about?';
}
