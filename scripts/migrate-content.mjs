/**
 * One-time content migration: uploads assets and creates the 3 case-study +
 * 2 proposal documents in Sanity, transcribed from the original static HTML.
 *
 * Auth: uses your Sanity CLI login token (run `npx sanity login` first).
 * Idempotent: documents use fixed _ids (createOrReplace); uploaded assets are
 * cached in scripts/.asset-manifest.json so re-runs don't duplicate uploads.
 *
 * Usage: node scripts/migrate-content.mjs
 */
import { createClient } from '@sanity/client';
import { createReadStream, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const PROJECT_ID = '71kxkqkh';
const DATASET = 'production';
const CDN = 'cdn.prod.website-files.com/621d3937308a160b5f994de9';
const MANIFEST_PATH = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '.asset-manifest.json',
);

function cliToken() {
  const candidates = [
    path.join(homedir(), 'Library/Application Support/sanity/config.json'),
    path.join(homedir(), '.config/sanity/config.json'),
  ];
  for (const p of candidates) {
    if (existsSync(p)) {
      const cfg = JSON.parse(readFileSync(p, 'utf8'));
      if (cfg.authToken) return cfg.authToken;
    }
  }
  throw new Error('No Sanity CLI token found — run `npx sanity login`.');
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2026-07-01',
  token: process.env.SANITY_WRITE_TOKEN ?? cliToken(),
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Assets: key → { src, type } (type defaults to 'image')
// ---------------------------------------------------------------------------
const ASSETS = {
  // Ancestry
  'ancestry-logo.svg': { src: `${CDN}/6220e198fcf6d1086847a04f_Frame 55.svg` },
  'ancestry-card.png': { src: `${CDN}/62218ff02152156b76b195e6_Mask group (7).png` },
  'ancestry-logo-small.svg': { src: `${CDN}/6220e1984ad9c6a8ac1d3090_Frame 58.svg` },
  'ancestry-existing-flow.png': { src: `${CDN}/6220e196025daf590d86d52b_Frame 95.png` },
  'ancestry-flow-annotated.png': { src: `${CDN}/6220e19a086f7f38d4582503_Frame 129.png` },
  'ancestry-competitive-analysis-thumb.png': { src: `${CDN}/6222eff298ac9d2a8e97a7db_564564.png` },
  'ancestry-competitive-analysis.pdf': { src: `${CDN}/6226404735934d7487f00626_compet-analysis.pdf`, type: 'file' },
  'ancestry-comparative-analysis-thumb.png': { src: `${CDN}/6222eff2100cfef0611f9ec1_77654456.png` },
  'ancestry-comparative-analysis.pdf': { src: `${CDN}/62264058752fd66d2caf9ffa_compar-analysis.pdf`, type: 'file' },
  'ancestry-scope-doc.png': { src: `${CDN}/6220e196ae4c887c875e70e5_Frame 44.png` },
  'ancestry-questions.png': { src: `${CDN}/622641d93ffa8cd5a0e6fbc5_qs.png` },
  'ancestry-questions.pdf': { src: `${CDN}/622641b28047bc6ae788c0e0_qs.pdf`, type: 'file' },
  'ancestry-concept-themes.png': { src: `${CDN}/6222f6c973c393c140305854_image 10.png` },
  'ancestry-sketch-1.png': { src: `${CDN}/6220e19a616e1be96a98e033_Frame 109.png` },
  'ancestry-sketch-2.png': { src: `${CDN}/6220e1999fe8fe44876c3c10_Frame 117.png` },
  'ancestry-sketch-3.png': { src: `${CDN}/6220e19ad9d5b9b112c705a0_Frame 114.png` },
  'ancestry-sketch-4.png': { src: `${CDN}/6220e1994eb7bcc1153f66b7_Frame 121.png` },
  'ancestry-sketch-5.png': { src: `${CDN}/6220e199f6406430015a7e2f_Frame 123.png` },
  'ancestry-concept-chatbot.png': { src: `${CDN}/6220e1974ad9c6a48a1d308f_Frame 99.png` },
  'ancestry-concept-countdown.png': { src: `${CDN}/6220e1974ad9c653141d308e_Frame 98.png` },
  'ancestry-sketch-chatbot.png': { src: `${CDN}/622374cf4625dd84e16e8200_bdsfgdfgfds.png` },
  'ancestry-sketch-yearbook.png': { src: `${CDN}/622374998ddf914ae9d7cdc2_afsgfsdgdfg.png` },
  'ancestry-sketch-record-tour.png': { src: `${CDN}/6223749973c3934cca32df27_tewrtryujhgf.png` },
  'ancestry-sketch-obituary.png': { src: `${CDN}/62237746d8b8d2b85b1c8641_rtjhfjdg.png` },
  'ancestry-sketch-search.png': { src: `${CDN}/62237746a1dfe220af41c161_jdjhtydtrdu.png` },
  'ancestry-sketch-next-steps.png': { src: `${CDN}/62237746d0dea89c609da669_fjdysaersty.png` },
  'ancestry-sketch-plan-select.png': { src: `${CDN}/62237b03508be06756caad5b_Frame 48.png` },
  'ancestry-sketch-gifting.png': { src: `${CDN}/62237b0f0fc48564871830d7_Frame 49.png` },
  'ancestry-sketch-upgrade.png': { src: `${CDN}/62237b3794125f6ddd041941_Frame 50.png` },
  'ancestry-final-labelling.png': { src: `${CDN}/6220e19735c83def21d6c799_Frame 103.png` },
  'ancestry-final-paywall.png': { src: `${CDN}/6220e1976e41b211a3f2da9d_Frame 104.png` },
  'ancestry-final-next-steps.png': { src: `${CDN}/6220e19714a193d77aebdc21_Frame 105.png` },
  // Lendio
  'lendio-logo.svg': { src: `${CDN}/6220e198c66b37a1760bdab6_Frame 57.svg` },
  'lendio-card.png': { src: `${CDN}/62213d8e02d86062e0a1ab98_Mask group (5).png` },
  'lendio-logo-small.svg': { src: `${CDN}/6220e1989fe8fed4996c3c0e_Frame 59.svg` },
  'lendio-page-audit.png': { src: `${CDN}/6220e1968dce3d4bd6fa82e2_Frame 79.png` },
  'lendio-ds-interviews.png': { src: `${CDN}/62264cf29ae58b38dcbb56f0_DS Interviews.png` },
  'lendio-implementation-plan.png': { src: `${CDN}/6223c99a7d1841e627509712_ffgdssss.png` },
  'lendio-implementation-plan-full.svg': { src: `${CDN}/62263dbc2427ad284a805747_proposal.svg` },
  'lendio-comparative.png': { src: `${CDN}/6223ca37324d2cdcf1e038d4_image 32.png` },
  'lendio-stress-test.png': { src: `${CDN}/6223cba328953e5e65555738_image 33.png` },
  'lendio-side-by-side.png': { src: `${CDN}/622632da70491e3cf9d28d25_image 2.png` },
  'lendio-v1-styles.png': { src: `${CDN}/6223cfcd786212b17a24c4be_image 30.png` },
  'lendio-v1-components.png': { src: `${CDN}/6223d0484711809e1b8bbc42_lllklkljhgg.png` },
  'lendio-governance.png': { src: `${CDN}/6223d0e57d1841b53550c7c0_Copy of Design System Governance (Part 2) 1.png` },
  'lendio-governance-full.svg': { src: `${CDN}/62263e273169f45c8f4ae591_governance.svg` },
  // BYU
  'byu-logo.svg': { src: `${CDN}/6220e19af645adddcfe649aa_Frame 56.svg` },
  'byu-card.png': { src: `${CDN}/62213da882467f691bd67c0e_Mask group (6).png` },
  'byu-student-workflow.png': { src: `${CDN}/62263259d1248fe1cd8e363e_gffghhgf.png` },
  'byu-librarian-workflow.png': { src: `${CDN}/6226338a47bbc2333d8a78c4_dhfgjkfgfdgsadfghjhds.png` },
  'byu-student-wireframes.png': { src: `${CDN}/62263438c664c36390e9376d_dghfjdfdhfg.png` },
  'byu-librarian-wireframes.png': { src: `${CDN}/62263461739a5719119c6c2f_rtetyutjdf.png` },
  'byu-student-hifi.png': { src: `${CDN}/622634d058eda0d970fb870c_Bitmap.png` },
  'byu-librarian-hifi.png': { src: `${CDN}/622634f85460dd108de20412_Group 26.png` },
  // Proposals
  'agilecio-logo.png': { src: 'proposals/theagilecio/images/the-agile-cio-logo.png' },
};

async function uploadAssets() {
  const manifest = existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
    : {};
  for (const [key, { src, type = 'image' }] of Object.entries(ASSETS)) {
    if (manifest[key]) continue;
    const abs = path.join(REPO_ROOT, src);
    if (!existsSync(abs)) throw new Error(`Missing source file: ${abs}`);
    process.stdout.write(`Uploading ${key} … `);
    const asset = await client.assets.upload(type, createReadStream(abs), { filename: key });
    manifest[key] = { _id: asset._id, url: asset.url };
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
    console.log('done');
  }
  return manifest;
}

// ---------------------------------------------------------------------------
// Portable-text helpers
// ---------------------------------------------------------------------------
let keyCounter = 0;
const key = () => `k${(++keyCounter).toString(36).padStart(4, '0')}`;

/**
 * rich(style, ...parts): one block. Parts: string | {b: string} | {em: string}
 * | {il: string} (inline-link span) | {link: {text, href, blank?}}.
 */
function rich(style, ...parts) {
  const markDefs = [];
  const children = parts.flatMap((part) => {
    if (typeof part === 'string') {
      // "\n" must be its own span to render as a hard break (<br>)
      return part
        .split(/(\n)/)
        .filter(Boolean)
        .map((text) => ({ _type: 'span', _key: key(), text, marks: [] }));
    }
    if (part.b) return { _type: 'span', _key: key(), text: part.b, marks: ['strong'] };
    if (part.em) return { _type: 'span', _key: key(), text: part.em, marks: ['em'] };
    if (part.il) return { _type: 'span', _key: key(), text: part.il, marks: ['inlineLink'] };
    if (part.link) {
      const defKey = key();
      markDefs.push({
        _type: 'link',
        _key: defKey,
        href: part.link.href,
        blank: part.link.blank !== false,
      });
      return { _type: 'span', _key: key(), text: part.link.text, marks: [defKey] };
    }
    throw new Error(`Unknown rich part: ${JSON.stringify(part)}`);
  });
  return { _type: 'block', _key: key(), style, children, markDefs };
}

const p = (...parts) => rich('normal', ...parts);
const grey = (...parts) => rich('grey', ...parts);
const h3 = (text) => rich('h3', text);
const h4 = (text) => rich('h4', text);
const largeBold = (text) => rich('largeBold', text);

function listItem(listType, ...parts) {
  return { ...rich('normal', ...parts), listItem: listType, level: 1 };
}
const bullets = (...items) =>
  items.map((item) => listItem('bullet', ...(Array.isArray(item) ? item : [item])));
const numbers = (...items) =>
  items.map((item) => listItem('number', ...(Array.isArray(item) ? item : [item])));

// ---------------------------------------------------------------------------
// Object helpers (asset refs resolved after upload)
// ---------------------------------------------------------------------------
let manifest = {};
const imageRef = (assetKey) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: manifest[assetKey]._id },
});
const fileRef = (assetKey) => ({
  _type: 'file',
  asset: { _type: 'reference', _ref: manifest[assetKey]._id },
});

