/**
 * Seed: 7 service categories + 42 sub-services
 * Run: node scripts/seed-services.mjs
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

const CATEGORIES = [
  { slug:'tax-advisory', order:1, icon:'FileText', titleEn:'Tax Advisory', titleAr:'الاستشارات الضريبية', bodyEn:'Corporate income tax, VAT, transfer pricing, international tax, tax disputes, e-invoicing.', bodyAr:'ضريبة دخل الشركات، ضريبة القيمة المضافة، التسعير التحويلي، الضريبة الدولية، المنازعات الضريبية، الفوترة الإلكترونية.' },
  { slug:'audit-accounting-assurance', order:2, icon:'BarChart2', titleEn:'Audit, Accounting & Assurance', titleAr:'التدقيق والمحاسبة والتأكيد', bodyEn:'Statutory audit, bookkeeping, financial statements, internal audit, accounting system set-up.', bodyAr:'التدقيق القانوني، مسك الدفاتر، البيانات المالية، التدقيق الداخلي، إعداد نظام المحاسبة.' },
  { slug:'financial-advisory', order:3, icon:'TrendingUp', titleEn:'Financial Advisory', titleAr:'الاستشارات المالية', bodyEn:'Feasibility studies, business valuation, financial due diligence, financial modelling, restructuring, transaction support.', bodyAr:'دراسات الجدوى، تقييم الأعمال، العناية الواجبة المالية، النمذجة المالية، إعادة الهيكلة، دعم المعاملات.' },
  { slug:'business-management-advisory', order:4, icon:'Users', titleEn:'Business, Economic & Management Advisory', titleAr:'استشارات الأعمال والاقتصاد والإدارة', bodyEn:'Market entry, investment incentives, business plans, economic studies, governance, policies.', bodyAr:'دخول السوق، حوافز الاستثمار، خطط الأعمال، الدراسات الاقتصادية، الحوكمة، السياسات.' },
  { slug:'corporate-legal-services', order:5, icon:'Building2', titleEn:'Corporate & Legal Services', titleAr:'الخدمات المؤسسية والقانونية', bodyEn:'Company formation, branches, corporate secretarial, licensing, liquidation, contracts.', bodyAr:'تأسيس الشركات، الفروع، أمانة الشركة، التراخيص، التصفية، العقود.' },
  { slug:'payroll-social-insurance', order:6, icon:'ShieldCheck', titleEn:'Payroll & Social Insurance', titleAr:'الرواتب والتأمينات الاجتماعية', bodyEn:'Payroll processing, salary tax, social insurance, health insurance, work permits, HR policies.', bodyAr:'معالجة الرواتب، ضريبة الراتب، التأمينات الاجتماعية، التأمين الصحي، تصاريح العمل، سياسات الموارد البشرية.' },
  { slug:'ecommerce-digital-business', order:7, icon:'Globe', titleEn:'E-Commerce & Digital Business', titleAr:'التجارة الإلكترونية والأعمال الرقمية', bodyEn:'Digital business structuring, VAT for non-residents, e-invoicing set-up, online seller compliance, cross-border payments, digital accounting.', bodyAr:'هيكلة الأعمال الرقمية، ضريبة القيمة المضافة لغير المقيمين، إعداد الفوترة الإلكترونية، الامتثال للبائعين عبر الإنترنت، المدفوعات عبر الحدود، المحاسبة الرقمية.' },
];

const SUB_SERVICES = [
  // Tax Advisory
  { cat:'tax-advisory', order:1, titleEn:'Direct & Indirect Taxation', titleAr:'الضرائب المباشرة وغير المباشرة', bodyEn:'Corporate income tax, VAT, withholding and stamp tax, filed accurately and on time.', bodyAr:'ضريبة دخل الشركات، ضريبة القيمة المضافة، ضريبة الاستقطاع وضريبة الدمغة، مُقدَّمة بدقة وفي الوقت المحدد.' },
  { cat:'tax-advisory', order:2, titleEn:'International Taxation', titleAr:'الضرائب الدولية', bodyEn:'Treaty relief, permanent establishment risk and cross-border payments.', bodyAr:'الإعفاء بموجب المعاهدات، مخاطر المنشأة الدائمة، والمدفوعات العابرة للحدود.' },
  { cat:'tax-advisory', order:3, titleEn:'Transfer Pricing', titleAr:'التسعير التحويلي', bodyEn:'Documentation, benchmarking and policies that hold up at inspection.', bodyAr:'التوثيق والمقارنة المعيارية والسياسات التي تصمد أمام الفحص.' },
  { cat:'tax-advisory', order:4, titleEn:'Tax Dispute Resolution', titleAr:'حل المنازعات الضريبية', bodyEn:'Inspection, objection, committees and settlement.', bodyAr:'الفحص، الاعتراض، اللجان والتسوية.' },
  { cat:'tax-advisory', order:5, titleEn:'Tax Due Diligence & Structuring', titleAr:'العناية الضريبية الواجبة والهيكلة', bodyEn:'Tax clarity before you sign, and a structure planned for exit.', bodyAr:'الوضوح الضريبي قبل التوقيع، وهيكل مُخطَّط للخروج.' },
  { cat:'tax-advisory', order:6, titleEn:'Tax Accounting', titleAr:'المحاسبة الضريبية', bodyEn:'Current and deferred tax your auditor and parent company can rely on.', bodyAr:'الضريبة الجارية والمؤجلة التي يمكن لمدققك والشركة الأم الاعتماد عليها.' },
  { cat:'tax-advisory', order:7, titleEn:'E-Invoicing & E-Receipt Compliance', titleAr:'الامتثال للفوترة الإلكترونية والإيصالات الإلكترونية', bodyEn:'Onboarding, integration and monthly reconciliation with the ETA systems.', bodyAr:'الانضمام والتكامل والمطابقة الشهرية مع أنظمة هيئة الضرائب.' },
  // Audit
  { cat:'audit-accounting-assurance', order:1, titleEn:'Statutory Audit', titleAr:'التدقيق القانوني', bodyEn:'Independent audit of annual financial statements for joint stock companies, LLCs and branches of foreign companies.', bodyAr:'تدقيق مستقل للبيانات المالية السنوية لشركات المساهمة والشركات ذات المسؤولية المحدودة وفروع الشركات الأجنبية.' },
  { cat:'audit-accounting-assurance', order:2, titleEn:'Reviews & Agreed-Upon Procedures', titleAr:'المراجعات والإجراءات المتفق عليها', bodyEn:'Limited reviews of interim financial statements and targeted procedures for lenders, shareholders or head offices.', bodyAr:'مراجعات محدودة للبيانات المالية المرحلية وإجراءات مستهدفة للمقرضين والمساهمين أو المقرات الرئيسية.' },
  { cat:'audit-accounting-assurance', order:3, titleEn:'Bookkeeping & Accounting', titleAr:'مسك الدفاتر والمحاسبة', bodyEn:'Monthly bookkeeping, bank and account reconciliations, and period-end closing on cloud accounting systems.', bodyAr:'مسك الدفاتر الشهري، ومطابقة البنوك والحسابات، وإغلاق نهاية الفترة على أنظمة المحاسبة السحابية.' },
  { cat:'audit-accounting-assurance', order:4, titleEn:'Financial Statements Preparation', titleAr:'إعداد البيانات المالية', bodyEn:'Annual and interim financial statements under Egyptian Accounting Standards, with IFRS reporting packs for foreign parent companies.', bodyAr:'البيانات المالية السنوية والمرحلية وفق معايير المحاسبة المصرية، مع حزم تقارير IFRS للشركات الأم الأجنبية.' },
  { cat:'audit-accounting-assurance', order:5, titleEn:'Internal Audit & Controls', titleAr:'التدقيق الداخلي والضوابط', bodyEn:'Risk-based internal audit, process reviews and the design of internal controls over finance, procurement and inventory.', bodyAr:'التدقيق الداخلي القائم على المخاطر، ومراجعات العمليات، وتصميم الضوابط الداخلية للمالية والمشتريات والمخزون.' },
  { cat:'audit-accounting-assurance', order:6, titleEn:'Accounting System Set-Up', titleAr:'إعداد نظام المحاسبة', bodyEn:'Chart of accounts, accounting policies and procedures manuals, and system implementation for newly formed entities.', bodyAr:'دليل الحسابات، وسياسات المحاسبة وأدلة الإجراءات، وتطبيق النظام للكيانات المُنشَأة حديثاً.' },
  // Financial Advisory
  { cat:'financial-advisory', order:1, titleEn:'Feasibility Studies', titleAr:'دراسات الجدوى', bodyEn:'Market, technical and financial feasibility studies for new projects, suitable for investors, banks and regulatory submissions.', bodyAr:'دراسات الجدوى السوقية والتقنية والمالية للمشاريع الجديدة، مناسبة للمستثمرين والبنوك والتقديمات التنظيمية.' },
  { cat:'financial-advisory', order:2, titleEn:'Business Valuation', titleAr:'تقييم الأعمال', bodyEn:'Valuations of companies and shares for acquisitions, share transfers, capital increases and shareholder exits.', bodyAr:'تقييمات الشركات والأسهم للاستحواذات ونقل الأسهم وزيادات رأس المال وخروج المساهمين.' },
  { cat:'financial-advisory', order:3, titleEn:'Financial Due Diligence', titleAr:'العناية الواجبة المالية', bodyEn:'Quality of earnings, net debt and working capital reviews for buyers and investors.', bodyAr:'مراجعات جودة الأرباح وصافي الدين ورأس المال العامل للمشترين والمستثمرين.' },
  { cat:'financial-advisory', order:4, titleEn:'Financial Modelling & Budgeting', titleAr:'النمذجة المالية والميزانية', bodyEn:'Integrated three-statement models, annual budgets and rolling cash-flow forecasts.', bodyAr:'نماذج البيانات الثلاثة المتكاملة، والميزانيات السنوية، وتوقعات التدفق النقدي المتجددة.' },
  { cat:'financial-advisory', order:5, titleEn:'Restructuring & Working Capital', titleAr:'إعادة الهيكلة ورأس المال العامل', bodyEn:'Cost reviews, cash-flow improvement and support in renegotiating debt with lenders.', bodyAr:'مراجعات التكاليف وتحسين التدفق النقدي ودعم إعادة التفاوض على الدين مع المقرضين.' },
  { cat:'financial-advisory', order:6, titleEn:'Transaction Support', titleAr:'دعم المعاملات', bodyEn:'Support through acquisitions and investments, from term sheet and pricing to completion accounts.', bodyAr:'دعم خلال الاستحواذات والاستثمارات، من ورقة الشروط والتسعير إلى حسابات الإتمام.' },
  // Business Advisory
  { cat:'business-management-advisory', order:1, titleEn:'Market Entry Strategy', titleAr:'استراتيجية دخول السوق', bodyEn:'Choice of legal entity, investment regime and location, with a step-by-step entry roadmap.', bodyAr:'اختيار الكيان القانوني ونظام الاستثمار والموقع، مع خارطة طريق دخول خطوة بخطوة.' },
  { cat:'business-management-advisory', order:2, titleEn:'Investment Incentives', titleAr:'حوافز الاستثمار', bodyEn:'Assessment of and applications for incentives under Investment Law No. 72 of 2017, including the Golden License.', bodyAr:'تقييم وتقديم طلبات الحوافز بموجب قانون الاستثمار رقم 72 لسنة 2017، بما فيها الترخيص الذهبي.' },
  { cat:'business-management-advisory', order:3, titleEn:'Business Plans', titleAr:'خطط الأعمال', bodyEn:'Business plans prepared for investors, banks and partners.', bodyAr:'خطط أعمال مُعَدَّة للمستثمرين والبنوك والشركاء.' },
  { cat:'business-management-advisory', order:4, titleEn:'Economic & Sector Studies', titleAr:'الدراسات الاقتصادية والقطاعية', bodyEn:'Sector analysis, demand studies and economic assessments to support investment decisions.', bodyAr:'تحليل القطاعات ودراسات الطلب والتقييمات الاقتصادية لدعم قرارات الاستثمار.' },
  { cat:'business-management-advisory', order:5, titleEn:'Organization & Governance', titleAr:'التنظيم والحوكمة', bodyEn:'Organizational structures, delegation of authority matrices and governance frameworks.', bodyAr:'الهياكل التنظيمية ومصفوفات تفويض الصلاحيات وأطر الحوكمة.' },
  { cat:'business-management-advisory', order:6, titleEn:'Policies & Procedures', titleAr:'السياسات والإجراءات', bodyEn:'Operating manuals for finance, procurement, human resources and inventory.', bodyAr:'أدلة التشغيل للمالية والمشتريات والموارد البشرية والمخزون.' },
  // Corporate & Legal
  { cat:'corporate-legal-services', order:1, titleEn:'Company Formation', titleAr:'تأسيس الشركات', bodyEn:'Incorporation of LLCs, joint stock companies and one-person companies through GAFI.', bodyAr:'تأسيس الشركات ذات المسؤولية المحدودة وشركات المساهمة والشركات أحادية الشخص من خلال هيئة الاستثمار.' },
  { cat:'corporate-legal-services', order:2, titleEn:'Branches & Representative Offices', titleAr:'الفروع والمكاتب التمثيلية', bodyEn:'Registration of branches and representative offices of foreign companies in Egypt.', bodyAr:'تسجيل فروع ومكاتب التمثيل للشركات الأجنبية في مصر.' },
  { cat:'corporate-legal-services', order:3, titleEn:'Corporate Secretarial', titleAr:'أمانة الشركة', bodyEn:'General assemblies, board minutes, share transfers, capital changes and commercial register amendments.', bodyAr:'الجمعيات العمومية ومحاضر مجلس الإدارة ونقل الأسهم وتغييرات رأس المال وتعديلات السجل التجاري.' },
  { cat:'corporate-legal-services', order:4, titleEn:'Licensing & Registrations', titleAr:'التراخيص والتسجيلات', bodyEn:'Sector licenses, the importers and exporters registers, and chamber of commerce memberships.', bodyAr:'التراخيص القطاعية وسجلات المستوردين والمصدرين وعضويات غرف التجارة.' },
  { cat:'corporate-legal-services', order:5, titleEn:'Liquidation & Deregistration', titleAr:'التصفية وإلغاء التسجيل', bodyEn:'Voluntary liquidation, tax clearance and removal from the commercial register.', bodyAr:'التصفية الاختيارية والمخالصة الضريبية وإزالة القيد من السجل التجاري.' },
  { cat:'corporate-legal-services', order:6, titleEn:'Contracts Support', titleAr:'دعم العقود', bodyEn:'Commercial and employment contracts, prepared in coordination with licensed legal counsel.', bodyAr:'العقود التجارية وعقود العمل، مُعَدَّة بالتنسيق مع المستشار القانوني المرخص.' },
  // Payroll
  { cat:'payroll-social-insurance', order:1, titleEn:'Payroll Processing', titleAr:'معالجة الرواتب', bodyEn:'Monthly payroll calculation, payslips and bank transfer files.', bodyAr:'حساب الرواتب الشهري وكشوف الرواتب وملفات التحويل البنكي.' },
  { cat:'payroll-social-insurance', order:2, titleEn:'Salary Tax Compliance', titleAr:'الامتثال لضريبة الراتب', bodyEn:'Monthly salary tax withholding and the periodic and annual salary tax returns.', bodyAr:'استقطاع ضريبة الراتب الشهري والإقرارات الضريبية الدورية والسنوية.' },
  { cat:'payroll-social-insurance', order:3, titleEn:'Social Insurance', titleAr:'التأمينات الاجتماعية', bodyEn:'Employee registration and monthly contributions under Social Insurance and Pensions Law No. 148 of 2019.', bodyAr:'تسجيل الموظفين والاشتراكات الشهرية بموجب قانون التأمين الاجتماعي والمعاشات رقم 148 لسنة 2019.' },
  { cat:'payroll-social-insurance', order:4, titleEn:'Expatriate Work Permits', titleAr:'تصاريح عمل المغتربين', bodyEn:'Work permits for foreign employees and coordination of residency procedures.', bodyAr:'تصاريح العمل للموظفين الأجانب وتنسيق إجراءات الإقامة.' },
  { cat:'payroll-social-insurance', order:5, titleEn:'HR Policies & Employment Contracts', titleAr:'سياسات الموارد البشرية وعقود العمل', bodyEn:'Internal work regulations and employment contracts in line with the Egyptian Labour Law.', bodyAr:'لوائح العمل الداخلية وعقود العمل المتوافقة مع قانون العمل المصري.' },
  // E-Commerce
  { cat:'ecommerce-digital-business', order:1, titleEn:'Digital Business Structuring', titleAr:'هيكلة الأعمال الرقمية', bodyEn:'Entity choice and operating model for online platforms, marketplaces and software businesses.', bodyAr:'اختيار الكيان ونموذج التشغيل للمنصات الإلكترونية والأسواق وأعمال البرمجيات.' },
  { cat:'ecommerce-digital-business', order:2, titleEn:'VAT for Non-Resident Digital Services', titleAr:'ضريبة القيمة المضافة للخدمات الرقمية غير المقيمة', bodyEn:'Simplified VAT registration and filing for foreign providers selling digital services to consumers in Egypt.', bodyAr:'التسجيل المبسط في ضريبة القيمة المضافة وتقديم الإقرارات للموردين الأجانب الذين يبيعون الخدمات الرقمية للمستهلكين في مصر.' },
  { cat:'ecommerce-digital-business', order:3, titleEn:'E-Invoicing & E-Receipt Set-Up', titleAr:'إعداد الفوترة الإلكترونية والإيصالات الإلكترونية', bodyEn:'Integration of online sales systems with the ETA e-invoice and e-receipt platforms.', bodyAr:'دمج أنظمة المبيعات الإلكترونية مع منصتي الفوترة الإلكترونية والإيصالات الإلكترونية لهيئة الضرائب.' },
  { cat:'ecommerce-digital-business', order:4, titleEn:'Online Seller Tax Compliance', titleAr:'الامتثال الضريبي للبائعين عبر الإنترنت', bodyEn:'Tax registration and compliance for e-commerce sellers and content creators.', bodyAr:'التسجيل الضريبي والامتثال للبائعين عبر الإنترنت ومنشئي المحتوى.' },
  { cat:'ecommerce-digital-business', order:5, titleEn:'Cross-Border Payments & Withholding Tax', titleAr:'المدفوعات عبر الحدود وضريبة الاستقطاع', bodyEn:'Tax treatment of payments to foreign platforms for advertising, software and cloud services.', bodyAr:'المعالجة الضريبية للمدفوعات للمنصات الأجنبية مقابل الإعلانات والبرمجيات وخدمات الحوسبة السحابية.' },
  { cat:'ecommerce-digital-business', order:6, titleEn:'Digital Accounting & Automation', titleAr:'المحاسبة الرقمية والأتمتة', bodyEn:'Cloud accounting and ETA-integrated systems that reduce manual work.', bodyAr:'المحاسبة السحابية والأنظمة المتكاملة مع هيئة الضرائب التي تُقلِّل العمل اليدوي.' },
];

async function upsert(prisma, adminId, data) {
  const all = await prisma.contentItem.findMany({ where: { type: 'service' } });
  const existing = all.find(r => {
    try {
      const m = JSON.parse(r.metadata);
      return m.serviceType === data.serviceType && m.categorySlug === data.categorySlug &&
             (data.serviceType === 'category' || m.displayOrder === data.displayOrder);
    } catch { return false; }
  });
  const meta = JSON.stringify({ serviceType: data.serviceType, categorySlug: data.categorySlug, displayOrder: data.displayOrder, icon: data.icon || null, shortDescriptionEn: data.bodyEn, shortDescriptionAr: data.bodyAr });
  if (existing) {
    await prisma.contentItem.update({ where: { id: existing.id }, data: { titleEn: data.titleEn, titleAr: data.titleAr, bodyEn: data.bodyEn, bodyAr: data.bodyAr, metadata: meta, updatedById: adminId } });
    return 'updated';
  }
  await prisma.contentItem.create({ data: { type: 'service', titleEn: data.titleEn, titleAr: data.titleAr, bodyEn: data.bodyEn, bodyAr: data.bodyAr, status: 'published', metadata: meta, createdById: adminId, updatedById: adminId } });
  return 'created';
}

async function main() {
  const admin = await prisma.adminUser.findFirst({ where: { role: 'super_admin' } });
  if (!admin) throw new Error('No super_admin found. Run main seed first.');
  console.log(`Using admin: ${admin.email}\n`);

  for (const c of CATEGORIES) {
    const r = await upsert(prisma, admin.id, { serviceType:'category', categorySlug:c.slug, displayOrder:c.order, icon:c.icon, titleEn:c.titleEn, titleAr:c.titleAr, bodyEn:c.bodyEn, bodyAr:c.bodyAr });
    console.log(`  ${r==='created'?'✓':'↻'} category: ${c.titleEn}`);
  }
  for (const s of SUB_SERVICES) {
    const r = await upsert(prisma, admin.id, { serviceType:'sub-service', categorySlug:s.cat, displayOrder:s.order, titleEn:s.titleEn, titleAr:s.titleAr, bodyEn:s.bodyEn, bodyAr:s.bodyAr });
    console.log(`  ${r==='created'?'✓':'↻'} [${s.cat}] ${s.titleEn}`);
  }
  console.log(`\n✅ Done: ${CATEGORIES.length} categories + ${SUB_SERVICES.length} sub-services`);
}

main().catch(e => { console.error('❌', e); process.exit(1); }).finally(() => prisma.$disconnect());
