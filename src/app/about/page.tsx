'use client';

import { motion } from 'framer-motion';
import { Heart, Award, CheckCircle2, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CTASection } from '@/components/layout/CTASection';
import { RichText } from '@/components/RichText';
import { useSiteSettings, getSetting } from '@/lib/useSiteSettings';
import { getCompanyInfo, parseLines } from '@/lib/company';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Every block on this page comes from Admin > Paginas > About.
// A block whose field is empty is hidden, so nothing unverified is ever shown by default.
export default function AboutPage() {
  const { settings, loading } = useSiteSettings();
  const company = getCompanyInfo(settings);

  const heroTitle = getSetting(settings, 'about_hero_title', `About ${company.name}`);
  const heroSubtitle = getSetting(
    settings,
    'about_hero_subtitle',
    `Buying, selling, refurbishing and servicing medical imaging and ophthalmology equipment since ${company.foundedYear}.`
  );
  const image = getSetting(settings, 'about_image');
  const story = getSetting(settings, 'about_story');
  const mission = getSetting(settings, 'about_mission');
  const values = parseLines(settings.about_values, 2);
  const stats = parseLines(settings.about_stats, 3).filter(([value, label]) => value && label);
  const teamTitle = getSetting(settings, 'about_team_title', 'Our Team');
  const teamText = getSetting(settings, 'about_team_text');
  const teamMembers = parseLines(settings.about_team_members, 3).filter(([name]) => name);
  const certifications = parseLines(settings.about_certifications, 2).filter(([name]) => name);
  const ctaTitle = getSetting(settings, 'about_cta_title', 'Ready to Work With Us?');
  const ctaDesc = getSetting(settings, 'about_cta_desc', 'Tell us what equipment you need, or what you want to sell, and our team will get back to you.');

  return (
    <>
      {/* Hero */}
      <section className="gradient-primary py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {heroTitle}
          </motion.h1>
          <motion.p
            className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {heroSubtitle}
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      {(story || image) && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className={`grid grid-cols-1 gap-12 items-center ${image && story ? 'lg:grid-cols-2' : ''}`}>
              {story && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className={image ? '' : 'max-w-3xl mx-auto'}
                >
                  <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-2">Our Story</h2>
                  <p className="text-sm font-medium text-teal-600 mb-4">Established in {company.foundedYear}</p>
                  <RichText content={story} />
                </motion.div>
              )}
              {image && (
                <motion.div
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="flex justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={company.name} className="w-full max-w-lg rounded-2xl object-cover shadow-lg" />
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Mission Statement */}
      {mission && (
        <section className="py-14 sm:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-3xl mx-auto text-center"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Heart className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">{mission}</p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Stats — only verified figures entered in the admin */}
      {stats.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
              {stats.map(([value, label, description], idx) => (
                <motion.div
                  key={`${label}-${idx}`}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <Card className="h-full text-center">
                    <CardContent className="pt-6 pb-5 px-4">
                      <p className="text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-sm font-semibold text-foreground mt-1">{label}</p>
                      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {(teamText || teamMembers.length > 0) && (
        <section className="py-14 sm:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="max-w-3xl mx-auto text-center mb-10"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Users className="h-10 w-10 text-teal-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-4">{teamTitle}</h2>
              {teamText && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{teamText}</p>}
            </motion.div>
            {teamMembers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map(([name, role, photo], idx) => (
                  <Card key={`${name}-${idx}`} className="h-full text-center">
                    <CardContent className="pt-6 pb-5">
                      {photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photo} alt={name} className="h-20 w-20 rounded-full object-cover mx-auto mb-3" />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 dark:bg-teal-950/30 mx-auto mb-3">
                          <Users className="h-8 w-8 text-teal-600" />
                        </div>
                      )}
                      <p className="font-semibold text-foreground">{name}</p>
                      {role && <p className="text-sm text-muted-foreground">{role}</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Certifications — only real accreditations entered in the admin */}
      {certifications.length > 0 && (
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-8 text-center">Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map(([name, description], idx) => (
                <Card key={`${name}-${idx}`}>
                  <CardContent className="flex items-start gap-3 p-5">
                    <Award className="h-5 w-5 shrink-0 text-teal-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">{name}</p>
                      {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      {values.length > 0 && (
        <section className="py-14 sm:py-20 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl mb-10 text-center">Our Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map(([title, desc], idx) => (
                <Card key={`${title}-${idx}`} className="h-full">
                  <CardContent className="pt-6 pb-5">
                    <CheckCircle2 className="h-6 w-6 text-teal-600 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
                    {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && !story && !mission && (
        <section className="py-14">
          <p className="text-center text-muted-foreground">{company.description}</p>
        </section>
      )}

      <CTASection
        title={ctaTitle}
        description={ctaDesc}
        buttonText="Get in Touch"
        buttonLink="/contact"
        variant="primary"
      />
    </>
  );
}
