import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SYSTEM_PROMPT = `You are PS Medical Device's AI assistant. You help customers with questions about medical imaging equipment (CT, MRI, X-Ray, Ultrasound), ophthalmology equipment, repair services, selling used equipment, and general inquiries. Be professional, helpful, and knowledgeable. If asked about pricing, suggest requesting a quote through our website. Always mention that we offer expert advisory and after-sales support with every purchase. Respond in the same language the user writes in (if they write in Spanish, respond in Spanish).

Key facts about PS Medical Devices:
- Located at 2234 Winter Woods, Unidad 1000, Winter Park, FL 32792
- Phone: +1 (305) 244-9340
- Email: michelgg0102780@gmail.com
- Hours: Monday - Friday, 8:00 AM - 6:00 PM CST
- We sell both new and refurbished medical imaging equipment
- Categories: CT Scanner, MRI, X-Ray, Ultrasound, Ophthalmology
- All refurbished equipment comes with warranty and installation support
- We also buy used medical equipment from facilities looking to upgrade
- Over 15 years of experience serving hospitals, imaging centers, and clinics
- Website: https://ps-medical-devices.onrender.com`;

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

    // Load active knowledge entries from database
    let knowledgeContext = '';
    try {
      const knowledgeEntries = await prisma.aiKnowledge.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      if (knowledgeEntries.length > 0) {
        knowledgeContext = '\n\nAdditional company knowledge (use this information to answer questions accurately):\n';
        for (const entry of knowledgeEntries) {
          knowledgeContext += `\nQ: ${entry.question}\nA: ${entry.answer}\n`;
        }
      }
    } catch (dbError) {
      console.error('Could not load knowledge base:', dbError);
    }

    // Build system prompt with knowledge context
    const fullSystemPrompt = SYSTEM_PROMPT + (knowledgeContext || '');

    // Build messages array for the AI
    const messages = [
      { role: 'system' as const, content: fullSystemPrompt },
      { role: 'user' as const, content: message },
    ];

    let assistantMessage: string;

    // Try Z-AI SDK first (built-in AI backend, no API key needed)
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      const completion = await zai.chat.completions.create({
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 800,
      });

      assistantMessage =
        completion?.choices?.[0]?.message?.content ||
        'Lo siento, no pude generar una respuesta. Por favor intente de nuevo o contáctenos directamente.';

      console.log('Z-AI SDK response successful');
    } catch (zaiError) {
      console.error('Z-AI SDK error, trying OpenAI fallback:', zaiError);

      // Try OpenAI API as secondary option
      if (process.env.OPENAI_API_KEY) {
        try {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages,
              temperature: 0.7,
              max_tokens: 800,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            assistantMessage =
              data?.choices?.[0]?.message?.content ||
              'Lo siento, no pude generar una respuesta. Por favor intente de nuevo o contáctenos directamente.';
            console.log('OpenAI API response successful');
          } else {
            const errorText = await response.text();
            console.error('OpenAI API error response:', response.status, errorText);
            throw new Error(`OpenAI API error: ${response.status}`);
          }
        } catch (aiError) {
          console.error('OpenAI API error, using knowledge base fallback:', aiError);
          assistantMessage = await getSmartFallback(message);
        }
      } else {
        // Ultimate fallback to keyword-based response
        console.warn('No AI backend available, using knowledge base fallback');
        assistantMessage = await getSmartFallback(message);
      }
    }

    // Save messages to database for history
    try {
      await prisma.chatMessage.createMany({
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
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { message: 'Lo siento, encontré un error. Por favor contáctenos al +1 (305) 244-9340 para asistencia inmediata.' },
      { status: 200 }
    );
  }
}

// Smart fallback that uses the knowledge base
async function getSmartFallback(message: string): Promise<string> {
  const lower = message.toLowerCase();

  try {
    // Search knowledge base for relevant entries
    const allKnowledge = await prisma.aiKnowledge.findMany({
      where: { isActive: true },
    });

    if (allKnowledge.length > 0) {
      // Score each knowledge entry by keyword relevance
      const scored = allKnowledge.map((entry) => {
        const keywords = entry.keywords.toLowerCase().split(',').map(k => k.trim());
        const questionWords = entry.question.toLowerCase().split(/\s+/);
        let score = 0;

        // Check keyword matches
        for (const keyword of keywords) {
          if (keyword && lower.includes(keyword)) score += 3;
        }

        // Check question word matches
        for (const word of questionWords) {
          if (word.length > 3 && lower.includes(word)) score += 1;
        }

        return { entry, score };
      });

      // Sort by score descending
      scored.sort((a, b) => b.score - a.score);

      // If we have a good match (score >= 2), use it
      if (scored[0].score >= 2) {
        return scored[0].entry.answer;
      }

      // If there's knowledge but no specific match, mention what we can help with
      if (allKnowledge.length > 0) {
        const categories = [...new Set(allKnowledge.map(k => k.category))];
        return getKeywordBasedResponse(lower, categories);
      }
    }
  } catch (error) {
    console.error('Knowledge base fallback error:', error);
  }

  // Ultimate fallback with keyword matching
  return getKeywordBasedResponse(lower, []);
}

