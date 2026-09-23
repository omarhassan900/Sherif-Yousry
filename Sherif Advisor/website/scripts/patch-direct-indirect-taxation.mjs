/**
 * One-off: set the full rich bodyEn for "Direct & Indirect Taxation"
 * Run: node scripts/patch-direct-indirect-taxation.mjs
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

const bodyEn = `
<p class="service-lead">Accurate returns, filed on time, with every position documented before the Egyptian Tax Authority asks for it.</p>

<h2 class="service-h2">Compliance is now digital, and so is scrutiny</h2>
<p class="service-p">Under the Unified Tax Procedures Law No. 206 of 2020, returns, invoices and payments flow through the Egyptian Tax Authority's electronic systems. The Authority can now match your filings against the data submitted by your customers and suppliers.</p>
<p class="service-p">Small inconsistencies between the VAT return, the e-invoices and the corporate tax return have become a common trigger for inspection. For foreign-owned companies the stakes are higher: tax cost feeds directly into the results reported to the parent and the cash available for dividends.</p>

<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Corporate income tax:</strong> Preparation and filing of the annual return under Income Tax Law No. 91 of 2005, computation of taxable profit, review of deductible expenses and provisions, and planning for the use of carried-forward losses.</p>
<p class="service-p"><strong class="service-strong">Value added tax:</strong> Registration, monthly returns under VAT Law No. 67 of 2016, input tax recovery, treatment of exempt, zero-rated and export supplies, and table tax on scheduled goods and services.</p>
<p class="service-p"><strong class="service-strong">Withholding tax:</strong> Quarterly filings under the advance payment system and withholding on payments to non-residents, with reconciliations that support the credits you claim.</p>
<p class="service-p"><strong class="service-strong">Stamp tax:</strong> Assessment of stamp tax on contracts, advertising, banking facilities and other taxable instruments under Stamp Tax Law No. 111 of 1980.</p>
<p class="service-p"><strong class="service-strong">Tax health check:</strong> A review of the open tax years that identifies exposures and corrects them before the Authority's inspection does.</p>
<p class="service-p"><strong class="service-strong">Tax calendar:</strong> One schedule of every filing and payment deadline, owned by us and shared with your finance team, so nothing depends on memory.</p>

<h2 class="service-h2">Our approach</h2>
<ol class="service-steps">
  <li class="service-step">
    <span class="service-step-num">Step 1</span>
    <span class="service-step-title">Diagnose</span>
    <span class="service-step-body">Review returns, accounting records and e-invoice data for the open years.</span>
  </li>
  <li class="service-step">
    <span class="service-step-num">Step 2</span>
    <span class="service-step-title">Correct</span>
    <span class="service-step-body">Close gaps and document the positions taken.</span>
  </li>
  <li class="service-step">
    <span class="service-step-num">Step 3</span>
    <span class="service-step-title">File</span>
    <span class="service-step-body">Prepare and submit returns within the statutory deadlines.</span>
  </li>
  <li class="service-step">
    <span class="service-step-num">Step 4</span>
    <span class="service-step-title">Monitor</span>
    <span class="service-step-body">Track changes in law and ETA practice, and explain what each one means for you.</span>
  </li>
</ol>

<div class="service-highlight">
  <span class="service-highlight-title">Who we advise</span>
  <span class="service-highlight-body">Egyptian subsidiaries of foreign groups, family-owned and investor-backed companies, and foreign investors in their first years of operation in Egypt.</span>
</div>

<h2 class="service-h2">Why choose Sherif Yousry?</h2>
<p class="service-p"><strong class="service-strong">Licensed accountants and advisers:</strong> Our team brings together licensed accountants, registered statutory auditors and certified tax experts, with more than two decades of professional experience across the Egyptian market.</p>
<p class="service-p"><strong class="service-strong">International standards:</strong> We work to International Financial Reporting Standards and International Standards on Auditing alongside Egyptian standards, so our work carries the same weight with a foreign parent, a lender or an investor as it does with the Egyptian Tax Authority.</p>
<p class="service-p"><strong class="service-strong">International tax expertise:</strong> We bring hands-on experience in double tax treaties, transfer pricing and cross-border structuring, aligned with OECD standards, to investors entering Egypt and to groups operating across borders.</p>
<p class="service-p"><strong class="service-strong">Partner-led, team-delivered:</strong> Every engagement is led by a partner and supported by a dedicated team from the initial consultation to the final deliverable, with no handoffs between departments. Clients benefit from senior-level judgement, continuity and accountability at every stage.</p>
<p class="service-p"><strong class="service-strong">Digital by design:</strong> Our services are delivered through a digital-first model. Clients can securely share documents through our client portal, track engagement progress, and connect with our team through virtual meetings, making it possible to work with us seamlessly from anywhere in the world.</p>

<h2 class="service-h2">Questions investors ask</h2>
<div class="service-faq-list">
  <details class="service-faq" open>
    <summary class="service-faq-q">What is the corporate income tax rate in Egypt?</summary>
    <p class="service-faq-a">The standard rate is 22.5% of taxable profit. Different rates apply to certain entities, such as companies in oil exploration and production, and smaller businesses may qualify for the simplified tax regime.</p>
  </details>
  <details class="service-faq">
    <summary class="service-faq-q">When is the annual corporate tax return due?</summary>
    <p class="service-faq-a">Within four months of the financial year end. For a company with a 31 December year end, that means by 30 April.</p>
  </details>
  <details class="service-faq">
    <summary class="service-faq-q">Are foreign-owned companies taxed differently from Egyptian companies?</summary>
    <p class="service-faq-a">No. A company incorporated in Egypt is taxed on the same basis whoever owns it. What changes the tax position is the investment regime it operates under, such as a free zone or an economic zone.</p>
  </details>
</div>

<p class="service-closing">Talk to us about your corporate tax and VAT position.</p>
`.trim();

async function main() {
  const record = await prisma.contentItem.findFirst({
    where: { type: 'service', titleEn: 'Direct & Indirect Taxation' },
  });

  if (!record) {
    console.error('❌ Record not found');
    process.exit(1);
  }

  await prisma.contentItem.update({
    where: { id: record.id },
    data: { bodyEn },
  });

  console.log('✅ Updated "Direct & Indirect Taxation" bodyEn');
  console.log('   ID:', record.id);
}

main()
  .catch(e => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