const section = (heading, content, opts = {}) => ({
  _type: 'dottedSection',
  _key: key(),
  heading,
  headingLevel: opts.headingLevel ?? 'h2',
  anchorId: opts.anchorId,
  content,
});

const figure = (assetKey, opts = {}) => ({
  _type: 'imageFigure',
  _key: key(),
  image: imageRef(assetKey),
  alt: opts.alt ?? '',
  style: opts.style ?? 'photo',
  label: opts.label,
  expandIcon: opts.expandIcon ?? false,
  ...(opts.lightbox ? { lightboxImage: imageRef(opts.lightbox) } : {}),
  ...(opts.pdf ? { linkToPdf: fileRef(opts.pdf) } : {}),
});

const scroller = (...assetKeys) => ({
  _type: 'imageScroller',
  _key: key(),
  images: assetKeys.map((k) => ({
    _type: 'scrollerImage',
    _key: key(),
    image: imageRef(k),
    alt: '',
  })),
});

const pdfRow = (left, right) => ({
  _type: 'pdfCardRow',
  _key: key(),
  left: { _type: 'pdfCard', label: left.label, thumbnail: imageRef(left.thumb), pdf: fileRef(left.pdf) },
  ...(right
    ? { right: { _type: 'pdfCard', label: right.label, thumbnail: imageRef(right.thumb), pdf: fileRef(right.pdf) } }
    : {}),
});

const labeled = (label, text, variant = 'default') => ({
  _type: 'labeledText',
  _key: key(),
  label,
  text,
  variant,
});

const processStep = (number, heading, intro, activities, deliverables) => ({
  _type: 'processStep',
  _key: key(),
  number,
  heading,
  anchorId: `step-${number}`,
  intro,
  activitiesDeliverables: { _type: 'activitiesDeliverables', activities, deliverables },
});

const conceptGrid = (headingPrefix, headingSuffix, hypothesis, cards) => ({
  _type: 'conceptGrid',
  _key: key(),
  headingPrefix,
  headingSuffix,
  hypothesis,
  cards: cards.map((c) => ({
    _type: 'conceptCard',
    _key: key(),
    image: imageRef(c.img),
    imageStyle: c.imageStyle ?? 'paperProto',
    title: c.title,
    statusText: c.statusText,
    status: c.status,
    ...(c.credit ? { credit: c.credit } : {}),
  })),
});

const testBlock = (text, opts = {}) => ({
  _type: 'testBlock',
  _key: key(),
  text,
  subtext: opts.subtext,
  orientation: opts.vert ? 'vert' : 'horizontal',
});

const subhead = (text, dotPosition = 'default') => ({
  _type: 'dottedSubhead',
  _key: key(),
  text,
  dotPosition,
});

