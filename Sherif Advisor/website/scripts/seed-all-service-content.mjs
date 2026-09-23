/**
 * Seed all service rich content into bodyEn.
 * Run: node scripts/seed-all-service-content.mjs
 */
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const prisma = new PrismaClient({ adapter });

// ── Reusable "Why choose Sherif Yousry?" block ────────────────────────────
const WHY_US = `
<h2 class="service-h2">Why choose Sherif Yousry?</h2>
<p class="service-p"><strong class="service-strong">Licensed accountants and advisers:</strong> Our team brings together licensed accountants, registered statutory auditors and certified tax experts, with more than two decades of professional experience across the Egyptian market.</p>
<p class="service-p"><strong class="service-strong">International standards:</strong> We work to International Financial Reporting Standards and International Standards on Auditing alongside Egyptian standards, so our work carries the same weight with a foreign parent, a lender or an investor as it does with the Egyptian Tax Authority.</p>
<p class="service-p"><strong class="service-strong">International tax expertise:</strong> We bring hands-on experience in double tax treaties, transfer pricing and cross-border structuring, aligned with OECD standards, to investors entering Egypt and to groups operating across borders.</p>
<p class="service-p"><strong class="service-strong">Partner-led, team-delivered:</strong> Every engagement is led by a partner and supported by a dedicated team from the initial consultation to the final deliverable, with no handoffs between departments. Clients benefit from senior-level judgement, continuity and accountability at every stage.</p>
<p class="service-p"><strong class="service-strong">Digital by design:</strong> Our services are delivered through a digital-first model. Clients can securely share documents through our client portal, track engagement progress, and connect with our team through virtual meetings, making it possible to work with us seamlessly from anywhere in the world.</p>`;

// ── Helper: steps grid ────────────────────────────────────────────────────
function steps(items) {
  return `<ol class="service-steps">${items.map(([n, t, b]) => `
  <li class="service-step">
    <span class="service-step-num">Step ${n}</span>
    <span class="service-step-title">${t}</span>
    <span class="service-step-body">${b}</span>
  </li>`).join('')}
</ol>`;
}

// ── Helper: highlight box ─────────────────────────────────────────────────
function who(body) {
  return `<div class="service-highlight">
  <span class="service-highlight-title">Who we advise</span>
  <span class="service-highlight-body">${body}</span>
</div>`;
}

// ── Helper: FAQ ───────────────────────────────────────────────────────────
function faq(items) {
  return `<div class="service-faq-list">${items.map(([q, a], i) => `
  <details class="service-faq"${i === 0 ? ' open' : ''}>
    <summary class="service-faq-q">${q}</summary>
    <p class="service-faq-a">${a}</p>
  </details>`).join('')}
</div>`;
}

