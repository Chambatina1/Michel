import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { confirm } = await request.json();
    if (confirm !== 'SEED_SETTINGS') {
      return NextResponse.json({ error: 'Pass { confirm: "SEED_SETTINGS" } to seed' }, { status: 400 });
    }

    const defaults: Record<string, string> = {
      company_name: 'P&S Medical Device Inc.',
      company_description: 'P&S Medical Device Inc. buys, sells, refurbishes and services medical equipment, mainly diagnostic imaging and ophthalmology systems.',
      tagline: 'Medical Imaging & Ophthalmology Equipment',
      contact_phone: '+1 (305) 244-9340',
      contact_email: 'admin@psmedicaldevices.com',
      contact_address: '540 N 70th Ave, Hollywood, FL 33024',
      contact_hours: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 1:00 PM\nSunday: Closed',
      facebook_url: 'https://facebook.com/psmedicaldevices',
      instagram_url: 'https://instagram.com/psmedicaldevices',
      linkedin_url: 'https://linkedin.com/company/ps-medical-device',
      twitter_url: 'https://twitter.com/psmedicaldevices',
      youtube_url: '',
      tiktok_url: '',
      whatsapp_phone: '+13052449340',
      hero_badge: '',
      hero_headline: 'Medical Imaging & Ophthalmology|Equipment You Can Trust',
      hero_subtitle: 'New, used and refurbished diagnostic imaging and ophthalmology equipment. We buy, sell, refurbish and service medical devices.',
      hero_btn_primary: 'Browse Equipment',
      hero_btn_secondary: 'Sell Your Equipment',
      stat1_value: '',
      stat1_label: 'Healthcare Clients',
      stat2_value: '',
      stat2_label: 'Devices Sold',
      stat3_value: '',
      stat3_label: 'Years Experience',
      stat4_value: '',
      stat4_label: 'Client Satisfaction',
      why_title: 'Why Healthcare Facilities Choose P&S Medical Device Inc.',
      why_subtitle: 'We focus on diagnostic imaging and ophthalmology equipment, and we help each facility find the right unit for its needs and budget.',
      why_f1_title: 'Imaging & Ophthalmology Focus',
      why_f1_desc: 'We specialize in diagnostic imaging and ophthalmology equipment.',
      why_f2_title: 'New, Used & Refurbished',
      why_f2_desc: 'Options for different budgets, with condition and included items stated in every quote.',
      why_f3_title: 'Service',
      why_f3_desc: 'Services related to the equipment we sell. Contact us to confirm scope and availability.',
      why_f4_title: 'We Buy Equipment',
      why_f4_desc: 'Sell us your used or decommissioned devices.',
      cta1_title: 'Ready to Upgrade Your Medical Equipment?',
      cta1_desc: 'Whether you\'re buying, selling, or need service, our team is ready to help you find the perfect solution for your facility.',
      cta1_btn: 'Get a Free Consultation',
      cta1_link: '/contact?type=quote',
      cta2_title: 'Have Old Equipment to Sell?',
      cta2_desc: 'We buy used, broken, or decommissioned medical devices. Tell us about your equipment and we will get back to you with an offer.',
      cta2_btn: 'Get Your Offer Now',
      cta2_link: '/sell-equipment',
      trust_bar_items: JSON.stringify([
        { icon: 'ShieldCheck', label: 'Expert Advisory', description: 'Personalized equipment guidance' },
        { icon: 'Wrench', label: 'After-Sales Support', description: 'Maintenance & repair services' },
        { icon: 'DollarSign', label: 'We Buy Broken Equipment', description: 'Used or non-functional devices' },
        { icon: 'Award', label: 'Refurbished Equipment', description: 'New, used & refurbished options' }
      ]),
      about_mission: 'To make high-quality medical imaging equipment accessible and affordable for healthcare providers of all sizes.',
      about_team_title: 'Our Team',
      company_founded_year: '2018',
      contact_map_url: '',
      meta_title: 'P&S Medical Device Inc. | Trusted Medical Equipment Partner',
      meta_description: 'Premium medical imaging equipment sales, expert advisory, repair services, and equipment buybacks.',
      meta_keywords: 'medical devices, medical imaging equipment, CT scanner, MRI machine',
    };

    let created = 0;
    let updated = 0;

    for (const [key, value] of Object.entries(defaults)) {
      const existing = await db.siteSettings.findUnique({ where: { key } });
      if (existing) {
        updated++;
      } else {
        await db.siteSettings.create({ data: { key, value, type: 'text' } });
        created++;
      }
    }

    return NextResponse.json({ message: `Settings seeded: ${created} created, ${updated} already exist`, created, updated });
  } catch (error) {
    console.error('Error seeding settings:', error);
    return NextResponse.json({ error: 'Failed to seed settings' }, { status: 500 });
  }
}
