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
      company_description: 'Your trusted partner for premium medical imaging equipment. We provide sales, expert advisory, repair services, and equipment buybacks for healthcare facilities worldwide.',
      tagline: 'Medical Imaging & Ophthalmology Equipment',
      contact_phone: '+1 (305) 244-9340',
      contact_email: 'info@psmedicaldevices.com',
      contact_address: '2234 Winter Woods, Suite 1000, Winter Park, FL 32792',
      contact_hours: 'Mon-Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 1:00 PM\nSunday: Closed',
      facebook_url: 'https://facebook.com/psmedicaldevices',
      instagram_url: 'https://instagram.com/psmedicaldevices',
      linkedin_url: 'https://linkedin.com/company/ps-medical-device',
      twitter_url: 'https://twitter.com/psmedicaldevices',
      youtube_url: '',
      tiktok_url: '',
      whatsapp_phone: '+13052449340',
      hero_badge: 'Trusted by 500+ Healthcare Facilities',
      hero_headline: 'Medical Imaging & Ophthalmology|Equipment You Can Trust',
      hero_subtitle: 'From CT scanners to ophthalmology devices, we supply, service, and buy medical equipment with unmatched expertise and fair pricing.',
      hero_btn_primary: 'Browse Equipment',
      hero_btn_secondary: 'Sell Your Equipment',
      stat1_value: '500+',
      stat1_label: 'Healthcare Clients',
      stat2_value: '2,000+',
      stat2_label: 'Devices Sold',
      stat3_value: '15+',
      stat3_label: 'Years Experience',
      stat4_value: '98%',
      stat4_label: 'Client Satisfaction',
      why_title: 'Why Healthcare Facilities Choose P&S Medical Device Inc.',
      why_subtitle: 'With over 15 years in the medical equipment industry, we combine technical expertise with a commitment to patient care outcomes.',
      why_f1_title: 'Quality Guaranteed',
      why_f1_desc: 'Every device undergoes rigorous testing and certification before delivery.',
      why_f2_title: 'Competitive Pricing',
      why_f2_desc: 'Save 30-60% compared to new equipment without sacrificing performance.',
      why_f3_title: 'Full Service & Support',
      why_f3_desc: 'Installation, training, maintenance, and 24/7 emergency repair services.',
      why_f4_title: 'Expert Consultation',
      why_f4_desc: 'Our specialists help you choose the right equipment for your specific needs.',
      cta1_title: 'Ready to Upgrade Your Medical Equipment?',
      cta1_desc: 'Whether you\'re buying, selling, or need service, our team is ready to help you find the perfect solution for your facility.',
      cta1_btn: 'Get a Free Consultation',
      cta1_link: '/contact?type=quote',
      cta2_title: 'Have Old Equipment to Sell?',
      cta2_desc: 'We buy used, broken, or decommissioned medical devices at fair market prices. Get a same-day offer.',
      cta2_btn: 'Get Your Offer Now',
      cta2_link: '/sell-equipment',
      trust_bar_items: JSON.stringify([
        { icon: 'ShieldCheck', label: 'Expert Advisory', description: 'Certified specialists guide your equipment decisions' },
        { icon: 'Wrench', label: 'After-Sales Support', description: 'Installation, training, and 24/7 maintenance' },
        { icon: 'DollarSign', label: 'We Buy Broken Equipment', description: 'Fair prices for used or non-functional devices' },
        { icon: 'Award', label: 'Certified Refurbished', description: 'OEM specifications with full warranty' }
      ]),
      about_mission: 'To make high-quality medical imaging equipment accessible and affordable for healthcare providers of all sizes.',
      about_team_title: 'Our Team of Experts',
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