const kpi = (value, subValue, label) => ({ _type: 'kpiCard', _key: key(), value, subValue, label });

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
function buildAncestry() {
  return {
    _id: 'caseStudy-ancestry-onboarding',
    _type: 'caseStudy',
    title: 'Product Onboarding',
    company: 'Ancestry.com',
    companyLogo: imageRef('ancestry-logo.svg'),
    slug: { _type: 'slug', current: 'ancestry/onboarding' },
    teamMembers: '7 UI Teams\n2 PMs\n1 UX',
    myRoles: 'UX Research & Testing\nUX Design\nAnimation/Video Editing',
    card: {
      image: imageRef('ancestry-card.png'),
      logoSmall: imageRef('ancestry-logo-small.svg'),
      cardTitle: 'Product Onboarding',
      outcomeBlurb: '~$15 million increase in revenue.',
      order: 1,
    },
    seo: {
      metaTitle: 'Ancestry Product Onboarding • Utah UX',
      metaDescription:
        'UX case study: 18 months of iterative onboarding design at Ancestry.com resulting in ~$15 million of projected revenue.',
    },
    outcome: {
      intro: [
        p(
          'The collection of concepts that won both qualitatively and quantitatively were launched to production. These concepts were all featured in the pitch deck that helped Ancestry sell to Blackrock for $4 billion dollars. Here is why:',
        ),
      ],
      kpiLabel: 'KPI RESULTS',
      kpis: [
        kpi('+6.3%', '+8.5% on mobile', 'Bill-thru Rate'),
        kpi('+18%', 'N/A', 'Onboard Completion Rate'),
        kpi('-8%', '-12.1% on mobile', 'Day 0 Cancel Rate'),
      ],
      netProfitLabel: 'NET PROFIT',
      netProfit: [
        rich('normal', '~$15 Million in revenue over the next 4 years alone', { il: '*' }, '.'),
      ],
      disclaimer: 'Based upon projections for 2020-2024.',
    },
    body: [
      section('Summary', [
        p(
          'Nearly a dozen concepts that aligned with business and customer goals were design, tested, and shipped over the course of 18 months ',
          { b: 'resulting in an est. ~$15 million of revenue' },
          ' over a four-year span.',
          { il: '* ' },
        ),
        grey({ il: '*' }, ' Based upon projections for 2020-2024.'),
      ]),
      section('Context', [
        p(
          'Ancestry.com has two product lines: family history record subscriptions, and DNA tests. This particular onboarding initiative was specific to the family history record subscription business. This was a team effort. Special thanks to ',
          { link: { text: 'Liz Brown', href: 'https://www.linkedin.com/in/llizbrown/' } },
          ', ',
          { link: { text: 'Josh Harman', href: 'https://www.linkedin.com/in/josh-harman-88473b13/' } },
          ', ',
          { link: { text: 'Jasmine Sarkhazi', href: 'https://www.linkedin.com/in/jasminesarkhazi/' } },
          ', ',
          { link: { text: 'Jeff Alton', href: 'https://www.linkedin.com/in/jeffalton/' } },
          ', and the Groot Team for their endless collaboration, support, and feedback as we worked on these initiatives together.',
        ),
      ]),
      section('Timeline', [
        largeBold('February 2019–October 2020'),
        grey('Total Elapsed Time: ~18 months'),
      ]),
      section('Customer & Business Problems', [
        labeled('FOR THE CUSTOMER', [
          p({ b: 'As a new customer' }, ', I don’t know how Ancestry.com works, where to start, or what to do next.'),
        ]),
        labeled('FOR THE BUSINESS', [
          p({ b: 'As a business' }, ', I need to increase bill-thru rate of new customers and find ways to encourage long-term customer retention.'),
        ]),
      ]),
      section('Project KPIs', [
        ...numbers(
          'Increase bill-thru rate—the number of free-trialers who complete their trial period with a subscription—by 5%.',
          'Reduce day-0 cancellations.',
        ),
      ]),
      processStep(
        1,
        'Learn + Map',
        [
          p(
            'Together, my PM and I began by mapping out existing onboarding flow(s) that led customers into the family history record subscription product. We then gathered any existing data we could find—both qual. and quant. From there, we broke the customer journey flows down into sections that appeared to provide the best opportunity for improvements to the KPIs—while also improving the customer experience. Finally, we generated a list of questions/hypotheses that we wanted to find answers to.',
          ),
        ],
        [
          'Identifying desired outcomes & KPIs',
          'Mapping out the existing flow(s)',
          'Gathering previous qual. research',
          'Gathering previous quant. research',
          'Compiling unanswered questions',
          'Conducting intent surveys',
          'Conducting user observation',
          'Competitive & Comparative Analysis',
        ],
        [
          'Overview of existing flow & entry points',
          'Summary of existing qual. research',
          'Gathering previous qual. research',
          'List of questions to answer',
          'Survey of results summary & next steps',
          'Summary of user observations',
          'Comparative & Competitive Ana. Results',
        ],
      ),
      section('Existing Flow Diagramming', [
        p(
          'My PM and I spoke with stakeholders in marketing, product, and development to get as complete a picture over the system-level flow of the current onboarding experience. He and I created the following chart to explain the complexity of the onboarding experience at a quick glance. Before creating the graphic, Liz, Josh, and I—mostly Liz—printed out as many pages of the flow we could and annotated them with sticky notes.',
        ),
        figure('ancestry-existing-flow.png', { style: 'shadowFigma' }),
        figure('ancestry-flow-annotated.png', { style: 'photo' }),
      ]),
      section('Competitive & Comparative Analysis', [
        p(
          'This project was highly iterative. We conducted generative research (',
          { link: { text: '1. Learn + Map', href: '#step-1', blank: false } },
          '), tested prototypes with potential customers (',
          { link: { text: '2. Design + Test', href: '#step-2', blank: false } },
          '), shipped concepts via A/B tests (',
          { link: { text: '3. Launch + Learn', href: '#step-3', blank: false } },
          ') and began the process over again. These competitive and comparative analyses were a part of a second round of onboarding research I conducted.',
        ),
        pdfRow(
          { label: 'COMPETITIVE ANALYSIS', thumb: 'ancestry-competitive-analysis-thumb.png', pdf: 'ancestry-competitive-analysis.pdf' },
          { label: 'COMPARATIVE ANALYSIS', thumb: 'ancestry-comparative-analysis-thumb.png', pdf: 'ancestry-comparative-analysis.pdf' },
        ),
      ]),
      section('Scope Clarification Doc', [
        p(
          "The scope and objective of the onboarding initiative wasn't this clear at the beginning of the project, and this was created afterward to help other teams better understand our space. Initially, my PMs and I had to narrow down what sections of the flow/audiences we were going to focus on. It was messy.",
        ),
        figure('ancestry-scope-doc.png', { style: 'scopeDoc' }),
      ]),
      section('List of Questions / Hypotheses', [
        p(
          'After having documented the existing flow. Theses were some of the questions we sought to answer through our research.',
        ),
        figure('ancestry-questions.png', { style: 'questions', expandIcon: true, pdf: 'ancestry-questions.pdf' }),
      ]),
      processStep(
        2,
        'Design + Test',
        [
          p(
            'Once we had identified the target audience—free-trialers without family trees—through the quantitative data we gathered, we began to generate concepts to test at each stage in the onboarding process. We began with paper prototypes, and moved on to high-fidelity prototypes—since Ancestry had a design system in place.',
          ),
        ],
        [
          'Concept Theme Generation',
          'Paper prototype & sketch creation',
          'Visual design mockup creation',
          'Flowcharting new flow',
        ],
        ['Prioritized concepts', 'Paper sketches & prototypes', 'Visual design mockups', 'Updated flow chart(s)'],
      ),
      section('Theme Creation & Early Sketches', [
        p(
          'After generating the following concepts as a team, we then grouped the ideas into four broad themes and began sketching concepts.',
        ),
        figure('ancestry-concept-themes.png', { style: 'plain', label: 'CONCEPT THEMES' }),
      ]),
      section(
        'Paper Sketches & Flows',
        [
          rich(
            'normal',
            'Once we had prioritized which concepts we thought would do best at increasing bill-thru rate and reducing day-0 cancellations, I began creating paper prototypes of these concepts so we could test.',
          ),
          scroller('ancestry-sketch-1.png', 'ancestry-sketch-2.png', 'ancestry-sketch-3.png', 'ancestry-sketch-4.png', 'ancestry-sketch-5.png'),
        ],
        { headingLevel: 'h4' },
      ),
      section('Qualitative & Quantitative Testing', [
        p(
          'After creating paper prototypes, we tested each concept qualitatively. Whichever concepts tested well qualitatively, we then tested quantitatively with a live A/B test on the site.',
        ),
        {
          _type: 'statusKey',
          _key: key(),
          label: 'KEY',
          entries: [
            {
              _type: 'statusKeyEntry',
              _key: key(),
              statusText: 'Failed Quant.(Learning)',
              status: 'failure',
              description:
                'Concepts with this label were tested live on the site in an A/B test and failed to increase bill-thru rate or reduce day-0 cancellations against the control.',
            },
            {
              _type: 'statusKeyEntry',
              _key: key(),
              statusText: 'Success Quant./Qual.',
              status: 'success',
              description:
                'Concepts with this label were tested live on the site in an A/B test and increase bill-thru rate or reduced day-0 cancellations against the control.',
            },
            {
              _type: 'statusKeyEntry',
              _key: key(),
              statusText: 'Saved (Not Coded)',
              status: 'savedForLater',
              description: 'Concepts with this label were saved to test later.',
            },
          ],
        },
      ]),
      conceptGrid(
        'EXISTING PROTOTYPES',
        'THEME #1 • INCREASE GUIDANCE / GIVE CONTEXT',
        [
          rich(
            'normal',
            { b: 'Hypothesis:' },
            ' If we offer a quick and easy way to get going with adding information to their family tree—users will be more likely to enter into—and stay within—the discovery flywheel. Also, if customers know how much time they have left, urgency will lead to engagement.',
          ),
        ],
        [
          {
            img: 'ancestry-concept-chatbot.png',
            imageStyle: 'screenshot',
            title: 'Chatbot for Tree Building',
            statusText: 'Failed Quant.(Learning)',
            status: 'failure',
            credit: "This was an existing onboarding code prototype that hadn't been tested yet. I didn't create this.",
          },
          {
            img: 'ancestry-concept-countdown.png',
            imageStyle: 'screenshot',
            title: 'Free Trial Countdown',
            statusText: 'Success Quant. (Learning)',
            status: 'success',
            credit: "This was an existing onboarding code prototype that hadn't been tested yet. I didn't create this.",
          },
        ],
      ),
      testBlock('Tested with potential customers who had never used Ancestry before.'),
      conceptGrid(
        'PAPER PROTOTYPES',
        'THEME #2 • OPTIMIZE VALUE',
        [
          rich(
            'normal',
            { b: 'Hypothesis: ' },
            'By providing value earlier in the onboarding experience—such as yearbook photos or surname insights—users will feel rewarded and will be more likely to continue on to enter into the discovery flywheel (Seeing a record that has family info in it, and then seeing another etc.).',
          ),
        ],
        [
          {
            img: 'ancestry-sketch-chatbot.png',
            title: 'Chatbot for Tree Building',
            statusText: 'Failed Quant. (Learning)',
            status: 'failure',
            credit: 'Sketch credit: Liz Brown',
          },
          { img: 'ancestry-sketch-yearbook.png', title: 'Yearbook Discovery', statusText: 'Saved (Not Coded)', status: 'savedForLater' },
          {
            img: 'ancestry-sketch-record-tour.png',
            title: 'Record Tour',
            statusText: 'Saved (Not Coded)',
            status: 'savedForLater',
            credit: 'Concept credit: Josh Harman',
          },
        ],
      ),
      testBlock('Tested with potential customers who had never used Ancestry before.'),
      conceptGrid(
        'PAPER PROTOTYPES',
        'THEME #3 • INCREASE DISCOVERY RATE',
        [
          rich(
            'normal',
            { b: 'Hypothesis: ' },
            'By decreasing the time to first discovery—hint, first value, or first search—customers will see a quicker return on investment, will be willing to invest more, and eventually be more likely to bill through (Sign up for a record subscription).',
          ),
        ],
        [
          { img: 'ancestry-sketch-obituary.png', title: 'Obituary Hints', statusText: 'Saved (Not Coded)', status: 'savedForLater' },
          { img: 'ancestry-sketch-search.png', title: 'Early Intro to Search', statusText: 'Success Quant. (Learning)', status: 'success' },
          { img: 'ancestry-sketch-next-steps.png', title: 'Next Best Steps', statusText: 'Success Quant. (Learning)', status: 'success' },
        ],
      ),
      testBlock('Tested with potential customers who had never used Ancestry before.'),
      conceptGrid(
        'PAPER PROTOTYPES',
        'THEME #4 • REDUCE PAYWALL FRICTION',
        [
          rich(
            'normal',
            { b: 'Hypothesis: ' },
            'By clarifying and simplifying the value propositions for each plan—and making upgrading easy—users will be more likely to choose a plan, create an account, and eventually bill through (Sign up for a record subscription).',
          ),
        ],
        [
          { img: 'ancestry-sketch-plan-select.png', title: 'Simple Plan Select', statusText: 'Success Qual. (Learning)', status: 'success' },
          { img: 'ancestry-sketch-gifting.png', title: 'Gifting Records', statusText: 'Saved (Not Coded)', status: 'savedForLater' },
          { img: 'ancestry-sketch-upgrade.png', title: 'Option to upgrade', statusText: 'Saved (Not Coded)', status: 'savedForLater' },
        ],
      ),
      section('Selection of Final Deliverables', [
        p(
          'After iterating and testing with customers repeatedly, we were able to identify and build those concepts on the site and test them against the existing onboarding experience on production.',
        ),
        subhead('LABELLING RECORDS WITH PLAN NAMES DURING FREE TRIAL', 'first'),
        rich(
          'normal',
          { b: 'Hypothesis: ' },
          'If we show potential customers which records belong to which plans, and give them an upfront and simple way to sign up for a free trial, they will be more likely to purchase a subscription when the time comes.',
        ),
        figure('ancestry-final-labelling.png', { style: 'photo' }),
        subhead('REDESIGNING THE PLAN SELECTION PAGE AND PAYWALL PAGES', 'final-del'),
        rich(
          'normal',
          { b: 'Hypothesis: ' },
          'If we simplify and unify the paywall pages and plan selection page, customers will be more likely to sign up for a free trial or subscription. ',
        ),
        figure('ancestry-final-paywall.png', { style: 'photo' }),
        subhead('PROVIDING NEXT BEST STEPS PROMPTS & GUIDANCE', 'final-del'),
        rich(
          'normal',
          { b: 'Hypothesis: ' },
          'If we show users how to begin getting hints and how to use search, then they will be more likely to have success finding records. If they have greater success finding records, then they will be more likely to bill-thru after their trial.',
        ),
        figure('ancestry-final-next-steps.png', { style: 'photo' }),
        subhead('ANIMATED "HOW ANCESTRY WORKS" VIDEO', 'final-del'),
        rich(
          'normal',
          { b: 'Hypothesis: ' },
          'If we offer a quick overview of how building a family tree allows Ancestry to find records about their family, then when we ask them to start building a family tree, they will know why they are building a tree. If they build a tree, then they will be more likely to receive Hints (discoveries) and eventually bill-thru.',
        ),
        { _type: 'videoEmbed', _key: key(), youtubeId: 'cFdFkzt45Xw', title: 'How does Ancestry work? | Ancestry' },
      ]),
      processStep(
        3,
        'Launch + Learn',
        [
          p(
            'Several of these concepts were launched at once, while a majority were A/B tested as individual concepts. I supported the developers in implementation across ',
            { b: '7 different dev teams' },
            ' and monitored the analytics in relation to the project KPIs.',
          ),
        ],
        ['Design to development hand off', 'Design implementation support', 'Quantitative data analysis'],
        ['Dev support services', 'KPI data reports'],
      ),
      {
        _type: 'lessonsLearned',
        _key: key(),
        heading: 'Lessons Learned',
        items: [
          'Failure is learning in disguise.',
          'Many small improvements can net large overall improvements for the customer and the business.',
          'It is important for me to pace myself and not get so carried away in the excitement of new projects that I burn myself out.',
          'Cross-team alignment is hard, but it is a lot easier—both for the teams you serve, and yourself—if you focus on how what you’re building can help them reach their goals.',
        ],
      },
    ],
  };
}

