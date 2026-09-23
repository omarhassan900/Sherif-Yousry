/**
 * Seed script: populate the 7 service categories and all sub-services
 * extracted from the client's HTML design files.
 *
 * Run with:  node scripts/seed-services.mjs
 *
 * Data model (no schema change):
 *   ContentItem { type: 'service', metadata: JSON }
 *   metadata.serviceType = 'category'   → top-level group shown on homepage
 *   metadata.serviceType = 'sub-service' → actual service under a category
 *   metadata.categorySlug              → links sub-service to its category
 *   metadata.displayOrder              → sort within a group
 *   metadata.icon                      → lucide icon name for the category
 */

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    slug: 'tax-advisory',
    order: 1,
    icon: 'FileText',
    titleEn: 'Tax Advisory',
    titleAr: 'الاستشارات الضريبية',
    bodyEn: 'Corporate income tax, VAT and indirect taxes, Transfer pricing, International tax and treaties, Tax audits and disputes, E-invoicing compliance.',
    bodyAr: 'ضريبة دخل الشركات، ضريبة القيمة المضافة والضرائب غير المباشرة، التسعير التحويلي، الضريبة الدولية والمعاهدات، تدقيق وفحص الضرائب، الامتثال للفوترة الإلكترونية.',
  },
  {
    slug: 'audit-accounting-assurance',
    order: 2,
    icon: 'BarChart2',
    titleEn: 'Audit, Accounting & Assurance',
    titleAr: 'التدقيق والمحاسبة والتأكيد',
    bodyEn: 'Statutory audit, Reviews and agreed-upon procedures, Bookkeeping and accounting, Financial statements preparation, Internal audit and controls, Accounting system set-up.',
    bodyAr: 'التدقيق القانوني، المراجعات والإجراءات المتفق عليها، مسك الدفاتر والمحاسبة، إعداد البيانات المالية، التدقيق الداخلي والضوابط، إعداد نظام المحاسبة.',
  },
  {
    slug: 'financial-advisory',
    order: 3,
    icon: 'TrendingUp',
    titleEn: 'Financial Advisory',
    titleAr: 'الاستشارات المالية',
    bodyEn: 'Feasibility studies, Business valuation, Financial due diligence, Financial modelling and budgeting, Restructuring and working capital, Transaction support.',
    bodyAr: 'دراسات الجدوى، تقييم الأعمال، العناية الواجبة المالية، النمذجة المالية والميزانية، إعادة الهيكلة ورأس المال العامل، دعم المعاملات.',
  },
  {
    slug: 'business-management-advisory',
    order: 4,
    icon: 'Users',
    titleEn: 'Business, Economic & Management Advisory',
    titleAr: 'استشارات الأعمال والاقتصاد والإدارة',
    bodyEn: 'Market entry strategy, Investment incentives, Business plans, Economic and sector studies, Organization and governance, Policies and procedures.',
    bodyAr: 'استراتيجية دخول السوق، حوافز الاستثمار، خطط الأعمال، الدراسات الاقتصادية والقطاعية، التنظيم والحوكمة، السياسات والإجراءات.',
  },
  {
    slug: 'corporate-legal-services',
    order: 5,
    icon: 'Building2',
    titleEn: 'Corporate & Legal Services',
    titleAr: 'الخدمات المؤسسية والقانونية',
    bodyEn: 'Company formation, Branches and representative offices, Corporate secretarial, Licensing and registrations, Liquidation and deregistration, Contracts support.',
    bodyAr: 'تأسيس الشركات، الفروع والمكاتب التمثيلية، أمانة الشركة، التراخيص والتسجيلات، التصفية وإلغاء التسجيل، دعم العقود.',
  },
  {
    slug: 'payroll-social-insurance',
    order: 6,
    icon: 'ShieldCheck',
    titleEn: 'Payroll & Social Insurance',
    titleAr: 'الرواتب والتأمينات الاجتماعية',
    bodyEn: 'Payroll processing, Salary tax compliance, Social insurance, Universal health insurance, Expatriate work permits, HR policies and employment contracts.',
    bodyAr: 'معالجة الرواتب، الامتثال لضريبة الراتب، التأمينات الاجتماعية، التأمين الصحي الشامل، تصاريح عمل المغتربين، سياسات الموارد البشرية وعقود العمل.',
  },
  {
    slug: 'ecommerce-digital-business',
    order: 7,
    icon: 'Globe',
    titleEn: 'E-Commerce & Digital Business',
    titleAr: 'التجارة الإلكترونية والأعمال الرقمية',
    bodyEn: 'Digital business structuring, VAT for non-resident digital services, E-invoicing and e-receipt set-up, Online seller tax compliance, Cross-border payments and withholding tax, Digital accounting and automation.',
    bodyAr: 'هيكلة الأعمال الرقمية، ضريبة القيمة المضافة للخدمات الرقمية غير المقيمة، إعداد الفوترة الإلكترونية والإيصالات الإلكترونية، الامتثال الضريبي للبائعين عبر الإنترنت، المدفوعات عبر الحدود وضريبة الاستقطاع، المحاسبة الرقمية والأتمتة.',
  },
];

