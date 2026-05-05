import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Clean existing data ───────────────────────────────────────────
  await prisma.chatMessage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.sellRequest.deleteMany();
  await prisma.product.deleteMany();
  await prisma.siteSettings.deleteMany();
  await prisma.user.deleteMany();

  // ─── Seed Admin User ───────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: 'admin@psmedicaldevices.com',
      name: 'PS Admin',
      role: 'admin',
      isActive: true,
    },
  });
  console.log('✅ Admin user created');

  // ─── Seed Products ─────────────────────────────────────────────────
  const products = [
    {
      name: 'GE Revolution CT Scanner',
      slug: 'ge-revolution-ct-scanner',
      category: 'CT',
      condition: 'Refurbished',
      price: 185000,
      description:
        'The GE Revolution CT Scanner delivers exceptional image quality with its 256-slice detector and advanced iterative reconstruction technology. Designed for high-volume imaging centers, it provides fast turnaround times and reduced dose for patients. This refurbished unit has been fully inspected and calibrated to meet OEM specifications. Ideal for cardiac, neurological, and trauma imaging applications. Comes with a 12-month warranty and on-site installation support.',
      specs: JSON.stringify({
        'Detector Rows': '256 slices',
        'Rotation Time': '0.28s',
        'Slice Thickness': '0.625 mm',
        'Gantry Aperture': '80 cm',
        'Table Weight Limit': '450 lbs',
        'Tube Heat Capacity': '8.0 MHU',
        'Spatial Resolution': '0.24 mm',
        'Software Version': 'Revolution EVO',
      }),
      features: JSON.stringify([
        '256-slice detector for superior image quality',
        'Advanced iterative reconstruction (ASiR-V)',
        'Low-dose cardiac CT angiography',
        'One-beat cardiac imaging',
        'Automated workflow with kV assist',
        'Smart collimation for dose optimization',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: true,
    },
    {
      name: 'Siemens Magnetom Vida 3T MRI',
      slug: 'siemens-magnetom-vida-3t-mri',
      category: 'MRI',
      condition: 'Refurbished',
      price: 425000,
      description:
        'The Siemens Magnetom Vida 3T MRI combines Tim 4G and Dot technology to deliver outstanding diagnostic confidence across all clinical applications. Its 70 cm bore provides exceptional patient comfort while maintaining high-field performance. This refurbished system features the BioMatrix technology that personalizes exams for each patient. Perfect for neurology, orthopedics, and oncology imaging. Includes comprehensive installation and training package.',
      specs: JSON.stringify({
        'Field Strength': '3.0 Tesla',
        'Bore Size': '70 cm',
        'Gradient Strength': '45 mT/m',
        'Slew Rate': '200 T/m/s',
        'Channels': 'up to 128',
        'Coils': '18-element Body, Head/Neck, Spine',
        'Patient Weight Limit': '550 lbs',
        'Software': 'syngo MR XA30',
      }),
      features: JSON.stringify([
        'Tim 4G integrated coil technology',
        'BioMatrix patient-personalized imaging',
        '70 cm patient-friendly bore',
        'Quiet Suite for reduced acoustic noise',
        'Dot workflow automation',
        'Advanced diffusion and perfusion imaging',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: true,
    },
    {
      name: 'Philips IU Elite Ultrasound',
      slug: 'philips-iu-elite-ultrasound',
      category: 'Ultrasound',
      condition: 'New',
      price: 95000,
      description:
        'The Philips IU Elite Ultrasound system is a premium shared-service platform designed for exceptional clinical performance. It features advanced imaging technologies including nSIGHT imaging for enhanced tissue differentiation and PureWave crystal technology for superior resolution. The system excels in abdominal, vascular, OB/GYN, and musculoskeletal imaging. Its intuitive touchscreen interface streamlines workflow for busy clinical environments.',
      specs: JSON.stringify({
        'Transducer Ports': '4 active ports',
        'Display': '21.5" HD LCD',
        'Imaging Modes': 'B-mode, M-mode, Doppler, Harmonic',
        'Tissue Harmonic': 'nSIGHT',
        'Frame Rate': 'Up to 300 fps',
        'Storage': '1 TB HDD + DVD-RW',
        'Connectivity': 'DICOM 3.0, USB, Ethernet',
        'Weight': '325 lbs',
      }),
      features: JSON.stringify([
        'nSIGHT imaging for enhanced tissue characterization',
        'PureWave transducer technology',
        'AutoSCAN for automated image optimization',
        'Active Array matrix transducers',
        'QLAB quantitative analysis',
        'iSCAN one-touch image optimization',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: true,
    },
    {
      name: 'Zeiss Cirrus HD-OCT 6000',
      slug: 'zeiss-cirrus-hd-oct-6000',
      category: 'Ophthalmology',
      condition: 'New',
      price: 75000,
      description:
        'The Zeiss Cirrus HD-OCT 6000 is the gold standard in optical coherence tomography for ophthalmic diagnostics. It provides ultra-high resolution retinal imaging with advanced segmentation algorithms for retinal nerve fiber layer and ganglion cell analysis. The system features an intuitive touchscreen interface and streamlined workflow for efficient patient throughput. Ideal for glaucoma management, retinal disease assessment, and anterior segment imaging.',
      specs: JSON.stringify({
        'Scan Speed': '68,000 A-scans/second',
        'Axial Resolution': '5 μm',
        'Transverse Resolution': '15 μm',
        'Scan Depth': '2.0 mm',
        'Scan Width': '9.0 mm',
        'Imaging Modes': 'Macula, Optic Disc, Anterior Segment, HD Angio',
        'Eye Tracking': 'TruTrack active',
        'Display': '24" widescreen monitor',
      }),
      features: JSON.stringify([
        'Ultra-high speed HD imaging',
        'Advanced ganglion cell analysis (GCC)',
        'Glaucoma progression analysis (GPA)',
        'Anterior segment OCT module',
        'HD Angio retinal vasculature imaging',
        'Seamless EMR integration',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: true,
    },
    {
      name: 'Toshiba Aquilion ONE CT',
      slug: 'toshiba-aquilion-one-ct',
      category: 'CT',
      condition: 'Refurbished',
      price: 210000,
      description:
        'The Toshiba Aquilion ONE CT Scanner features a 320-row detector that can image an entire organ in a single rotation, reducing motion artifacts and radiation dose significantly. Its cone-beam CT technology eliminates helical artifacts for pure volumetric imaging. This refurbished unit is ideal for cardiac, brain perfusion, and whole-organ dynamic studies. Includes full system recalibration and a 12-month parts warranty.',
      specs: JSON.stringify({
        'Detector Rows': '320 rows (0.5 mm)',
        'Detector Coverage': '16 cm',
        'Rotation Time': '0.275s',
        'Slice Thickness': '0.5 mm',
        'Gantry Aperture': '78 cm',
        'Spatial Resolution': '0.35 mm',
        'Tube Voltage': '80-135 kV',
        'Software': 'Vitrea workstation included',
      }),
      features: JSON.stringify([
        'Volume CT with 16 cm coverage',
        'Single-rotation whole-organ imaging',
        'Ultra-low dose with AIDR 3D',
        'Cardiac CT with 100% phase coverage',
        'Brain perfusion in single rotation',
        'Real-time image reconstruction',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
    {
      name: 'Hitachi Echelon Oval MRI',
      slug: 'hitachi-echelon-oval-mri',
      category: 'MRI',
      condition: 'Refurbished',
      price: 350000,
      description:
        'The Hitachi Echelon Oval MRI features the worlds first oval-shaped bore design, providing unmatched patient comfort with a spacious feel while maintaining 1.5T diagnostic performance. Its zero boil-off magnet technology reduces operational costs significantly. The system is ideal for claustrophobic patients, bariatric imaging, and general diagnostic use. This refurbished unit comes with updated coils and current software version.',
      specs: JSON.stringify({
        'Field Strength': '1.5 Tesla',
        'Bore Size': '74 cm (oval)',
        'Gradient Strength': '33 mT/m',
        'Slew Rate': '150 T/m/s',
        'Magnet Type': 'Zero boil-off superconducting',
        'Coils': 'Body, Head, Spine, Extremity',
        'Patient Weight Limit': '500 lbs',
        'Software': 'R5.0 workflow suite',
      }),
      features: JSON.stringify([
        'Oval bore for maximum patient comfort',
        'Zero boil-off magnet technology',
        'Claustrophobic patient-friendly design',
        'Low operating costs',
        'Parallel imaging (SENS-itivity Encoding)',
        'Comprehensive clinical applications package',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
    {
      name: 'Carestream DRX-Evolution X-Ray',
      slug: 'carestream-drx-evolution-x-ray',
      category: 'X-Ray',
      condition: 'New',
      price: 125000,
      description:
        'The Carestream DRX-Evolution is a versatile digital radiography system designed for high-throughput imaging environments. It features a motorized ceiling-mounted tube stand and wireless DR detectors for flexible positioning. The systems intelligent software automatically optimizes image quality while minimizing dose. Perfect for hospitals, urgent care centers, and orthopedic practices requiring reliable everyday imaging.',
      specs: JSON.stringify({
        'Generator': '80 kW high-frequency',
        'Tube': 'Dual-focus X-ray tube',
        'Detector': 'Wireless DRX 3543 (35 x 43 cm)',
        'Detectors Included': '2 wireless panels',
        'Collimation': 'Automatic multi-leaf',
        'SID Range': '40-72 inches',
        'Table': '4-way floating tabletop',
        'Software': 'Carestream PACS integrated',
      }),
      features: JSON.stringify([
        'Wireless DR detector technology',
        'Motorized tube stand positioning',
        'Automatic exposure control (AEC)',
        'Image processing with EVP+ software',
        'DICOM 3.0 worklist management',
        'Bucky wall stand for upright exams',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
    {
      name: 'Canon Aplio i800 Ultrasound',
      slug: 'canon-aplio-i800-ultrasound',
      category: 'Ultrasound',
      condition: 'Refurbished',
      price: 88000,
      description:
        'The Canon Aplio i800 Ultrasound system delivers premium imaging performance with its iSMC technology and advanced transducer portfolio. It provides exceptional detail resolution and penetration for demanding clinical applications including cardiology, abdominal, and vascular imaging. This refurbished system has been fully reconditioned with new transducers and updated software. An excellent choice for facilities seeking premium performance at a competitive price.',
      specs: JSON.stringify({
        'Transducer Ports': '3 active ports',
        'Display': '23.8" HD LED monitor',
        'Imaging Modes': 'B-mode, Harmonic, Doppler, Elastography',
        'Frame Rate': 'Up to 400 fps',
        'Storage': '512 GB SSD',
        'Connectivity': 'DICOM, USB, HDMI, Ethernet',
        'Weight': '280 lbs',
        'Channels': '256 digital channels',
      }),
      features: JSON.stringify([
        'iSMC micro-scanning technology',
        'Shear Wave elastography',
        'Automated measurements with ApliPure+',
        'Contrast-enhanced ultrasound (CEUS)',
        'Panoramic and 3D/4D imaging',
        'Intelligent workflow automation',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
    {
      name: 'Topcon Maestro 2 OCT',
      slug: 'topcon-maestro-2-oct',
      category: 'Ophthalmology',
      condition: 'New',
      price: 68000,
      description:
        'The Topcon Maestro 2 is a fully automated, multi-modal diagnostic platform combining OCT, fundus photography, and FA in one compact device. It features swept-source OCT technology for deeper penetration and higher quality retinal images. The systems automated alignment and tracking eliminate the need for operator intervention, improving workflow efficiency. Ideal for busy ophthalmology practices and screening programs.',
      specs: JSON.stringify({
        'OCT Technology': 'Swept-source OCT (1,050 nm)',
        'Scan Speed': '50,000 A-scans/second',
        'Axial Resolution': '8 μm',
        'Scan Width': '12 mm x 9 mm',
        'Fundus Camera': 'TrueColor confocal',
        'Visual Fields': 'Optional 24-2, 10-2',
        'FA Capability': 'Optional fluorescein angiography',
        'Automation': 'Fully automated alignment and capture',
      }),
      features: JSON.stringify([
        'Swept-source OCT for deeper penetration',
        'Fully automated operation',
        'Combined OCT + fundus camera',
        'Built-in normative database',
        'Single-button multi-modal capture',
        'Compact footprint design',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: true,
    },
    {
      name: 'Shimadzu Sonialvision X-Ray',
      slug: 'shimadzu-sonialvision-x-ray',
      category: 'X-Ray',
      condition: 'Refurbished',
      price: 145000,
      description:
        'The Shimadzu Sonialvision is a flat-panel digital radiography and fluoroscopy system designed for multi-purpose diagnostic imaging. It seamlessly handles general radiography, fluoroscopy, and spot imaging in a single system. The 17 x 17 inch flat-panel detector provides excellent image quality with reduced dose. This refurbished unit is perfect for orthopedic, gastrointestinal, and interventional imaging needs.',
      specs: JSON.stringify({
        'Generator': '80 kW high-frequency',
        'Detector': '17" x 17" flat-panel (FPD)',
        'Fluoroscopy': 'Real-time digital fluoroscopy',
        'Spot Imaging': 'Digital spot radiography',
        'Table': 'Multi-directional tilting table',
        'SID Range': '40-60 inches',
        'Dose Management': 'SUREexposure technology',
        'Software': 'Console with integrated PACS',
      }),
      features: JSON.stringify([
        'Flat-panel detector for both R/F',
        'Real-time digital fluoroscopy',
        'Multi-purpose tilting table',
        'Low-dose imaging with SUREexposure',
        'Automatic collimation control',
        'Integrated DICOM connectivity',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
    {
      name: 'GE LOGIQ E10 Ultrasound',
      slug: 'ge-logiq-e10-ultrasound',
      category: 'Ultrasound',
      condition: 'New',
      price: 110000,
      description:
        'The GE LOGIQ E10 represents the next generation of ultrasound imaging with its revolutionary cSound™ architecture and high channel count. It delivers extraordinary image clarity and consistency across a wide range of clinical applications. The system features advanced AI-powered tools for automated measurements and image optimization. Designed for radiology, OB/GYN, vascular, and point-of-care applications.',
      specs: JSON.stringify({
        'Transducer Ports': '4 active ports',
        'Display': '23.8" HD LED monitor + 12.1" touchscreen',
        'Architecture': 'cSound™ beamformer',
        'Channels': '128 digital channels',
        'Imaging Modes': 'B-mode, Harmonic, Doppler, Strain Elastography',
        'Storage': '1 TB SSD',
        'Connectivity': 'DICOM, USB, Wi-Fi, Ethernet',
        'Weight': '330 lbs',
      }),
      features: JSON.stringify([
        'cSound™ architecture for superior imaging',
        'AI-powered image optimization (Auto B-mode)',
        'Strain elastography for tissue characterization',
        'B-Flow and B-Steer technologies',
        'Modern ergonomic design',
        'Comprehensive vascular and cardiac tools',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
    {
      name: 'Heidelberg Spectralis OCT',
      slug: 'heidelberg-spectralis-oct',
      category: 'Ophthalmology',
      condition: 'Refurbished',
      price: 58000,
      description:
        'The Heidelberg Spectralis OCT is renowned for its proprietary TruTrack active eye-tracking and dual-beam technology that delivers follow-up scans with pixel-perfect reproducibility. It is the preferred choice for longitudinal monitoring of retinal diseases and glaucoma progression. This refurbished unit has been completely overhauled with current software and calibration. An outstanding value for practices requiring precise retinal analysis.',
      specs: JSON.stringify({
        'OCT Technology': 'Spectral-domain OCT (870 nm)',
        'Scan Speed': '40,000 A-scans/second',
        'Axial Resolution': '3.9 μm',
        'Transverse Resolution': '14 μm',
        'Eye Tracking': 'TruTrack active eye tracking',
        'Fundus Camera': 'Confocal scanning laser ophthalmoscope',
        'FA/ICG': 'Optional angiography module',
        'Display': '24" medical-grade monitor',
      }),
      features: JSON.stringify([
        'TruTrack dual-beam eye tracking',
        'Pixel-perfect follow-up scanning',
        'BluePeak autofluorescence',
        'OCT-Angiography upgradeable',
        'Anatomical mapping with eye tracking',
        'Widefield imaging module available',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
    {
      name: 'GE Optima XR646 X-Ray',
      slug: 'ge-optima-xr646-x-ray',
      category: 'X-Ray',
      condition: 'Refurbished',
      price: 92000,
      description:
        'The GE Optima XR646 is a reliable digital radiography system built for general-purpose imaging in hospitals and clinics. It features a floor-mounted tube stand and wall stand configuration for maximum flexibility. The AutoImage suite automatically optimizes every image for consistent diagnostic quality. This refurbished system is an excellent workhorse for facilities needing dependable daily radiography.',
      specs: JSON.stringify({
        'Generator': '65 kW high-frequency',
        'Detector': 'Wireless 35 x 43 cm DR panel',
        'Tube': 'Dual-focus anode',
        'Collimation': 'Automatic multi-leaf',
        'SID Range': '40-72 inches',
        'Wall Stand': 'Motorized elevating',
        'Table': '4-way floating tabletop',
        'Software': 'AutoImage processing suite',
      }),
      features: JSON.stringify([
        'AutoImage automatic image processing',
        'Wireless DR detector convenience',
        'Flexible room configurations',
        'DoseWatch dose monitoring',
        'DICOM 3.0 connectivity',
        'Consistent image quality',
      ]),
      imageUrl: '/images/placeholder-equipment.svg',
      images: JSON.stringify(['/images/placeholder-equipment.svg']),
      status: 'active',
      isFeatured: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
  console.log(`✅ ${products.length} products created`);

  // ─── Seed Reviews ──────────────────────────────────────────────────
  const reviews = [
    {
      author: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@metrohealth.org',
      rating: 5,
      title: 'Outstanding quality and service',
      content:
        'We purchased the GE Revolution CT from PS Medical Devices and the experience was exceptional from start to finish. The system arrived in pristine condition and their installation team was professional and thorough. Image quality is outstanding and our radiologists are thrilled with the upgrade. The after-sales support has been equally impressive, with quick response times for any questions.',
      company: 'Metro Regional Health Center',
      role: 'Chief of Radiology',
      isApproved: true,
      isFeatured: true,
      userId: admin.id,
    },
    {
      author: 'James Rodriguez',
      email: 'jrodriguez@pacificimaging.com',
      rating: 5,
      title: 'Saved us over $200K on our MRI',
      content:
        'PS Medical Devices helped us find a refurbished Siemens Magnetom Vida that fit perfectly within our budget. The savings compared to buying new allowed us to invest in additional coils and software upgrades. The system performs flawlessly and their 12-month warranty gave us complete confidence. I would absolutely recommend them to any facility looking for quality refurbished equipment.',
      company: 'Pacific Imaging Center',
      role: 'Facility Director',
      isApproved: true,
      isFeatured: true,
      userId: admin.id,
    },
    {
      author: 'Dr. Emily Chen',
      email: 'emily.chen@valeyee.com',
      rating: 4,
      title: 'Great value on the Philips IU Elite',
      content:
        'We acquired a new Philips IU Elite ultrasound system through PS Medical Devices for our OB/GYN practice. The pricing was competitive and they handled all the logistics of delivery and setup. The image quality is superb and our sonographers adapted quickly. My only minor feedback is that the training sessions could have been more in-depth for our specific clinical needs.',
      company: 'Valley Eye & Women\'s Health',
      role: 'Medical Director',
      isApproved: true,
      isFeatured: false,
      userId: admin.id,
    },
    {
      author: 'Michael Thompson',
      email: 'mthompson@midwestortho.com',
      rating: 5,
      title: 'Expert guidance through the buying process',
      content:
        'As a clinic manager, I was new to purchasing imaging equipment. The team at PS Medical Devices walked me through every step, from selecting the right X-ray system to understanding installation requirements. We ended up with the Carestream DRX-Evolution and it has been a game-changer for our orthopedic practice. Workflow efficiency improved dramatically and our patients love the faster turnaround.',
      company: 'Midwest Orthopedic Specialists',
      role: 'Clinic Manager',
      isApproved: true,
      isFeatured: false,
      userId: admin.id,
    },
    {
      author: 'Dr. Robert Kline',
      email: 'rkline@summitretina.com',
      rating: 5,
      title: 'Best OCT system for the price',
      content:
        'The refurbished Heidelberg Spectralis OCT we purchased has been performing beautifully in our retinal practice. The eye-tracking technology is truly best-in-class and provides unmatched repeatability for tracking disease progression. PS Medical Devices ensured the system was in perfect condition and included all necessary accessories. Their expertise in ophthalmic equipment is evident.',
      company: 'Summit Retina Associates',
      role: 'Retinal Specialist',
      isApproved: true,
      isFeatured: true,
      userId: admin.id,
    },
    {
      author: 'Karen Williams',
      email: 'kwilliams@citygeneral.org',
      rating: 4,
      title: 'Reliable partner for our equipment needs',
      content:
        'We have worked with PS Medical Devices on three separate equipment acquisitions over the past two years. Each transaction has been smooth and professional. They consistently deliver quality refurbished equipment at prices that work for our hospital budget. Their technical team is knowledgeable and always available for support. A trusted partner for any healthcare facility.',
      company: 'City General Hospital',
      role: 'Director of Imaging Services',
      isApproved: true,
      isFeatured: false,
      userId: admin.id,
    },
    {
      author: 'Dr. Amanda Foster',
      email: 'afoster@clearviewimaging.com',
      rating: 5,
      title: 'Transformative upgrade to our ultrasound fleet',
      content:
        'PS Medical Devices helped us upgrade three ultrasound systems simultaneously, replacing aging equipment with Canon Aplio i800 units. The difference in image quality is remarkable. Our cardiologists and general imaging teams both report significantly improved diagnostic confidence. The team coordinated delivery and training across all three locations seamlessly.',
      company: 'Clearview Imaging Centers',
      role: 'Chief Medical Officer',
      isApproved: true,
      isFeatured: false,
      userId: admin.id,
    },
    {
      author: 'David Park',
      email: 'dpark@northstarhealth.net',
      rating: 4,
      title: 'Smooth sell-back process and fair pricing',
      content:
        'When we needed to upgrade our MRI, PS Medical Devices not only helped us find a replacement but also purchased our old system at a fair price. The sell-back process was transparent and straightforward. They handled all the logistics of equipment removal. This end-to-end service is rare in the industry and made the upgrade process much less stressful.',
      company: 'NorthStar Health System',
      role: 'VP of Operations',
      isApproved: true,
      isFeatured: false,
      userId: admin.id,
    },
    {
      author: 'Dr. Lisa Patel',
      email: 'lpatel@gatewayeye.com',
      rating: 5,
      title: 'Perfect OCT choice for our growing practice',
      content:
        'We selected the Topcon Maestro 2 based on PS Medical Devices recommendation and it has been perfect for our busy ophthalmology practice. The fully automated operation means our technicians can capture OCT and fundus images simultaneously, cutting exam times in half. The swept-source OCT provides superior depth penetration compared to our previous system. Outstanding investment.',
      company: 'Gateway Eye Institute',
      role: 'Ophthalmologist',
      isApproved: true,
      isFeatured: true,
      userId: admin.id,
    },
    {
      author: 'Unverified Customer',
      email: 'reviewer@example.com',
      rating: 3,
      title: 'Good equipment, slow delivery',
      content:
        'The ultrasound machine we purchased works well, but the delivery took longer than initially promised. The quality of the equipment is good and the price was fair. Customer service was helpful once we raised the delivery concern.',
      company: 'Unknown',
      role: null,
      isApproved: false,
      isFeatured: false,
      userId: null,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log(`✅ ${reviews.length} reviews created`);

  // ─── Seed Sample Leads ─────────────────────────────────────────────
  const leads = [
    {
      name: 'Dr. Mark Johnson',
      email: 'mjohnson@riversidehospital.org',
      phone: '+1 (713) 555-0142',
      company: 'Riverside Community Hospital',
      type: 'quote',
      productName: 'GE Revolution CT Scanner',
      message:
        'We are interested in obtaining a quote for the GE Revolution CT Scanner. We are expanding our imaging department and need this system within the next 90 days. Please include installation and training costs in the quote.',
      status: 'new',
    },
    {
      name: 'Patricia Lewis',
      email: 'plewis@sunriseclinic.com',
      phone: '+1 (713) 555-0188',
      company: 'Sunrise Family Clinic',
      type: 'quote',
      productName: 'Carestream DRX-Evolution X-Ray',
      message:
        'Our clinic is looking to upgrade from film-based X-ray to digital. We would like more information about the Carestream DRX-Evolution system, including financing options and service contracts.',
      status: 'contacted',
    },
    {
      name: 'Tom Bradley',
      email: 'tbradley@statimaging.com',
      phone: '+1 (713) 555-0167',
      company: 'Stat Imaging Partners',
      type: 'sell',
      message:
        'We have a Philips Ingenuity CT 128-slice that we would like to sell. It was decommissioned last month and is in good working condition. Can you provide an estimate?',
      status: 'new',
    },
    {
      name: 'Dr. Nancy Reed',
      email: 'nreed@centralvision.com',
      phone: '+1 (713) 555-0195',
      company: 'Central Vision Center',
      type: 'support',
      message:
        'We purchased an OCT system from PS Medical Devices six months ago and need assistance with software updates and recalibration. The system is working but we want to ensure it stays current.',
      status: 'contacted',
    },
  ];

  for (const lead of leads) {
    await prisma.lead.create({ data: lead });
  }
  console.log(`✅ ${leads.length} leads created`);

  // ─── Seed Sample Sell Requests ─────────────────────────────────────
  const sellRequests = [
    {
      name: 'Robert Henderson',
      email: 'rhenderson@metrohealth.org',
      phone: '+1 (713) 555-0133',
      company: 'Metro Health Imaging',
      equipmentType: 'MRI',
      manufacturer: 'GE',
      model: 'Signa HDx 1.5T',
      condition: 'Working',
      description:
        'GE Signa HDx 1.5T MRI system, manufactured 2016, decommissioned in 2024. Includes 8-channel body coil, head coil, and spine array. Regular maintenance records available. System is in full working condition.',
      askingPrice: 180000,
      photos: JSON.stringify([]),
      status: 'reviewing',
    },
    {
      name: 'Carol Martinez',
      email: 'cmartinez@westsideclinic.com',
      phone: '+1 (713) 555-0171',
      company: 'Westside Surgical Center',
      equipmentType: 'Ultrasound',
      manufacturer: 'GE',
      model: 'LOGIQ E9',
      condition: 'Working',
      description:
        'GE LOGIQ E9 ultrasound with C1-5, M4C, and L8-18i transducers. System works well but we are upgrading to a newer model. All transducers tested and functional.',
      askingPrice: 35000,
      photos: JSON.stringify([]),
      status: 'pending',
    },
  ];

  for (const sellRequest of sellRequests) {
    await prisma.sellRequest.create({ data: sellRequest });
  }
  console.log(`✅ ${sellRequests.length} sell requests created`);

  // ─── Seed Site Settings ────────────────────────────────────────────
  const settings = [
    { key: 'company_name', value: 'PS Medical Devices', type: 'text' },
    { key: 'tagline', value: 'Trusted Medical Equipment Partner', type: 'text' },
    { key: 'phone', value: '+1 (305) 244-9340', type: 'text' },
    { key: 'email', value: 'michelgg0102780@gmail.com', type: 'text' },
    { key: 'address', value: '2234 Winter Woods, Unidad 1000, Winter Park, FL 32792', type: 'text' },
    { key: 'hours', value: 'Monday - Friday: 8:00 AM - 6:00 PM CST', type: 'text' },
    { key: 'primary_color', value: '#0F2B5B', type: 'color' },
    { key: 'accent_color', value: '#0D9488', type: 'color' },
    { key: 'facebook_url', value: 'https://facebook.com/psmedicaldevices', type: 'text' },
    { key: 'linkedin_url', value: 'https://linkedin.com/company/psmedicaldevices', type: 'text' },
    { key: 'about_description', value: 'PS Medical Devices is a leading provider of new and refurbished medical imaging equipment. With over 15 years of experience, we serve hospitals, imaging centers, clinics, and physician practices across the United States. Our commitment to quality, value, and exceptional customer service has made us a trusted partner for healthcare facilities of all sizes.', type: 'text' },
    { key: 'hero_title', value: 'Premium Medical Imaging Equipment', type: 'text' },
    { key: 'hero_subtitle', value: 'New & Refurbished CT, MRI, X-Ray, Ultrasound, and Ophthalmology Systems from Top Manufacturers', type: 'text' },
    { key: 'hero_cta_text', value: 'Browse Equipment', type: 'text' },
    { key: 'hero_cta_link', value: '/products', type: 'text' },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.create({ data: setting });
  }
  console.log(`✅ ${settings.length} site settings created`);

  console.log('\n🎉 Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