function buildLendio() {
  return {
    _id: 'caseStudy-lendio-design-system',
    _type: 'caseStudy',
    title: 'Design System',
    company: 'Lendio.com',
    companyLogo: imageRef('lendio-logo.svg'),
    slug: { _type: 'slug', current: 'lendio/design-system' },
    teamMembers: '1 Dev Team\n1 Sr. UX\n1 UX',
    myRoles: 'Sr. UX System Strategy\nGlobal Component Design\nComponent Assembly',
    card: {
      image: imageRef('lendio-card.png'),
      logoSmall: imageRef('lendio-logo-small.svg'),
      cardTitle: 'Lendio Design System',
      outcomeBlurb: 'Dev & UX efficiency/consistency',
      order: 2,
    },
    seo: {
      metaTitle: 'Lendio Design System • Utah UX',
      metaDescription:
        'UX case study: creating a scalable, reusable design system adopted by all product teams at Lendio.',
    },
    outcome: {
      intro: [
        p(
          { b: 'We accomplished our designated charter!' },
          ' 🎉\nWhile I led the process, this was a massive team effort across development, marketing, and other designers on the design team.\n\nAs of April 2021, the system was instated as the core design system for all Lendio product and marketing design teams—maintained by both development and design.',
        ),
      ],
    },
    body: [
      section('Summary', [
        p(
          { link: { text: 'Jessica Lim', href: 'https://www.linkedin.com/in/jessicablim/' } },
          ' and I collaborated with stakeholders in marketing, development, and product to create a scalable, reusable, and maintainable design system that was adopted by all product teams at Lendio.',
        ),
      ]),
      section('Context', [
        p(
          'At Lendio, designers are divided up into pairs and given responsibilities beyond their work projects to help build the culture of the design team. My culture team role was to partner with my fellow UX team member, ',
          { link: { text: 'Jessica Lim', href: 'https://www.linkedin.com/in/jessicablim/' } },
          ', to create a design system for Lendio/Sunrise designers and developers—across marketing, customer-facing product apps, and internal apps.',
        ),
      ]),
      section('Timeline', [largeBold('December 2020–April 2021'), grey('Total Elapsed Time: ~4 months')]),
      section('Customer & Business Problems', [
        labeled('FOR THE CUSTOMER(S)', [
          p(
            { b: 'As a designer at Lendio/Sunrise, ' },
            'I keep recreating the same components, typographic styles, and card layouts again and again. Even worse, other designers on the team are simultaneously creating similar components—all of which get past on to the developers who then create one-off versions of each similar component.',
          ),
          p(
            { b: 'As a developer at Lendio/Sunrise, ' },
            'I keep rebuilding the same components, typographic styles, and card layouts again and again. Even worse, other developers across the organization are also creating similar components—creating one-off versions of each similar components throughout the code base. This make maintenance a nightmare and creates tech debt.',
          ),
          p(
            { b: 'As a customer coming to Lendio.com or Sunrise.com, ' },
            "I get confused when i see different colors and styles applied across what I thought was the same site. As a result, I don't trust Lendio as much because I can't tell if the site is secure and being well-maintained. I'm not sure I can trust Lendio.",
          ),
        ]),
        labeled('FOR THE BUSINESS', [
          p(
            { b: 'As a business, ' },
            'when designers and developers spend duplicative time designing the same UI elements, and then each development team spends additionally duplicative time building those same elements, we lose money to technical debt and maintenance costs. We also can’t build products as quickly as a result.',
          ),
        ]),
      ]),
      section('Our Charter', [
        ...numbers(
          'Produce a basic scalable, reusable, and maintainable design system that standardizes components—e.g. buttons and form elements—along with typography, colors, and spacing styles and standards.',
          'Work with development to create these same components and styles in code and set up a governance system for adding/updating/removing components into the future.',
        ),
      ]),
      processStep(
        1,
        'Learn + Map',
        [
          p(
            'Together, Jessica and I began by documenting all of the existing pages across the entire Lendio ecosystem—both product apps and marketing pages. From there, we identified all of the different typographic styles being used across all of these pages, along with the padding/margin amounts between elements.',
          ),
        ],
        [
          'Identifying charter',
          'Identifying/auditing existing pages',
          'Interviewing designers',
          'Interviewing developers',
          'Interviewing marketers',
          'Strategic implementation planning',
          'Conducting comparative analysis',
        ],
        [
          'Charter reference doc',
          'Figma doc of existing pages',
          'Spreadsheet of designer responses',
          'Word docs of developer responses',
          'Word docs of marketer responses',
          'Strategic implementation plan',
          'Comparative analysis results',
        ],
      ),
      section('Existing Page Audit', [
        p('Each of these Figma pages is representative of each app/website within the Lendio/Sunrise org.'),
        figure('lendio-page-audit.png', { style: 'shadowFigma' }),
      ]),
      section('Design / Dev / Marketing Interviews', [
        p(
          'We sat down with designers, developers, and marketing and asked them a series of questions to better understand how components and styles were being shared across the team and across disciplines.',
        ),
      ]),
      section(
        'WHAT WE LEARNED',
        [
          grey(
            'Lendio and Sunrise had grown so quickly that designers, developers, and marketers weren’t sharing nearly any components as a result. (There were also 6 typefaces being used across the apps/pages.)',
          ),
          figure('lendio-ds-interviews.png', { style: 'scopeDoc' }),
        ],
        { headingLevel: 'h4NoDot' },
      ),
      section('Strategic Implementation Plan', [
        p(
          'We knew that we had to start with the basics in order to get everyone aligned—especially with individual designers and developers—across two companies and multiple apps/sites.\n\nTo do this, we created a plan to get alignment on the basics: typography & grid, spacing, buttons, elevations, modals, breakpoints, and border radius.',
        ),
        figure('lendio-implementation-plan.png', {
          style: 'photoShadow',
          expandIcon: true,
          lightbox: 'lendio-implementation-plan-full.svg',
        }),
        grey(
          'Lendio and Sunrise had grown so quickly that designers, developers, and marketers weren’t sharing nearly any components as a result. (There were also 6 typefaces being used across the apps/pages.)',
        ),
      ]),
      section('Comparative Analysis', [
        p(
          'Neither Jessica, nor I, wanted to reinvent the wheel. We began by looking at what others had already put together and shared on ',
          { link: { text: 'DesignSystemsforFigma.com', href: 'https://www.designsystemsforfigma.com/' } },
          '.',
        ),
        figure('lendio-comparative.png', { style: 'photoShadow' }),
      ]),
      processStep(
        2,
        'Design + Test',
        [
          p(
            'After comparing many of these existing systems, we decided to mimic parts of different systems to put together our own. We weren’t trying to create anything revolutionary. Instead, we were aiming to create a single source of truth for existing components and styles that could be adopted quickly and easily due to their familiarity.',
          ),
        ],
        [
          'Typographic scale creation',
          'Creation of spacing rules',
          'Creation of grid standards',
          'Creation of breakpoint standards',
          'Creation of border radius standards',
          'Creation of governance model',
        ],
        [
          'Documentation of type scale',
          'Documentation of spacing ',
          'Documentation of grid ',
          'Documentation of breakpoints',
          'Documentation of border radius',
          'Documentation of governance model',
        ],
      ),
      testBlock('Feedback gathering from all stakeholders, iterating,  and continual alignment meetings.', {
        vert: true,
        subtext:
          'This included meeting with developers to better understand the existing front-end technologies they were using to build components currently—and that what we were designing could be aligned across these technologies. (These included Ember.js, Bootstrap 4, Vue.js, and TailwindCSS.)',
      }),
      section('Stress Testing Where We Landed', [
        p(
          'Once we had gathered several iterations of feedback from designers, developers, and marketing on the styles and components Jessica and I had developed, I built a page from every experience using our proposed styles and components. This included experiences across Lendio and Sunrise—both internal and external-facing apps—to show stakeholders how the system could work well for their experience.',
        ),
        figure('lendio-stress-test.png', { style: 'photoShadow' }),
        p(
          'This included creating a side-by-side comparison for each app/site page to illustrate to the teams how the new system would affect their pages.',
        ),
        figure('lendio-side-by-side.png', { style: 'photoShadow' }),
      ]),
      section('Feedback & The Final Product', [
        p(
          'Once we had stress tested the system and had resolved any concerns with stakeholders, we went to the design team and asked them to help us finish out the system by selecting a color palette as a team. Once that was done, this is where we landed for v1:',
        ),
        figure('lendio-v1-styles.png', { style: 'photoShadow' }),
        figure('lendio-v1-components.png', { style: 'photoShadow' }),
      ]),
      section('Creating the Governance Model', [
        p(
          'Now that the system had been created, we needed to create a clear way to add/update/remove new styles and components moving forward. Again, not wanting to reinvent the wheel, we started with Brad Frost’s governance model for design systems. \n\nWe than created our own from his boilerplate:',
        ),
        figure('lendio-governance.png', {
          style: 'photoShadow',
          expandIcon: true,
          lightbox: 'lendio-governance-full.svg',
        }),
      ]),
      processStep(
        3,
        'Launch + Learn',
        [
          p(
            'Once Jessica, the design team, and I had completed the v1 of system—with buy-in from all stakeholders—we handed off the system to the Design Ops team to implement the system with dev over the coming months.',
          ),
        ],
        ['Design to Design Ops hand off', 'Design Ops implementation support'],
        ['Hand off doc', 'Meeting with Design Ops as needed'],
      ),
      {
        _type: 'lessonsLearned',
        _key: key(),
        heading: 'Lessons Learned',
        items: [
          'Stakeholder buy-in comes when you show them how the system could work for them—and make their jobs easier.',
          'Giving team members the opportunity to participate in giving feedback on the system as it was built led to a sense of common ownership—which likely influenced adoption. ',
          'Reinventing the wheel is daunting—and unnecessary. Taking inspiration and direction from existing design systems allowed us to move much more quickly, and allowed us more time to stress-test the system to ensure that it worked for all experiences.',
        ],
      },
    ],
  };
}

