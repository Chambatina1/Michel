const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const services = [
  {
    title: "Equipment Repair & Maintenance",
    slug: "equipment-repair-maintenance",
    icon: "Wrench",
    coverImage: "/images/services/repair-maintenance.jpg",
    shortDesc: "Our team of certified biomedical engineers provides expert repair and preventive maintenance services for all types of medical imaging equipment.",
    description: `# Equipment Repair & Maintenance

At P&S Medical Device Inc., our team of certified biomedical engineers provides comprehensive repair and preventive maintenance services for all types of medical imaging equipment. We understand that equipment downtime directly impacts patient care, which is why we are committed to minimizing disruptions and keeping your systems running at peak performance.

## Our Repair Services

Our experienced technicians handle repairs across all major imaging modalities:

- **CT Scanners** – From detector replacements to full system overhauls
- **MRI Systems** – Magnet service, coil repairs, and cryogen management
- **X-Ray Systems** – Tube replacements, generator service, and detector calibration
- **Ultrasound** – Transducer repair, board-level service, and software updates
- **Ophthalmology Equipment** – OCT calibration, alignment service, and optics cleaning

## Preventive Maintenance Programs

Regular preventive maintenance is the key to maximizing equipment uptime and extending the lifespan of your imaging systems. Our tailored maintenance programs include:

1. **Scheduled Inspections** – Regular comprehensive system checks to identify potential issues before they cause downtime
2. **Calibration & Quality Assurance** – Ensure your equipment meets manufacturer specifications and regulatory requirements
3. **Software Updates** – Keep your systems running the latest software versions with the latest features and security patches
4. **Performance Optimization** – Fine-tune system parameters for optimal image quality and workflow efficiency
5. **Documentation & Compliance** – Detailed service records and compliance documentation for accreditation and regulatory purposes

## Emergency Response

When equipment failures occur, every minute counts. Our emergency response program provides:

- **4-hour response time** for critical equipment failures
- **24/7 dispatch** for emergency service calls
- **Rapid parts sourcing** from our extensive inventory and manufacturer relationships
- **Temporary equipment** availability when extended repairs are needed

## Service Contracts

We offer flexible service contract options to meet your facility's needs and budget:

- **Full Coverage** – Comprehensive parts and labor coverage for predictable annual costs
- **Time & Materials** – Pay-as-you-go service with competitive rates
- **Hybrid Plans** – Custom combinations of coverage levels for different equipment types

Contact us today to discuss how we can keep your imaging equipment running at its best.`,
    features: [
      "Emergency repair with 4-hour response time",
      "Preventive maintenance programs",
      "Full system calibration and testing",
      "OEM-quality replacement parts",
      "Service contracts available",
    ],
    ctaText: "Request Service",
    ctaLink: "/contact?type=support",
    sortOrder: 1,
    isPublished: true,
    isFeatured: false,
  },
  {
    title: "Technical Support & Training",
    slug: "technical-support-training",
    icon: "Headphones",
    coverImage: "/images/services/technical-support.jpg",
    shortDesc: "Our dedicated support team is available around the clock to assist with technical issues, software updates, and system optimization.",
    description: `# Technical Support & Training

Our dedicated support team is available around the clock to assist with technical issues, software updates, and system optimization. We also offer comprehensive training programs to ensure your staff can operate equipment confidently and efficiently.

## 24/7 Technical Support

Our technical support team provides rapid, expert assistance for all your imaging equipment needs:

- **Phone Support** – Direct access to experienced applications specialists and service engineers
- **Remote Diagnostics** – Secure remote connection capabilities allow us to diagnose and often resolve issues without an on-site visit
- **Software Troubleshooting** – Expert assistance with software configuration, updates, and workflow optimization
- **Emergency Escalations** – Priority routing for critical system issues with guaranteed response times

## Training Programs

Investing in proper training is one of the most effective ways to maximize the value of your imaging equipment. Our training programs are designed for all experience levels:

### Operator Training
- Basic system operation and workflow
- Image acquisition techniques and protocols
- Patient positioning and safety
- Daily quality control procedures

### Advanced Clinical Applications
- Specialized examination protocols
- Advanced image processing and analysis
- Contrast administration protocols
- Dose optimization techniques

### Safety & Compliance
- Radiation safety practices
- Regulatory compliance requirements
- Documentation and reporting
- Emergency procedures

### Certification Programs
- Manufacturer-recognized certification courses
- Continuing education credits
- Competency assessment and verification
- Annual refresher programs

## Ongoing Education

Technology evolves rapidly, and we ensure your staff stays current with:

- **New Feature Training** – Comprehensive walkthroughs when software updates bring new capabilities
- **Best Practice Updates** – Regular sharing of clinical best practices and workflow improvements
- **Peer Learning Opportunities** – Connection to our network of clinical users for knowledge sharing

Contact our training coordinator to develop a customized education plan for your team.`,
    features: [
      "Phone and remote support",
      "Real-time diagnostics",
      "Software troubleshooting",
      "Emergency escalations",
      "On-site operator training",
      "Advanced clinical applications",
      "Safety and compliance",
      "Certification programs",
    ],
    ctaText: "Contact Support",
    ctaLink: "/contact?type=support",
    sortOrder: 2,
    isPublished: true,
    isFeatured: false,
  },
  {
    title: "Consultative Sales Advisory",
    slug: "consultative-sales-advisory",
    icon: "MessageSquare",
    coverImage: "/images/services/sales-advisory.jpg",
    shortDesc: "Choosing the right medical equipment is a significant investment. Our expert advisors work alongside your team to understand your clinical needs.",
    description: `# Consultative Sales Advisory

Choosing the right medical equipment is a significant investment that affects patient care, facility operations, and financial performance for years to come. Our expert advisors work alongside your team to understand your clinical needs, budget constraints, and growth plans to recommend the best solution for your facility.

## Our Consultative Approach

We don't just sell equipment — we build partnerships. Our consultative sales process is designed to ensure you make the most informed decision possible:

### 1. Needs Assessment
We begin with a comprehensive evaluation of your imaging requirements, including:
- Current clinical applications and referral patterns
- Patient volume and growth projections
- Existing equipment capabilities and limitations
- Staff skill levels and training requirements
- Space and infrastructure considerations

### 2. Budget Planning
We provide transparent, honest guidance to help you maximize your investment:
- New vs. refurbished equipment analysis with total cost of ownership
- Financing options and leasing arrangements
- Trade-in valuation for existing equipment
- Long-term operating cost projections (service, parts, consumables)

### 3. Facility Planning
Our team assists with every aspect of preparing your facility for new equipment:
- Site evaluation and room requirements
- Electrical and HVAC specifications
- Shielding requirements for CT and MRI
- Workflow design and department layout
- Construction coordination and timelines

### 4. Equipment Comparison & Selection
We provide objective, side-by-side comparisons of equipment from different manufacturers:
- Clinical performance specifications
- Image quality benchmarks
- Workflow efficiency features
- Service history and reliability data
- Upgrade paths and future-proofing

### 5. Installation Coordination
We manage the entire installation process from start to finish:
- Delivery scheduling and logistics
- Installation supervision by certified engineers
- System acceptance testing and calibration
- Staff training during commissioning
- Documentation and warranty registration

### 6. After-Sales Support
Our commitment continues well beyond installation:
- Comprehensive warranty coverage
- Priority service response for new installations
- Ongoing applications support and optimization
- Upgrade and expansion planning

## Why Choose P&S Medical Device?

- **Multi-manufacturer expertise** – We work with all major OEMs and can recommend the best fit without brand bias
- **Extensive inventory** – Access to a wide range of new and certified refurbished systems
- **Transparent pricing** – No hidden fees or surprise costs
- **Industry experience** – Decades of combined experience in medical imaging equipment
- **Customer-first approach** – Your success is our success

Schedule a complimentary consultation with one of our equipment advisors to discuss your facility's needs.`,
    features: [
      "Needs Assessment",
      "Budget Planning",
      "Facility Planning",
      "Comparison Analysis",
      "Installation Coordination",
      "After-Sales Support",
    ],
    ctaText: "Schedule Consultation",
    ctaLink: "/contact?type=quote",
    sortOrder: 3,
    isPublished: true,
    isFeatured: false,
  },
];

async function main() {
  console.log('Seeding services...');

  for (const service of services) {
    try {
      const data = {
        ...service,
        features: JSON.stringify(service.features),
        images: JSON.stringify([]),
      };
      const result = await prisma.service.upsert({
        where: { slug: data.slug },
        update: data,
        create: data,
      });
      console.log(`✅ Created/Updated: "${result.title}"`);
    } catch (error) {
      console.error(`❌ Error with "${service.title}":`, error.message);
    }
  }

  console.log('\nServices seeding complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