function getKeywordBasedResponse(lower: string, knowledgeCategories: string[]): string {
  // Detect language
  const isSpanish = /[áéíóúñ¿¡]/.test(lower) ||
    lower.includes('hola') || lower.includes('gracias') ||
    lower.includes('necesito') || lower.includes('equipo') ||
    lower.includes('precio') || lower.includes('información') ||
    lower.includes('vender') || lower.includes('comprar') ||
    lower.includes('servicio') || lower.includes('contacto');

  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('precio') || lower.includes('cuanto') || lower.includes('cuánto') || lower.includes('cotización')) {
    return isSpanish
      ? 'Para información de precios y cotizaciones personalizadas, le recomendamos contactar a nuestro equipo directamente:\n\n📞 Teléfono: +1 (305) 244-9340\n📧 Correo: michelgg0102780@gmail.com\n\nTambién puede llenar nuestro formulario de solicitud de cotización en la página de Contacto. Ofrecemos precios competitivos tanto en equipos nuevos como reacondicionados.'
      : 'For pricing information and personalized quotes, I recommend contacting our team directly:\n\n📞 Phone: +1 (305) 244-9340\n📧 Email: michelgg0102780@gmail.com\n\nYou can also fill out our quote request form on the Contact page. We offer competitive pricing on both new and refurbished equipment!';
  }

  if (lower.includes('sell') || lower.includes('vender') || lower.includes('compr') || lower.includes('buyback') || lower.includes('compra') || lower.includes('venta')) {
    return isSpanish
      ? '¡Compramos equipos médicos usados! Ofrecemos precios justos y nos encargamos de toda la logística para el retiro del equipo. Para comenzar:\n\n1. Visite nuestra página "Vender su Equipo"\n2. Llene el formulario con los detalles de su equipo\n3. Nuestro equipo evaluará y proporcionará una oferta en 48 horas\n\n¡Llámenos al +1 (305) 244-9340 para asistencia inmediata!'
      : 'We buy used medical imaging equipment! We offer fair prices and handle all logistics for equipment removal. To get started:\n\n1. Visit our "Sell Your Equipment" page\n2. Fill out the form with your equipment details\n3. Our team will evaluate and provide an offer within 48 hours\n\nCall us at +1 (305) 244-9340 for immediate assistance!';
  }

  if (lower.includes('repair') || lower.includes('service') || lower.includes('mantenimiento') || lower.includes('soporte') || lower.includes('reparación')) {
    return isSpanish
      ? 'PS Medical Devices ofrece servicios integrales de reparación y mantenimiento para todo tipo de equipos de imagenología médica. Nuestros técnicos certificados proporcionan:\n\n• Programas de mantenimiento preventivo\n• Servicios de reparación de emergencia\n• Calibración y certificación de equipos\n• Actualizaciones de software\n\n¡Contáctenos al +1 (305) 244-9340 para solicitudes de servicio!'
      : 'PS Medical Devices offers comprehensive repair and maintenance services for all types of medical imaging equipment. Our certified technicians provide:\n\n• Preventive maintenance programs\n• Emergency repair services\n• Equipment calibration and certification\n• Software upgrades and updates\n\nContact us at +1 (305) 244-9340 for service requests!';
  }

  if (lower.includes('ct') || lower.includes('scanner') || lower.includes('tomografía') || lower.includes('tac')) {
    return isSpanish
      ? 'Contamos con una amplia selección de Escáneres CT incluyendo:\n\n• GE Revolution CT Scanner (256 cortes)\n• Toshiba Aquilion ONE CT (320 filas)\n• Siemens SOMATOM series\n\nTodas las unidades reacondicionadas incluyen garantía, soporte de instalación y capacitación. ¡Contáctenos para disponibilidad y precios actuales!'
      : 'We carry a wide selection of CT Scanners including:\n\n• GE Revolution CT Scanner (256-slice)\n• Toshiba Aquilion ONE CT (320-row)\n• Siemens SOMATOM series\n\nAll refurbished units come with warranty, installation support, and training. Contact us for current availability and pricing!';
  }

  if (lower.includes('mri') || lower.includes('resonancia') || lower.includes('rmn')) {
    return isSpanish
      ? 'Nuestro inventario de MRI incluye las mejores marcas:\n\n• Siemens Magnetom Vida 3T\n• Hitachi Echelon Oval 1.5T\n• GE Signa series\n\nOfrecemos sistemas nuevos y reacondicionados con paquetes completos de instalación, capacitación y garantía.'
      : 'Our MRI inventory includes top brands like:\n\n• Siemens Magnetom Vida 3T\n• Hitachi Echelon Oval 1.5T\n• GE Signa series\n\nWe offer both new and refurbished systems with full installation, training, and warranty packages.';
  }

  if (lower.includes('ultrasound') || lower.includes('ecogra') || lower.includes('ultrasonido')) {
    return isSpanish
      ? 'Ofrecemos sistemas de ultrasonido premium de los principales fabricantes:\n\n• Philips IU Elite\n• Canon Aplio i800\n• GE LOGIQ E10\n\nIdeales para radiología, cardiología, obstetricia/ginecología y aplicaciones punto de atención.'
      : 'We offer premium ultrasound systems from leading manufacturers:\n\n• Philips IU Elite\n• Canon Aplio i800\n• GE LOGIQ E10\n\nPerfect for radiology, cardiology, OB/GYN, and point-of-care applications.';
  }

  if (lower.includes('x-ray') || lower.includes('rayos x') || lower.includes('radiogra')) {
    return isSpanish
      ? 'Nuestra selección de equipos de rayos X incluye:\n\n• Carestream DRX-Evolution (radiografía digital)\n• GE Optima XR646\n• Shimadzu Sonialvision (sistema R/F)\n\nTodos los sistemas incluyen instalación, capacitación y garantía.'
      : 'Our X-Ray equipment selection includes:\n\n• Carestream DRX-Evolution (digital radiography)\n• GE Optima XR646\n• Shimadzu Sonialvision (R/F system)\n\nAll systems include installation, training, and warranty.';
  }

  if (lower.includes('ophthalmol') || lower.includes('oct') || lower.includes('eye') || lower.includes('oftalm') || lower.includes('ojo') || lower.includes('visión')) {
    return isSpanish
      ? 'Especializamos en equipos de diagnóstico oftalmológico:\n\n• Zeiss Cirrus HD-OCT 6000\n• Topcon Maestro 2 OCT\n• Heidelberg Spectralis OCT\n\nEstos sistemas son ideales para manejo de glaucoma, evaluación de enfermedades retinianas y cuidado ocular integral.'
      : 'We specialize in ophthalmology diagnostic equipment:\n\n• Zeiss Cirrus HD-OCT 6000\n• Topcon Maestro 2 OCT\n• Heidelberg Spectralis OCT\n\nThese systems are ideal for glaucoma management, retinal disease assessment, and comprehensive eye care.';
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('llamar') || lower.includes('contacto') || lower.includes('teléfono')) {
    return isSpanish
      ? 'Puede contactar a PS Medical Devices a través de:\n\n📞 Teléfono: +1 (305) 244-9340\n📧 Correo: michelgg0102780@gmail.com\n📍 Dirección: 2234 Winter Woods, Unidad 1000, Winter Park, FL 32792\n🕐 Horario: Lunes a Viernes, 8:00 AM - 6:00 PM CST\n\n¡O visite nuestra página de Contacto para enviarnos un mensaje!'
      : 'You can reach PS Medical Devices through:\n\n📞 Phone: +1 (305) 244-9340\n📧 Email: michelgg0102780@gmail.com\n📍 Address: 2234 Winter Woods, Unidad 1000, Winter Park, FL 32792\n🕐 Hours: Monday - Friday, 8:00 AM - 6:00 PM CST\n\nOr visit our Contact page to send us a message!';
  }

  // Default response - detect language
  if (isSpanish) {
    return '¡Gracias por su interés en PS Medical Devices! Somos proveedores líderes de equipos de imagenología médica nuevos y reacondicionados con más de 15 años de experiencia.\n\nNuestras especialidades incluyen:\n• Escáneres CT\n• Sistemas MRI\n• Equipos de Rayos X\n• Sistemas de Ultrasonido\n• Equipos de Oftalmología\n\n¿En qué puedo ayudarle hoy? No dude en preguntar sobre equipos específicos, precios, servicios o cualquier otra cosa.\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com';
  }

  return 'Thank you for your interest in PS Medical Devices! We are a leading provider of new and refurbished medical imaging equipment with over 15 years of experience.\n\nOur specialties include:\n• CT Scanners\n• MRI Systems\n• X-Ray Equipment\n• Ultrasound Systems\n• Ophthalmology Equipment\n\nHow can I help you today? Feel free to ask about specific equipment, pricing, services, or anything else!\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com';
}