function buildByu() {
  return {
    _id: 'caseStudy-byu-instruction-scheduler',
    _type: 'caseStudy',
    title: 'Instruction Scheduler',
    company: 'BYU Library',
    companyLogo: imageRef('byu-logo.svg'),
    slug: { _type: 'slug', current: 'byu/instruction-scheduler' },
    teamMembers: '2 Back-end Developers\n1 UX Designer\n2 Front-end Developers',
    myRoles: 'UX Designer\nFront-end Developer (HTML/SCSS)',
    card: {
      image: imageRef('byu-card.png'),
      logoSmall: imageRef('byu-logo.svg'),
      cardTitle: 'Instruction Scheduler',
      outcomeBlurb: '~1.3k students scheduled/term',
      order: 3,
    },
    seo: {
      metaTitle: 'BYU Library Instruction Scheduler • Utah UX',
      metaDescription:
        'UX case study: designing a new library instruction scheduling system for students, librarians, and administrators at the BYU Library.',
    },
    outcome: {
      intro: [
        p(
          "While I wasn't able to gather baseline data from the original app—i.e. time on task, customer satisfaction score—the new app was positively received by students, librarians, and administrators.",
        ),
      ],
      extraContent: [
        h3('Qualitative'),
        h4('QUOTES FROM LIBRARIANS ABOUT THE SYSTEM'),
        ...bullets('“You’ve given us a ten-course meal!”', '“I like it!”'),
        h4('QUOTES FROM STUDENTS ABOUT THE SYSTEM'),
        ...bullets('“Great job. This was easy to do.”', '“Quick and easy! Nice.”'),
        h3('Quantitative'),
        h4('NUMBER OF 1-ON-1 MEETINGS'),
        ...bullets('Increased by 1.6%.'),
      ],
    },
    body: [
      section('Context', [
        p(
          'Each semester, 1300+ students come to the BYU Library to attend hour-long library instruction sessions taught by subject-specific librarians—outside of regular university class time—to fulfill class requirements.\n\nThere was an existing application that was failing to meet the needs of librarians, students and administrators. I was tasked with designing a new system that would meet the needs of each group.',
        ),
      ]),
      section('Timeline', [largeBold('Summer 2016–Winter 2018'), grey('Total Elapsed Time: ~18 months')]),
      {
        _type: 'callout',
        _key: key(),
        variant: 'note',
        label: 'SO YOU’RE AWARE',
        body: [
          grey(
            'Any of the 60+ BYU Library web projects—not always UX related—can be added or removed from my project queue at any time based on priority, time constraints, or other reasons. \n\nAs project priorities change, a project that only requires 1-8 months of total design and development time often end up spanning up to a year and a half—or more—from start to finish.',
          ),
        ],
      },
      section('Metrics of Success', [
        labeled('QUALITATIVE FEEDBACK + TASK COMPLETION', [
          ...bullets(
            'Increase ease of use of the system for librarians',
            'Increase ease of use of the system for students',
            'Increase ease of use of the system for administrators',
          ),
        ]),
        labeled('QUANTITATIVE FEEDBACK', [...bullets('Reduce # of 1-on-1 sessions taught by librarians.')]),
      ]),
      processStep(
        1,
        'Learn + Map',
        [
          p(
            'Together, Jessica and I began by documenting all of the existing pages across the entire Lendio ecosystem—both product apps and marketing pages. From there, we identified all of the different typographic styles being used across all of these pages, along with the padding/margin amounts between elements.',
          ),
        ],
        [
          'Identifying charter',
          'Identifying/auditing existing pages',
          'Interviewing designers',
          'Interviewing developers',
          'Interviewing marketers',
          'Strategic implementation planning',
          'Conducting comparative analysis',
        ],
        [
          'Charter reference doc',
          'Figma doc of existing pages',
          'Spreadsheet of designer responses',
          'Word docs of developer responses',
          'Word docs of marketer responses',
          'Strategic implementation plan',
          'Comparative analysis results',
        ],
      ),
      section('Audience Roles', [...numbers('Students', 'Subject librarians', 'System Administrators')]),
      section('Jobs-to-be-Done: Summary', [
        p(
          'For this project, I used the jobs-to-be-done framework to understand and design for meeting user needs and goals. There were dozens of jobs-to-be-done that I create for each user group, but these give a general overview.',
        ),
        labeled('FOR THE STUDENTS', [
          p(
            { b: 'When ' },
            'I go to sign up for library instruction,',
            { b: ' I want to ' },
            'be able to submit and update my availability, so I can be assigned a session or participate in a 1-on-1 meeting,',
            { b: ' so I can ' },
            'get credit for my class.',
          ),
        ]),
        labeled('FOR THE LIBRARIANS', [
          p(
            { b: 'When' },
            ' I schedule sessions, ',
            { b: 'I want to ' },
            'be able to scheduled them based on student availability, teach those sessions, and record one-on-one meetings, ',
            { b: 'so I can ' },
            'give the students the information they need during their session as well as credit for attending.',
          ),
        ]),
        labeled('FOR THE ADMINISTRATORS', [
          p(
            { b: 'When ' },
            'I set up the polling, scheduling, and instruction periods for an instruction type block,',
            { b: ' I want to ' },
            'be able define the amounts of time for the polling, scheduling, and instruction periods for an instruction type, generate reports from each of those periods, and send those reports to the students’ professors,',
            { b: ' so I can' },
            ' give students credit for their attendance and set up the timeframes for instruction to take place.',
          ),
        ]),
        labeled('IN GENERAL', [
          p({
            b: 'Most jobs-to-be-done for each of the user groups fell into one of three periods of time that made up an instruction block within the application:',
          }),
          ...numbers(
            [{ b: 'The polling period' }, '—The time during which students submitted/updated their availability.'],
            [{ b: 'The scheduling period' }, '—The time during which librarians scheduled sessions.'],
            [
              { b: 'The instruction period' },
              '—The time during which librarians taught sessions and administrators began generating reports.',
            ],
          ),
        ]),
      ]),
      {
        _type: 'callout',
        _key: key(),
        variant: 'mistake',
        label: 'OWNING A MISTAKE',
        body: [
          grey(
            'For the first few weeks of the learning and understanding phase I assumed that I knew what the librarians and students wanted and needed in the new application.',
          ),
        ],
      },
      processStep(
        2,
        'Design + Test',
        [
          p(
            'With interviews and contextual inquires done, I moved on to diagramming, designing, and prototyping an interface for the students and the librarians to use across the three time periods—polling, scheduling and instruction. The administrator’s dashboard was created using the Django dashboard.',
          ),
        ],
        [
          'Diagramming new workflows',
          'Info. Architecture creation',
          'Wireframe mockup creation',
          'Visual design mockup creation',
          'Interact. design mockup creation',
          'HTML/SCSS mockup creation',
        ],
        [
          'Workflow diagrams',
          'Wireframes mockups',
          'Visual design mockups',
          'Zeplin JS functionality specification doc ',
          'HTML/SCSS mockups',
          'HTML/SCSS specification doc',
        ],
      ),
      section('Workflow Diagramming', [
        p('I began with diagramming the student and librarian workflows across each of the three periods.'),
        figure('byu-student-workflow.png', { style: 'photoShadow', label: 'STUDENT WORKFLOW DIAGRAM', expandIcon: true }),
        figure('byu-librarian-workflow.png', { style: 'photoShadow', label: 'LIBRARIAN WORKFLOW DIAGRAM', expandIcon: true }),
      ]),
      section('Wireframing / Prototyping', [
        p(
          'Once I had created the workflow diagrams, I began iterating design solutions using wireframes. I tested these wireframes using InVision. Once I had validated the usability of each peice of functionality, I moved on to high fidelity mockups.',
        ),
        figure('byu-student-wireframes.png', { style: 'photo', label: 'STUDENT DASHBOARD WIREFRAMES', expandIcon: true }),
        figure('byu-librarian-wireframes.png', { style: 'photo', label: 'LIBRARIAN DASHBOARD WIREFRAMES', expandIcon: true }),
      ]),
      testBlock('Feedback gathering from all stakeholders, iterating,  and continual alignment meetings.', {
        vert: true,
      }),
      section('High Fidelity Mockups / Prototyping', [
        p(
          'I created and tested iterations of the high fidelity mockups using Sketch and InVision. (Back before Figma was a thing.)\n\nAt the end of this iteration cycle, I created an interaction design specification document for the developers who would be coding the JavaScript, and planning the back-end architecture.',
        ),
        figure('byu-student-hifi.png', { style: 'photo', label: 'STUDENT DASHBOARD HIGH FIDELITY', expandIcon: true }),
        figure('byu-librarian-hifi.png', { style: 'photo', label: 'LIBRARIAN DASHBOARD WIREFRAMES', expandIcon: true }),
      ]),
      testBlock('Feedback gathering from all stakeholders, iterating,  and continual alignment meetings.', {
        vert: true,
      }),
      section('HTML + SCSS / Prototyping', [
        p(
          'At this point I began building what I had designed in HTML and SCSS, sent the front-end developers the interaction design doc with instructions for the JavaScript functionality on the frontend, and met with developers to talk about how the backend would need to be architected in order to support the functionality of the front-end.',
        ),
        { _type: 'ctaButton', _key: key(), label: 'View Video Walkthrough', url: '#' },
      ]),
      processStep(
        3,
        'Launch + Learn',
        [
          p(
            'As we launched the app, I created a feedback form in both the student and librarian dashboards that submitted directly to my email so that I could gather feedback from users. \n\nI supported developers with any small HTML/SCSS tweaks that needed to be made after launch.',
          ),
        ],
        ['Design to development hand off', 'Design implementation support', 'Feedback follow-up'],
        ['Feedback follow-up results'],
      ),
      {
        _type: 'lessonsLearned',
        _key: key(),
        heading: 'Lessons Learned',
        items: [
          'I built the production HTML/SCSS for the project—and some JS—and wished I hadn’t. I learned that I want to focus on refining the design—not on writing production front-end code. I needed this experience to teach me that. 😅   ',
          'Systems-level design is my jam—I enjoy the complexity of these types of design problems. ',
          'Complex systems can take a long time to build, but starting with users—and testing iteratively along the way with users—can reduce that time. ',
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Proposals
// ---------------------------------------------------------------------------
const deliverable = (heading, body, pagesGrid) => ({
  _type: 'deliverable',
  _key: key(),
  heading,
  body,
  ...(pagesGrid
    ? { pagesGrid: pagesGrid.map(([name, desc]) => ({ _type: 'pageItem', _key: key(), name, desc })) }
    : {}),
});
const maintainItem = (heading, body) => ({ _type: 'maintainItem', _key: key(), heading, body });
const processItem = (heading, body, starred = false) => ({
  _type: 'processItem',
  _key: key(),
  heading,
  body,
  starred,
});
const term = (heading, body) => ({ _type: 'term', _key: key(), heading, body });

function buildMhrProposal() {
  return {
    _id: 'proposal-mhrinteriors',
    _type: 'proposal',
    title: 'Website Proposal—MHR Design',
    clientName: 'MHR Design',
    slug: { _type: 'slug', current: 'mhrinteriors' },
    proposalDate: '2026-04-24',
    onBehalfLabel: 'Proposal on Behalf of',
    forPerson: { name: 'Marian Rockwood', title: 'Owner, MHR Design' },
    byPerson: { name: 'Ben Crabtree', title: 'Sr. Designer, Utah UX' },
    calendlyUrl: 'https://calendly.com/utahux/proposal-review',
    footerHeading: 'Ready to Review Proposal?',
    noindex: true,
    copyrightYear: '2026',
    sections: [
      {
        _type: 'objectiveSection',
        _key: key(),
        heading: 'Core Objective',
        lead: "Create an elegant online presence for MHR Design that showcases the quality and experience of Marian's work to create spaces of joy, peace, and comfort.",
      },
      {
        _type: 'scopeSection',
        _key: key(),
        heading: 'Project Scope & Deliverables',
        intro: [
          p(
            "A simple, clean website designed around your projects. You'll be able to add, edit, and remove projects and photos yourself from an easy-to-use editing portal—no developer needed.",
          ),
        ],
        deliverables: [
          deliverable(
            'Full website design',
            'thoughtful, minimal design that works on all screen sizes including the following pages:',
            [
              ['Home / Projects', 'Symmetrical grid of project thumbnails—this is the landing page visitors see first'],
              ['Project Detail', 'Title, short description, and full photo gallery for each project'],
              [
                'About & Contact',
                'Your portrait photo, design statement, and contact form with submissions sent directly to your email',
              ],
            ],
          ),
          deliverable('Content setup', 'your photos, project descriptions, and other content added to the site for you'),
          deliverable('Editing portal', 'add, edit, or remove projects and photos yourself'),
          deliverable('SEO', 'optimized for Google search and social sharing previews (Instagram, Facebook, LinkedIn)'),
          deliverable('Deployment', 'live on mhrinteriors.com'),
        ],
      },
      {
        _type: 'cardsSection',
        _key: key(),
        heading: 'Key Benefits',
        cards: ['Clean and Focused Design', 'Effortless to Update', 'Fully in Your Control'],
      },
      {
        _type: 'maintainSection',
        _key: key(),
        heading: 'Maintainability',
        subheading: 'WHAT YOU CAN UPDATE ON YOUR OWN',
        items: [
          maintainItem('Projects', 'add new projects with a title, description, and photos'),
          maintainItem('Photos', 'upload, reorder, or remove images within any project'),
          maintainItem('About & Contact', 'update your portrait photo, design statement, email, and contact details'),
        ],
      },
      {
        _type: 'proposalProcessSection',
        _key: key(),
        heading: 'Process & Timeline',
        intro: [p('Once the proposal is approved and initial payment is received:')],
        steps: [
          processItem('Site creation begins', "I'll begin creating the site, incorporating the content you provide."),
          processItem('Review link', "Within 7 days, I'll send you a link to review."),
          processItem(
            'Feedback',
            "You'll compile your feedback as a list of specific changes—e.g. layout, typography, colors, image sizing, etc.",
          ),
          processItem(
            'Review call',
            "We'll meet for a 30-minute review call to walk through your feedback and clarify any details.",
          ),
          processItem('Publish', "I'll apply those changes, conduct a final checklist review of the site, and publish."),
          processItem(
            'Editing walkthrough',
            "I'll deliver a recorded walkthrough showing you how to manage all the site content independently.",
          ),
        ],
        footnote: 'Additional revision rounds are billed at $175/hour.',
        deliveryLabel: 'DELIVERY DATE',
        deliveryValue: 'Mid-May 2026',
      },
      {
        _type: 'investmentSection',
        _key: key(),
        heading: 'Investment',
        price: '$2,100',
        terms: [
          term(
            'PAYMENT',
            '50% upfront, 50% on delivery. Scope includes everything described above: design, content setup, editing portal, SEO, and deployment to mhrinteriors.com.',
          ),
          term(
            'OWNERSHIP',
            'You own the final site and all deliverables. I retain the right to feature the work in my portfolio. A copy of the initial site code will be retained as a backup for continuity.',
          ),
          term(
            'NOT INCLUDED',
            'Ongoing maintenance or future design changes beyond the initial handoff. Day-to-day content updates (projects, photos, design statement) are taken care of by you directly in the editing portal. Additional features or pages would be scoped as a separate project. Post-launch support is available as a separate retainer.',
          ),
          term('CANCELLATION', 'You may cancel at any time with written notice. The initial deposit is non-refundable.'),
          term(
            'AGREEMENT',
            "After reviewing the proposal together, if you'd like to move forward, a payment link will be sent to your email. Completing the initial deposit constitutes an agreement to the above terms and officially starts the project.",
          ),
        ],
        nextStepsHeading: 'NEXT STEPS',
        nextSteps: ['Proposal review call', 'Payment link sent to your email', 'Schedule initial design review'],
      },
    ],
  };
}

function buildAgileCioProposal() {
  return {
    _id: 'proposal-theagilecio',
    _type: 'proposal',
    title: 'Website Redesign Proposal—The Agile CIO',
    clientName: 'The Agile CIO',
    slug: { _type: 'slug', current: 'theagilecio' },
    proposalDate: '2026-04-02',
    onBehalfLabel: 'Proposal on Behalf of',
    clientLogo: imageRef('agilecio-logo.png'),
    forPerson: { name: 'Azunna Anyanwu', title: 'Founder, The Agile CIO' },
    byPerson: { name: 'Ben Crabtree', title: 'Sr. Designer, Utah UX' },
    calendlyUrl: 'https://calendly.com/utahux/proposal-review',
    footerHeading: 'Ready to Review Proposal?',
    noindex: true,
    copyrightYear: '2026',
    sections: [
      {
        _type: 'objectiveSection',
        _key: key(),
        heading: 'Core Objective',
        lead: "Elevate TheAgileCIO.net into a modern, high-performance website that fully reflects Azunna's expertise while strengthening his digital presence as a fractional CIO and speaker.",
      },
      {
        _type: 'scopeSection',
        _key: key(),
        heading: 'Project Scope & Deliverables',
        intro: [
          p(
            'A complete redesign and rebuild—moving beyond the limitations of WordPress to a custom, high-performance site with a CMS you control. All existing content will be migrated, including blog posts, service descriptions, testimonials, and legal pages. The site will auto-publish when you make changes—no developer needed.',
          ),
        ],
        deliverables: [
          deliverable(
            'Full website redesign',
            'custom design system with CMS, responsive across all devices including the following pages:',
            [
              [
                'Homepage',
                'Hero with headshot, service highlights, testimonial carousel, YouTube videos, latest blog posts, showcase case studies (new content), newsletter signup',
              ],
              ['Speaking', 'Upcoming & past engagements with video thumbnails, booking CTA'],
              ['Solutions', '5 service offerings with clear descriptions and direct consultation links'],
              ['Case Studies', 'Page will be structured and ready for your case studies'],
              ['Insights', 'All 39 blog articles will be migrated with category filtering'],
              ['Contact', 'Professional form with service pre-selection, submissions sent directly to your email'],
              ['About', 'Bio, executive experience, awards, education, certifications'],
              ['Privacy & Terms', 'Full original content will be migrated'],
            ],
          ),
          deliverable(
            'Content migration & management',
            'all 39 blog posts and existing copy migrated as-is into the CMS for ongoing editing',
          ),
          deliverable('SEO setup', 'optimized titles, meta descriptions, Open Graph tags, structured data, XML sitemap'),
          deliverable(
            'AI/LLM discoverability',
            'when someone asks ChatGPT or Claude about fractional CIOs in your area, your site will be structured so it gets surfaced',
          ),
          deliverable('Email collection', 'email collection form across the site'),
          deliverable(
            'URL redirects',
            '301 redirects from all existing WordPress URLs to their new equivalents so search rankings and bookmarks are preserved',
          ),
          deliverable('Deployment', 'live on hosting of your choice'),
        ],
      },
      {
        _type: 'cardsSection',
        _key: key(),
        heading: 'Key Enhancements',
        cards: ['Premium Branded Visual Presence', 'Client-First Content Strategy', 'Easy to Maintain and Update'],
        table: {
          _type: 'comparisonTable',
          columns: ['', 'Before', 'After'],
          rows: [
            {
              _type: 'tableRow',
              _key: key(),
              cells: [
                'First Impression',
                'Limited by WordPress theme constraints',
                'Fully custom design with your brand, headshot, and videos front and center',
              ],
            },
            {
              _type: 'tableRow',
              _key: key(),
              cells: ['Blog Author', '"The Agile CIO"', '"Azunna Anyanwu"—builds personal credibility'],
            },
            {
              _type: 'tableRow',
              _key: key(),
              cells: [
                'SEO',
                'Default title: "Home - The Agile CIO"',
                'Optimized titles, descriptions, and social sharing cards on every page',
              ],
            },
            {
              _type: 'tableRow',
              _key: key(),
              cells: [
                'AI Discovery',
                'Not visible to AI tools',
                'Structured data & llms.txt so AI assistants can find and recommend you',
              ],
            },
            {
              _type: 'tableRow',
              _key: key(),
              cells: ['Lead Capture', 'Contact form only', 'Contact form and email collection across the site'],
            },
            {
              _type: 'tableRow',
              _key: key(),
              cells: [
                'Performance',
                'WordPress + plugin overhead',
                'Static site on global CDN—loads instantly from anywhere',
              ],
            },
            {
              _type: 'tableRow',
              _key: key(),
              cells: [
                'Accessibility',
                'Theme-level gaps in alt text, headings',
                'Designed to meet WCAG 2.2 AA standards',
              ],
            },
            { _type: 'tableRow', _key: key(), cells: ['Broken Links', '5 broken', 'Zero'] },
            {
              _type: 'tableRow',
              _key: key(),
              cells: ['Hosting Cost', 'Paid Namecheap hosting', 'Free hosting with automatic SSL and global CDN'],
            },
            {
              _type: 'tableRow',
              _key: key(),
              cells: [
                'Form Submissions',
                'WPForms',
                'Smart contact form with service pre-selection, submissions to your inbox',
              ],
            },
          ],
        },
      },
      {
        _type: 'maintainSection',
        _key: key(),
        heading: 'Maintainability',
        intro: [
          p(
            "You'll have a CMS where you can log in and make updates yourself—no developer needed for day-to-day changes.",
          ),
        ],
        subheading: 'WHAT YOU CAN UPDATE ON YOUR OWN',
        items: [
          maintainItem(
            'Blog posts',
            'write and publish new articles with the CMS editor, add images, and assign categories. New posts auto-publish to the site.',
          ),
          maintainItem('Case studies', 'add new case studies using a structured template'),
          maintainItem('Videos', 'add, swap, or remove YouTube videos on the Speaking page and Homepage'),
          maintainItem('Speaking events', 'add upcoming engagements, mark past events, update details'),
          maintainItem('Services & FAQs', 'update service descriptions, add or edit FAQ questions'),
          maintainItem('Testimonials', 'add, edit, or remove client testimonials'),
          maintainItem(
            'Contact info & social links',
            'update your email, LinkedIn, and other details across the site from one place',
          ),
        ],
      },
      {
        _type: 'proposalProcessSection',
        _key: key(),
        heading: 'Process & Revisions',
        intro: [
          p(
            'Once the proposal is approved and initial payment is received (estimated 2–4 weeks, dependent on feedback turnaround):',
          ),
        ],
        steps: [
          processItem(
            'Site creation begins',
            "I'll begin creating the site incorporating your current content and branding.",
          ),
          processItem('Review link', "Within 7 days, I'll send you a link to review."),
          processItem(
            'Feedback',
            "You'll compile your feedback as a list of specific changes—e.g. copy, colors, typography, images, layout, etc.",
          ),
          processItem(
            'Review call',
            "We'll meet for a 30-minute review call to walk through your feedback and clarify any details.",
          ),
          processItem(
            'Publish',
            "I'll apply any changes based on the feedback within 7 days of the review call. We'll meet for another 30-minute call to verify the changes have been made, check the status of the 301 redirects for existing WordPress links, conduct a final checklist review of site security, content, and SEO, and publish the site.",
            true,
          ),
          processItem(
            'CMS walkthrough',
            "I'll deliver a recorded walkthrough showing you how to manage all the site content independently.",
          ),
        ],
        footnote: 'Additional revision rounds are billed at $175/hour.',
      },
      {
        _type: 'investmentSection',
        _key: key(),
        heading: 'Investment',
        price: '$2,500',
        terms: [
          term(
            'PAYMENT',
            '50% upfront, 50% on delivery. Scope includes everything described above: design, development, content migration, SEO setup, and deployment to hosting of your choice.',
          ),
          term(
            'OWNERSHIP',
            'You own the final site and all deliverables. I retain the right to feature the work in my portfolio. A copy of the initial redesigned site code will be retained as a backup for continuity.',
          ),
          term(
            'NOT INCLUDED',
            'Ongoing maintenance or future design changes beyond the initial handoff. Day-to-day content updates (blog posts, case studies, videos, speaking events, etc.) are taken care of by you directly in the CMS. Additional features, functionality, or pages would be scoped as a separate project. Post-launch support is available as a separate retainer.',
          ),
          term('CANCELLATION', 'You may cancel at any time with written notice. The initial deposit is non-refundable.'),
          term(
            'AGREEMENT',
            'After reviewing the proposal together, replying to the email with your approval constitutes agreement to begin work under the terms outlined above.',
          ),
        ],
        nextStepsHeading: 'NEXT STEPS',
        nextSteps: [
          'Proposal review call',
          'Reply to proposal email with your approval',
          'Submit initial payment and schedule review call',
        ],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`Project ${PROJECT_ID}, dataset ${DATASET}`);
  manifest = await uploadAssets();
  console.log(`Assets ready: ${Object.keys(manifest).length}`);

  const docs = [buildAncestry(), buildLendio(), buildByu(), buildMhrProposal(), buildAgileCioProposal()];
  const tx = docs.reduce((t, doc) => t.createOrReplace(doc), client.transaction());
  const result = await tx.commit();
  console.log(`Committed ${result.results.length} documents:`);
  for (const r of result.results) console.log(`  ${r.id} (${r.operation})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
