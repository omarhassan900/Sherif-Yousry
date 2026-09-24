/**
 * Seed rich HTML bodyEn for all service sub-service records.
 * Run: node scripts/seed-all-service-content.mjs
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

const WHY = `<h2 class="service-h2">Why choose Sherif Yousry?</h2>
<p class="service-p"><strong class="service-strong">Licensed accountants and advisers:</strong> Our team brings together licensed accountants, registered statutory auditors and certified tax experts, with more than two decades of professional experience across the Egyptian market.</p>
<p class="service-p"><strong class="service-strong">International standards:</strong> We work to International Financial Reporting Standards and International Standards on Auditing alongside Egyptian standards, so our work carries the same weight with a foreign parent, a lender or an investor as it does with the Egyptian Tax Authority.</p>
<p class="service-p"><strong class="service-strong">Partner-led, team-delivered:</strong> Every engagement is led by a partner and supported by a dedicated team from the initial consultation to the final deliverable, with no handoffs between departments.</p>
<p class="service-p"><strong class="service-strong">Digital by design:</strong> Clients can securely share documents through our client portal, track engagement progress, and connect with our team through virtual meetings.</p>`;

function steps(items) {
  return `<ol class="service-steps">${items.map(([n,t,b])=>`<li class="service-step"><span class="service-step-num">Step ${n}</span><span class="service-step-title">${t}</span><span class="service-step-body">${b}</span></li>`).join('')}</ol>`;
}
function who(body) {
  return `<div class="service-highlight"><span class="service-highlight-title">Who we advise</span><span class="service-highlight-body">${body}</span></div>`;
}
function faq(items) {
  return `<div class="service-faq-list">${items.map(([q,a],i)=>`<details class="service-faq"${i===0?' open':''}><summary class="service-faq-q">${q}</summary><p class="service-faq-a">${a}</p></details>`).join('')}</div>`;
}

const CONTENT = {
  'Direct & Indirect Taxation': `<p class="service-lead">Accurate returns, filed on time, with every position documented before the Egyptian Tax Authority asks for it.</p>
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
${steps([['1','Diagnose','Review returns, accounting records and e-invoice data for the open years.'],['2','Correct','Close gaps and document the positions taken.'],['3','File','Prepare and submit returns within the statutory deadlines.'],['4','Monitor','Track changes in law and ETA practice, and explain what each one means for you.']])}
${who('Egyptian subsidiaries of foreign groups, family-owned and investor-backed companies, and foreign investors in their first years of operation in Egypt.')}
${WHY}
<h2 class="service-h2">Questions investors ask</h2>
${faq([['What is the corporate income tax rate in Egypt?','The standard rate is 22.5% of taxable profit. Different rates apply to certain entities, such as companies in oil exploration and production, and smaller businesses may qualify for the simplified tax regime.'],['When is the annual corporate tax return due?','Within four months of the financial year end. For a company with a 31 December year end, that means by 30 April.'],['Are foreign-owned companies taxed differently from Egyptian companies?','No. A company incorporated in Egypt is taxed on the same basis whoever owns it. What changes the tax position is the investment regime it operates under, such as a free zone or an economic zone.']])}
<p class="service-closing">Talk to us about your corporate tax and VAT position.</p>`,

  'International Taxation': `<p class="service-lead">Cross-border structures that are efficient on paper and defensible in practice.</p>
<h2 class="service-h2">Treaty benefits must now be earned, not assumed</h2>
<p class="service-p">Egypt has an extensive network of double tax treaties and is a signatory to the OECD Multilateral Instrument, which adds a principal purpose test to many of them. Reduced withholding on dividends, interest, royalties and service fees is now available only where a structure has genuine substance.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Double tax treaty relief:</strong> Analysis of treaty eligibility, documentation of tax residence and beneficial ownership, and claims for reduced withholding rates.</p>
<p class="service-p"><strong class="service-strong">Permanent establishment risk:</strong> Review of how employees, agents, projects and contracts in Egypt are organised, and practical steps to manage the risk of an unintended taxable presence.</p>
<p class="service-p"><strong class="service-strong">Cross-border payments:</strong> Tax treatment of dividends, interest, royalties, and technical and management fees paid abroad, including VAT on imported services.</p>
<p class="service-p"><strong class="service-strong">Inbound investment structuring:</strong> Choice of holding jurisdiction, financing mix and profit repatriation route for new investment in Egypt.</p>
<p class="service-p"><strong class="service-strong">Expatriate taxation:</strong> Tax position of foreign employees assigned to Egypt and of Egyptian staff seconded abroad.</p>
<h2 class="service-h2">Our approach</h2>
${steps([['1','Map','Chart the entities, transactions and payment flows involved.'],['2','Test','Assess each flow against Egyptian law, the relevant treaty and the Multilateral Instrument.'],['3','Structure','Recommend the arrangement that balances tax cost, substance and commercial needs.'],['4','Document','Assemble residence certificates, substance evidence and board records that support the position.']])}
${who('Multinational groups investing in Egypt, foreign companies serving Egyptian customers, and Egyptian groups expanding into the Gulf and Africa.')}
${WHY}
<h2 class="service-h2">Questions investors ask</h2>
${faq([['Does Egypt tax payments to foreign service providers?','Many payments to non-residents, including royalties, interest and a range of service fees, are subject to Egyptian withholding tax unless a treaty reduces or removes it.'],['Can a foreign company have a permanent establishment in Egypt without an office?','Yes. A permanent establishment can arise through a dependent agent who concludes contracts in Egypt, or through construction or service projects that last beyond the period set in the relevant treaty.'],['What does the Multilateral Instrument change?','For covered treaties, it allows treaty benefits to be denied where obtaining them was one of the principal purposes of an arrangement.']])}
<p class="service-closing">Talk to us before you move money across borders.</p>`,

  'Transfer Pricing': `<p class="service-lead">Intra-group pricing that stands up to inspection in Egypt and fits the group's global policy.</p>
<h2 class="service-h2">A priority area for the Egyptian Tax Authority</h2>
<p class="service-p">Egyptian law requires transactions between related parties to follow the arm's length principle under Article 30 of the Income Tax Law. Groups above the prescribed thresholds must prepare a master file, a local file and, where applicable, a country-by-country report.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Transfer pricing documentation:</strong> Preparation of the local file and support with the master file, in the required format and within the filing timeline.</p>
<p class="service-p"><strong class="service-strong">Country-by-country reporting:</strong> Notifications and country-by-country reports for Egyptian parent companies and constituent entities.</p>
<p class="service-p"><strong class="service-strong">Benchmarking studies:</strong> Selection of the most appropriate method, and searches for comparable companies and transactions.</p>
<p class="service-p"><strong class="service-strong">Transfer pricing policies:</strong> Pricing policies for distribution, manufacturing, services, royalties and intra-group financing.</p>
<p class="service-p"><strong class="service-strong">Inspection defence and advance rulings:</strong> Responses to transfer pricing inspections, and requests for advance tax rulings where certainty is needed.</p>
<h2 class="service-h2">Our approach</h2>
${steps([['1','Understand','Interview management and analyse the functions, assets and risks of each entity.'],['2','Benchmark','Select the method and test the pricing against comparable data.'],['3','Document','Prepare files that tell a consistent story across the group.'],['4','Defend','Support the position through inspection and, if needed, dispute.']])}
${who('Egyptian subsidiaries of multinational groups, Egyptian groups with foreign affiliates, and companies with significant transactions with shareholders or sister companies.')}
${WHY}
<h2 class="service-h2">Questions investors ask</h2>
${faq([['Who must prepare transfer pricing documentation in Egypt?','Companies whose related-party transactions exceed the thresholds in the Executive Regulations must prepare a master file and a local file.'],['Are management fees paid to a parent company deductible?','Yes, provided the company can show that the services were actually received, that they benefited the Egyptian business, and that the charge is at arm\'s length.'],['How often should a benchmarking study be updated?','Comparables should be reviewed regularly and refreshed whenever the business model, the group structure or market conditions change materially.']])}
<p class="service-closing">Talk to us about your transfer pricing file.</p>`,

  'Tax Dispute Resolution': `<p class="service-lead">A disputed assessment is a negotiation with strict rules. We prepare for it from the first inspection request.</p>
<div class="service-highlight" style="background:#081222;border:none;padding:1.25rem 1.5rem;border-radius:6px"><span class="service-highlight-title" style="color:#fff">The settlement window closes on 31 December 2026</span><span class="service-highlight-body" style="color:#C9D1DC">File a request under Law No. 79 of 2016 before the deadline to settle open disputes.</span></div>
<h2 class="service-h2">Most disputes are decided before the committee</h2>
<p class="service-p">Under the Unified Tax Procedures Law, a taxpayer who disagrees with an assessment must object within strict statutory deadlines. The outcome largely depends on the strength of the file at inspection: reconciliations, contracts, e-invoices and board records.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Inspection readiness:</strong> A review of your records and positions before the inspector arrives, so the file is complete and consistent.</p>
<p class="service-p"><strong class="service-strong">Managing the inspection:</strong> Attendance at inspection meetings, responses to information requests, and challenge of adjustments that the evidence does not support.</p>
<p class="service-p"><strong class="service-strong">Objections and internal committees:</strong> Technical memoranda and representation at the internal committee stage.</p>
<p class="service-p"><strong class="service-strong">Appeal Committees:</strong> Preparation of the case, supporting evidence and representation before the Appeal Committees.</p>
<p class="service-p"><strong class="service-strong">Settlement:</strong> Assessment of settlement options, including applications under Law No. 79 of 2016, extended to 31 December 2026.</p>
<h2 class="service-h2">Our approach</h2>
${steps([['1','Assess','Review the assessment, the deadlines and the strength of each point.'],['2','Prepare','Build the evidence file and the technical arguments.'],['3','Represent','Present the case at each stage of the process.'],['4','Resolve','Close the dispute through a decision or a negotiated settlement.']])}
${who('Companies facing a tax inspection or an assessment they disagree with, and investors who have acquired a company with open disputes.')}
${WHY}
<h2 class="service-h2">Questions investors ask</h2>
${faq([['What happens if the objection deadline is missed?','The assessment can become final and enforceable, which sharply limits the options that remain. Contact an adviser as soon as you receive a notice.'],['Is there a settlement scheme available now?','Yes. Law No. 79 of 2016 has been extended to 31 December 2026. A settlement request must be submitted by that date.'],['Is it better to settle or to appeal?','It depends on the amount, the strength of the evidence and the cost of time. We give you a clear view of both routes before you decide.']])}
<p class="service-closing">Received a tax assessment? Talk to us before the deadline runs.</p>`,

  'Tax Due Diligence & Structuring': `<p class="service-lead">Know the tax you are buying before you sign, and plan the tax you will pay on exit before you invest.</p>
<h2 class="service-h2">Tax exposures transfer with the shares</h2>
<p class="service-p">When you acquire shares in an Egyptian company, you inherit its open tax years, including any unpaid tax, penalties and late-payment charges. Tax findings are one of the most common reasons for price adjustments, specific indemnities and escrow arrangements.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Buy-side tax due diligence:</strong> Review of open tax years, inspection status, disputes and compliance quality, with each exposure quantified and ranked by risk.</p>
<p class="service-p"><strong class="service-strong">Vendor tax due diligence:</strong> A tax review on the seller's side, so issues are resolved or disclosed before buyers find them.</p>
<p class="service-p"><strong class="service-strong">Deal structuring:</strong> Share versus asset deals, capital gains on share transfers, stamp tax, VAT on asset transfers, and acquisition financing.</p>
<p class="service-p"><strong class="service-strong">Market-entry structuring:</strong> Entity type, investment regime and incentives available under Investment Law No. 72 of 2017.</p>
<h2 class="service-h2">Our approach</h2>
${steps([['1','Scope','Agree the areas, years and materiality that matter for the deal.'],['2','Review','Examine returns, assessments, contracts and correspondence with the Authority.'],['3','Quantify','Put a value and a likelihood on every exposure.'],['4','Protect','Translate findings into price, warranties, indemnities or structure.']])}
${who('Private equity funds, strategic acquirers, family offices and Egyptian owners preparing a business for sale or investment.')}
${WHY}
<h2 class="service-h2">Questions investors ask</h2>
${faq([['How long does a tax due diligence take?','Typically two to four weeks, depending on the number of open tax years, the quality of the records and access to management.'],['Are gains on the sale of shares in an Egyptian company taxed?','Yes. Gains on unlisted shares are generally taxable, including for non-resident sellers, subject to any treaty relief.'],['What is the difference between buy-side and vendor due diligence?','Buy-side work protects the investor. Vendor work lets the seller find and fix issues first, which usually shortens the deal and supports the price.']])}
<p class="service-closing">Planning an acquisition or an investment in Egypt? Talk to us before the term sheet.</p>`,

  'Tax Accounting': `<p class="service-lead">Tax numbers in your financial statements that your auditor, your board and your parent company can rely on.</p>
<h2 class="service-h2">Tax is one of the most judgement-heavy lines in the accounts</h2>
<p class="service-p">Income tax balances under Egyptian Accounting Standard No. 24 and IAS 12 require judgement on deferred tax, the recoverability of tax losses and uncertain positions. Errors tend to surface as late audit adjustments or, worse, restatements.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Current tax provisions:</strong> Quarterly and year-end tax computations, reconciled to the return that will be filed.</p>
<p class="service-p"><strong class="service-strong">Deferred tax:</strong> Identification of temporary differences and assessment of deferred tax assets, including those arising from tax losses.</p>
<p class="service-p"><strong class="service-strong">Uncertain tax positions:</strong> Assessment, measurement and disclosure of uncertain tax treatments in line with IFRIC 23 for IFRS reporting.</p>
<p class="service-p"><strong class="service-strong">Group reporting packs:</strong> Tax sections of IFRS reporting packs for foreign parents, delivered on the group timetable.</p>
<h2 class="service-h2">Our approach</h2>
${steps([['1','Gather','Collect trial balances, fixed asset registers and prior computations.'],['2','Compute','Calculate current and deferred tax and test the judgements.'],['3','Reconcile','Tie the provision to the return and the effective tax rate.'],['4','Report','Deliver disclosures and working papers ready for audit.']])}
${who('Subsidiaries of foreign groups, companies preparing for audit or investment, and finance teams without an in-house tax specialist.')}
${WHY}
<h2 class="service-h2">Questions investors ask</h2>
${faq([['Can you prepare our tax provision if you are also our statutory auditor?','No. To protect auditor independence, where we are the statutory auditor the provision is prepared by the company or by another adviser.'],['When should deferred tax be recognised on tax losses?','When it is probable that future taxable profit will be available to use the losses before they expire. This requires a supportable forecast.'],['Do you work with the group\'s own tax team?','Yes. We work to the group\'s instructions, templates and timetable, and flag Egyptian-specific issues early.']])}
<p class="service-closing">Talk to us before your year-end close.</p>`,

  'E-Invoicing & E-Receipt Compliance': `<p class="service-lead">Every sale reported correctly to the Egyptian Tax Authority, in real time, without slowing your business down.</p>
<h2 class="service-h2">An invoice that is not electronic may not count</h2>
<p class="service-p">E-invoicing is mandatory for sales between businesses, and the e-receipt system for sales to consumers is being rolled out in phases. Expenses and input VAT supported by non-compliant invoices can be disallowed, and the Authority uses the data to cross-check returns.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Onboarding:</strong> Registration on the e-invoicing and e-receipt systems, set-up of the electronic signature and the taxpayer profile.</p>
<p class="service-p"><strong class="service-strong">Item coding:</strong> Mapping of your products and services to GS1 or EGS codes.</p>
<p class="service-p"><strong class="service-strong">ERP and POS integration:</strong> Coordination with your system provider to submit documents through the ETA interface, with testing before go-live.</p>
<p class="service-p"><strong class="service-strong">Monthly reconciliation:</strong> Matching of submitted invoices, credit notes and cancellations against the books and the VAT return.</p>
<h2 class="service-h2">Our approach</h2>
${steps([['1','Assess','Review your sales process, systems and document volumes.'],['2','Set up','Register, code items and configure the signature.'],['3','Integrate','Connect and test your ERP or POS with the ETA systems.'],['4','Sustain','Reconcile monthly and resolve rejected documents quickly.']])}
${who('Companies registering for the first time, businesses changing their ERP, retailers moving onto e-receipts, and foreign-owned companies setting up in Egypt.')}
${WHY}
<h2 class="service-h2">Questions investors ask</h2>
${faq([['Do export invoices need to be issued electronically?','Yes. Export sales are also issued through the e-invoicing system.'],['Do we need a new accounting system?','Not necessarily. Most ERP systems can connect to the ETA interface, and low volumes can be issued directly on the ETA portal.'],['What happens if a supplier does not issue an e-invoice?','The related expense and input VAT can be challenged. Suppliers should be required to issue compliant e-invoices before payment.']])}
<p class="service-closing">Talk to us about moving your invoicing onto the ETA systems.</p>`,
};

async function main() {
  const all = await prisma.contentItem.findMany({ where: { type: 'service' } });
  let updated = 0;
  for (const [titleEn, bodyEn] of Object.entries(CONTENT)) {
    const r = all.find(x => x.titleEn === titleEn);
    if (!r) { console.warn(`  ⚠ Not found: ${titleEn}`); continue; }
    await prisma.contentItem.update({ where: { id: r.id }, data: { bodyEn: bodyEn.trim() } });
    console.log(`  ✓ ${titleEn}`);
    updated++;
  }
  console.log(`\n✅ Updated ${updated} services with rich content.`);
}

main().catch(e => { console.error('❌', e); process.exit(1); }).finally(() => prisma.$disconnect());
