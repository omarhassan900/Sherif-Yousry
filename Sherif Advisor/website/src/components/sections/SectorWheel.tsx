'use client';

import { useState, useEffect } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';
import { ChevronLeft, ChevronRight, ArrowUpRight, MapPin, Leaf } from 'lucide-react';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

const sectorsData = [
  {
    id: 'agriculture',
    title: 'Agriculture and Food Processing',
    shortTitle: 'Agriculture',
    description: 'Egypt benefits from a unique combination of national and natural advantages that position it as an exceptional global hub for food manufacturing and supply chains.',
    strategies: { text: 'Agrifood security, water efficiency, processing, resilient supply chains.' },
    keyNumbers: [
      { value: '~$1.3 - TRN', label: 'is the global agri-food market value in retail sales' },
      { value: '~$75 - BN', label: 'is the value of the agri-food sector in Egypt at retail prices' },
      { value: '7-8%', label: 'per year is the expected growth of Egypt Agri-Food Market through 2030' }
    ],
    opportunities: [
      { title: 'Integrated Potato Play', location: 'Aljouf', description: 'Invest in an integrated potato facility, farming optimal breeds to produce fresh whole potatoes...', investment: 'USD 2.7 Bn', hasLeaf: true },
      { title: 'Livestock Breeding', location: 'Aljouf', description: 'Invest in large state of the art commercial livestock farms, focusing on optimal breeds...', investment: 'USD 8.8 Bn', hasLeaf: false }
    ]
  },
  {
    id: 'automotive',
    title: 'Automotive',
    shortTitle: 'Automotive',
    description: 'Egypt is rapidly emerging as a regional automotive manufacturing hub, supported by government incentives.',
    strategies: { text: 'EV manufacturing, supply chain localization, export-oriented production.' },
    keyNumbers: [
      { value: '~$50 - BN', label: 'automotive market size in GCC by 2030' },
      { value: '30%', label: 'target for local manufacturing content' },
      { value: '200K+', label: 'vehicles annual production capacity target' }
    ],
    opportunities: [
      { title: 'EV Assembly Plant', location: 'Riyadh', description: 'Establish a state-of-the-art electric vehicle assembly plant...', investment: 'USD 1.5 Bn', hasLeaf: false },
      { title: 'Auto Parts Manufacturing', location: 'Jeddah', description: 'Develop a comprehensive automotive parts manufacturing facility...', investment: 'USD 450 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'biotech',
    title: 'Biotechnology and Pharma',
    shortTitle: 'Biotech',
    description: 'The Kingdom is investing heavily in biotechnology and pharmaceutical manufacturing.',
    strategies: { text: 'Local drug manufacturing, R&D centers, biotech innovation hubs.' },
    keyNumbers: [
      { value: '~$8 - BN', label: 'pharmaceutical market value in KSA' },
      { value: '70%', label: 'target for local pharmaceutical production' },
      { value: '12%', label: 'annual growth rate of biotech sector' }
    ],
    opportunities: [
      { title: 'Pharma Manufacturing Hub', location: 'Riyadh', description: 'Build a comprehensive pharmaceutical manufacturing facility...', investment: 'USD 800 Mn', hasLeaf: true },
      { title: 'Biotech Research Center', location: 'KAUST', description: 'Establish a cutting-edge biotechnology research center...', investment: 'USD 350 Mn', hasLeaf: true }
    ]
  },
  {
    id: 'culture',
    title: 'Culture',
    shortTitle: 'Culture',
    description: 'Egypt is experiencing a cultural renaissance with massive investments in arts and heritage.',
    strategies: { text: 'Cultural heritage preservation, creative industries, arts infrastructure.' },
    keyNumbers: [
      { value: '~$15 - BN', label: 'investment in cultural sector by 2030' },
      { value: '50+', label: 'new cultural venues planned' },
      { value: '3x', label: 'growth in creative industries employment' }
    ],
    opportunities: [
      { title: 'Cultural District', location: 'Diriyah', description: 'Develop a world-class cultural district featuring museums and galleries...', investment: 'USD 2.1 Bn', hasLeaf: false },
      { title: 'Heritage Restoration', location: 'Al-Ula', description: 'Restore historical sites into premium cultural tourism destinations...', investment: 'USD 650 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    shortTitle: 'Cybersecurity',
    description: 'Building a robust cybersecurity ecosystem to protect critical infrastructure.',
    strategies: { text: 'National cybersecurity framework, threat intelligence, secure infrastructure.' },
    keyNumbers: [
      { value: '~$3.5 - BN', label: 'cybersecurity market size in KSA' },
      { value: '15%', label: 'annual growth rate of cybersecurity sector' },
      { value: '20K+', label: 'cybersecurity professionals needed by 2030' }
    ],
    opportunities: [
      { title: 'Cyber Ops Center', location: 'Riyadh', description: 'Establish a state-of-the-art cybersecurity operations center...', investment: 'USD 280 Mn', hasLeaf: false },
      { title: 'Security Academy', location: 'NEOM', description: 'Build a comprehensive cybersecurity training academy...', investment: 'USD 120 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'defense',
    title: 'Defense and Space',
    shortTitle: 'Defense',
    description: 'Developing advanced defense capabilities and space technologies.',
    strategies: { text: 'Defense manufacturing, space exploration, satellite technology.' },
    keyNumbers: [
      { value: '~$20 - BN', label: 'defense sector investment by 2030' },
      { value: '50%', label: 'target for local defense manufacturing' },
      { value: '3', label: 'satellite launches planned by 2025' }
    ],
    opportunities: [
      { title: 'Defense Systems', location: 'Riyadh', description: 'Establish advanced defense systems manufacturing facilities...', investment: 'USD 3.2 Bn', hasLeaf: false },
      { title: 'Satellite Station', location: 'Tabuk', description: 'Develop a comprehensive satellite ground station...', investment: 'USD 450 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'education',
    title: 'Education',
    shortTitle: 'Education',
    description: 'Transforming the education sector with world-class institutions.',
    strategies: { text: 'Digital learning, international partnerships, skills development.' },
    keyNumbers: [
      { value: '~$30 - BN', label: 'education sector investment' },
      { value: '100+', label: 'new international schools planned' },
      { value: '95%', label: 'target for digital literacy by 2030' }
    ],
    opportunities: [
      { title: 'University Campus', location: 'KAEC', description: 'Develop a world-class international university campus...', investment: 'USD 1.8 Bn', hasLeaf: false },
      { title: 'EdTech Platform', location: 'Riyadh', description: 'Build a comprehensive digital learning platform...', investment: 'USD 220 Mn', hasLeaf: true }
    ]
  },
  {
    id: 'energy',
    title: 'Energy',
    shortTitle: 'Energy',
    description: 'Leading the global energy transition while maintaining oil production.',
    strategies: { text: 'Renewable energy, hydrogen production, grid modernization.' },
    keyNumbers: [
      { value: '~$100 - BN', label: 'renewable energy investment target' },
      { value: '50%', label: 'renewable energy mix by 2030' },
      { value: '4 GW', label: 'solar capacity addition annually' }
    ],
    opportunities: [
      { title: 'Solar Farm', location: 'Tabuk', description: 'Develop a utility-scale solar photovoltaic farm...', investment: 'USD 2.5 Bn', hasLeaf: true },
      { title: 'Green Hydrogen', location: 'NEOM', description: 'Build a large-scale green hydrogen production facility...', investment: 'USD 8.4 Bn', hasLeaf: true }
    ]
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    shortTitle: 'Entertainment',
    description: 'Booming sector with new venues, events, and content creation.',
    strategies: { text: 'Theme parks, live events, content production, gaming.' },
    keyNumbers: [
      { value: '~$12 - BN', label: 'entertainment sector revenue target' },
      { value: '300+', label: 'live events annually by 2030' },
      { value: '5x', label: 'growth in entertainment employment' }
    ],
    opportunities: [
      { title: 'Theme Park', location: 'Qiddiya', description: 'Develop a world-class theme park and entertainment resort...', investment: 'USD 4.2 Bn', hasLeaf: false },
      { title: 'Film Studio', location: 'Riyadh', description: 'Build a comprehensive film production studio complex...', investment: 'USD 380 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'environment',
    title: 'Environment',
    shortTitle: 'Environment',
    description: 'Implementing ambitious environmental protection initiatives.',
    strategies: { text: 'Carbon reduction, biodiversity protection, circular economy.' },
    keyNumbers: [
      { value: '~$18 - BN', label: 'environmental initiatives investment' },
      { value: '10B', label: 'trees to be planted by 2030' },
      { value: 'Net Zero', label: 'carbon neutrality target by 2060' }
    ],
    opportunities: [
      { title: 'Carbon Capture', location: 'Jubail', description: 'Establish a large-scale carbon capture facility...', investment: 'USD 1.2 Bn', hasLeaf: true },
      { title: 'Waste-to-Energy', location: 'Jeddah', description: 'Develop an advanced waste-to-energy conversion facility...', investment: 'USD 450 Mn', hasLeaf: true }
    ]
  },
  {
    id: 'env-services',
    title: 'Environment Services',
    shortTitle: 'Env Services',
    description: 'Comprehensive environmental services including waste management.',
    strategies: { text: 'Waste management, water treatment, environmental consulting.' },
    keyNumbers: [
      { value: '~$8 - BN', label: 'environmental services market size' },
      { value: '90%', label: 'waste diversion target by 2030' },
      { value: '100%', label: 'wastewater treatment coverage target' }
    ],
    opportunities: [
      { title: 'Recycling Network', location: 'Multiple Cities', description: 'Develop a network of advanced recycling facilities...', investment: 'USD 680 Mn', hasLeaf: true },
      { title: 'Water Treatment', location: 'Riyadh', description: 'Build a state-of-the-art water treatment facility...', investment: 'USD 920 Mn', hasLeaf: true }
    ]
  },
  {
    id: 'financial',
    title: 'Financial Services',
    shortTitle: 'Financial',
    description: 'Riyadh is emerging as a major financial hub with fintech innovation.',
    strategies: { text: 'Fintech innovation, Islamic finance, capital markets development.' },
    keyNumbers: [
      { value: '~$45 - BN', label: 'financial services sector value' },
      { value: '300+', label: 'fintech companies target by 2030' },
      { value: '15%', label: 'annual growth in digital banking' }
    ],
    opportunities: [
      { title: 'Fintech Hub', location: 'Riyadh', description: 'Establish a comprehensive fintech innovation hub...', investment: 'USD 550 Mn', hasLeaf: false },
      { title: 'Islamic Finance', location: 'Jeddah', description: 'Develop a digital Islamic finance platform...', investment: 'USD 320 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Medical Devices',
    shortTitle: 'Healthcare',
    description: 'Building a world-class healthcare system with advanced facilities.',
    strategies: { text: 'Healthcare infrastructure, medical device manufacturing, telemedicine.' },
    keyNumbers: [
      { value: '~$35 - BN', label: 'healthcare sector investment' },
      { value: '40%', label: 'target for local medical device production' },
      { value: '500+', label: 'new healthcare facilities planned' }
    ],
    opportunities: [
      { title: 'Medical Devices', location: 'Riyadh', description: 'Establish a medical device manufacturing facility...', investment: 'USD 780 Mn', hasLeaf: true },
      { title: 'Smart Hospital', location: 'NEOM', description: 'Build a next-generation smart hospital...', investment: 'USD 1.4 Bn', hasLeaf: true }
    ]
  },
  {
    id: 'ict',
    title: 'Information and Communications',
    shortTitle: 'ICT',
    description: 'Digital infrastructure and telecommunications are key enablers.',
    strategies: { text: '5G deployment, data centers, digital infrastructure.' },
    keyNumbers: [
      { value: '~$25 - BN', label: 'ICT sector investment' },
      { value: '98%', label: '5G coverage target by 2025' },
      { value: '100+', label: 'new data centers planned' }
    ],
    opportunities: [
      { title: 'Data Center Campus', location: 'Riyadh', description: 'Develop a hyperscale data center campus...', investment: 'USD 1.1 Bn', hasLeaf: false },
      { title: '5G Expansion', location: 'Nationwide', description: 'Expand 5G network infrastructure...', investment: 'USD 2.3 Bn', hasLeaf: false }
    ]
  },
  {
    id: 'machinery',
    title: 'Machinery and Equipment',
    shortTitle: 'Machinery',
    description: 'Local manufacturing of machinery to support Vision 2030 projects.',
    strategies: { text: 'Industrial manufacturing, automation, heavy equipment.' },
    keyNumbers: [
      { value: '~$12 - BN', label: 'machinery market size' },
      { value: '60%', label: 'localization target for industrial equipment' },
      { value: '8%', label: 'annual sector growth rate' }
    ],
    opportunities: [
      { title: 'Heavy Machinery', location: 'Dammam', description: 'Establish a heavy machinery manufacturing facility...', investment: 'USD 620 Mn', hasLeaf: false },
      { title: 'Automation Factory', location: 'Jubail', description: 'Build an advanced automation systems plant...', investment: 'USD 380 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'media',
    title: 'Media',
    shortTitle: 'Media',
    description: 'Developing a vibrant media ecosystem with content creation.',
    strategies: { text: 'Content production, broadcasting, digital media platforms.' },
    keyNumbers: [
      { value: '~$6 - BN', label: 'media sector investment' },
      { value: '1000+', label: 'new media jobs created annually' },
      { value: '5x', label: 'growth in local content production' }
    ],
    opportunities: [
      { title: 'Media Complex', location: 'Riyadh', description: 'Develop a comprehensive media production complex...', investment: 'USD 420 Mn', hasLeaf: false },
      { title: 'Streaming Platform', location: 'Riyadh', description: 'Launch a regional Arabic-language streaming platform...', investment: 'USD 280 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'mining',
    title: 'Mining and Metals',
    shortTitle: 'Mining',
    description: 'Untapped mineral wealth worth an estimated $1.3 trillion.',
    strategies: { text: 'Mineral extraction, metal processing, mining technology.' },
    keyNumbers: [
      { value: '~$1.3 - TRN', label: 'estimated mineral wealth' },
      { value: '3', label: 'new mining cities planned' },
      { value: '$20 BN', label: 'mining sector investment target' }
    ],
    opportunities: [
      { title: 'Gold Mining', location: 'Mahd Ad Dhahab', description: 'Develop a large-scale gold mining operation...', investment: 'USD 1.8 Bn', hasLeaf: false },
      { title: 'Phosphate Plant', location: 'Wa\'ad Al Shamal', description: 'Establish a phosphate mining and fertilizer facility...', investment: 'USD 2.4 Bn', hasLeaf: false }
    ]
  },
  {
    id: 'petrochemical',
    title: 'Petrochemical and Conventional',
    shortTitle: 'Petrochemical',
    description: 'A global leader in petrochemicals, expanding into specialty chemicals.',
    strategies: { text: 'Petrochemical expansion, specialty chemicals, circular carbon economy.' },
    keyNumbers: [
      { value: '~$80 - BN', label: 'petrochemical sector value' },
      { value: '3rd', label: 'largest petrochemical producer globally' },
      { value: '15%', label: 'annual capacity growth target' }
    ],
    opportunities: [
      { title: 'Specialty Chemicals', location: 'Yanbu', description: 'Build a specialty chemicals production complex...', investment: 'USD 3.5 Bn', hasLeaf: false },
      { title: 'Polymer Plant', location: 'Jubail', description: 'Establish a state-of-the-art polymer manufacturing plant...', investment: 'USD 2.1 Bn', hasLeaf: false }
    ]
  },
  {
    id: 'pv',
    title: 'PV Factory',
    shortTitle: 'PV Factory',
    description: 'Solar photovoltaic manufacturing is a strategic priority.',
    strategies: { text: 'Solar panel manufacturing, cell production, module assembly.' },
    keyNumbers: [
      { value: '~$5 - BN', label: 'solar manufacturing investment' },
      { value: '4 GW', label: 'annual solar panel production target' },
      { value: '50%', label: 'local content target for solar projects' }
    ],
    opportunities: [
      { title: 'Solar Cell Mfg', location: 'Riyadh', description: 'Establish a comprehensive solar cell manufacturing facility...', investment: 'USD 1.2 Bn', hasLeaf: true },
      { title: 'PV Glass Production', location: 'Dammam', description: 'Build a solar PV glass manufacturing plant...', investment: 'USD 480 Mn', hasLeaf: true }
    ]
  },
  {
    id: 'realestate',
    title: 'Real Estate and Construction',
    shortTitle: 'Real Estate',
    description: 'Mega-projects and urban development are transforming the landscape.',
    strategies: { text: 'Mega-projects, smart cities, sustainable construction.' },
    keyNumbers: [
      { value: '~$500 - BN', label: 'real estate development pipeline' },
      { value: '1M+', label: 'new housing units planned' },
      { value: '10%', label: 'annual construction sector growth' }
    ],
    opportunities: [
      { title: 'Smart City', location: 'NEOM', description: 'Develop a comprehensive smart city with IoT infrastructure...', investment: 'USD 15 Bn', hasLeaf: false },
      { title: 'Residential Complex', location: 'Riyadh', description: 'Build a large-scale residential development...', investment: 'USD 2.8 Bn', hasLeaf: false }
    ]
  },
  {
    id: 'recycling',
    title: 'Recycling',
    shortTitle: 'Recycling',
    description: 'Circular economy initiatives driving growth in recycling.',
    strategies: { text: 'Waste recycling, circular economy, resource recovery.' },
    keyNumbers: [
      { value: '~$4 - BN', label: 'recycling industry value' },
      { value: '85%', label: 'waste diversion target by 2035' },
      { value: '200+', label: 'recycling facilities planned' }
    ],
    opportunities: [
      { title: 'Plastic Recycling', location: 'Jeddah', description: 'Establish an advanced plastic recycling facility...', investment: 'USD 180 Mn', hasLeaf: true },
      { title: 'E-Waste Center', location: 'Riyadh', description: 'Build an electronic waste processing center...', investment: 'USD 220 Mn', hasLeaf: true }
    ]
  },
  {
    id: 'sports',
    title: 'Sports',
    shortTitle: 'Sports',
    description: 'Investing heavily in sports infrastructure and international events.',
    strategies: { text: 'Sports infrastructure, event hosting, athlete development.' },
    keyNumbers: [
      { value: '~$10 - BN', label: 'sports sector investment' },
      { value: '50+', label: 'international events hosted annually' },
      { value: '3x', label: 'growth in sports participation' }
    ],
    opportunities: [
      { title: 'Sports Stadium', location: 'Riyadh', description: 'Develop a world-class multi-purpose sports stadium...', investment: 'USD 1.5 Bn', hasLeaf: false },
      { title: 'Sports Academy', location: 'Jeddah', description: 'Build a comprehensive sports training academy...', investment: 'USD 420 Mn', hasLeaf: false }
    ]
  },
  {
    id: 'tourism',
    title: 'Tourism',
    shortTitle: 'Tourism',
    description: 'A key diversification sector with ambitious visitor targets.',
    strategies: { text: 'Tourism infrastructure, heritage sites, hospitality development.' },
    keyNumbers: [
      { value: '~$100 - BN', label: 'tourism sector contribution target' },
      { value: '150M', label: 'annual visitors target by 2030' },
      { value: '600K+', label: 'new hospitality jobs created' }
    ],
    opportunities: [
      { title: 'Luxury Resort', location: 'Red Sea', description: 'Develop a ultra-luxury resort destination...', investment: 'USD 5.2 Bn', hasLeaf: false },
      { title: 'Heritage Site', location: 'Al-Ula', description: 'Transform historical sites into premium tourism destinations...', investment: 'USD 1.8 Bn', hasLeaf: false }
    ]
  },
  {
    id: 'transport',
    title: 'Transport and Logistics',
    shortTitle: 'Transport',
    description: 'Positioning as a global logistics hub connecting three continents.',
    strategies: { text: 'Logistics infrastructure, port development, rail networks.' },
    keyNumbers: [
      { value: '~$40 - BN', label: 'logistics sector investment' },
      { value: 'Top 10', label: 'global logistics performance index target' },
      { value: '3x', label: 'growth in freight volume by 2030' }
    ],
    opportunities: [
      { title: 'Logistics Hub', location: 'King Abdullah Port', description: 'Establish a comprehensive logistics and distribution hub...', investment: 'USD 2.4 Bn', hasLeaf: false },
      { title: 'Rail Network', location: 'Nationwide', description: 'Expand the national rail network...', investment: 'USD 6.8 Bn', hasLeaf: false }
    ]
  },
  {
    id: 'water',
    title: 'Water',
    shortTitle: 'Water',
    description: 'Water security is a national priority with massive investments.',
    strategies: { text: 'Desalination, water recycling, smart water management.' },
    keyNumbers: [
      { value: '~$30 - BN', label: 'water sector investment' },
      { value: '1st', label: 'largest desalination producer globally' },
      { value: '100%', label: 'water treatment coverage target' }
    ],
    opportunities: [
      { title: 'Desalination Plant', location: 'Ras Al-Khair', description: 'Build a large-scale reverse osmosis desalination plant...', investment: 'USD 3.2 Bn', hasLeaf: true },
      { title: 'Smart Water Network', location: 'Riyadh', description: 'Develop an IoT-enabled smart water distribution network...', investment: 'USD 680 Mn', hasLeaf: true }
    ]
  }
];

export function SectorWheel() {
  const [lang, setLang] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSector, setSelectedSector] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  const handleSectorClick = (index: number) => {
    setSelectedSector(index);
    const sectorAngle = 360 / sectorsData.length;
    const sliceCenterAngle = index * sectorAngle + sectorAngle / 2;
    const targetRotation = -sliceCenterAngle;
    setRotation(targetRotation);
  };

  if (!isMounted) return null;

  const sectorAngle = 360 / sectorsData.length;
  const currentData = sectorsData[selectedSector];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-[#0a1f2e]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          src="/images/Protenisn-and-aquaculture--scaled.jpg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/60" />
      </div>

      {/* Section Title */}
      <div className="absolute top-10 left-0 right-0 z-20 text-center px-4">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3">
          {t(lang, 'استكشف قطاعات الاستثمار', 'Explore Investment Sectors')}
        </h2>
        <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
          {t(lang, 'انقر على أي قطاع لعرض التفاصيل والفرص الاستثمارية', 'Click on any sector to view details and investment opportunities')}
        </p>
        <div className="w-24 h-1 bg-[#00A7A2] mx-auto mt-6 rounded-full" />
      </div>

      <div className="relative z-10 flex items-center justify-center w-full max-w-[1600px] mx-auto gap-8 flex-col lg:flex-row mt-32">
        
        {/* Left Side - Circular Wheel */}
        <div className="relative flex items-center justify-center shrink-0" style={{ width: '700px', height: '700px' }}>
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: '0 0 80px rgba(0, 167, 162, 0.4)' }} />
          
          <div 
            className="relative w-full h-full transition-transform duration-1000 ease-out"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="-430 -430 860 860" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="highlight-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00A7A2" />
                  <stop offset="100%" stopColor="#00d4cc" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {sectorsData.map((sector, index) => {
                const startAngle = index * sectorAngle;
                const endAngle = (index + 1) * sectorAngle;
                
                const startRad = (startAngle - 90) * Math.PI / 180;
                const endRad = (endAngle - 90) * Math.PI / 180;
                
                const x1 = 380 * Math.cos(startRad);
                const y1 = 380 * Math.sin(startRad);
                const x2 = 380 * Math.cos(endRad);
                const y2 = 380 * Math.sin(endRad);
                
                const isSelected = index === selectedSector;
                const textAngle = startAngle + sectorAngle / 2;
                
                return (
                  <g key={sector.id}>
                    <path
                      d={`M 0 0 L ${x1} ${y1} A 380 380 0 0 1 ${x2} ${y2} Z`}
                      fill={isSelected ? 'url(#highlight-gradient)' : 'rgba(30, 41, 59, 0.8)'}
                      stroke="rgba(255, 255, 255, 0.15)"
                      strokeWidth="1.5"
                      style={{
                        cursor: 'pointer',
                        filter: isSelected ? 'url(#glow)' : 'none',
                        opacity: isSelected ? 1 : 0.75,
                        transition: 'all 0.5s ease',
                        pointerEvents: 'auto'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSectorClick(index);
                      }}
                    />
                    
                    <text
                      x={0}
                      y={0}
                      transform={`rotate(${textAngle}) translate(310, 0)`}
                      fill={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'}
                      fontSize={isSelected ? '16' : '14'}
                      fontWeight={isSelected ? 'bold' : '600'}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{
                        pointerEvents: 'none',
                        userSelect: 'none',
                        textShadow: isSelected ? '0 0 12px rgba(0,0,0,0.9)' : '0 1px 3px rgba(0,0,0,0.5)',
                        transition: 'all 0.3s ease',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                    >
                      {sector.shortTitle}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          
          {/* Center Circle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="relative cursor-pointer group pointer-events-auto"
              style={{ width: '160px', height: '160px' }}
            >
              <div className="absolute inset-0 rounded-full bg-[#0a1f2e] border-4 border-[#00A7A2] shadow-[0_0_40px_rgba(0,167,162,0.6)]" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-3xl font-bold mb-2">NIS</div>
                <div className="w-14 h-14 rounded-full bg-[#00A7A2] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="mt-2 text-sm font-medium">View</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Information Panel */}
        <div className="flex-1 max-w-2xl w-full">
          <div className="bg-[rgba(10,31,46,0.9)] backdrop-blur-xl rounded-2xl border border-[#00A7A2]/30 overflow-hidden shadow-2xl">
            
            {/* Top Section */}
            <div className="p-6 border-b border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Strategies */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-4">Agricultural & industrial strategies</h3>
                  <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#00A7A2]/20 flex items-center justify-center flex-shrink-0">
                        <div className="w-4 h-4 border-2 border-[#00A7A2] rounded-full" />
                      </div>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {currentData.strategies.text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Numbers */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-4 text-center">Key Numbers</h3>
                  <div className="space-y-3">
                    {currentData.keyNumbers.map((stat, index) => (
                      <div key={index} className="bg-[rgba(0,0,0,0.3)] rounded-lg p-3 backdrop-blur-sm">
                        <div className="flex items-center gap-3 mb-1">
                          <div className="w-3 h-3 rounded-full bg-[#00A7A2]" />
                          <span className="text-white font-bold text-sm">{stat.value}</span>
                        </div>
                        <p className="text-white/60 text-xs pl-6">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Opportunities */}
            <div className="p-6">
              <h3 className="text-white font-semibold text-sm mb-4">Investment Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentData.opportunities.map((opp, index) => (
                  <div 
                    key={index}
                    className={`rounded-xl p-4 backdrop-blur-sm ${
                      index === 0 
                        ? 'bg-gradient-to-b from-[#00A7A2]/20 to-[#00A7A2]/40 border border-[#00A7A2]/30' 
                        : 'bg-gradient-to-b from-purple-500/20 to-purple-600/40 border border-purple-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold text-sm mb-1">{opp.title}</h4>
                        {opp.hasLeaf && <Leaf className="w-4 h-4 text-[#00A7A2]" />}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-[#00A7A2]" />
                      <span className="text-[#00A7A2] text-xs">{opp.location}</span>
                    </div>
                    
                    <p className="text-white/70 text-xs leading-relaxed mb-4 line-clamp-3">
                      {opp.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white/20 rounded" />
                        <div>
                          <div className="text-white text-xs font-semibold">{opp.investment}</div>
                        </div>
                      </div>
                      <button className="w-6 h-6 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-colors">
                        <ArrowUpRight className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="p-4 bg-[rgba(0,0,0,0.4)] border-t border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
                
                <div className="flex items-center gap-3 flex-1">
                  <button className="flex-1 bg-[rgba(0,0,0,0.4)] border border-white/30 rounded-full px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors group">
                    <span className="text-white text-xs font-semibold">Explore Opportunities</span>
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                  <button className="flex-1 bg-[#00A7A2] rounded-full px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-[#00b8b3] transition-colors group">
                    <span className="text-white text-xs font-semibold">Explore Sector</span>
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}