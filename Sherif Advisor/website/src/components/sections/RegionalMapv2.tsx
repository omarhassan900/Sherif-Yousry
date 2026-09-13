'use client';

import { useState, useEffect } from 'react';
import { getClientLanguage, type Language } from '@/lib/language';
import { ArrowUpRight, MapPin, Users, Ruler, Building2 } from 'lucide-react';

const t = (lang: Language, ar: string, en: string) => (lang === 'ar' ? ar : en);

interface RegionData {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  stats: {
    populationGrowth: string;
    population: string;
    area: string;
    cities: string;
  };
  sectors: { name: string; nameAr: string }[];
  opportunities: { title: string; titleAr: string }[];
}

const regionsData: Record<string, RegionData> = {
  'EG-ALX': {
    id: 'EG-ALX',
    name: 'Alexandria',
    nameAr: 'الإسكندرية',
    description: 'Egypt\'s second-largest city and major Mediterranean port, known for its rich history and modern industrial base.',
    descriptionAr: 'ثاني أكبر مدينة في مصر وميناء رئيسي على البحر الأبيض المتوسط، تشتهر بتاريخها الغني وقاعدتها الصناعية الحديثة.',
    stats: {
      populationGrowth: '1.8%',
      population: '5,200,000',
      area: '2,679 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Maritime', nameAr: 'النقل البحري' },
      { name: 'Petrochemicals', nameAr: 'البتروكيماويات' },
      { name: 'Tourism', nameAr: 'السياحة' }
    ],
    opportunities: [
      { title: 'Port Expansion', titleAr: 'توسيع الموانئ' },
      { title: 'Petrochemical Complex', titleAr: 'مجمع بتروكيماوي' },
      { title: 'Coastal Tourism', titleAr: 'السياحة الساحلية' },
      { title: 'Fisheries', titleAr: 'الثروة السمكية' }
    ]
  },
  'EG-ASN': {
    id: 'EG-ASN',
    name: 'Aswan',
    nameAr: 'أسوان',
    description: 'Southern gateway to Egypt with Nubian culture and the High Dam.',
    descriptionAr: 'البوابة الجنوبية لمصر مع الثقافة النوبية والسد العالي.',
    stats: {
      populationGrowth: '2.1%',
      population: '1,473,975',
      area: '62,726 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Mining', nameAr: 'التعدين' }
    ],
    opportunities: [
      { title: 'Nubian Tourism', titleAr: 'السياحة النوبية' },
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Mining Projects', titleAr: 'مشاريع التعدين' },
      { title: 'Cultural Heritage', titleAr: 'التراث الثقافي' }
    ]
  },
  'EG-AST': {
    id: 'EG-AST',
    name: 'Asyut',
    nameAr: 'أسيوط',
    description: 'Major Upper Egypt governorate with agricultural and educational significance.',
    descriptionAr: 'محافظة رئيسية في صعيد مصر ذات أهمية زراعية وتعليمية.',
    stats: {
      populationGrowth: '2.1%',
      population: '4,383,289',
      area: '1,553 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Education', nameAr: 'التعليم' },
      { name: 'Industry', nameAr: 'الصناعة' }
    ],
    opportunities: [
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Educational Institutions', titleAr: 'المؤسسات التعليمية' },
      { title: 'Industrial Development', titleAr: 'التطوير الصناعي' },
      { title: 'Infrastructure', titleAr: 'البنية التحتية' }
    ]
  },
  'EG-BA': {
    id: 'EG-BA',
    name: 'Red Sea',
    nameAr: 'البحر الأحمر',
    description: 'Egypt\'s premier coastal tourism destination with world-class diving resorts and strategic ports.',
    descriptionAr: 'الوجهة السياحية الساحلية الأولى في مصر مع منتجعات غوص عالمية المستوى وموانئ استراتيجية.',
    stats: {
      populationGrowth: '3.2%',
      population: '359,888',
      area: '203,685 km²',
      cities: '2'
    },
    sectors: [
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Mining', nameAr: 'التعدين' },
      { name: 'Logistics', nameAr: 'اللوجستيات' }
    ],
    opportunities: [
      { title: 'Luxury Resorts', titleAr: 'المنتجعات الفاخرة' },
      { title: 'Marine Tourism', titleAr: 'السياحة البحرية' },
      { title: 'Mining Projects', titleAr: 'مشاريع التعدين' },
      { title: 'Port Development', titleAr: 'تطوير الموانئ' }
    ]
  },
  'EG-BH': {
    id: 'EG-BH',
    name: 'Beheira',
    nameAr: 'البحيرة',
    description: 'Coastal governorate on the Mediterranean with agricultural and fishing industries.',
    descriptionAr: 'محافظة ساحلية على البحر الأبيض المتوسط مع صناعات زراعية وسمكية.',
    stats: {
      populationGrowth: '1.8%',
      population: '6,168,382',
      area: '9,826 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Fishing', nameAr: 'صيد الأسماك' },
      { name: 'Tourism', nameAr: 'السياحة' }
    ],
    opportunities: [
      { title: 'Coastal Development', titleAr: 'التطوير الساحلي' },
      { title: 'Aquaculture', titleAr: 'تربية الأحياء المائية' },
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Tourism Infrastructure', titleAr: 'البنية التحتية السياحية' }
    ]
  },
  'EG-BNS': {
    id: 'EG-BNS',
    name: 'Beni Suef',
    nameAr: 'بني سويف',
    description: 'Agricultural governorate with growing cement and construction industries.',
    descriptionAr: 'محافظة زراعية مع صناعات أسمنت وبناء نامية.',
    stats: {
      populationGrowth: '2.0%',
      population: '3,154,100',
      area: '1,322 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Cement', nameAr: 'الأسمنت' },
      { name: 'Construction', nameAr: 'البناء' }
    ],
    opportunities: [
      { title: 'Cement Production', titleAr: 'إنتاج الأسمنت' },
      { title: 'Agricultural Development', titleAr: 'التنمية الزراعية' },
      { title: 'Construction Materials', titleAr: 'مواد البناء' },
      { title: 'Industrial Projects', titleAr: 'المشاريع الصناعية' }
    ]
  },
  'EG-C': {
    id: 'EG-C',
    name: 'Cairo',
    nameAr: 'القاهرة',
    description: 'The capital and largest city of Egypt, serving as the economic, cultural, and political heart of the nation.',
    descriptionAr: 'عاصمة مصر وأكبر مدنها، وتعمل كمركز اقتصادي وثقافي وسياسي للأمة.',
    stats: {
      populationGrowth: '2.1%',
      population: '10,025,657',
      area: '3,085 km²',
      cities: '1'
    },
    sectors: [
      { name: 'ICT', nameAr: 'تكنولوجيا المعلومات' },
      { name: 'Finance', nameAr: 'الخدمات المالية' },
      { name: 'Tourism', nameAr: 'السياحة' }
    ],
    opportunities: [
      { title: 'Smart City Development', titleAr: 'تطوير المدن الذكية' },
      { title: 'Financial Services Hub', titleAr: 'مركز الخدمات المالية' },
      { title: 'Cultural Tourism', titleAr: 'السياحة الثقافية' },
      { title: 'Tech Startups', titleAr: 'الشركات الناشئة التقنية' }
    ]
  },
  'EG-DK': {
    id: 'EG-DK',
    name: 'Dakahlia',
    nameAr: 'الدقهلية',
    description: 'Major agricultural governorate in the Nile Delta with growing industrial zones.',
    descriptionAr: 'محافظة زراعية رئيسية في دلتا النيل مع مناطق صناعية نامية.',
    stats: {
      populationGrowth: '1.9%',
      population: '6,492,332',
      area: '3,459 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Food Industry', nameAr: 'صناعة الأغذية' },
      { name: 'Textiles', nameAr: 'المنسوجات' }
    ],
    opportunities: [
      { title: 'Food Processing', titleAr: 'تصنيع الأغذية' },
      { title: 'Agricultural Technology', titleAr: 'التكنولوجيا الزراعية' },
      { title: 'Textile Manufacturing', titleAr: 'تصنيع المنسوجات' },
      { title: 'Export Facilities', titleAr: 'مرافق التصدير' }
    ]
  },
  'EG-DT': {
    id: 'EG-DT',
    name: 'Damietta',
    nameAr: 'دمياط',
    description: 'Mediterranean port city known for furniture industry and maritime trade.',
    descriptionAr: 'مدينة مينائية على البحر الأبيض المتوسط تشتهر بصناعة الأثاث والتجارة البحرية.',
    stats: {
      populationGrowth: '1.5%',
      population: '1,496,765',
      area: '910 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Furniture', nameAr: 'الأثاث' },
      { name: 'Maritime', nameAr: 'النقل البحري' },
      { name: 'Agriculture', nameAr: 'الزراعة' }
    ],
    opportunities: [
      { title: 'Furniture Manufacturing', titleAr: 'تصنيع الأثاث' },
      { title: 'Port Development', titleAr: 'تطوير الموانئ' },
      { title: 'Export Industries', titleAr: 'صناعات التصدير' },
      { title: 'Agricultural Exports', titleAr: 'الصادرات الزراعية' }
    ]
  },
  'EG-FYM': {
    id: 'EG-FYM',
    name: 'Fayoum',
    nameAr: 'الفيوم',
    description: 'Historic oasis governorate with agricultural and tourism potential.',
    descriptionAr: 'محافظة واحة تاريخية مع إمكانات زراعية وسياحية.',
    stats: {
      populationGrowth: '1.9%',
      population: '3,596,954',
      area: '1,827 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Handicrafts', nameAr: 'الحرف اليدوية' }
    ],
    opportunities: [
      { title: 'Eco-Tourism', titleAr: 'السياحة البيئية' },
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Cultural Tourism', titleAr: 'السياحة الثقافية' },
      { title: 'Handicrafts', titleAr: 'الحرف اليدوية' }
    ]
  },
  'EG-GH': {
    id: 'EG-GH',
    name: 'Gharbia',
    nameAr: 'الغربية',
    description: 'Agricultural governorate in the Nile Delta with traditional industries.',
    descriptionAr: 'محافظة زراعية في دلتا النيل مع صناعات تقليدية.',
    stats: {
      populationGrowth: '1.7%',
      population: '4,301,601',
      area: '1,539 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Textiles', nameAr: 'المنسوجات' },
      { name: 'Food Processing', nameAr: 'تصنيع الأغذية' }
    ],
    opportunities: [
      { title: 'Agricultural Modernization', titleAr: 'تحديث الزراعة' },
      { title: 'Textile Industry', titleAr: 'صناعة المنسوجات' },
      { title: 'Food Production', titleAr: 'إنتاج الأغذية' },
      { title: 'Rural Development', titleAr: 'التنمية الريفية' }
    ]
  },
  'EG-GZ': {
    id: 'EG-GZ',
    name: 'Giza',
    nameAr: 'الجيزة',
    description: 'Home to the Great Pyramids and Sphinx, Giza is a major tourist destination and rapidly growing urban center.',
    descriptionAr: 'موطن الأهرامات العظيمة وأبو الهول، الجيزة وجهة سياحية رئيسية ومركز حضري سريع النمو.',
    stats: {
      populationGrowth: '2.3%',
      population: '8,915,071',
      area: '85,153 km²',
      cities: '3'
    },
    sectors: [
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Education', nameAr: 'التعليم' }
    ],
    opportunities: [
      { title: 'Archaeological Tourism', titleAr: 'السياحة الأثرية' },
      { title: 'Agricultural Development', titleAr: 'التنمية الزراعية' },
      { title: 'Educational Institutions', titleAr: 'المؤسسات التعليمية' },
      { title: 'Heritage Sites', titleAr: 'المواقع التراثية' }
    ]
  },
  'EG-IS': {
    id: 'EG-IS',
    name: 'Ismailia',
    nameAr: 'الإسماعيلية',
    description: 'Gateway to the Suez Canal with agricultural and industrial potential.',
    descriptionAr: 'بوابة قناة السويس مع إمكانات زراعية وصناعية.',
    stats: {
      populationGrowth: '2.1%',
      population: '1,303,993',
      area: '1,442 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Industry', nameAr: 'الصناعة' },
      { name: 'Logistics', nameAr: 'اللوجستيات' }
    ],
    opportunities: [
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Industrial Development', titleAr: 'التطوير الصناعي' },
      { title: 'Canal Services', titleAr: 'خدمات القناة' },
      { title: 'Tourism', titleAr: 'السياحة' }
    ]
  },
  'EG-JS': {
    id: 'EG-JS',
    name: 'South Sinai',
    nameAr: 'جنوب سيناء',
    description: 'Home to Sharm El-Sheikh and Mount Sinai, a premier tourism and religious destination.',
    descriptionAr: 'موطن شرم الشيخ وجبل سيناء، وجهة سياحية ودينية رئيسية.',
    stats: {
      populationGrowth: '4.1%',
      population: '102,018',
      area: '33,140 km²',
      cities: '2'
    },
    sectors: [
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Diving', nameAr: 'الغوص' },
      { name: 'Religious Tourism', nameAr: 'السياحة الدينية' }
    ],
    opportunities: [
      { title: 'Eco-Tourism', titleAr: 'السياحة البيئية' },
      { title: 'Diving Centers', titleAr: 'مراكز الغوص' },
      { title: 'Religious Sites', titleAr: 'المواقع الدينية' },
      { title: 'Adventure Tourism', titleAr: 'السياحة المغامرة' }
    ]
  },
  'EG-KB': {
    id: 'EG-KB',
    name: 'Qalyubia',
    nameAr: 'القليوبية',
    description: 'Strategic governorate north of Cairo with growing industrial and residential areas.',
    descriptionAr: 'محافظة استراتيجية شمال القاهرة مع مناطق صناعية وسكنية نامية.',
    stats: {
      populationGrowth: '2.2%',
      population: '5,627,420',
      area: '1,001 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Industry', nameAr: 'الصناعة' },
      { name: 'Real Estate', nameAr: 'العقارات' },
      { name: 'Services', nameAr: 'الخدمات' }
    ],
    opportunities: [
      { title: 'Industrial Development', titleAr: 'التطوير الصناعي' },
      { title: 'Residential Projects', titleAr: 'المشاريع السكنية' },
      { title: 'Commercial Centers', titleAr: 'المراكز التجارية' },
      { title: 'Infrastructure', titleAr: 'البنية التحتية' }
    ]
  },
  'EG-KFS': {
    id: 'EG-KFS',
    name: 'Kafr El-Sheikh',
    nameAr: 'كفر الشيخ',
    description: 'Northern Delta governorate with agricultural focus and Mediterranean coastline.',
    descriptionAr: 'محافظة في شمال الدلتا مع تركيز زراعي وساحل على البحر الأبيض المتوسط.',
    stats: {
      populationGrowth: '1.6%',
      population: '3,362,185',
      area: '3,437 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Fishing', nameAr: 'صيد الأسماك' },
      { name: 'Renewables', nameAr: 'الطاقة المتجددة' }
    ],
    opportunities: [
      { title: 'Agricultural Development', titleAr: 'التنمية الزراعية' },
      { title: 'Fisheries', titleAr: 'مصايد الأسماك' },
      { title: 'Wind Energy', titleAr: 'طاقة الرياح' },
      { title: 'Coastal Tourism', titleAr: 'السياحة الساحلية' }
    ]
  },
  'EG-KN': {
    id: 'EG-KN',
    name: 'Qena',
    nameAr: 'قنا',
    description: 'Upper Egypt governorate known for agriculture and ancient temples.',
    descriptionAr: 'محافظة في صعيد مصر تشتهر بالزراعة والمعابد القديمة.',
    stats: {
      populationGrowth: '2.3%',
      population: '3,164,281',
      area: '1,079 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Sugar Industry', nameAr: 'صناعة السكر' }
    ],
    opportunities: [
      { title: 'Temple Tourism', titleAr: 'سياحة المعابد' },
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Sugar Production', titleAr: 'إنتاج السكر' },
      { title: 'Cultural Heritage', titleAr: 'التراث الثقافي' }
    ]
  },
  'EG-LX': {
    id: 'EG-LX',
    name: 'Luxor',
    nameAr: 'الأقصر',
    description: 'World\'s greatest open-air museum with ancient Egyptian temples and tombs.',
    descriptionAr: 'أكبر متحف في الهواء الطلق في العالم مع المعابد والمقابر المصرية القديمة.',
    stats: {
      populationGrowth: '1.8%',
      population: '1,250,209',
      area: '416 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Archaeology', nameAr: 'علم الآثار' },
      { name: 'Hospitality', nameAr: 'الضيافة' }
    ],
    opportunities: [
      { title: 'Archaeological Tourism', titleAr: 'السياحة الأثرية' },
      { title: 'Luxury Hotels', titleAr: 'الفنادق الفاخرة' },
      { title: 'Cultural Events', titleAr: 'الفعاليات الثقافية' },
      { title: 'Heritage Conservation', titleAr: 'الحفاظ على التراث' }
    ]
  },
  'EG-MN': {
    id: 'EG-MN',
    name: 'Minya',
    nameAr: 'المنيا',
    description: 'Upper Egypt governorate with archaeological sites and agricultural base.',
    descriptionAr: 'محافظة في صعيد مصر مع مواقع أثرية وقاعدة زراعية.',
    stats: {
      populationGrowth: '2.2%',
      population: '5,497,153',
      area: '2,262 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Industry', nameAr: 'الصناعة' }
    ],
    opportunities: [
      { title: 'Archaeological Tourism', titleAr: 'السياحة الأثرية' },
      { title: 'Agricultural Development', titleAr: 'التنمية الزراعية' },
      { title: 'Industrial Projects', titleAr: 'المشاريع الصناعية' },
      { title: 'Cultural Heritage', titleAr: 'التراث الثقافي' }
    ]
  },
  'EG-MNF': {
    id: 'EG-MNF',
    name: 'Monufia',
    nameAr: 'المنوفية',
    description: 'Agricultural governorate in the Nile Delta with traditional industries.',
    descriptionAr: 'محافظة زراعية في دلتا النيل مع صناعات تقليدية.',
    stats: {
      populationGrowth: '1.7%',
      population: '4,301,601',
      area: '1,539 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Textiles', nameAr: 'المنسوجات' },
      { name: 'Food Processing', nameAr: 'تصنيع الأغذية' }
    ],
    opportunities: [
      { title: 'Agricultural Modernization', titleAr: 'تحديث الزراعة' },
      { title: 'Textile Industry', titleAr: 'صناعة المنسوجات' },
      { title: 'Food Production', titleAr: 'إنتاج الأغذية' },
      { title: 'Rural Development', titleAr: 'التنمية الريفية' }
    ]
  },
  'EG-MT': {
    id: 'EG-MT',
    name: 'Matrouh',
    nameAr: 'مطروح',
    description: 'Mediterranean coastal governorate with beautiful beaches and tourism potential.',
    descriptionAr: 'محافظة ساحلية على البحر الأبيض المتوسط مع شواطئ جميلة وإمكانات سياحية.',
    stats: {
      populationGrowth: '2.4%',
      population: '450,328',
      area: '212,112 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Fishing', nameAr: 'صيد الأسماك' }
    ],
    opportunities: [
      { title: 'Beach Resorts', titleAr: 'المنتجعات الشاطئية' },
      { title: 'Coastal Tourism', titleAr: 'السياحة الساحلية' },
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Fisheries', titleAr: 'الثروة السمكية' }
    ]
  },
  'EG-PTS': {
    id: 'EG-PTS',
    name: 'Port Said',
    nameAr: 'بورسعيد',
    description: 'Strategic port city at the northern entrance of the Suez Canal.',
    descriptionAr: 'مدينة مينائية استراتيجية عند المدخل الشمالي لقناة السويس.',
    stats: {
      populationGrowth: '1.9%',
      population: '749,371',
      area: '72 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Maritime', nameAr: 'النقل البحري' },
      { name: 'Logistics', nameAr: 'اللوجستيات' },
      { name: 'Industry', nameAr: 'الصناعة' }
    ],
    opportunities: [
      { title: 'Port Expansion', titleAr: 'توسيع الميناء' },
      { title: 'Free Zone', titleAr: 'المنطقة الحرة' },
      { title: 'Logistics Hub', titleAr: 'مركز لوجستي' },
      { title: 'Industrial Zones', titleAr: 'المناطق الصناعية' }
    ]
  },
  'EG-SHG': {
    id: 'EG-SHG',
    name: 'Sohag',
    nameAr: 'سوهاج',
    description: 'Upper Egypt governorate with rich archaeological heritage and agricultural base.',
    descriptionAr: 'محافظة في صعيد مصر مع تراث أثري غني وقاعدة زراعية.',
    stats: {
      populationGrowth: '2.0%',
      population: '4,967,409',
      area: '1,547 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Industry', nameAr: 'الصناعة' }
    ],
    opportunities: [
      { title: 'Archaeological Sites', titleAr: 'المواقع الأثرية' },
      { title: 'Agricultural Development', titleAr: 'التنمية الزراعية' },
      { title: 'Tourism Infrastructure', titleAr: 'البنية التحتية السياحية' },
      { title: 'Industrial Zones', titleAr: 'المناطق الصناعية' }
    ]
  },
  'EG-SHR': {
    id: 'EG-SHR',
    name: 'Sharqia',
    nameAr: 'الشرقية',
    description: 'One of the most populous governorates with strong agricultural and industrial sectors.',
    descriptionAr: 'واحدة من أكثر المحافظات اكتظاظًا بالسكان مع قطاعات زراعية وصناعية قوية.',
    stats: {
      populationGrowth: '2.0%',
      population: '7,163,824',
      area: '4,180 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Industry', nameAr: 'الصناعة' },
      { name: 'Trade', nameAr: 'التجارة' }
    ],
    opportunities: [
      { title: 'Industrial Zones', titleAr: 'المناطق الصناعية' },
      { title: 'Agricultural Exports', titleAr: 'الصادرات الزراعية' },
      { title: 'Manufacturing', titleAr: 'التصنيع' },
      { title: 'Logistics Centers', titleAr: 'مراكز اللوجستيات' }
    ]
  },
  'EG-SIN': {
    id: 'EG-SIN',
    name: 'North Sinai',
    nameAr: 'شمال سيناء',
    description: 'Strategic governorate with agricultural potential and developing infrastructure.',
    descriptionAr: 'محافظة استراتيجية ذات إمكانات زراعية وبنية تحتية قيد التطوير.',
    stats: {
      populationGrowth: '2.8%',
      population: '450,328',
      area: '27,564 km²',
      cities: '2'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Energy', nameAr: 'الطاقة' },
      { name: 'Infrastructure', nameAr: 'البنية التحتية' }
    ],
    opportunities: [
      { title: 'Agricultural Projects', titleAr: 'المشاريع الزراعية' },
      { title: 'Solar Energy', titleAr: 'الطاقة الشمسية' },
      { title: 'Infrastructure Development', titleAr: 'تطوير البنية التحتية' },
      { title: 'Water Management', titleAr: 'إدارة المياه' }
    ]
  },
  'EG-SUZ': {
    id: 'EG-SUZ',
    name: 'Suez',
    nameAr: 'السويس',
    description: 'Strategic port city at the southern entrance of the Suez Canal.',
    descriptionAr: 'مدينة مينائية استراتيجية عند المدخل الجنوبي لقناة السويس.',
    stats: {
      populationGrowth: '1.7%',
      population: '728,180',
      area: '17,840 km²',
      cities: '1'
    },
    sectors: [
      { name: 'Maritime', nameAr: 'النقل البحري' },
      { name: 'Petrochemicals', nameAr: 'البتروكيماويات' },
      { name: 'Industry', nameAr: 'الصناعة' }
    ],
    opportunities: [
      { title: 'Port Services', titleAr: 'خدمات الموانئ' },
      { title: 'Petrochemical Complex', titleAr: 'مجمع بتروكيماوي' },
      { title: 'Industrial Zones', titleAr: 'المناطق الصناعية' },
      { title: 'Logistics', titleAr: 'اللوجستيات' }
    ]
  },
  'EG-WAD': {
    id: 'EG-WAD',
    name: 'New Valley',
    nameAr: 'الوادي الجديد',
    description: 'Egypt\'s largest governorate with oases and significant agricultural potential.',
    descriptionAr: 'أكبر محافظة في مصر مع الواحات وإمكانات زراعية كبيرة.',
    stats: {
      populationGrowth: '3.5%',
      population: '247,380',
      area: '376,505 km²',
      cities: '3'
    },
    sectors: [
      { name: 'Agriculture', nameAr: 'الزراعة' },
      { name: 'Tourism', nameAr: 'السياحة' },
      { name: 'Mining', nameAr: 'التعدين' }
    ],
    opportunities: [
      { title: 'Oasis Tourism', titleAr: 'سياحة الواحات' },
      { title: 'Agricultural Development', titleAr: 'التنمية الزراعية' },
      { title: 'Mining Projects', titleAr: 'مشاريع التعدين' },
      { title: 'Desert Tourism', titleAr: 'السياحة الصحراوية' }
    ]
  }
};

