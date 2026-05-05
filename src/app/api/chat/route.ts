import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are PS Medical Device's AI assistant. You help customers with questions about medical imaging equipment (CT, MRI, X-Ray, Ultrasound), ophthalmology equipment, repair services, selling used equipment, and general inquiries. Be professional, helpful, and knowledgeable. If asked about pricing, suggest requesting a quote through our website. Always mention that we offer expert advisory and after-sales support with every purchase.

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

    // Build messages array for the AI
    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { role: 'user' as const, content: message },
    ];

    let assistantMessage: string;

    // Try OpenAI API first
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
            'I apologize, but I was unable to generate a response. Please try again or contact us directly.';
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      } catch (aiError) {
        console.error('OpenAI API error, trying fallback:', aiError);
        assistantMessage = getFallbackResponse(message);
      }
    } else {
      assistantMessage = getFallbackResponse(message);
    }

    return NextResponse.json({
      message: assistantMessage,
      sessionId,
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { message: 'Sorry, I encountered an error. Please contact us at +1 (305) 244-9340 for immediate assistance.' },
      { status: 200 }
    );
  }
}

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('price') || lower.includes('cost') || lower.includes('quote') || lower.includes('precio') || lower.includes('cuanto')) {
    return 'For pricing information and personalized quotes, I recommend contacting our team directly:\n\n📞 Phone: +1 (305) 244-9340\n📧 Email: michelgg0102780@gmail.com\n\nYou can also fill out our quote request form on the Contact page. We offer competitive pricing on both new and refurbished equipment!';
  }

  if (lower.includes('sell') || lower.includes('vender') || lower.includes('compr') || lower.includes('buyback')) {
    return 'We buy used medical imaging equipment! We offer fair prices and handle all logistics for equipment removal. To get started:\n\n1. Visit our "Sell Your Equipment" page\n2. Fill out the form with your equipment details\n3. Our team will evaluate and provide an offer within 48 hours\n\nCall us at +1 (305) 244-9340 for immediate assistance!';
  }

  if (lower.includes('repair') || lower.includes('service') || lower.includes('mantenimiento') || lower.includes('soporte')) {
    return 'PS Medical Devices offers comprehensive repair and maintenance services for all types of medical imaging equipment. Our certified technicians provide:\n\n• Preventive maintenance programs\n• Emergency repair services\n• Equipment calibration and certification\n• Software upgrades and updates\n\nContact us at +1 (305) 244-9340 for service requests!';
  }

  if (lower.includes('ct') || lower.includes('scanner')) {
    return 'We carry a wide selection of CT Scanners including:\n\n• GE Revolution CT Scanner (256-slice)\n• Toshiba Aquilion ONE CT (320-row)\n• Siemens SOMATOM series\n\nAll refurbished units come with warranty, installation support, and training. Contact us for current availability and pricing!';
  }

  if (lower.includes('mri') || lower.includes('resonancia')) {
    return 'Our MRI inventory includes top brands like:\n\n• Siemens Magnetom Vida 3T\n• Hitachi Echelon Oval 1.5T\n• GE Signa series\n\nWe offer both new and refurbished systems with full installation, training, and warranty packages.';
  }

  if (lower.includes('ultrasound') || lower.includes('ecogra')) {
    return 'We offer premium ultrasound systems from leading manufacturers:\n\n• Philips IU Elite\n• Canon Aplio i800\n• GE LOGIQ E10\n\nPerfect for radiology, cardiology, OB/GYN, and point-of-care applications.';
  }

  if (lower.includes('x-ray') || lower.includes('rayos x') || lower.includes('radiogra')) {
    return 'Our X-Ray equipment selection includes:\n\n• Carestream DRX-Evolution (digital radiography)\n• GE Optima XR646\n• Shimadzu Sonialvision (R/F system)\n\nAll systems include installation, training, and warranty.';
  }

  if (lower.includes('ophthalmol') || lower.includes('oct') || lower.includes('eye') || lower.includes('oftalm')) {
    return 'We specialize in ophthalmology diagnostic equipment:\n\n• Zeiss Cirrus HD-OCT 6000\n• Topcon Maestro 2 OCT\n• Heidelberg Spectralis OCT\n\nThese systems are ideal for glaucoma management, retinal disease assessment, and comprehensive eye care.';
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('llamar') || lower.includes('contacto')) {
    return 'You can reach PS Medical Devices through:\n\n📞 Phone: +1 (305) 244-9340\n📧 Email: michelgg0102780@gmail.com\n📍 Address: 2234 Winter Woods, Unidad 1000, Winter Park, FL 32792\n🕐 Hours: Monday - Friday, 8:00 AM - 6:00 PM CST\n\nOr visit our Contact page to send us a message!';
  }

  return 'Thank you for your interest in PS Medical Devices! We are a leading provider of new and refurbished medical imaging equipment with over 15 years of experience.\n\nOur specialties include:\n• CT Scanners\n• MRI Systems\n• X-Ray Equipment\n• Ultrasound Systems\n• Ophthalmology Equipment\n\nHow can I help you today? Feel free to ask about specific equipment, pricing, services, or anything else!\n\n📞 +1 (305) 244-9340\n📧 michelgg0102780@gmail.com';
}