// ── All service content ───────────────────────────────────────────────────
const SERVICES = [

  // ── International Taxation ──────────────────────────────────────────────
  {
    titleEn: 'International Taxation',
    body: `
<p class="service-lead">Cross-border structures that are efficient on paper and defensible in practice.</p>
<h2 class="service-h2">Treaty benefits must now be earned, not assumed</h2>
<p class="service-p">Egypt has an extensive network of double tax treaties and is a signatory to the OECD Multilateral Instrument, which adds a principal purpose test to many of them. Reduced withholding on dividends, interest, royalties and service fees is now available only where a structure has genuine substance.</p>
<p class="service-p">At the same time, the Egyptian Tax Authority is looking more closely at foreign companies whose staff, agents or projects in Egypt may create a taxable permanent establishment.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Double tax treaty relief:</strong> Analysis of treaty eligibility, documentation of tax residence and beneficial ownership, and claims for reduced withholding rates.</p>
<p class="service-p"><strong class="service-strong">Permanent establishment risk:</strong> Review of how employees, agents, projects and contracts in Egypt are organised, and practical steps to manage the risk of an unintended taxable presence.</p>
<p class="service-p"><strong class="service-strong">Cross-border payments:</strong> Tax treatment of dividends, interest, royalties, and technical and management fees paid abroad, including VAT on imported services.</p>
<p class="service-p"><strong class="service-strong">Inbound investment structuring:</strong> Choice of holding jurisdiction, financing mix and profit repatriation route for new investment in Egypt.</p>
<p class="service-p"><strong class="service-strong">Foreign tax credits and residence:</strong> Relief for foreign tax paid by Egyptian residents, and advice on the tax residence of companies and individuals.</p>
<p class="service-p"><strong class="service-strong">Expatriate taxation:</strong> Tax position of foreign employees assigned to Egypt and of Egyptian staff seconded abroad.</p>
<h2 class="service-h2">Our approach</h2>
${steps([
  ['1','Map','Chart the entities, transactions and payment flows involved.'],
  ['2','Test','Assess each flow against Egyptian law, the relevant treaty and the Multilateral Instrument.'],
  ['3','Structure','Recommend the arrangement that balances tax cost, substance and commercial needs.'],
  ['4','Document','Assemble residence certificates, substance evidence and board records that support the position.'],
])}
${who('Multinational groups investing in Egypt, foreign companies serving Egyptian customers, and Egyptian groups expanding into the Gulf and Africa.')}
${WHY_US}
<h2 class="service-h2">Questions investors ask</h2>
${faq([
  ['Does Egypt tax payments to foreign service providers?','Many payments to non-residents, including royalties, interest and a range of service fees, are subject to Egyptian withholding tax unless a treaty reduces or removes it. VAT on imported services may also apply.'],
  ['Can a foreign company have a permanent establishment in Egypt without an office?','Yes. A permanent establishment can arise, for example, through a dependent agent who concludes contracts in Egypt, or through construction or service projects that last beyond the period set in the relevant treaty.'],
  ['What does the Multilateral Instrument change?','For covered treaties, it allows treaty benefits to be denied where obtaining them was one of the principal purposes of an arrangement. Structures set up mainly for treaty access need to be reviewed.'],
])}
<p class="service-closing">Talk to us before you move money across borders.</p>`,
  },

  // ── Transfer Pricing ────────────────────────────────────────────────────
  {
    titleEn: 'Transfer Pricing',
    body: `
<p class="service-lead">Intra-group pricing that stands up to inspection in Egypt and fits the group's global policy.</p>
<h2 class="service-h2">A priority area for the Egyptian Tax Authority</h2>
<p class="service-p">Egyptian law requires transactions between related parties to follow the arm's length principle under Article 30 of the Income Tax Law and its Executive Regulations. Groups above the prescribed thresholds must prepare a master file, a local file and, where applicable, a country-by-country report.</p>
<p class="service-p">Late or missing documentation carries penalties under the Unified Tax Procedures Law, and inspection adjustments can be significant because they often span several years. The Egyptian Transfer Pricing Guidelines follow the OECD Guidelines, but local practice on comparables and management fees has features of its own.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Transfer pricing documentation:</strong> Preparation of the local file and support with the master file, in the required format and within the filing timeline.</p>
<p class="service-p"><strong class="service-strong">Country-by-country reporting:</strong> Notifications and country-by-country reports for Egyptian parent companies and constituent entities.</p>
<p class="service-p"><strong class="service-strong">Benchmarking studies:</strong> Selection of the most appropriate method, and searches for comparable companies and transactions.</p>
<p class="service-p"><strong class="service-strong">Transfer pricing policies:</strong> Pricing policies for distribution, manufacturing, services, royalties and intra-group financing, aligned with the group's value chain.</p>
<p class="service-p"><strong class="service-strong">Management fees and intra-group services:</strong> Benefit evidence and cost allocation that support the deductibility of charges in Egypt.</p>
<p class="service-p"><strong class="service-strong">Inspection defence and advance rulings:</strong> Responses to transfer pricing inspections, and requests for advance tax rulings where certainty is needed before a transaction.</p>
<h2 class="service-h2">Our approach</h2>
${steps([
  ['1','Understand','Interview management and analyse the functions, assets and risks of each entity.'],
  ['2','Benchmark','Select the method and test the pricing against comparable data.'],
  ['3','Document','Prepare files that tell a consistent story across the group.'],
  ['4','Defend','Support the position through inspection and, if needed, dispute.'],
])}
${who('Egyptian subsidiaries of multinational groups, Egyptian groups with foreign affiliates, and companies with significant transactions with shareholders or sister companies.')}
${WHY_US}
<h2 class="service-h2">Questions investors ask</h2>
${faq([
  ['Who must prepare transfer pricing documentation in Egypt?','Companies whose related-party transactions exceed the thresholds in the Executive Regulations must prepare a master file and a local file, and groups above the country-by-country threshold must file a report. All taxpayers must disclose related-party transactions in their annual return.'],
  ['Are management fees paid to a parent company deductible?','Yes, provided the company can show that the services were actually received, that they benefited the Egyptian business, and that the charge is at arm\'s length.'],
  ['How often should a benchmarking study be updated?','Comparables should be reviewed regularly and refreshed whenever the business model, the group structure or market conditions change materially.'],
])}
<p class="service-closing">Talk to us about your transfer pricing file.</p>`,
  },

  // ── Tax Dispute Resolution ───────────────────────────────────────────────
  {
    titleEn: 'Tax Dispute Resolution',
    body: `
<p class="service-lead">A disputed assessment is a negotiation with strict rules. We prepare for it from the first inspection request.</p>
<div class="service-highlight" style="background:#081222;border:none;border-radius:6px;padding:1.25rem 1.5rem;">
  <span class="service-highlight-title" style="color:#fff;font-size:15px;">The settlement window closes on 31 December 2026</span>
  <span class="service-highlight-body" style="color:#C9D1DC;">File a request under Law No. 79 of 2016 before the deadline to settle open disputes.</span>
</div>
<h2 class="service-h2">Most disputes are decided before the committee</h2>
<p class="service-p">Under the Unified Tax Procedures Law, a taxpayer who disagrees with an assessment must object within strict statutory deadlines. The dispute then moves through internal committees and Appeal Committees, and can reach the courts.</p>
<p class="service-p">The outcome largely depends on the strength of the file at inspection: reconciliations, contracts, e-invoices and board records. A missed deadline can make an assessment final regardless of its merits.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Inspection readiness:</strong> A review of your records and positions before the inspector arrives, so the file is complete and consistent.</p>
<p class="service-p"><strong class="service-strong">Managing the inspection:</strong> Attendance at inspection meetings, responses to information requests, and challenge of adjustments that the evidence does not support.</p>
<p class="service-p"><strong class="service-strong">Objections and internal committees:</strong> Technical memoranda and representation at the internal committee stage.</p>
<p class="service-p"><strong class="service-strong">Appeal Committees:</strong> Preparation of the case, supporting evidence and representation before the Appeal Committees.</p>
<p class="service-p"><strong class="service-strong">Settlement:</strong> Assessment of settlement options, including applications under Law No. 79 of 2016, currently extended to 31 December 2026.</p>
<p class="service-p"><strong class="service-strong">Litigation support:</strong> Technical tax support to legal counsel where a dispute proceeds to court.</p>
<h2 class="service-h2">Our approach</h2>
${steps([
  ['1','Assess','Review the assessment, the deadlines and the strength of each point.'],
  ['2','Prepare','Build the evidence file and the technical arguments.'],
  ['3','Represent','Present the case at each stage of the process.'],
  ['4','Resolve','Close the dispute through a decision or a negotiated settlement, whichever serves you better.'],
])}
${who('Companies facing a tax inspection or an assessment they disagree with, and investors who have acquired a company with open disputes.')}
${WHY_US}
<h2 class="service-h2">Questions investors ask</h2>
${faq([
  ['What happens if the objection deadline is missed?','The assessment can become final and enforceable, which sharply limits the options that remain. Contact an adviser as soon as you receive a notice.'],
  ['Is there a settlement scheme available now?','Yes. Law No. 79 of 2016 on the settlement of tax disputes has been extended to 31 December 2026. A settlement request must be submitted by that date; the case itself does not need to be closed by then.'],
  ['Is it better to settle or to appeal?','It depends on the amount, the strength of the evidence and the cost of time. We give you a clear view of both routes before you decide.'],
])}
<p class="service-closing">Received a tax assessment? Talk to us before the deadline runs.</p>`,
  },

  // ── Tax Due Diligence & Structuring ─────────────────────────────────────
  {
    titleEn: 'Tax Due Diligence & Structuring',
    body: `
<p class="service-lead">Know the tax you are buying before you sign, and plan the tax you will pay on exit before you invest.</p>
<h2 class="service-h2">Tax exposures transfer with the shares</h2>
<p class="service-p">When you acquire shares in an Egyptian company, you inherit its open tax years, including any unpaid tax, penalties and late-payment charges. Tax findings are one of the most common reasons for price adjustments, specific indemnities and escrow arrangements.</p>
<p class="service-p">For new investments, the choice between a share or asset deal, a subsidiary or a branch, and a free zone, an economic zone or the general regime determines the tax cost for years to come.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Buy-side tax due diligence:</strong> Review of open tax years, inspection status, disputes and compliance quality, with each exposure quantified and ranked by risk.</p>
<p class="service-p"><strong class="service-strong">Vendor tax due diligence:</strong> A tax review on the seller's side, so issues are resolved or disclosed before buyers find them and use them in negotiation.</p>
<p class="service-p"><strong class="service-strong">Deal structuring:</strong> Share versus asset deals, capital gains on share transfers including disposals by non-residents, stamp tax, VAT on asset transfers, and acquisition financing.</p>
<p class="service-p"><strong class="service-strong">Transaction documents:</strong> Tax warranties, indemnities and completion mechanisms, developed with the parties' legal counsel.</p>
<p class="service-p"><strong class="service-strong">Market-entry structuring:</strong> Entity type, investment regime and incentives available under Investment Law No. 72 of 2017.</p>
<p class="service-p"><strong class="service-strong">Post-deal integration:</strong> Alignment of the acquired company's tax processes and group policies after completion.</p>
<h2 class="service-h2">Our approach</h2>
${steps([
  ['1','Scope','Agree the areas, years and materiality that matter for the deal.'],
  ['2','Review','Examine returns, assessments, contracts and correspondence with the Authority.'],
  ['3','Quantify','Put a value and a likelihood on every exposure.'],
  ['4','Protect','Translate findings into price, warranties, indemnities or structure.'],
])}
${who('Private equity funds, strategic acquirers, family offices and Egyptian owners preparing a business for sale or investment.')}
${WHY_US}
<h2 class="service-h2">Questions investors ask</h2>
${faq([
  ['How long does a tax due diligence take?','Typically two to four weeks, depending on the number of open tax years, the quality of the records and access to management.'],
  ['Are gains on the sale of shares in an Egyptian company taxed?','Yes. Gains on unlisted shares are generally taxable, including for non-resident sellers, subject to any treaty relief. Listed shares follow a separate regime.'],
  ['What is the difference between buy-side and vendor due diligence?','Buy-side work protects the investor. Vendor work lets the seller find and fix issues first, which usually shortens the deal and supports the price.'],
])}
<p class="service-closing">Planning an acquisition or an investment in Egypt? Talk to us before the term sheet.</p>`,
  },

  // ── Tax Accounting ───────────────────────────────────────────────────────
  {
    titleEn: 'Tax Accounting',
    body: `
<p class="service-lead">Tax numbers in your financial statements that your auditor, your board and your parent company can rely on.</p>
<h2 class="service-h2">Tax is one of the most judgement-heavy lines in the accounts</h2>
<p class="service-p">Income tax balances under Egyptian Accounting Standard No. 24 and IAS 12 require judgement on deferred tax, the recoverability of tax losses and uncertain positions. Errors tend to surface as late audit adjustments or, worse, restatements.</p>
<p class="service-p">For subsidiaries of foreign groups, the Egyptian tax charge must also be reported accurately and fast in the group reporting pack.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Current tax provisions:</strong> Quarterly and year-end tax computations, reconciled to the return that will be filed.</p>
<p class="service-p"><strong class="service-strong">Deferred tax:</strong> Identification of temporary differences and assessment of deferred tax assets, including those arising from tax losses.</p>
<p class="service-p"><strong class="service-strong">Uncertain tax positions:</strong> Assessment, measurement and disclosure of uncertain tax treatments in line with IFRIC 23 for IFRS reporting.</p>
<p class="service-p"><strong class="service-strong">Effective tax rate analysis:</strong> Reconciliation of the statutory and effective tax rates for disclosures and board reporting.</p>
<p class="service-p"><strong class="service-strong">Group reporting packs:</strong> Tax sections of IFRS reporting packs for foreign parents, delivered on the group timetable.</p>
<p class="service-p"><strong class="service-strong">Audit support:</strong> Tax working papers prepared for review by your external auditor.</p>
<h2 class="service-h2">Our approach</h2>
${steps([
  ['1','Gather','Collect trial balances, fixed asset registers and prior computations.'],
  ['2','Compute','Calculate current and deferred tax and test the judgements.'],
  ['3','Reconcile','Tie the provision to the return and the effective tax rate.'],
  ['4','Report','Deliver disclosures and working papers ready for audit.'],
])}
${who('Subsidiaries of foreign groups, companies preparing for audit or investment, and finance teams without an in-house tax specialist.')}
${WHY_US}
<h2 class="service-h2">Questions investors ask</h2>
${faq([
  ['Can you prepare our tax provision if you are also our statutory auditor?','No. To protect auditor independence, where we are the statutory auditor the provision is prepared by the company or by another adviser.'],
  ['When should deferred tax be recognised on tax losses?','When it is probable that future taxable profit will be available to use the losses before they expire. This requires a supportable forecast.'],
  ['Do you work with the group\'s own tax team?','Yes. We work to the group\'s instructions, templates and timetable, and flag Egyptian-specific issues early.'],
])}
<p class="service-closing">Talk to us before your year-end close.</p>`,
  },

  // ── E-Invoicing & E-Receipt Compliance ──────────────────────────────────
  {
    titleEn: 'E-Invoicing & E-Receipt Compliance',
    body: `
<p class="service-lead">Every sale reported correctly to the Egyptian Tax Authority, in real time, without slowing your business down.</p>
<h2 class="service-h2">An invoice that is not electronic may not count</h2>
<p class="service-p">E-invoicing is mandatory for sales between businesses, and the e-receipt system for sales to consumers is being rolled out in phases. Expenses and input VAT supported by non-compliant invoices can be disallowed, and the Authority uses the data to cross-check returns.</p>
<p class="service-p">For most companies the challenge is not registration but ongoing quality: incorrect item codes, unreconciled credit notes and cancellations, and differences between the portal and the accounting system.</p>
<h2 class="service-h2">How we help</h2>
<p class="service-p"><strong class="service-strong">Onboarding:</strong> Registration on the e-invoicing and e-receipt systems, set-up of the electronic signature and the taxpayer profile.</p>
<p class="service-p"><strong class="service-strong">Item coding:</strong> Mapping of your products and services to GS1 or EGS codes.</p>
<p class="service-p"><strong class="service-strong">ERP and POS integration:</strong> Coordination with your system provider to submit documents through the ETA interface, with testing before go-live.</p>
<p class="service-p"><strong class="service-strong">Monthly reconciliation:</strong> Matching of submitted invoices, credit notes and cancellations against the books and the VAT return.</p>
<p class="service-p"><strong class="service-strong">Supplier invoice checks:</strong> Review that the purchase invoices you rely on are validly issued, protecting your deductions and input VAT.</p>
<p class="service-p"><strong class="service-strong">Training:</strong> Practical sessions for finance, sales and branch teams.</p>
<h2 class="service-h2">Our approach</h2>
${steps([
  ['1','Assess','Review your sales process, systems and document volumes.'],
  ['2','Set up','Register, code items and configure the signature.'],
  ['3','Integrate','Connect and test your ERP or POS with the ETA systems.'],
  ['4','Sustain','Reconcile monthly and resolve rejected documents quickly.'],
])}
${who('Companies registering for the first time, businesses changing their ERP, retailers moving onto e-receipts, and foreign-owned companies setting up in Egypt.')}
${WHY_US}
<h2 class="service-h2">Questions investors ask</h2>
${faq([
  ['Do export invoices need to be issued electronically?','Yes. Export sales are also issued through the e-invoicing system.'],
  ['Do we need a new accounting system?','Not necessarily. Most ERP systems can connect to the ETA interface, and low volumes can be issued directly on the ETA portal.'],
  ['What happens if a supplier does not issue an e-invoice?','The related expense and input VAT can be challenged. Suppliers should be required to issue compliant e-invoices before payment.'],
])}
<p class="service-closing">Talk to us about moving your invoicing onto the ETA systems.</p>`,
  },

  // ── Audit, Accounting & Assurance (category page) ───────────────────────
  {
    titleEn: 'Audit, Accounting & Assurance',
    body: `
<p class="service-lead">Numbers that hold up with banks, investors and the tax authority.</p>
<h2 class="service-h2">Reliable numbers are the foundation of every decision</h2>
<p class="service-p">Reliable financial statements are the basis of every tax return, bank facility and shareholder report. We keep your books, prepare your statements and provide independent assurance in line with Egyptian Accounting Standards and Egyptian Standards on Auditing.</p>
<p class="service-p">To protect independence, we do not audit a company whose books we keep.</p>
<h2 class="service-h2">What the service covers</h2>
<p class="service-p"><strong class="service-strong">Statutory Audit:</strong> Independent audit of annual financial statements for joint stock companies, limited liability companies and branches of foreign companies.</p>
<p class="service-p"><strong class="service-strong">Reviews &amp; Agreed-Upon Procedures:</strong> Limited reviews of interim financial statements and targeted procedures requested by lenders, shareholders or head offices.</p>
<p class="service-p"><strong class="service-strong">Bookkeeping &amp; Accounting:</strong> Monthly bookkeeping, bank and account reconciliations, and period-end closing on cloud accounting systems.</p>
<p class="service-p"><strong class="service-strong">Financial Statements Preparation:</strong> Annual and interim financial statements under Egyptian Accounting Standards, with IFRS reporting packs for foreign parent companies.</p>
<p class="service-p"><strong class="service-strong">Internal Audit &amp; Controls:</strong> Risk-based internal audit, process reviews and the design of internal controls over finance, procurement and inventory.</p>
<p class="service-p"><strong class="service-strong">Accounting System Set-Up:</strong> Chart of accounts, accounting policies and procedures manuals, and system implementation for newly formed entities.</p>
${WHY_US}
<p class="service-closing">Talk to us about your audit and accounting needs.</p>`,
  },

  // ── Financial Advisory (category page) ──────────────────────────────────
  {
    titleEn: 'Financial Advisory',
    body: `
<p class="service-lead">The analysis behind investment and financing decisions.</p>
<h2 class="service-h2">Decisions that stand up to scrutiny</h2>
<p class="service-p">Decisions to invest, acquire, borrow or restructure need figures that stand up to scrutiny from boards, banks and counterparties. We build that analysis and stay with you through the decision.</p>
<h2 class="service-h2">What the service covers</h2>
<p class="service-p"><strong class="service-strong">Feasibility Studies:</strong> Market, technical and financial feasibility studies for new projects, suitable for investors, banks and regulatory submissions.</p>
<p class="service-p"><strong class="service-strong">Business Valuation:</strong> Valuations of companies and shares for acquisitions, share transfers, capital increases and shareholder exits.</p>
<p class="service-p"><strong class="service-strong">Financial Due Diligence:</strong> Quality of earnings, net debt and working capital reviews for buyers and investors.</p>
<p class="service-p"><strong class="service-strong">Financial Modelling &amp; Budgeting:</strong> Integrated three-statement models, annual budgets and rolling cash-flow forecasts.</p>
<p class="service-p"><strong class="service-strong">Restructuring &amp; Working Capital:</strong> Cost reviews, cash-flow improvement and support in renegotiating debt with lenders.</p>
<p class="service-p"><strong class="service-strong">Transaction Support:</strong> Support through acquisitions and investments, from term sheet and pricing to completion accounts.</p>
${WHY_US}
<p class="service-closing">Tell us what you are planning. We will tell you what it means for your financial position.</p>`,
  },

  // ── Business, Economic & Management Advisory (category page) ────────────
  {
    titleEn: 'Business, Economic & Management Advisory',
    body: `
<p class="service-lead">A clear plan for entering and growing in Egypt.</p>
<h2 class="service-h2">Entering or expanding in Egypt</h2>
<p class="service-p">Entering or expanding in Egypt means understanding its market, its incentives and its regulators. We give foreign investors and local owners a practical plan and the organizational structure to run it.</p>
<h2 class="service-h2">What the service covers</h2>
<p class="service-p"><strong class="service-strong">Market Entry Strategy:</strong> Choice of legal entity, investment regime and location, including free zones, investment zones and the Suez Canal Economic Zone, with a step-by-step entry roadmap.</p>
<p class="service-p"><strong class="service-strong">Investment Incentives:</strong> Assessment of and applications for incentives under Investment Law No. 72 of 2017, including the Golden License.</p>
<p class="service-p"><strong class="service-strong">Business Plans:</strong> Business plans prepared for investors, banks and partners.</p>
<p class="service-p"><strong class="service-strong">Economic &amp; Sector Studies:</strong> Sector analysis, demand studies and economic assessments to support investment decisions.</p>
<p class="service-p"><strong class="service-strong">Organization &amp; Governance:</strong> Organizational structures, delegation of authority matrices and governance frameworks for family and investor-owned companies.</p>
<p class="service-p"><strong class="service-strong">Policies &amp; Procedures:</strong> Operating manuals for finance, procurement, human resources and inventory.</p>
${WHY_US}
<p class="service-closing">Tell us about your plans for Egypt. We will tell you how to structure them.</p>`,
  },

  // ── Corporate & Legal Services (category page) ───────────────────────────
  {
    titleEn: 'Corporate & Legal Services',
    body: `
<p class="service-lead">Your company formed correctly and kept in good standing.</p>
<h2 class="service-h2">From first name reservation to annual general assembly</h2>
<p class="service-p">From the first name reservation to the annual general assembly, we handle the corporate formalities that keep a company legally in good standing.</p>
<p class="service-p">Legal opinions and litigation are handled in coordination with licensed legal counsel.</p>
<h2 class="service-h2">What the service covers</h2>
<p class="service-p"><strong class="service-strong">Company Formation:</strong> Incorporation of limited liability companies, joint stock companies and one-person companies through GAFI, including name reservation, articles of association, commercial registration and tax card.</p>
<p class="service-p"><strong class="service-strong">Branches &amp; Representative Offices:</strong> Registration of branches and representative offices of foreign companies in Egypt.</p>
<p class="service-p"><strong class="service-strong">Corporate Secretarial:</strong> General assemblies, board minutes, share transfers, capital changes and commercial register amendments.</p>
<p class="service-p"><strong class="service-strong">Licensing &amp; Registrations:</strong> Sector licenses, the importers and exporters registers, and chamber of commerce memberships.</p>
<p class="service-p"><strong class="service-strong">Liquidation &amp; Deregistration:</strong> Voluntary liquidation, tax clearance and removal from the commercial register.</p>
<p class="service-p"><strong class="service-strong">Contracts Support:</strong> Commercial and employment contracts, prepared in coordination with licensed legal counsel.</p>
${WHY_US}
<p class="service-closing">Talk to us about setting up or managing your corporate structure in Egypt.</p>`,
  },

  // ── Payroll & Social Insurance (category page) ───────────────────────────
  {
    titleEn: 'Payroll & Social Insurance',
    body: `
<p class="service-lead">Payroll that is accurate every month.</p>
<h2 class="service-h2">Payroll errors cost more than money</h2>
<p class="service-p">Payroll errors cost more than money: they cost employee trust and bring penalties. We run your payroll and keep you compliant with salary tax, social insurance and labour requirements.</p>
<h2 class="service-h2">What the service covers</h2>
<p class="service-p"><strong class="service-strong">Payroll Processing:</strong> Monthly payroll calculation, payslips and bank transfer files.</p>
<p class="service-p"><strong class="service-strong">Salary Tax Compliance:</strong> Monthly salary tax withholding and the periodic and annual salary tax returns.</p>
<p class="service-p"><strong class="service-strong">Social Insurance:</strong> Employee registration and monthly contributions under Social Insurance and Pensions Law No. 148 of 2019.</p>
<p class="service-p"><strong class="service-strong">Universal Health Insurance:</strong> Calculation and payment of contributions under Law No. 2 of 2018 where the system applies.</p>
<p class="service-p"><strong class="service-strong">Expatriate Work Permits:</strong> Work permits for foreign employees and coordination of residency procedures.</p>
<p class="service-p"><strong class="service-strong">HR Policies &amp; Employment Contracts:</strong> Internal work regulations and employment contracts in line with the Egyptian Labour Law.</p>
${WHY_US}
<p class="service-closing">Talk to us about running your payroll accurately in Egypt.</p>`,
  },

  // ── E-Commerce & Digital Business (category page) ────────────────────────
  {
    titleEn: 'E-Commerce & Digital Business',
    body: `
<p class="service-lead">Tax and compliance built for digital businesses.</p>
<h2 class="service-h2">Digital businesses in Egypt face specific rules</h2>
<p class="service-p">Digital businesses in Egypt face specific rules on VAT, e-invoicing and cross-border payments. We help online sellers, platforms and non-resident digital service providers set up correctly and stay compliant.</p>
<h2 class="service-h2">What the service covers</h2>
<p class="service-p"><strong class="service-strong">Digital Business Structuring:</strong> Entity choice and operating model for online platforms, marketplaces and software businesses.</p>
<p class="service-p"><strong class="service-strong">VAT for Non-Resident Digital Services:</strong> Simplified VAT registration and filing for foreign providers selling digital services to consumers in Egypt.</p>
<p class="service-p"><strong class="service-strong">E-Invoicing &amp; E-Receipt Set-Up:</strong> Integration of online sales systems with the ETA e-invoice and e-receipt platforms.</p>
<p class="service-p"><strong class="service-strong">Online Seller Tax Compliance:</strong> Tax registration and compliance for e-commerce sellers and content creators.</p>
<p class="service-p"><strong class="service-strong">Cross-Border Payments &amp; Withholding Tax:</strong> Tax treatment of payments to foreign platforms for advertising, software and cloud services.</p>
<p class="service-p"><strong class="service-strong">Digital Accounting &amp; Automation:</strong> Cloud accounting and ETA-integrated systems that reduce manual work.</p>
${WHY_US}
<p class="service-closing">Talk to us about the tax obligations of your digital business in Egypt.</p>`,
  },
];

// ── Run ───────────────────────────────────────────────────────────────────
async function main() {
  const all = await prisma.contentItem.findMany({ where: { type: 'service' } });

  let updated = 0;
  for (const svc of SERVICES) {
    const record = all.find(r => r.titleEn === svc.titleEn);
    if (!record) { console.warn(`  ⚠ Not found: ${svc.titleEn}`); continue; }
    await prisma.contentItem.update({
      where: { id: record.id },
      data: { bodyEn: svc.body.trim() },
    });
    console.log(`  ✓ ${svc.titleEn}`);
    updated++;
  }
  console.log(`\n✅ Done. Updated ${updated}/${SERVICES.length} services.`);
}

main()
  .catch(e => { console.error('❌', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