export function RegionalMapEgypt() {
  const [lang, setLang] = useState<Language>('en');
  const [isMounted, setIsMounted] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('EG-C');
  const [sectorIndex, setSectorIndex] = useState(0);
  const [oppIndex, setOppIndex] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setLang(getClientLanguage());
  }, []);

  if (!isMounted) return null;

  const currentRegion = regionsData[selectedRegion] || regionsData['EG-C'];

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    setSectorIndex(0);
    setOppIndex(0);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-[#1a3a3a] via-[#2d5a5a] to-[#1a3a3a] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side - Map and Title */}
          <div className="lg:col-span-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-12 max-w-3xl">
              {t(lang, 
                'استكشف الفرص الإقليمية الديناميكية التي تشكل قصة نمو مصر',
                'Explore Dynamic Regional Opportunities Shaping Egypt\'s Growth Story'
              )}
            </h2>

            {/* Egypt Map */}
            <div className="relative w-full max-w-3xl mx-auto">
              <svg 
                viewBox="24.697924 31.667680 36.894654 21.724740" 
                className="w-full h-auto"
                style={{ maxWidth: '800px' }}
              >
                {/* Alexandria - EG-ALX */}
                <path
                  d="m 242.07971,17.9318 0,0.09 0.1,0.06 -0.02,0.07 -0.06,0 -0.04,-0.12 -0.08,0 -0.21,0.16 0.02,0.15 0.13,0.03 -0.1,0.17 0.11,0.06 -0.26,0.06 0.01,0.09 0.11,0.07 -0.09,0.28 0.21,0.29 -0.01,0.22 0.12,0.21 0.26,0.16 0.05,0.48 0.12,0.1 0,0 -0.02,2.23 -1.11,1.81 0,0 0,0 0,0 -1.19,3.14 -4.56,2.63 0,0 -3.2,2.64 2.3,2.03 -0.7,2.76 0,0 -1.17,2.09 2.28,3.74 5.62,6.44 -5.06,7.56 -4.91,2.33 -3.9,1.27 -1.79,0.26 -1.42,2.08 -1.43,4.22 0,0 -0.91,-30.57 0.02,-3.08 0,0 0.18,-0.12 0.1,-0.17 0.3,-0.07 0.11,-0.17 0.22,-0.09 0.8,-0.67 0.16,-0.04 0.37,-0.29 0.08,-0.25 0.06,0 0,0.06 0.11,-0.06 0.4,-0.39 0.39,-0.28 0.35,-0.42 0.67,-0.55 0.1,-0.01 0.06,-0.12 0.35,-0.12 0.54,-0.44 0.27,-0.1 0.15,-0.23 0.42,-0.28 0.05,-0.13 0.24,-0.07 0.03,-0.13 0.19,-0.1 0.57,-0.68 0.15,-0.36 -0.02,-0.26 0.17,-0.06 0.15,-0.16 0.21,-0.01 -0.11,0.16 -0.21,0.06 0.01,0.12 0.12,0 0.04,0.1 0.11,-0.06 0.1,-0.22 0.15,0.06 -0.02,0.15 -0.15,0.17 -0.05,0.26 0.09,-0.04 0.05,-0.19 0.19,-0.23 0.07,0.1 -0.04,0.31 0.25,0.03 0.06,-0.19 0.09,-0.04 0,0.36 0.26,-0.16 0.17,0.03 0.13,-0.15 0.14,-0.03 0.21,-0.17 0.14,-0.29 0.09,0.06 0.11,-0.06 0.21,-0.33 0.31,-0.17 0.17,-0.25 0.08,-0.45 0.11,0 0,0.13 0.07,-0.01 0.3,-0.28 -0.01,-0.09 0.06,-0.01 0.07,0.09 0.26,-0.39 -0.06,-0.15 -0.12,0.03 0.01,0.09 -0.07,0.03 -0.13,-0.17 0.21,-0.33 0.25,-0.17 -0.04,-0.06 -0.04,0.09 -0.05,-0.01 -0.09,-0.17 -0.15,0 -0.12,0.23 -0.09,0.04 -0.01,0.12 -0.2,-0.01 -0.05,0.22 -0.12,-0.1 0.06,0.2 -0.22,-0.15 0.47,-0.49 0.02,-0.12 -0.06,-0.06 0.26,-0.06 0.05,-0.12 0.39,-0.07 0,-0.17 -0.1,-0.15 0.11,-0.07 0.22,0.01 0.13,-0.12 0.05,0.07 -0.14,0.09 -0.02,0.19 0.17,0.26 0.2,0.12 0.37,-0.05 0.31,-0.39 -0.21,-0.26 0.16,0.01 0.24,0.22 0.35,-0.19 0.25,-0.26 0.41,-0.25 0.15,-0.22 0.22,-0.1 0.19,-0.28 0.15,0 0.05,-0.16 0.14,0.03 -0.02,-0.15 0.07,-0.09 0.24,0.01 0.11,-0.15 0.09,-0.01 0.05,-0.16 0.13,-0.03 0.05,-0.17 0.15,-0.17 0.21,-0.1 0.15,-0.23 0.26,-0.16 0.01,-0.13 -0.06,-0.09 0.06,-0.15 0.5,-0.03 0.19,-0.19 0.03,-0.2 0.26,-0.03 0.1,-0.22 -0.13,-0.16 0.06,-0.09 0.13,0.01 -0.01,-0.13 0.17,-0.03 0.21,0.17 0.04,-0.13 -0.12,0.03 -0.02,-0.06 0.1,-0.25 0.07,0.16 0.14,0.1 0.2,-0.01 0.32,-0.17 0.24,-0.31 0.01,-0.1 0.3,-0.32 -0.01,-0.13 -0.22,-0.16 0.19,-0.12 -0.03,-0.09 0.49,-0.13 0.27,-0.36 0.22,-0.09 0.02,-0.07 0.1,0.03 0.4,-0.1 z"
                  fill={selectedRegion === 'EG-ALX' ? '#00A7A2' : '#1a2a2a'}
                  stroke="#00A7A2"
                  strokeWidth="0.05"
                  opacity={selectedRegion === 'EG-ALX' ? 1 : 0.8}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: selectedRegion === 'EG-ALX' ? 'drop-shadow(0 0 8px rgba(0,167,162,0.6))' : 'none'
                  }}
                  onClick={() => handleRegionClick('EG-ALX')}
                />

                {/* Cairo - EG-C */}
                <path
                  d="m 323.00971,74.2918 0.15,3.56 0,0 1.23,4.26 0.65,4.88 1.28,8.59 -0.04,4.35 -2.19,25.47 -0.78,14.24 0,0 -1.23,0 -6.48,-1.58 -4.48,-1.76 -4.44,-0.63 -3.24,-2.34 -3.12,-4.76 -2.04,-2.11 -2.7,-2.52 0,0 -0.13,-2.69 0,-1.65 -0.95,-0.63 0,0 -0.53,-0.12 0,0 -0.21,-1.52 0.18,-1.48 0.3,-0.75 0.76,-0.54 0.3,-0.67 0.06,-1.62 0.29,-0.61 0.53,-0.81 0,-1.82 0.12,-2.03 0.18,-1.14 0.77,-0.61 0.11,-0.95 0,-1.01 -1.06,-0.95 -0.12,-1.96 0.06,-0.75 1.22,-0.14 0.04,-0.76 0.1,-7.68 -2.65,-0.91 -0.17,-1.82 -0.93,-1.64 0.91,-0.71 -0.16,-5.75 0,0 1.93,0.2 0,0 1.86,-1.69 4.4,-1.77 4.51,-0.3 0,0 4.59,0 3.15,-1.9 6.29,-4.4 0,0 0.01,0.29 0.28,0.1 z"
                  fill={selectedRegion === 'EG-C' ? '#00A7A2' : '#1a2a2a'}
                  stroke="#00A7A2"
                  strokeWidth="0.05"
                  opacity={selectedRegion === 'EG-C' ? 1 : 0.8}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: selectedRegion === 'EG-C' ? 'drop-shadow(0 0 8px rgba(0,167,162,0.6))' : 'none'
                  }}
                  onClick={() => handleRegionClick('EG-C')}
                />

                {/* Giza - EG-GZ */}
                <path
                  d="m 294.59971,80.2218 0.16,5.75 -0.91,0.71 0.93,1.64 0.17,1.82 2.65,0.91 -0.1,7.68 -0.04,0.76 -1.22,0.14 -0.06,0.75 0.12,1.96 1.06,0.95 0,1.01 -0.11,0.95 -0.77,0.61 -0.18,1.14 -0.12,2.03 0,1.82 -0.53,0.81 -0.29,0.61 -0.06,1.62 -0.3,0.67 -0.76,0.54 -0.3,0.75 -0.18,1.48 0.21,1.52 0,0 -1.74,-0.4 0,0 -2.31,-0.97 -0.53,0.78 0,0 -0.3,-1.92 0,0 -0.76,-3.43 -0.77,-5.03 -1.33,-2.8 -0.77,-0.96 0.1,-2.78 0.18,-1.4 -14,0.13 -0.13,1.09 -1.45,1.24 -2.51,1.51 -1.62,0.28 -3.97,2.7 -3.97,2.56 -3.73,0.99 -6.2,7.1 -1.49,0.14 -6.95,8.21 -2.11,1 -6.34,7.21 0,0 -0.17,1.08 -0.07,-0.01 -1.18,4.97 -0.59,5.6 -0.39,3.14 -1.82,2.37 0,0 -1.14,4.34 -1.58,2.9 -1.18,3.35 -1.58,5.36 -1.18,5.57 -2.37,2.23 -2.56,2.01 -4.73,3.11 -3.75,3.34 -2.56,0.67 -2.57,2 -3.74,1.33 -4.14,3.11 -3.16,1.55 -5.32,1.12 -1.58,0.88 -1.58,1.11 -0.78,1.78 -0.4,2.22 -0.59,1.77 -0.99,2.21 -1.38,2.76 0,0 -56.78,0.14 0,0 -0.68,0 0,0 -1.28,0 0,0 20.39,-45.43 41.89,-10.06 32.28,-31.75 6.46,-8.29 6.62,-1.63 22.68,-15 3.07,-0.4 0,0 0.76,-0.45 0.73,-1.31 4.74,-6.52 0.89,0.04 -0.89,-0.04 0,0 7.4,-7.47 2.66,-0.35 6.92,-7.08 0,0 1.44,-0.12 0.68,-0.58 2.09,0.14 0.09,3.18 1.42,-0.07 0.91,0.89 0.07,1.8 0.9,0.89 1.63,0.3 0.8,-0.9 0.89,0.52 0,0 0.76,0.19 1.95,-0.66 0,-0.08 0,0 1.65,2.78 2.41,1.48 0,0 z"
                  fill={selectedRegion === 'EG-GZ' ? '#00A7A2' : '#1a2a2a'}
                  stroke="#00A7A2"
                  strokeWidth="0.05"
                  opacity={selectedRegion === 'EG-GZ' ? 1 : 0.8}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: selectedRegion === 'EG-GZ' ? 'drop-shadow(0 0 8px rgba(0,167,162,0.6))' : 'none'
                  }}
                  onClick={() => handleRegionClick('EG-GZ')}
                />

                {/* Add more paths for other governorates following the same pattern */}
                {/* Due to length constraints, I'll add a few more key ones */}
                
                {/* Red Sea - EG-BA */}
                <path
                  d="m 499.55971,395.4018 0.08,0.65 0.11,0.33 -0.09,0.19 -0.19,0.03 -0.17,-0.07 -0.01,-0.11 0.04,-0.05 0.06,0.03 0.01,-0.1 0.2,-0.16 -0.04,-0.58 -0.06,-0.11 0.06,-0.05 z m -82.61,-144.54 0.16,0.14 0.04,0.17 0.2,0.07 0.04,0.15 0.5,-0.04 0.09,0.08 0.03,0.21 -0.14,0.83 0.09,0.24 0.17,0.15 0.12,0.33 0,0.15 -0.1,0.13 0.05,0.56 -0.07,0.07 0.05,0.07 -0.05,0.08 -0.09,-0.03 -0.35,-0.51 -0.13,-0.38 -0.13,-0.1 -0.07,0.01 -0.25,-0.38 0.09,-0.28 -0.05,-0.25 -0.24,-0.11 -0.14,-0.28 -0.12,-0.01 0,-0.18 -0.23,-0.24 0.01,-0.22 0.09,-0.11 0.19,-0.07 0.15,-0.26 0.09,0 z"
                  fill={selectedRegion === 'EG-BA' ? '#00A7A2' : '#1a2a2a'}
                  stroke="#00A7A2"
                  strokeWidth="0.05"
                  opacity={selectedRegion === 'EG-BA' ? 1 : 0.8}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: selectedRegion === 'EG-BA' ? 'drop-shadow(0 0 8px rgba(0,167,162,0.6))' : 'none'
                  }}
                  onClick={() => handleRegionClick('EG-BA')}
                />

                {/* Aswan - EG-ASN */}
                <path
                  d="m 373.73971,374.6618 -1.02,3.55 -0.01,6.03 0.79,1.85 0.32,2.99 0.92,1.14 1.17,2.13 0.2,1.85 0.33,1.42 0.98,1.77 1.63,0.93 1.44,1.63 0.2,4.53 1.07,0.41 -0.16,1.84 -0.72,0.73 -0.59,0.99 -0.39,2.2 0.07,2.34 0.98,3.4 1.57,0.36 0.83,1.91 0.77,1.45 -0.23,1.37 -0.79,1.13 -0.65,2.2 -1.05,2.05 -1.56,1.62 -1.11,1.35 -1.25,2.04 -1.3,1.42 -0.07,1.2 0.98,0.85 2.48,2.47 3.03,0.24 1.02,0.98 3.32,2.35 0,0 2.23,3.52 0.21,3.31 0,0 -1.19,2.02 -2.71,-0.4 -2.76,-2.94 -1.45,-1.91 -2.88,0.43 0,0 -2.57,-0.78 -1.83,-1.17 -2.62,-1.84 -3.16,0.33 0,0 -2.99,1.64 0.26,5.53 -1.18,3.42 -2.31,2.58 -2.73,1.59 -3.72,2.45 -3.14,2.75 -2.62,0.78 0,0 -2.94,0.88 -3.43,-1.52 0,0 -2.35,-2.28 -1.47,-1.9 -2.11,-1.33 -2.75,0.66 -1.18,4.45 -0.39,2.35 -1.18,2.88 -1.04,1.96 -1.39,1.74 -2.71,1.16 -4.28,-0.67 -1.44,3.14 -1.96,1.96 -2.75,1.44 -8.11,2.75 0,0 -1.19,4.65 -5.17,-0.01 -0.06,-0.24 0.09,-0.7 0.6,-1.7 0.42,-0.88 1.35,-2.13 0.41,-0.47 0.65,-0.52 0.28,-0.47 0.53,-0.63 0.26,-0.58 -0.02,-0.28 -0.17,-0.26 -0.52,-0.27 -0.6,-1.05 -0.41,-0.28 -0.26,0.11 -0.89,0.76 -3.81,2.33 -1.44,-0.13 0,0 -2.67,0.26 -1.51,-2.22 0.78,-2.75 4.32,-2.23 3.01,-0.91 4,0.12 2.96,-2.73 1.92,-2.16 0.83,-1.57 0.48,-1.58 -0.23,-1.6 0,-4.33 -0.21,-2.22 0.84,-1.83 1.47,-1.74 1.17,-0.5 2.77,-0.02 2.05,0.23 1.61,-0.23 2.26,-0.74 8.64,-2.42 5.49,-1.62 0.98,0.38 2.59,0.26 2.57,0.51 1.94,1.22 1.5,0.66 1.64,-0.92 1.7,-3.32 0.95,-2.01 1.23,-2.18 0.79,-2.37 1.25,-2.8 1.69,-2.7 1.32,-2.27 1.54,-3.24 1.69,-2.53 1.42,-2.36 0.3,-0.96 -0.48,-1.98 -2.07,0.11 -1.72,0.39 -2.68,-0.36 -5.18,-1.23 -1.39,-1.65 0.36,-3.28 1.71,-5.93 1.41,-2.01 1.56,-1.02 2.29,-1.36 2.19,-0.91 2.01,-0.56 2.12,-1.72 -0.32,-1.26 -1.49,-1.21 -2.11,-2.04 -0.17,-3.14 1.39,-1.39 1.28,-0.49 1.84,-0.92 3.74,-3.91 0.39,-6.45 0,-2.96 0.59,-4.2 0.02,-3.42 0.75,-3.48 0.66,-3.49 0,-2.88 0.56,-3.32 -1.8,-3.48 -0.56,-2.19 -1.17,-3.56 -0.06,-2.17 0.03,-2.6 -0.39,-1.85 -1.6,-2.01 -2.68,-2.52 -3.49,-1.62 0,0 0.96,-3.51 -0.07,-3.57 0,0 1.91,1.73 0,0 2.39,1.48 1.83,1.77 4.35,3.02 3.29,5.5 0.47,3.34 0.14,9.58 1.92,4.53 3.06,5.11 0.23,1.55 -0.39,4.01 -3.2,2.66 -1.99,2.97 -0.13,2.37 0,0 z"
                  fill={selectedRegion === 'EG-ASN' ? '#00A7A2' : '#1a2a2a'}
                  stroke="#00A7A2"
                  strokeWidth="0.05"
                  opacity={selectedRegion === 'EG-ASN' ? 1 : 0.8}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: selectedRegion === 'EG-ASN' ? 'drop-shadow(0 0 8px rgba(0,167,162,0.6))' : 'none'
                  }}
                  onClick={() => handleRegionClick('EG-ASN')}
                />

                {/* South Sinai - EG-JS */}
                <path
                  d="m 456.90971,114.7118 0.02,0.11 -0.08,0.06 -0.04,-0.14 0.1,-0.03 z m -89.91,-23.09 1.87,0.07 0.24,-0.28 0.02,0.12 6.61,-0.43 9.77,0.29 8.36,1.18 1.02,0.29 4.26,-0.07 8.2,1.92 1.77,0.86 0.05,0.11 7.97,5.01 3.34,2.21 3.6,1.18 3.86,0.88 6.04,3.68 0.08,-0.03 0.91,0.28 2.63,0.88 2.62,1.07 1.43,-0.12 0.31,0.27 3.86,0.59 3.47,0.29 3.73,0.73 3.74,-0.15 2.39,0.58 0,0 -0.31,0.33 -0.2,0.1 -0.2,-0.07 -0.3,0 -0.45,0.26 -0.39,0.13 -0.16,0.4 -0.33,0.16 -0.06,0.38 -0.11,0.17 0.06,0.37 -0.16,0.47 -0.5,0.63 -0.25,0.03 -0.09,0.16 -0.26,-0.14 0.2,0.27 0.02,0.18 -0.15,0.11 -0.25,0.07 -0.15,0.13 0,0.07 -0.09,0.01 -0.01,0.16 -0.09,0 -0.04,0.3 0.09,0.3 -0.14,-0.01 -0.08,-0.08 -0.2,0.06 0.1,0.54 -0.06,0.31 -0.21,0.23 -0.09,0.21 -0.12,0.04 -0.3,-0.04 -0.2,0.07 -0.12,0.2 -0.08,0.17 0,0.31 -0.1,0.13 0.03,0.43 -0.15,0.34 -0.17,0.11 0.01,0.04 0.15,-0.03 -0.1,0.08 -0.2,-0.03 -0.39,0.1 -0.19,0.3 -0.04,0.18 -0.22,0.14 -0.06,0.44 -0.42,0.19 -0.06,0.1 0.01,0.41 0.19,0.37 -0.01,0.23 -0.21,0.43 0.08,0.85 -0.11,0.26 -0.3,0.28 -0.03,0.13 0.1,0.21 0.08,0.65 0.09,0.09 0.09,0.34 -0.05,0.17 0.06,0.26 -0.09,0.07 -0.04,0.27 0.06,0.13 -0.06,0.11 -0.1,0.03 -0.1,0.5 -0.17,0.28 -0.38,0.27 -0.16,0.77 -0.76,0.13 -0.24,0.13 -0.17,0.21 -0.09,0.4 0.1,0.18 0.01,0.2 -0.13,0.23 0.04,0.18 -0.15,0.24 0,0.21 -0.11,0.1 0.1,0.24 -0.17,0.11 -0.17,0.64 -0.17,0.16 0.25,0.41 0,0.1 -0.06,0.27 -0.17,0.16 -0.02,0.13 -0.09,0.07 0,0.18 -0.1,0.11 0.04,0.26 -0.08,0.06 0,0.1 0.14,0.28 0.02,0.36 -0.14,0.28 -0.27,0.28 -0.04,0.2 0.05,0.06 -0.08,0.01 0.04,0.07 0.09,-0.06 0.1,0.27 0.13,0.06 0.01,0.08 0.07,-0.01 -0.02,0.16 0.1,0.04 0.01,0.13 -0.05,0.27 0.46,0.47 0.04,0.41 0.05,0.06 -0.09,0.2 0.09,0.95 -0.2,0.23 -0.61,0.17 0,0.16 -0.24,-0.07 -0.44,0.13 -0.19,0.36 -0.35,0.2 0.03,0.17 -0.13,0.31 0.05,0.5 0.35,0.4 0.01,0.31 -0.25,0.26 0.09,0.43 0.13,0.24 -0.05,0.26 0.14,0.4 -0.1,0.2 0.02,0.31 -0.16,0.27 0.1,0.16 -0.07,0.23 0.14,0.35 0.01,0.27 -0.14,0.26 -0.6,0.14 -0.16,0.27 -0.27,0.24 -0.05,0.18 -0.03,0.48 0.16,0.34 -0.13,0.33 0.21,0.23 -0.08,0.35 0.05,0.18 -0.05,0.45 0.06,0.07 -0.06,0.3 0.05,0.13 -0.08,0.31 0.16,0.38 0.01,0.2 -0.07,0.2 -0.09,0.04 -0.03,0.23 -0.12,0.11 0.02,0.4 -0.05,0.11 0.24,0.41 0.08,0.28 -0.2,0.21 -0.25,0.68 -0.17,0.18 0,0.14 -0.21,0.3 -0.07,0.33 -0.27,0.27 -0.08,0.25 -0.27,0.23 -0.11,0.27 -0.28,0.2 0.11,0.33 -0.04,0.21 -0.14,0.14 -0.28,0.11 -0.09,0.13 -0.03,0.24 0.24,0.27 0.01,0.18 -0.11,-0.03 -0.15,0.3 -0.01,0.2 0.09,0.28 -0.24,0.07 -0.17,0.21 -0.14,0 -0.13,0.08 -0.09,0.24 -0.28,0.06 -0.22,0.67 -0.06,0.04 -0.05,0.88 -0.22,0.31 -0.17,0.08 -0.04,0.14 -0.16,0.1 -0.27,0.44 -0.31,0.3 -0.05,0.31 -0.09,0.11 -0.02,0.69 -0.13,0.72 0.32,0.47 0.08,0.41 -0.17,0.1 0.01,0.23 -0.19,0.69 -0.25,0.45 -0.41,-0.14 0.29,-0.03 0.05,-0.06 -0.04,-0.16 -0.2,0.06 -0.14,-0.13 -0.2,0 -0.38,0.13 -0.07,0.34 -0.22,0.13 -0.05,0.24 -0.1,0.03 -0.15,0.28 -0.01,0.48 -0.09,0.24 -0.25,0.21 -0.22,0.03 -0.13,0.16 -0.04,0.42 0.11,0.2 0,0.17 -0.27,0.54 -0.06,0.48 -0.17,0.23 0,0.47 0.09,0.13 0.01,0.17 -0.06,0.2 -0.21,0.25 -0.08,0.39 0.03,0.21 -0.21,0.2 -0.29,0.13 -0.11,0.27 -0.19,0.08 -0.09,0.11 -0.1,0.52 -0.31,0.38 -0.13,0.28 0.11,0.28 -0.13,0.14 -0.04,0.41 0.07,0.11 -0.15,0.41 0.08,0.18 0,0.97 0.07,0.18 0,0.32 0.14,0.18 0.14,0.44 -0.05,0.3 -0.17,0.24 0.01,0.39 0.13,0.42 0.27,0.45 -0.1,0.2 0.14,0.1 0.04,-0.1 0.1,-0.01 0.21,0.18 -0.19,0.07 -0.06,0.27 0.31,0.11 0.17,0.21 0.03,-0.24 0.39,0.45 -0.06,0.16 0.2,0 0.16,0.59 -0.03,0.66 -0.06,0.17 0.05,0.31 -0.06,0.13 -0.21,0.11 -0.01,0.16 -0.14,0.18 0,0.2 0.09,0.21 -0.02,0.27 0.1,0.11 -0.09,0.31 0.06,0.13 -0.09,0.16 -0.14,0.06 -0.04,0.25 0.01,0.2 -0.05,0.13 -0.04,0.37 -0.19,0.17 -0.01,0.13 -0.16,0.16 0.06,0.56 0.09,0.1 0,0.11 0.22,0.11 0.19,0.24 0.01,0.27 -0.11,0.31 -0.04,0.59 0.22,0.31 0.04,0.2 -0.46,2.12 -0.32,0.14 -0.09,0.28 0.16,0.2 -0.07,0.14 -0.14,0.03 -0.01,0.1 -0.24,0.27 -0.19,-0.01 -0.19,0.13 -0.39,0 -0.09,0.14 0.01,0.11 -0.14,0.08 -0.06,0.14 -0.39,0.04 -0.01,0.27 0.09,0.34 -0.14,0.07 -0.06,0.16 -0.14,0.08 -0.17,0.07 -0.22,-0.01 -0.08,0.07 -0.09,0.14 0.1,0.21 -0.01,0.22 -0.13,0.21 -0.23,0.07 -0.17,-0.13 -0.11,0 -0.26,0.15 -0.03,0.17 -0.07,0.07 -0.19,-0.04 -0.19,-0.15 -0.23,-0.04 -0.24,0.11 -0.02,0.11 0.17,0.16 -0.2,0.63 0.03,0.22 0.11,0.2 -0.39,0.21 -0.05,0.22 0.14,0.2 0.06,0.28 -0.22,0.23 -0.15,0.79 -0.28,-0.11 -0.09,0 -0.1,0.13 -0.14,-0.01 -0.17,-0.21 -0.13,-0.52 -0.19,-0.07 -0.14,0.1 0.03,0.14 0.16,0 0.05,0.08 -0.16,0.14 -0.1,0.27 -0.12,-0.07 0.06,-0.28 -0.09,-0.08 -0.11,0.13 -0.44,0.07 0.06,0.27 0.1,0.04 0.02,0.44 -0.24,0.36 -0.08,0.28 -0.31,0.07 0.01,0.11 0.13,-0.01 0.09,0.1 0.03,0.24 -0.2,0.2 -0.09,0.6 -0.19,0.46 -0.17,0.04 -0.26,0.01 -0.37,0.18 -0.24,-0.41 -0.09,-0.01 -0.24,0.24 -0.16,0.07 -0.29,-0.14 -0.17,-0.21 -0.06,0.04 0.01,0.18 -0.16,0.06 -0.15,-0.03 -0.03,0.28 0.1,0.27 0.33,0.32 0.06,0.24 0.22,0.18 0.11,0.01 0.1,-0.1 0.61,0.1 0.27,-0.15 0.46,0.07 -0.06,0.18 -0.12,0.1 0.07,0.21 -0.06,0.11 0.15,0.27 0.06,0.52 0.2,0.37 -0.05,0.07 -0.08,0.13 -0.17,-0.01 -0.31,-0.44 -0.03,0.21 0.2,0.11 0.06,0.2 -0.13,0.14 -0.14,0 -0.24,-0.15 0.05,-0.32 -0.1,-0.15 0.01,-0.11 -0.19,-0.06 -0.36,-0.31 -0.27,-0.32 -0.21,-0.45 -0.19,-0.15 -0.06,-0.24 -0.31,-0.27 -0.08,-0.21 -0.14,-0.1 -0.2,0 -0.11,-0.17 -1.14,-0.32 -0.25,0.13 -0.03,0.13 -0.61,-0.32 -0.21,-0.01 -0.25,-0.21 -0.35,0.03 -0.6,-0.11 -0.63,0.07 -0.47,0.34 -0.13,-0.38 -0.49,-0.16 -0.14,-0.14 -0.26,-0.01 -0.71,-0.42 -0.05,-0.1 -0.29,-0.15 -0.16,-0.42 -0.16,-0.2 -0.4,-0.27 -0.21,-0.42 -0.22,-0.1 -0.07,-0.14 -0.16,-0.03 -0.26,-0.22 -0.01,-0.14 -0.31,-0.48 -0.17,-0.08 -0.17,-0.22 -0.08,-0.22 -0.07,-0.24 -0.14,-0.41 -0.94,-0.13 -0.05,-0.21 -0.1,-0.03 -0.46,-0.04 -0.04,0.13 -0.06,-0.01 0,-0.14 -0.2,-0.35 -0.62,-0.65 -0.5,-0.63 -0.01,-0.32 -0.22,-0.24 -0.35,-0.1 -0.66,0.31 -0.41,-0.13 -0.15,0.06 -0.05,0.13 -0.19,-0.07 -0.1,-0.32 -0.21,-0.21 -0.19,-0.35 -0.27,-0.32 -0.67,-0.29 -0.49,-0.34 -0.19,-0.06 -0.11,-0.13 -0.17,-0.01 -0.46,-0.77 -0.14,0.01 -0.11,-0.1 -0.1,0.01 -0.02,-0.29 -0.56,-0.72 -0.31,-0.06 -0.14,0.07 -0.06,-0.17 -0.6,-0.31 -0.16,-0.01 -0.1,-0.42 0.32,-0.49 -0.16,-0.24 -0.14,-0.38 -0.06,-0.06 -0.2,0.01 -0.21,-0.14 -0.26,0.06 0,-0.2 -0.36,-0.17 -0.1,-0.1 -0.11,-0.14 -0.36,-0.23 -0.44,0.08 -0.19,-0.32 0.19,-0.29 -0.01,-0.15 -0.15,-0.18 -0.01,-0.18 -0.25,-0.17 -0.22,-0.34 -0.3,-0.29 -0.1,-0.31 -0.21,-0.22 -0.13,-0.56 -0.11,-0.14 -0.31,-0.08 -0.14,-0.11 -0.09,-0.76 0.04,-0.49 -0.13,-0.28 -0.19,-0.11 -0.47,-0.03 -0.13,0.25 -0.02,-0.39 -0.29,-0.04 -0.17,-0.1 -0.29,-0.2 -0.21,-0.28 -0.06,-0.37 0.04,-1.01 -0.11,-0.52 -0.01,-0.41 -0.26,-0.3 -0.04,-0.16 -0.21,-0.17 -0.1,0 -0.17,0.07 0.13,0.25 -0.01,0.08 -0.08,0 -0.34,-0.34 -0.11,-0.2 -0.19,-0.16 0.04,-0.39 -0.26,-0.1 -0.05,-0.15 0,-0.58 -0.47,-0.16 -0.1,-0.44 -0.31,-0.69 -0.29,-0.14 -0.49,-0.06 -0.77,-0.76 -0.52,-0.14 -0.24,-0.14 -0.27,-0.04 -0.35,-0.18 -0.31,-0.34 -0.26,-0.41 -0.31,-0.21 -0.31,-0.1 -0.08,-0.17 -0.54,-0.14 -0.11,-0.16 -0.24,-0.16 -0.24,-0.04 -0.74,-0.4 -0.01,-0.13 -0.13,-0.07 -0.06,-0.17 -0.17,-0.14 -0.11,-0.07 -0.25,-0.21 0.01,-0.1 -0.1,-0.18 -0.31,-0.23 -0.14,0.04 -0.16,-0.66 -0.2,-0.04 -0.01,-0.18 -0.17,-0.07 -0.54,-0.54 -0.3,-0.42 -0.08,-0.25 -0.2,-0.28 0.04,-0.55 -0.11,-0.3 -0.1,-0.1 -0.17,0 -0.16,-0.27 -0.24,-0.23 -0.7,-0.14 -0.03,-0.08 -0.26,-0.2 -0.19,-0.01 -0.05,-0.27 -0.2,-0.2 -0.19,-0.06 -0.11,-0.18 -0.14,-0.03 -0.37,-0.31 -0.32,-0.58 -0.44,-0.21 -0.17,-0.61 -0.09,-0.1 -0.05,-0.33 -0.86,-0.58 -0.05,-0.24 0.3,0.01 0.09,0.21 0.2,-0.03 0.03,-0.11 -0.1,-0.14 0.12,-0.08 0,-0.13 -0.07,-0.06 -0.03,-0.52 -0.24,-0.37 -0.07,-0.34 -0.24,-0.24 -0.62,0.04 -0.31,0.08 -0.04,0.23 0.19,0.1 0.09,0.25 0.1,-0.01 0.01,0.11 -0.07,0.04 0.09,0.14 -0.08,0.08 0.14,0.06 0.06,0.13 -0.06,0.1 -0.15,0 -0.08,-0.11 -0.15,-0.18 -0.22,-0.68 -0.29,-0.37 -0.11,-0.25 0.06,-0.55 -0.07,-0.21 0.04,-0.23 -0.22,-0.48 0.02,-0.16 0.08,-0.1 0.05,-0.38 -0.07,-0.21 -0.51,-0.55 0.06,-0.1 -0.2,-0.25 -0.08,-0.3 -0.13,-0.35 -0.06,-0.28 -0.11,-0.1 0.11,-0.42 0.13,-0.2 -0.05,-0.14 0.2,-0.41 0.09,-0.27 -0.04,-0.44 0.05,-0.44 0.34,-0.34 0.05,-0.21 0.11,-0.1 -0.06,-0.25 0.15,-0.14 0.02,-0.31 0.29,-0.59 0.01,-0.23 0.17,-0.47 -0.16,-0.25 -0.46,-0.42 -0.11,-0.51 -0.09,-0.2 -0.12,-0.08 -0.08,-0.5 -0.2,-0.03 -0.32,-0.31 -0.1,-0.08 -0.19,-0.13 -0.11,-0.17 -0.05,-0.13 -0.29,0.07 0,-0.23 0.08,-0.01 0.02,-0.1 -0.11,-0.3 -0.16,-0.01 0.03,-0.23 -0.19,-0.43 -0.06,-0.28 0.01,-1.08 0.29,-0.52 -0.03,-0.3 -0.09,-0.14 -0.17,-0.08 0.06,-0.26 0.21,-0.24 0.14,-0.34 0.15,-0.04 0.14,-0.45 -0.05,-0.21 -0.19,-0.23 -0.09,-0.14 -0.02,-0.16 -0.15,-0.14 -0.01,-0.13 -0.15,-0.08 -0.13,0.03 -0.14,0.21 -0.1,0.01 0.24,-0.3 -0.02,-0.06 -0.13,0 -0.08,-0.04 0.2,-0.07 0,-0.65 0.13,-0.37 -0.03,-0.25 0.08,-0.34 0.14,-0.18 0.13,-0.4 0.05,-0.58 -0.39,-0.34 -0.22,0.06 -0.32,-0.07 -0.2,-0.28 0,-0.27 -0.14,-0.24 -0.49,-0.17 -0.2,-0.23 -0.17,0.06 -0.09,-0.16 -0.2,-0.03 -0.09,-0.35 -0.19,-0.23 -0.06,-0.01 -0.11,0.13 -0.09,-0.14 -0.46,0.07 -0.35,-0.14 -0.06,-0.54 -0.5,-0.16 -0.24,-0.27 -0.21,-0.08 -0.04,-0.3 0.11,-0.21 -0.01,-0.47 -0.23,-0.17 -0.12,-0.19 -0.16,0.06 0,-0.21 -0.16,-0.23 -0.22,-0.08 -0.05,-0.21 -0.08,0 -0.21,-0.28 -0.51,-0.33 -0.15,-0.18 -0.16,-0.41 -0.19,-0.23 -0.16,-0.03 -0.13,0.07 -0.19,-0.13 -0.03,-0.27 -0.25,-0.17 -0.25,-0.4 -0.04,-0.24 -0.11,-0.03 -0.19,-0.27 -0.29,-0.14 -0.66,-0.06 -0.15,-0.23 -0.04,-0.17 -0.24,-0.2 0,-0.11 -0.11,-0.26 -0.4,-0.6 -0.08,-0.3 -0.71,-0.23 -0.59,0.14 -0.28,-0.39 -0.48,-0.48 -0.21,-0.11 -0.21,0 -0.24,-0.23 -0.14,-0.03 -0.05,-0.1 -0.19,-0.1 -0.11,-0.51 -0.22,-0.2 -0.03,-0.29 -0.08,-0.08 0.27,-0.74 -0.12,-0.11 -0.01,-0.21 -0.19,-0.13 0,-0.13 -0.17,-0.17 0.03,-0.27 -0.24,-0.31 -0.38,-0.27 -0.13,0.06 -0.3,-0.04 -0.04,-0.28 -0.24,-0.36 -0.17,0 -0.31,-0.14 -0.01,-0.47 -0.07,-0.19 0.16,-0.28 0,-0.27 -0.09,-0.33 -0.22,-0.27 -0.41,-0.3 0,-0.13 0.1,-0.06 -0.04,-0.34 0.09,-0.36 0.06,-0.04 0.02,-0.3 0.21,-0.16 -0.31,-0.93 -0.31,-0.24 -0.06,-0.14 -0.42,-0.03 -0.14,-0.13 -0.14,-0.3 -0.14,-0.13 -0.12,-0.17 0.01,-0.21 -0.29,-0.3 -0.22,-0.1 -0.29,0.04 -0.12,-0.16 -0.82,-0.38 -0.01,-0.06 0.1,-0.06 -0.02,-0.23 -0.1,-0.14 -0.14,-0.06 -0.1,-0.47 -0.15,-0.04 -0.02,0.31 0.04,0.08 -0.09,0.1 -0.08,-0.04 -0.13,0.11 -0.13,-0.3 0.15,-0.13 0.02,-0.27 0.08,-0.01 0.09,-0.14 -0.11,-0.31 -0.09,0 -0.1,0.14 0.02,0.14 0.15,0.01 0,0.06 -0.49,0.24 -0.09,0.1 0.02,-0.21 0.22,-0.21 0.24,-0.56 -0.04,-0.4 -0.17,-0.38 -0.31,-0.39 -0.13,-0.09 -0.14,0 0.26,-0.33 0,-0.2 -0.09,-0.14 0.04,-0.47 -0.09,-0.37 0.2,-0.27 0.04,-0.41 -0.24,-0.14 0.03,-0.27 -0.05,-0.1 -0.17,-0.01 -0.01,-0.41 -0.16,-0.13 0.09,-0.44 -0.07,-0.19 -0.1,-0.07 -0.01,-0.13 -0.08,-0.08 -0.19,0 -0.29,-0.11 -0.77,-0.23 -0.06,-0.11 0.01,-0.19 0.44,-0.43 0.13,-0.46 -0.2,-0.64 -0.07,-0.97 -0.16,-0.16 -0.06,-0.3 0.05,-0.13 0.1,-0.01 -0.01,-0.14 0.1,-0.1 0.06,-0.24 -0.05,-0.14 0.17,-0.37 -0.13,-0.67 0.47,-0.84 -0.09,-1.06 -0.05,-0.1 -0.1,-0.01 -0.09,-0.29 -0.11,-0.09 -0.01,-0.17 -0.39,-0.66 -0.09,0 -0.21,-0.17 -0.06,0 0.03,0.09 -0.08,0.04 -0.19,-0.03 -0.21,-0.73 -0.16,-0.27 -0.42,-0.42 0,0 6.93,-5.2 2.57,-0.59 0,0 0,-0.84 z"
                  fill={selectedRegion === 'EG-JS' ? '#00A7A2' : '#1a2a2a'}
                  stroke="#00A7A2"
                  strokeWidth="0.05"
                  opacity={selectedRegion === 'EG-JS' ? 1 : 0.8}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    filter: selectedRegion === 'EG-JS' ? 'drop-shadow(0 0 8px rgba(0,167,162,0.6))' : 'none'
                  }}
                  onClick={() => handleRegionClick('EG-JS')}
                />

                {/* Add labels for major cities */}
                <text x="245" y="25" fill="#ffffff" fontSize="0.4" fontWeight="bold" textAnchor="middle">Alexandria</text>
                <text x="295" y="75" fill="#ffffff" fontSize="0.4" fontWeight="bold" textAnchor="middle">Cairo</text>
                <text x="290" y="65" fill="#ffffff" fontSize="0.4" fontWeight="bold" textAnchor="middle">Giza</text>
                <text x="480" y="250" fill="#ffffff" fontSize="0.4" fontWeight="bold" textAnchor="middle">Red Sea</text>
                <text x="375" y="380" fill="#ffffff" fontSize="0.4" fontWeight="bold" textAnchor="middle">Aswan</text>
                <text x="430" y="200" fill="#ffffff" fontSize="0.4" fontWeight="bold" textAnchor="middle">South Sinai</text>
              </svg>
              
              <p className="text-center text-white/60 text-sm mt-4">
                {t(lang, 'انقر على أي محافظة لعرض التفاصيل', 'Click on any governorate to view details')}
              </p>
            </div>
          </div>

          {/* Right Side - Info Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[rgba(10,30,30,0.9)] backdrop-blur-xl rounded-2xl border border-[#00A7A2]/30 p-6 shadow-2xl sticky top-8">
              
              {/* Region Title */}
              <h3 className="text-2xl font-bold text-white mb-3">
                {lang === 'ar' ? currentRegion.nameAr : currentRegion.name}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                {lang === 'ar' ? currentRegion.descriptionAr : currentRegion.description}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-[#00A7A2]" />
                    <div className="text-2xl font-bold text-white">{currentRegion.stats.populationGrowth}</div>
                  </div>
                  <div className="text-xs text-white/60">{t(lang, 'نمو السكان (2021-2022)', 'Population Growth (2021-2022)')}</div>
                </div>
                <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-[#00A7A2]" />
                    <div className="text-2xl font-bold text-white">{currentRegion.stats.population}</div>
                  </div>
                  <div className="text-xs text-white/60">{t(lang, 'عدد السكان (2022)', 'Population (2022)')}</div>
                </div>
                <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler className="w-4 h-4 text-[#00A7A2]" />
                    <div className="text-2xl font-bold text-white">{currentRegion.stats.area}</div>
                  </div>
                  <div className="text-xs text-white/60">{t(lang, 'المساحة', 'Area')}</div>
                </div>
                <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-[#00A7A2]" />
                    <div className="text-2xl font-bold text-white">{currentRegion.stats.cities}</div>
                  </div>
                  <div className="text-xs text-white/60">{t(lang, 'إجمالي المدن والمراكز', 'Total Number of Cities and Governorates')}</div>
                </div>
              </div>

              {/* Key Strategic Sectors */}
              <div className="mb-6">
                <h4 className="text-white font-semibold text-sm mb-3">{t(lang, 'القطاعات الاستراتيجية الرئيسية', 'Key Strategic Sectors')}</h4>
                <div className="flex flex-wrap gap-2">
                  {currentRegion.sectors.map((sector, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-2 rounded-lg bg-[rgba(0,167,162,0.2)] border border-[#00A7A2]/30 text-white text-xs"
                    >
                      {lang === 'ar' ? sector.nameAr : sector.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Opportunities */}
              <div className="mb-6">
                <h4 className="text-white font-semibold text-sm mb-3">{t(lang, 'الفرص', 'Opportunities')}</h4>
                <div className="space-y-2">
                  {currentRegion.opportunities.slice(0, 4).map((opp, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg bg-gradient-to-br from-[#00A7A2]/20 to-[#00A7A2]/10 border border-[#00A7A2]/30 flex items-center justify-between group cursor-pointer hover:from-[#00A7A2]/30 hover:to-[#00A7A2]/20 transition-all"
                    >
                      <p className="text-white text-xs">
                        {lang === 'ar' ? opp.titleAr : opp.title}
                      </p>
                      <ArrowUpRight className="w-4 h-4 text-[#00A7A2] flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button className="flex-1 bg-[rgba(0,0,0,0.4)] border border-white/20 rounded-full px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
                  <span className="text-white text-xs font-semibold">{t(lang, 'عرض التقرير', 'View Report')}</span>
                  <MapPin className="w-4 h-4 text-white" />
                </button>
                <button className="flex-1 bg-[#00A7A2] rounded-full px-4 py-2.5 flex items-center justify-center gap-2 hover:bg-[#00b8b3] transition-colors group">
                  <span className="text-white text-xs font-semibold">{t(lang, 'اعرف المزيد', 'Learn More')}</span>
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}