const SUB_SERVICES = [
  // ── Tax Advisory ──────────────────────────────────────────────────────────
  {
    categorySlug: 'tax-advisory', order: 1,
    titleEn: 'Direct & Indirect Taxation',
    titleAr: 'الضرائب المباشرة وغير المباشرة',
    bodyEn: 'Corporate income tax, VAT, withholding and stamp tax, filed accurately and on time.',
    bodyAr: 'ضريبة دخل الشركات، ضريبة القيمة المضافة، ضريبة الاستقطاع وضريبة الدمغة، مُقدَّمة بدقة وفي الوقت المحدد.',
    fullBodyEn: 'Corporate income tax, VAT, withholding and stamp tax compliance and advisory. We prepare and file your tax returns accurately and on time, keep your books reconciled with tax positions, and advise on the tax consequences of transactions before they happen.',
    fullBodyAr: 'الامتثال والاستشارات في ضريبة دخل الشركات وضريبة القيمة المضافة وضريبة الاستقطاع وضريبة الدمغة. نُعِدّ إقراراتك الضريبية ونُقدِّمها بدقة وفي الوقت المحدد، ونحافظ على توافق دفاترك مع المواقف الضريبية، ونُقدِّم المشورة بشأن التبعات الضريبية للمعاملات قبل وقوعها.',
  },
  {
    categorySlug: 'tax-advisory', order: 2,
    titleEn: 'International Taxation',
    titleAr: 'الضرائب الدولية',
    bodyEn: 'Treaty relief, permanent establishment risk and cross-border payments.',
    bodyAr: 'الإعفاء بموجب المعاهدات، ومخاطر المنشأة الدائمة، والمدفوعات العابرة للحدود.',
    fullBodyEn: 'Treaty relief, permanent establishment risk management and advice on cross-border payments including dividends, royalties, interest and service fees. We help foreign investors understand their Egyptian tax exposure before setting up, and advise on inbound and outbound structuring.',
    fullBodyAr: 'الإعفاء بموجب المعاهدات، وإدارة مخاطر المنشأة الدائمة، والمشورة بشأن المدفوعات العابرة للحدود بما فيها الأرباح والإتاوات والفوائد ورسوم الخدمات. نُساعِد المستثمرين الأجانب على فهم تعرضهم الضريبي في مصر قبل الإنشاء، ونُقدِّم المشورة بشأن الهياكل الداخلية والخارجية.',
  },
  {
    categorySlug: 'tax-advisory', order: 3,
    titleEn: 'Transfer Pricing',
    titleAr: 'التسعير التحويلي',
    bodyEn: 'Documentation, benchmarking and policies that hold up at inspection.',
    bodyAr: 'التوثيق والمقارنة المعيارية والسياسات التي تصمد أمام الفحص.',
    fullBodyEn: 'Transfer pricing documentation (master file and local file), benchmarking studies, advance pricing arrangements and defence strategies for group transactions. We prepare compliant documentation under the Egyptian transfer pricing guidelines aligned with OECD standards.',
    fullBodyAr: 'توثيق التسعير التحويلي (الملف الرئيسي والملف المحلي)، ودراسات المقارنة المعيارية، وترتيبات التسعير المسبق، واستراتيجيات الدفاع في معاملات المجموعات. نُعِدّ التوثيق المتوافق وفق إرشادات التسعير التحويلي المصرية المنسجمة مع معايير OECD.',
  },
  {
    categorySlug: 'tax-advisory', order: 4,
    titleEn: 'Tax Dispute Resolution',
    titleAr: 'حل المنازعات الضريبية',
    bodyEn: 'Inspection, objection, committees and settlement.',
    bodyAr: 'الفحص، الاعتراض، اللجان والتسوية.',
    fullBodyEn: 'Representation through tax inspection, objection filing, internal committees, Appeals Committee, and the tax dispute settlement window (open until 31 December 2026). We prepare the technical file, draft the objection, appear before committees and negotiate settlement.',
    fullBodyAr: 'التمثيل من خلال الفحص الضريبي، وتقديم الاعتراضات، واللجان الداخلية، ولجنة الطعن، ونافذة تسوية المنازعات الضريبية (مفتوحة حتى 31 ديسمبر 2026). نُعِدّ الملف الفني، وصياغة الاعتراض، والمثول أمام اللجان، والتفاوض على التسوية.',
  },
  {
    categorySlug: 'tax-advisory', order: 5,
    titleEn: 'Tax Due Diligence & Structuring',
    titleAr: 'العناية الضريبية الواجبة والهيكلة',
    bodyEn: 'Tax clarity before you sign, and a structure planned for exit.',
    bodyAr: 'الوضوح الضريبي قبل التوقيع، وهيكل مُخطَّط للخروج.',
    fullBodyEn: 'Tax due diligence for acquisitions and investments: identifying open tax exposures and contingencies in target companies. Pre-acquisition structuring and post-deal integration to ensure the transaction is efficient on entry and at exit.',
    fullBodyAr: 'العناية الضريبية الواجبة للاستحواذات والاستثمارات: تحديد المخاطر الضريبية المفتوحة والطوارئ في الشركات المستهدفة. الهيكلة قبل الاستحواذ والتكامل بعد الصفقة لضمان كفاءة المعاملة عند الدخول والخروج.',
  },
  {
    categorySlug: 'tax-advisory', order: 6,
    titleEn: 'Tax Accounting',
    titleAr: 'المحاسبة الضريبية',
    bodyEn: 'Current and deferred tax your auditor and parent company can rely on.',
    bodyAr: 'الضريبة الجارية والمؤجلة التي يمكن لمدققك والشركة الأم الاعتماد عليها.',
    fullBodyEn: 'Current and deferred tax calculations under Egyptian Accounting Standards and IAS 12, prepared for inclusion in statutory financial statements and IFRS reporting packs. We work with your auditors to ensure the tax note withstands scrutiny.',
    fullBodyAr: 'حسابات الضريبة الجارية والمؤجلة وفق معايير المحاسبة المصرية ومعيار IAS 12، مُعَدَّة للإدراج في البيانات المالية القانونية وحزم التقارير وفق معايير IFRS. نعمل مع مدققيك لضمان صمود الإشعار الضريبي أمام التدقيق.',
  },
  {
    categorySlug: 'tax-advisory', order: 7,
    titleEn: 'E-Invoicing & E-Receipt Compliance',
    titleAr: 'الامتثال للفوترة الإلكترونية والإيصالات الإلكترونية',
    bodyEn: 'Onboarding, integration and monthly reconciliation with the ETA systems.',
    bodyAr: 'الانضمام والتكامل والمطابقة الشهرية مع أنظمة هيئة الضرائب.',
    fullBodyEn: 'Full support for onboarding to the Egyptian Tax Authority\'s e-invoice and e-receipt systems: system integration, testing, activation and monthly reconciliation of issued and received documents. We also advise on the obligations of non-resident digital service providers.',
    fullBodyAr: 'دعم كامل للانضمام إلى نظامي الفوترة الإلكترونية والإيصالات الإلكترونية لهيئة الضرائب المصرية: تكامل النظام، والاختبار، والتفعيل، والمطابقة الشهرية للمستندات الصادرة والمستلمة. كما نُقدِّم المشورة بشأن التزامات مقدمي الخدمات الرقمية غير المقيمين.',
  },

  // ── Audit, Accounting & Assurance ─────────────────────────────────────────
  {
    categorySlug: 'audit-accounting-assurance', order: 1,
    titleEn: 'Statutory Audit',
    titleAr: 'التدقيق القانوني',
    bodyEn: 'Independent audit of annual financial statements for joint stock companies, limited liability companies and branches of foreign companies.',
    bodyAr: 'تدقيق مستقل للبيانات المالية السنوية لشركات المساهمة والشركات ذات المسؤولية المحدودة وفروع الشركات الأجنبية.',
    fullBodyEn: 'Independent audit of annual financial statements under Egyptian Standards on Auditing, for joint stock companies, limited liability companies and branches of foreign companies. Our audit opinion gives shareholders, banks and the Egyptian Tax Authority the assurance they need.',
    fullBodyAr: 'تدقيق مستقل للبيانات المالية السنوية وفق معايير التدقيق المصرية، لشركات المساهمة والشركات ذات المسؤولية المحدودة وفروع الشركات الأجنبية. يمنح رأي التدقيق لدينا المساهمين والبنوك وهيئة الضرائب المصرية الطمأنينة التي يحتاجونها.',
  },
  {
    categorySlug: 'audit-accounting-assurance', order: 2,
    titleEn: 'Reviews & Agreed-Upon Procedures',
    titleAr: 'المراجعات والإجراءات المتفق عليها',
    bodyEn: 'Limited reviews of interim financial statements and targeted procedures requested by lenders, shareholders or head offices.',
    bodyAr: 'مراجعات محدودة للبيانات المالية المرحلية وإجراءات مستهدفة بطلب من المقرضين والمساهمين أو المقرات الرئيسية.',
    fullBodyEn: 'Limited reviews of interim financial statements, agreed-upon procedures for bank covenants, grant compliance and head-office reporting. We provide the level of assurance your stakeholders need without the cost of a full audit.',
    fullBodyAr: 'مراجعات محدودة للبيانات المالية المرحلية، وإجراءات متفق عليها لشروط البنوك وامتثال المنح وتقارير المقر الرئيسي. نُقدِّم مستوى الضمان الذي يحتاجه أصحاب المصلحة دون تكلفة التدقيق الكامل.',
  },
  {
    categorySlug: 'audit-accounting-assurance', order: 3,
    titleEn: 'Bookkeeping & Accounting',
    titleAr: 'مسك الدفاتر والمحاسبة',
    bodyEn: 'Monthly bookkeeping, bank and account reconciliations, and period-end closing on cloud accounting systems.',
    bodyAr: 'مسك الدفاتر الشهري، ومطابقة البنوك والحسابات، وإغلاق نهاية الفترة على أنظمة المحاسبة السحابية.',
    fullBodyEn: 'Monthly bookkeeping, bank and account reconciliations, accounts payable and receivable management, and period-end closing on cloud accounting systems. We work in your system or migrate you to a platform suited to your size and the ETA\'s digital requirements.',
    fullBodyAr: 'مسك الدفاتر الشهري، ومطابقة البنوك والحسابات، وإدارة الذمم المدينة والدائنة، وإغلاق نهاية الفترة على أنظمة المحاسبة السحابية. نعمل في نظامك أو ننقلك إلى منصة مناسبة لحجمك ومتطلبات هيئة الضرائب الرقمية.',
  },
  {
    categorySlug: 'audit-accounting-assurance', order: 4,
    titleEn: 'Financial Statements Preparation',
    titleAr: 'إعداد البيانات المالية',
    bodyEn: 'Annual and interim financial statements under Egyptian Accounting Standards, with IFRS reporting packs for foreign parent companies.',
    bodyAr: 'البيانات المالية السنوية والمرحلية وفق معايير المحاسبة المصرية، مع حزم تقارير IFRS للشركات الأم الأجنبية.',
    fullBodyEn: 'Annual and interim financial statements under Egyptian Accounting Standards, with IFRS conversion and reporting packs for foreign parent companies. We ensure your statements meet the requirements of the Egyptian Tax Authority, the commercial register and your lenders.',
    fullBodyAr: 'البيانات المالية السنوية والمرحلية وفق معايير المحاسبة المصرية، مع التحويل إلى IFRS وحزم التقارير للشركات الأم الأجنبية. نضمن استيفاء بياناتك لمتطلبات هيئة الضرائب المصرية والسجل التجاري والمقرضين.',
  },
  {
    categorySlug: 'audit-accounting-assurance', order: 5,
    titleEn: 'Internal Audit & Controls',
    titleAr: 'التدقيق الداخلي والضوابط',
    bodyEn: 'Risk-based internal audit, process reviews and the design of internal controls over finance, procurement and inventory.',
    bodyAr: 'التدقيق الداخلي القائم على المخاطر، ومراجعات العمليات، وتصميم الضوابط الداخلية للمالية والمشتريات والمخزون.',
    fullBodyEn: 'Risk-based internal audit programmes, process and control reviews, and the design of internal controls over finance, procurement and inventory. We help boards and audit committees get independent assurance on the effectiveness of their control environment.',
    fullBodyAr: 'برامج التدقيق الداخلي القائمة على المخاطر، ومراجعات العمليات والضوابط، وتصميم الضوابط الداخلية للمالية والمشتريات والمخزون. نُساعِد مجالس الإدارة ولجان التدقيق على الحصول على ضمان مستقل حول فعالية بيئة ضواباطهم.',
  },
  {
    categorySlug: 'audit-accounting-assurance', order: 6,
    titleEn: 'Accounting System Set-Up',
    titleAr: 'إعداد نظام المحاسبة',
    bodyEn: 'Chart of accounts, accounting policies and procedures manuals, and system implementation for newly formed entities.',
    bodyAr: 'دليل الحسابات، وسياسات المحاسبة وأدلة الإجراءات، وتطبيق النظام للكيانات المُنشَأة حديثاً.',
    fullBodyEn: 'Chart of accounts design, accounting policies and procedures manuals, and implementation support for newly formed entities or companies moving to a new accounting system. We set up your system to produce the outputs the ETA\'s digital systems require.',
    fullBodyAr: 'تصميم دليل الحسابات، وسياسات المحاسبة وأدلة الإجراءات، ودعم التطبيق للكيانات المُنشَأة حديثاً أو الشركات التي تنتقل إلى نظام محاسبي جديد. نُعِدّ نظامك لإنتاج المخرجات التي تتطلبها الأنظمة الرقمية لهيئة الضرائب.',
  },

  // ── Financial Advisory ────────────────────────────────────────────────────
  {
    categorySlug: 'financial-advisory', order: 1,
    titleEn: 'Feasibility Studies',
    titleAr: 'دراسات الجدوى',
    bodyEn: 'Market, technical and financial feasibility studies for new projects, suitable for investors, banks and regulatory submissions.',
    bodyAr: 'دراسات الجدوى السوقية والتقنية والمالية للمشاريع الجديدة، مناسبة للمستثمرين والبنوك والتقديمات التنظيمية.',
    fullBodyEn: 'Market, technical and financial feasibility studies for new projects and expansions, prepared to the standard required by banks, investment authorities and regulatory bodies in Egypt. We combine market analysis with detailed financial projections and sensitivity analysis.',
    fullBodyAr: 'دراسات الجدوى السوقية والتقنية والمالية للمشاريع الجديدة والتوسعات، مُعَدَّة بالمستوى المطلوب من قِبَل البنوك وسلطات الاستثمار والجهات التنظيمية في مصر. نجمع بين تحليل السوق والتوقعات المالية التفصيلية وتحليل الحساسية.',
  },
  {
    categorySlug: 'financial-advisory', order: 2,
    titleEn: 'Business Valuation',
    titleAr: 'تقييم الأعمال',
    bodyEn: 'Valuations of companies and shares for acquisitions, share transfers, capital increases and shareholder exits.',
    bodyAr: 'تقييمات الشركات والأسهم للاستحواذات ونقل الأسهم وزيادات رأس المال وخروج المساهمين.',
    fullBodyEn: 'Valuations of companies and shares using DCF, comparable transactions and market multiples, for acquisitions, share transfers, capital increases, employee share plans and shareholder exits. Our valuations are prepared to withstand scrutiny from counterparties, regulators and courts.',
    fullBodyAr: 'تقييمات الشركات والأسهم باستخدام التدفق النقدي المخصوم والمعاملات القابلة للمقارنة ومضاعفات السوق، للاستحواذات ونقل الأسهم وزيادات رأس المال وخطط أسهم الموظفين وخروج المساهمين. تُعَدّ تقييماتنا لتصمد أمام تدقيق الأطراف المقابلة والجهات التنظيمية والمحاكم.',
  },
  {
    categorySlug: 'financial-advisory', order: 3,
    titleEn: 'Financial Due Diligence',
    titleAr: 'العناية الواجبة المالية',
    bodyEn: 'Quality of earnings, net debt and working capital reviews for buyers and investors.',
    bodyAr: 'مراجعات جودة الأرباح وصافي الدين ورأس المال العامل للمشترين والمستثمرين.',
    fullBodyEn: 'Buy-side and vendor financial due diligence: quality of earnings analysis, net debt and working capital reviews, identification of financial risks and normalized earnings for pricing. We give buyers a clear view of what they are acquiring before they sign.',
    fullBodyAr: 'العناية الواجبة المالية للجانبين المشتري والبائع: تحليل جودة الأرباح، ومراجعات صافي الدين ورأس المال العامل، وتحديد المخاطر المالية والأرباح الموحدة للتسعير. نُقدِّم للمشترين صورة واضحة عما يقتنونه قبل التوقيع.',
  },
  {
    categorySlug: 'financial-advisory', order: 4,
    titleEn: 'Financial Modelling & Budgeting',
    titleAr: 'النمذجة المالية والميزانية',
    bodyEn: 'Integrated three-statement models, annual budgets and rolling cash-flow forecasts.',
    bodyAr: 'نماذج البيانات الثلاثة المتكاملة، والميزانيات السنوية، وتوقعات التدفق النقدي المتجددة.',
    fullBodyEn: 'Integrated three-statement financial models for investment decisions, annual budgets linked to business plans, and rolling cash-flow forecasts for treasury management. We build models your finance team can maintain and your board can rely on.',
    fullBodyAr: 'نماذج مالية متكاملة لثلاثة بيانات لقرارات الاستثمار، والميزانيات السنوية المرتبطة بخطط الأعمال، وتوقعات التدفق النقدي المتجددة لإدارة الخزينة. نبني نماذج يستطيع فريقك المالي صيانتها ويمكن لمجلس إدارتك الاعتماد عليها.',
  },
  {
    categorySlug: 'financial-advisory', order: 5,
    titleEn: 'Restructuring & Working Capital',
    titleAr: 'إعادة الهيكلة ورأس المال العامل',
    bodyEn: 'Cost reviews, cash-flow improvement and support in renegotiating debt with lenders.',
    bodyAr: 'مراجعات التكاليف وتحسين التدفق النقدي ودعم إعادة التفاوض على الدين مع المقرضين.',
    fullBodyEn: 'Cash-flow improvement programmes, cost base reviews, working capital optimisation and support in renegotiating debt facilities with lenders. We help businesses that are under pressure to stabilise their position and create a path to recovery.',
    fullBodyAr: 'برامج تحسين التدفق النقدي، ومراجعات قاعدة التكاليف، وتحسين رأس المال العامل، ودعم إعادة التفاوض على تسهيلات الدين مع المقرضين. نُساعِد الشركات التي تعاني ضغوطاً على تثبيت مواقفها وإيجاد مسار للتعافي.',
  },
  {
    categorySlug: 'financial-advisory', order: 6,
    titleEn: 'Transaction Support',
    titleAr: 'دعم المعاملات',
    bodyEn: 'Support through acquisitions and investments, from term sheet and pricing to completion accounts.',
    bodyAr: 'دعم خلال الاستحواذات والاستثمارات، من ورقة الشروط والتسعير إلى حسابات الإتمام.',
    fullBodyEn: 'Support through acquisitions and investments from term sheet to closing: financial modelling for pricing, due diligence co-ordination, completion account preparation and post-deal adjustments. We keep the financial side of your transaction on track.',
    fullBodyAr: 'دعم خلال الاستحواذات والاستثمارات من ورقة الشروط إلى الإغلاق: النمذجة المالية للتسعير، وتنسيق العناية الواجبة، وإعداد حسابات الإتمام والتسويات بعد الصفقة. نُبقي الجانب المالي لمعاملتك على المسار الصحيح.',
  },

  // ── Business, Economic & Management Advisory ──────────────────────────────
  {
    categorySlug: 'business-management-advisory', order: 1,
    titleEn: 'Market Entry Strategy',
    titleAr: 'استراتيجية دخول السوق',
    bodyEn: 'Choice of legal entity, investment regime and location, including free zones, with a step-by-step entry roadmap.',
    bodyAr: 'اختيار الكيان القانوني ونظام الاستثمار والموقع، بما فيها المناطق الحرة، مع خارطة طريق دخول خطوة بخطوة.',
    fullBodyEn: 'Choice of legal entity, investment regime and location, including free zones, investment zones and the Suez Canal Economic Zone, with a step-by-step entry roadmap tailored to your sector and timeline. We identify the right structure before you commit capital.',
    fullBodyAr: 'اختيار الكيان القانوني ونظام الاستثمار والموقع، بما فيها المناطق الحرة ومناطق الاستثمار ومنطقة قناة السويس الاقتصادية، مع خارطة طريق دخول خطوة بخطوة مُصمَّمة خصيصاً لقطاعك وجدولك الزمني. نُحدِّد الهيكل الصحيح قبل أن تُلتزم برأس المال.',
  },
  {
    categorySlug: 'business-management-advisory', order: 2,
    titleEn: 'Investment Incentives',
    titleAr: 'حوافز الاستثمار',
    bodyEn: 'Assessment of and applications for incentives under Investment Law No. 72 of 2017, including the Golden License.',
    bodyAr: 'تقييم وتقديم طلبات الحوافز بموجب قانون الاستثمار رقم 72 لسنة 2017، بما فيها الترخيص الذهبي.',
    fullBodyEn: 'Assessment of available incentives and preparation of applications under Investment Law No. 72 of 2017, including tax exemptions, customs deferrals, the general and special incentives regimes, and the Golden License for strategic projects.',
    fullBodyAr: 'تقييم الحوافز المتاحة وإعداد الطلبات بموجب قانون الاستثمار رقم 72 لسنة 2017، بما فيها الإعفاءات الضريبية وتأجيل الجمارك ونظام الحوافز العامة والخاصة والترخيص الذهبي للمشاريع الاستراتيجية.',
  },
  {
    categorySlug: 'business-management-advisory', order: 3,
    titleEn: 'Business Plans',
    titleAr: 'خطط الأعمال',
    bodyEn: 'Business plans prepared for investors, banks and partners.',
    bodyAr: 'خطط أعمال مُعَدَّة للمستثمرين والبنوك والشركاء.',
    fullBodyEn: 'Business plans combining market analysis, operational plan and integrated financial projections, prepared to the standard required by investors, banks and development finance institutions. We write the plan and present it to stakeholders if needed.',
    fullBodyAr: 'خطط أعمال تجمع بين تحليل السوق والخطة التشغيلية والتوقعات المالية المتكاملة، مُعَدَّة بالمستوى المطلوب من قِبَل المستثمرين والبنوك ومؤسسات التمويل التنموي. نكتب الخطة ونُقدِّمها لأصحاب المصلحة عند الحاجة.',
  },
  {
    categorySlug: 'business-management-advisory', order: 4,
    titleEn: 'Economic & Sector Studies',
    titleAr: 'الدراسات الاقتصادية والقطاعية',
    bodyEn: 'Sector analysis, demand studies and economic assessments to support investment decisions.',
    bodyAr: 'تحليل القطاعات ودراسات الطلب والتقييمات الاقتصادية لدعم قرارات الاستثمار.',
    fullBodyEn: 'Sector analysis, market size and demand studies, and economic impact assessments to support investment decisions, project approvals and regulatory submissions. We combine data from Egyptian statistical sources with our sector knowledge.',
    fullBodyAr: 'تحليل القطاعات وحجم السوق ودراسات الطلب وتقييمات الأثر الاقتصادي لدعم قرارات الاستثمار وموافقات المشاريع والتقديمات التنظيمية. نجمع بيانات من المصادر الإحصائية المصرية مع معرفتنا بالقطاعات.',
  },
  {
    categorySlug: 'business-management-advisory', order: 5,
    titleEn: 'Organization & Governance',
    titleAr: 'التنظيم والحوكمة',
    bodyEn: 'Organizational structures, delegation of authority matrices and governance frameworks for family and investor-owned companies.',
    bodyAr: 'الهياكل التنظيمية ومصفوفات تفويض الصلاحيات وأطر الحوكمة لشركات الأسرة والشركات المملوكة للمستثمرين.',
    fullBodyEn: 'Organizational structures, delegation of authority matrices and governance frameworks for family-owned businesses and investor-backed companies preparing for growth, external investment or a transition to professional management.',
    fullBodyAr: 'الهياكل التنظيمية ومصفوفات تفويض الصلاحيات وأطر الحوكمة للشركات العائلية والشركات المدعومة من المستثمرين التي تستعد للنمو أو الاستثمار الخارجي أو الانتقال إلى إدارة احترافية.',
  },
  {
    categorySlug: 'business-management-advisory', order: 6,
    titleEn: 'Policies & Procedures',
    titleAr: 'السياسات والإجراءات',
    bodyEn: 'Operating manuals for finance, procurement, human resources and inventory.',
    bodyAr: 'أدلة التشغيل للمالية والمشتريات والموارد البشرية والمخزون.',
    fullBodyEn: 'Operating manuals and policies for finance, procurement, human resources and inventory, aligned to your organizational structure and the requirements of your auditors and lenders. We write the manuals in both Arabic and English.',
    fullBodyAr: 'أدلة التشغيل وسياسات المالية والمشتريات والموارد البشرية والمخزون، متوافقة مع هيكلك التنظيمي ومتطلبات مدققيك ومقرضيك. نكتب الأدلة بالعربية والإنجليزية.',
  },

  // ── Corporate & Legal Services ────────────────────────────────────────────
  {
    categorySlug: 'corporate-legal-services', order: 1,
    titleEn: 'Company Formation',
    titleAr: 'تأسيس الشركات',
    bodyEn: 'Incorporation of limited liability companies, joint stock companies and one-person companies through GAFI.',
    bodyAr: 'تأسيس الشركات ذات المسؤولية المحدودة وشركات المساهمة والشركات أحادية الشخص من خلال هيئة الاستثمار.',
    fullBodyEn: 'Incorporation of limited liability companies, joint stock companies and one-person companies through the General Authority for Investment and Free Zones (GAFI), including name reservation, articles of association, commercial registration and tax card.',
    fullBodyAr: 'تأسيس الشركات ذات المسؤولية المحدودة وشركات المساهمة والشركات أحادية الشخص من خلال الهيئة العامة للاستثمار والمناطق الحرة (هيئة الاستثمار)، بما فيها حجز الاسم والنظام الأساسي والتسجيل التجاري والبطاقة الضريبية.',
  },
  {
    categorySlug: 'corporate-legal-services', order: 2,
    titleEn: 'Branches & Representative Offices',
    titleAr: 'الفروع والمكاتب التمثيلية',
    bodyEn: 'Registration of branches and representative offices of foreign companies in Egypt.',
    bodyAr: 'تسجيل فروع ومكاتب التمثيل للشركات الأجنبية في مصر.',
    fullBodyEn: 'Registration of branches and representative offices of foreign companies in Egypt through GAFI and the relevant regulatory authorities. We guide you through the documentation requirements and manage the registration process from start to finish.',
    fullBodyAr: 'تسجيل فروع ومكاتب التمثيل للشركات الأجنبية في مصر من خلال هيئة الاستثمار والجهات التنظيمية المعنية. نُرشِدُك عبر متطلبات التوثيق وندير عملية التسجيل من البداية إلى النهاية.',
  },
  {
    categorySlug: 'corporate-legal-services', order: 3,
    titleEn: 'Corporate Secretarial',
    titleAr: 'أمانة الشركة',
    bodyEn: 'General assemblies, board minutes, share transfers, capital changes and commercial register amendments.',
    bodyAr: 'الجمعيات العمومية ومحاضر مجلس الإدارة ونقل الأسهم وتغييرات رأس المال وتعديلات السجل التجاري.',
    fullBodyEn: 'Ongoing corporate secretarial services: preparation and filing of ordinary and extraordinary general assembly documentation, board minutes, share transfer deeds, capital increases and decreases, and amendments to the commercial register.',
    fullBodyAr: 'خدمات أمانة الشركة المستمرة: إعداد وتقديم وثائق الجمعيات العمومية العادية وغير العادية، ومحاضر مجلس الإدارة، وسندات نقل الأسهم، وزيادات وتخفيضات رأس المال، وتعديلات السجل التجاري.',
  },
  {
    categorySlug: 'corporate-legal-services', order: 4,
    titleEn: 'Licensing & Registrations',
    titleAr: 'التراخيص والتسجيلات',
    bodyEn: 'Sector licenses, the importers and exporters registers, and chamber of commerce memberships.',
    bodyAr: 'التراخيص القطاعية وسجلات المستوردين والمصدرين وعضويات غرف التجارة.',
    fullBodyEn: 'Sector-specific licenses from regulatory authorities, registration in the importers and exporters registers, chamber of commerce memberships, and other commercial and industrial licences required to operate in Egypt.',
    fullBodyAr: 'التراخيص القطاعية من الجهات التنظيمية، والتسجيل في سجلات المستوردين والمصدرين، وعضويات غرف التجارة، وغيرها من التراخيص التجارية والصناعية اللازمة للعمل في مصر.',
  },
  {
    categorySlug: 'corporate-legal-services', order: 5,
    titleEn: 'Liquidation & Deregistration',
    titleAr: 'التصفية وإلغاء التسجيل',
    bodyEn: 'Voluntary liquidation, tax clearance and removal from the commercial register.',
    bodyAr: 'التصفية الاختيارية والمخالصة الضريبية وإزالة القيد من السجل التجاري.',
    fullBodyEn: 'Voluntary liquidation of limited liability companies and joint stock companies: appointment of liquidator, preparation of liquidation accounts, obtaining tax clearance and final deregistration from the commercial register.',
    fullBodyAr: 'التصفية الاختيارية للشركات ذات المسؤولية المحدودة وشركات المساهمة: تعيين المصفي، وإعداد حسابات التصفية، والحصول على المخالصة الضريبية، والشطب النهائي من السجل التجاري.',
  },
  {
    categorySlug: 'corporate-legal-services', order: 6,
    titleEn: 'Contracts Support',
    titleAr: 'دعم العقود',
    bodyEn: 'Commercial and employment contracts, prepared in coordination with licensed legal counsel.',
    bodyAr: 'العقود التجارية وعقود العمل، مُعَدَّة بالتنسيق مع المستشار القانوني المرخص.',
    fullBodyEn: 'Commercial and employment contracts drafted in coordination with licensed legal counsel. We prepare the business terms and financial provisions, working alongside your lawyers to produce contracts that reflect your commercial intent and comply with Egyptian law.',
    fullBodyAr: 'العقود التجارية وعقود العمل مُصَاغَة بالتنسيق مع المستشار القانوني المرخص. نُعِدّ الشروط التجارية والأحكام المالية، بالعمل جنباً إلى جنب مع محاميك لإنتاج عقود تعكس نيتك التجارية وتتوافق مع القانون المصري.',
  },

  // ── Payroll & Social Insurance ─────────────────────────────────────────────
  {
    categorySlug: 'payroll-social-insurance', order: 1,
    titleEn: 'Payroll Processing',
    titleAr: 'معالجة الرواتب',
    bodyEn: 'Monthly payroll calculation, payslips and bank transfer files.',
    bodyAr: 'حساب الرواتب الشهري وكشوف الرواتب وملفات التحويل البنكي.',
    fullBodyEn: 'Monthly payroll calculation for all employee categories, payslips in Arabic and English, and bank transfer files in the format required by your bank. We handle variable pay, bonuses, advances and deductions accurately every cycle.',
    fullBodyAr: 'حساب الرواتب الشهري لجميع فئات الموظفين، وكشوف الرواتب بالعربية والإنجليزية، وملفات التحويل البنكي بالتنسيق المطلوب من مصرفك. نتعامل مع الأجر المتغير والمكافآت والسلف والخصومات بدقة في كل دورة.',
  },
  {
    categorySlug: 'payroll-social-insurance', order: 2,
    titleEn: 'Salary Tax Compliance',
    titleAr: 'الامتثال لضريبة الراتب',
    bodyEn: 'Monthly salary tax withholding and the periodic and annual salary tax returns.',
    bodyAr: 'استقطاع ضريبة الراتب الشهري والإقرارات الضريبية الدورية والسنوية.',
    fullBodyEn: 'Monthly salary tax withholding calculations, monthly payroll tax deposits, periodic salary tax returns (Form 4) and the annual salary tax return (Form 2), filed accurately and on time with the Egyptian Tax Authority.',
    fullBodyAr: 'حسابات استقطاع ضريبة الراتب الشهري، وإيداعات ضريبة الرواتب الشهرية، وإقرارات ضريبة الراتب الدورية (نموذج 4) والإقرار الضريبي السنوي للراتب (نموذج 2)، مُقدَّمة بدقة وفي الوقت المحدد لهيئة الضرائب المصرية.',
  },
  {
    categorySlug: 'payroll-social-insurance', order: 3,
    titleEn: 'Social Insurance',
    titleAr: 'التأمينات الاجتماعية',
    bodyEn: 'Employee registration and monthly contributions under Social Insurance and Pensions Law No. 148 of 2019.',
    bodyAr: 'تسجيل الموظفين والاشتراكات الشهرية بموجب قانون التأمين الاجتماعي والمعاشات رقم 148 لسنة 2019.',
    fullBodyEn: 'Employee registration with the National Organization for Social Insurance, monthly contribution calculations and payments, and end-of-service entitlement reviews under Social Insurance and Pensions Law No. 148 of 2019.',
    fullBodyAr: 'تسجيل الموظفين لدى الهيئة القومية للتأمين الاجتماعي، وحسابات ومدفوعات الاشتراكات الشهرية، ومراجعات استحقاق نهاية الخدمة بموجب قانون التأمين الاجتماعي والمعاشات رقم 148 لسنة 2019.',
  },
  {
    categorySlug: 'payroll-social-insurance', order: 4,
    titleEn: 'Expatriate Work Permits',
    titleAr: 'تصاريح عمل المغتربين',
    bodyEn: 'Work permits for foreign employees and coordination of residency procedures.',
    bodyAr: 'تصاريح العمل للموظفين الأجانب وتنسيق إجراءات الإقامة.',
    fullBodyEn: 'Work permit applications for foreign employees under the Labour Law quota system, coordination of residency procedures with the Passports Authority, and renewal management to keep your expatriate workforce legally employed.',
    fullBodyAr: 'طلبات تصاريح العمل للموظفين الأجانب بموجب نظام الحصص في قانون العمل، وتنسيق إجراءات الإقامة مع مصلحة الجوازات والهجرة، وإدارة التجديد للحفاظ على توظيف قوتك العاملة من المغتربين بصورة قانونية.',
  },
  {
    categorySlug: 'payroll-social-insurance', order: 5,
    titleEn: 'HR Policies & Employment Contracts',
    titleAr: 'سياسات الموارد البشرية وعقود العمل',
    bodyEn: 'Internal work regulations and employment contracts in line with the Egyptian Labour Law.',
    bodyAr: 'لوائح العمل الداخلية وعقود العمل المتوافقة مع قانون العمل المصري.',
    fullBodyEn: 'Internal work regulations (required under the Labour Law for companies with 10 or more employees), standard and customized employment contracts, and HR policy manuals aligned with the Egyptian Labour Law No. 12 of 2003 and its amendments.',
    fullBodyAr: 'لوائح العمل الداخلية (المطلوبة بموجب قانون العمل للشركات التي تضم 10 موظفين فأكثر)، وعقود العمل القياسية والمخصصة، وأدلة سياسات الموارد البشرية المتوافقة مع قانون العمل المصري رقم 12 لسنة 2003 وتعديلاته.',
  },

  // ── E-Commerce & Digital Business ─────────────────────────────────────────
  {
    categorySlug: 'ecommerce-digital-business', order: 1,
    titleEn: 'Digital Business Structuring',
    titleAr: 'هيكلة الأعمال الرقمية',
    bodyEn: 'Entity choice and operating model for online platforms, marketplaces and software businesses.',
    bodyAr: 'اختيار الكيان ونموذج التشغيل للمنصات الإلكترونية والأسواق وأعمال البرمجيات.',
    fullBodyEn: 'Entity choice and operating model design for online platforms, marketplaces and software businesses entering or operating in Egypt, including VAT registration obligations, permanent establishment risk and the choice between a branch, representative office and subsidiary.',
    fullBodyAr: 'تصميم اختيار الكيان ونموذج التشغيل للمنصات الإلكترونية والأسواق وأعمال البرمجيات الدخيلة إلى مصر أو العاملة فيها، بما فيها التزامات التسجيل في ضريبة القيمة المضافة ومخاطر المنشأة الدائمة والاختيار بين الفرع والمكتب التمثيلي والشركة الفرعية.',
  },
  {
    categorySlug: 'ecommerce-digital-business', order: 2,
    titleEn: 'VAT for Non-Resident Digital Services',
    titleAr: 'ضريبة القيمة المضافة للخدمات الرقمية غير المقيمة',
    bodyEn: 'Simplified VAT registration and filing for foreign providers selling digital services to consumers in Egypt.',
    bodyAr: 'التسجيل المبسط في ضريبة القيمة المضافة وتقديم الإقرارات للموردين الأجانب الذين يبيعون الخدمات الرقمية للمستهلكين في مصر.',
    fullBodyEn: 'Simplified VAT registration and periodic filing for foreign providers selling digital services (streaming, software, advertising, cloud) to consumers in Egypt under the VAT simplified registration regime.',
    fullBodyAr: 'التسجيل المبسط في ضريبة القيمة المضافة وتقديم الإقرارات الدورية للموردين الأجانب الذين يبيعون الخدمات الرقمية (البث والبرمجيات والإعلانات والحوسبة السحابية) للمستهلكين في مصر بموجب نظام التسجيل المبسط في ضريبة القيمة المضافة.',
  },
  {
    categorySlug: 'ecommerce-digital-business', order: 3,
    titleEn: 'E-Invoicing & E-Receipt Set-Up',
    titleAr: 'إعداد الفوترة الإلكترونية والإيصالات الإلكترونية',
    bodyEn: 'Integration of online sales systems with the ETA e-invoice and e-receipt platforms.',
    bodyAr: 'دمج أنظمة المبيعات الإلكترونية مع منصتي الفوترة الإلكترونية والإيصالات الإلكترونية لهيئة الضرائب.',
    fullBodyEn: 'Integration of e-commerce platforms and point-of-sale systems with the Egyptian Tax Authority\'s e-invoice and e-receipt systems. We manage onboarding, API integration testing, and ongoing reconciliation of issued documents.',
    fullBodyAr: 'دمج منصات التجارة الإلكترونية وأنظمة نقاط البيع مع نظامي الفوترة الإلكترونية والإيصالات الإلكترونية لهيئة الضرائب المصرية. ندير الانضمام واختبار تكامل واجهة برمجة التطبيقات والمطابقة المستمرة للمستندات الصادرة.',
  },
  {
    categorySlug: 'ecommerce-digital-business', order: 4,
    titleEn: 'Online Seller Tax Compliance',
    titleAr: 'الامتثال الضريبي للبائعين عبر الإنترنت',
    bodyEn: 'Tax registration and compliance for e-commerce sellers and content creators.',
    bodyAr: 'التسجيل الضريبي والامتثال للبائعين عبر الإنترنت ومنشئي المحتوى.',
    fullBodyEn: 'Tax registration and compliance for individual and corporate e-commerce sellers on Egyptian and international marketplaces, and for content creators generating income through platforms. We cover income tax, VAT and e-invoicing obligations.',
    fullBodyAr: 'التسجيل الضريبي والامتثال للبائعين الأفراد والشركات عبر الإنترنت في الأسواق المصرية والدولية، ولمنشئي المحتوى الذين يحققون دخلاً عبر المنصات. نُغطِّي التزامات ضريبة الدخل وضريبة القيمة المضافة والفوترة الإلكترونية.',
  },
  {
    categorySlug: 'ecommerce-digital-business', order: 5,
    titleEn: 'Cross-Border Payments & Withholding Tax',
    titleAr: 'المدفوعات عبر الحدود وضريبة الاستقطاع',
    bodyEn: 'Tax treatment of payments to foreign platforms for advertising, software and cloud services.',
    bodyAr: 'المعالجة الضريبية للمدفوعات للمنصات الأجنبية مقابل الإعلانات والبرمجيات وخدمات الحوسبة السحابية.',
    fullBodyEn: 'Analysis of the Egyptian withholding tax and VAT treatment of payments to foreign platforms for advertising, software licences, cloud services and payment processing. We advise on treaty availability and the correct documentation to reduce exposure.',
    fullBodyAr: 'تحليل ضريبة الاستقطاع المصرية ومعالجة ضريبة القيمة المضافة للمدفوعات للمنصات الأجنبية مقابل الإعلانات وتراخيص البرمجيات وخدمات الحوسبة السحابية ومعالجة المدفوعات. نُقدِّم المشورة بشأن توافر المعاهدات والتوثيق الصحيح لتقليل التعرض.',
  },
  {
    categorySlug: 'ecommerce-digital-business', order: 6,
    titleEn: 'Digital Accounting & Automation',
    titleAr: 'المحاسبة الرقمية والأتمتة',
    bodyEn: 'Cloud accounting and ETA-integrated systems that reduce manual work.',
    bodyAr: 'المحاسبة السحابية والأنظمة المتكاملة مع هيئة الضرائب التي تُقلِّل العمل اليدوي.',
    fullBodyEn: 'Cloud accounting system selection and set-up, ETA portal integration for e-invoicing and VAT filing, and automation of reconciliation and reporting processes. We help digital businesses move from spreadsheets to systems that scale with them.',
    fullBodyAr: 'اختيار نظام المحاسبة السحابي وإعداده، ودمج بوابة هيئة الضرائب للفوترة الإلكترونية وتقديم ضريبة القيمة المضافة، وأتمتة عمليات المطابقة وإعداد التقارير. نُساعِد الشركات الرقمية على الانتقال من جداول البيانات إلى الأنظمة التي تتوسع معها.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

async function getAdminUser(prisma) {
  const user = await prisma.adminUser.findFirst({ where: { role: 'super_admin' } });
  if (!user) throw new Error('No super_admin user found. Run the main seed first.');
  return user;
}

async function upsertService(prisma, adminId, data) {
  const { titleEn, titleAr, bodyEn, bodyAr, metadata } = data;
  const metadataJson = JSON.stringify(metadata);
  const slug = metadata.slug || (metadata.serviceType === 'sub-service' ? `${metadata.categorySlug}-${metadata.displayOrder}` : metadata.categorySlug);

  // Find by slug stored in metadata
  const existing = await prisma.contentItem.findFirst({
    where: { type: 'service' },
  }).then(() =>
    prisma.contentItem.findMany({ where: { type: 'service' } })
  ).then(items =>
    items.find(item => {
      try {
        const m = JSON.parse(item.metadata);
        if (metadata.serviceType === 'category') return m.serviceType === 'category' && m.categorySlug === metadata.categorySlug;
        return m.serviceType === 'sub-service' && m.categorySlug === metadata.categorySlug && m.displayOrder === metadata.displayOrder;
      } catch { return false; }
    })
  );

  if (existing) {
    await prisma.contentItem.update({
      where: { id: existing.id },
      data: { titleEn, titleAr, bodyEn, bodyAr, metadata: metadataJson, updatedById: adminId },
    });
    return { action: 'updated', titleEn };
  } else {
    await prisma.contentItem.create({
      data: { type: 'service', titleEn, titleAr, bodyEn, bodyAr, status: 'published', metadata: metadataJson, createdById: adminId, updatedById: adminId },
    });
    return { action: 'created', titleEn };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  const admin = await getAdminUser(prisma);
  console.log(`\nUsing admin: ${admin.email}\n`);

  // Seed categories
  console.log('── Service Categories ───────────────────────────────');
  for (const cat of CATEGORIES) {
    const result = await upsertService(prisma, admin.id, {
      titleEn: cat.titleEn,
      titleAr: cat.titleAr,
      bodyEn: cat.bodyEn,
      bodyAr: cat.bodyAr,
      metadata: {
        serviceType: 'category',
        categorySlug: cat.slug,
        displayOrder: cat.order,
        icon: cat.icon,
      },
    });
    console.log(`  ${result.action === 'created' ? '✓ Created' : '↻ Updated'} category: ${result.titleEn}`);
  }

  // Seed sub-services
  console.log('\n── Sub-Services ─────────────────────────────────────');
  for (const svc of SUB_SERVICES) {
    const result = await upsertService(prisma, admin.id, {
      titleEn: svc.titleEn,
      titleAr: svc.titleAr,
      bodyEn: svc.bodyEn,
      bodyAr: svc.bodyAr,
      metadata: {
        serviceType: 'sub-service',
        categorySlug: svc.categorySlug,
        displayOrder: svc.order,
        shortDescriptionEn: svc.bodyEn,
        shortDescriptionAr: svc.bodyAr,
        fullDescriptionEn: svc.fullBodyEn || svc.bodyEn,
        fullDescriptionAr: svc.fullBodyAr || svc.bodyAr,
      },
    });
    console.log(`  ${result.action === 'created' ? '✓ Created' : '↻ Updated'} [${svc.categorySlug}] ${result.titleEn}`);
  }

  console.log('\n✅ Services seed completed successfully');
  console.log(`   ${CATEGORIES.length} categories + ${SUB_SERVICES.length} sub-services`);
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
