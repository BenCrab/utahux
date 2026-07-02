import { defineArrayMember, defineField, defineType } from 'sanity';
import { richTextBlock } from './richText';

/** Blocks used inside case-study bodies. Each maps to existing Webflow markup. */

export const kpiCard = defineType({
  name: 'kpiCard',
  title: 'KPI Card',
  type: 'object',
  fields: [
    defineField({ name: 'value', type: 'string', title: 'Value', description: 'e.g. "+6.3%"' }),
    defineField({
      name: 'subValue',
      type: 'string',
      title: 'Sub-value',
      description: 'e.g. "+8.5% on mobile" or "N/A"',
    }),
    defineField({ name: 'label', type: 'string', title: 'Label', description: 'e.g. "Bill-thru Rate"' }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
});

export const labeledText = defineType({
  name: 'labeledText',
  title: 'Labeled Text',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', title: 'Label (h4, blue)' }),
    defineField({ name: 'text', type: 'richText', title: 'Text' }),
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Variant',
      options: { list: ['default', 'large'] },
      initialValue: 'default',
      description: '"large" = big bold line with grey sub-line (Timeline pattern)',
    }),
  ],
  preview: { select: { title: 'label' } },
});

export const imageFigure = defineType({
  name: 'imageFigure',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true } }),
    defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
    defineField({
      name: 'style',
      type: 'string',
      title: 'Style',
      options: {
        list: [
          { title: 'Photo (rounded)', value: 'photo' },
          { title: 'Figma shadow (bare)', value: 'shadowFigma' },
          { title: 'Photo + Figma shadow', value: 'photoShadow' },
          { title: 'Questions doc (max 480px)', value: 'questions' },
          { title: 'Plain', value: 'plain' },
          { title: 'Scope doc', value: 'scopeDoc' },
        ],
      },
      initialValue: 'photo',
    }),
    defineField({ name: 'label', type: 'string', title: 'Label above image (h4, optional)' }),
    defineField({
      name: 'expandIcon',
      type: 'boolean',
      title: 'Show expand icon',
      initialValue: false,
    }),
    defineField({
      name: 'lightboxImage',
      type: 'image',
      title: 'Lightbox image (optional)',
      description: 'Opens in the lightbox instead of the displayed image (e.g. a much larger SVG).',
    }),
    defineField({
      name: 'linkToPdf',
      type: 'file',
      title: 'Link to PDF (optional)',
      description: 'Clicking the image opens this PDF instead of a lightbox.',
    }),
  ],
  preview: { select: { title: 'alt', subtitle: 'style', media: 'image' } },
});

export const imageScroller = defineType({
  name: 'imageScroller',
  title: 'Image Scroller (lightbox gallery)',
  type: 'object',
  fields: [
    defineField({
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'scrollerImage',
          fields: [
            defineField({ name: 'image', type: 'image', title: 'Image' }),
            defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
            defineField({ name: 'lightboxImage', type: 'image', title: 'Lightbox image (optional)' }),
          ],
          preview: { select: { title: 'alt', media: 'image' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { images: 'images' },
    prepare: ({ images }) => ({ title: `Image scroller (${images?.length ?? 0} images)` }),
  },
});

const pdfCardFields = [
  defineField({ name: 'label', type: 'string', title: 'Label (h4)' }),
  defineField({ name: 'thumbnail', type: 'image', title: 'Thumbnail' }),
  defineField({ name: 'pdf', type: 'file', title: 'PDF' }),
];

export const pdfCard = defineType({
  name: 'pdfCard',
  title: 'PDF Card',
  type: 'object',
  fields: pdfCardFields,
  preview: { select: { title: 'label', media: 'thumbnail' } },
});

export const pdfCardRow = defineType({
  name: 'pdfCardRow',
  title: 'PDF Card Row',
  type: 'object',
  fields: [
    defineField({ name: 'left', type: 'pdfCard', title: 'Left card' }),
    defineField({ name: 'right', type: 'pdfCard', title: 'Right card (optional)' }),
  ],
  preview: { select: { title: 'left.label' } },
});

export const activitiesDeliverables = defineType({
  name: 'activitiesDeliverables',
  title: 'Activities / Deliverables',
  type: 'object',
  fields: [
    defineField({
      name: 'activities',
      type: 'array',
      title: 'Activities',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({
      name: 'deliverables',
      type: 'array',
      title: 'Deliverables',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Activities / Deliverables' }) },
});

const STATUS_OPTIONS = [
  { title: 'Success (green)', value: 'success' },
  { title: 'Failure (default pill)', value: 'failure' },
  { title: 'Saved for later (yellow)', value: 'savedForLater' },
];

export const conceptGrid = defineType({
  name: 'conceptGrid',
  title: 'Concept Card Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'headingPrefix',
      type: 'string',
      title: 'Heading prefix (bold)',
      description: 'e.g. "PAPER PROTOTYPES"',
    }),
    defineField({
      name: 'headingSuffix',
      type: 'string',
      title: 'Heading suffix (regular)',
      description: 'e.g. "THEME #2 • OPTIMIZE VALUE" — rendered after a • separator',
    }),
    defineField({ name: 'hypothesis', type: 'richText', title: 'Hypothesis paragraph' }),
    defineField({
      name: 'cards',
      type: 'array',
      title: 'Concept cards (2–3)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'conceptCard',
          fields: [
            defineField({ name: 'image', type: 'image', title: 'Image' }),
            defineField({
              name: 'imageStyle',
              type: 'string',
              title: 'Image style',
              options: { list: ['paperProto', 'screenshot'] },
              initialValue: 'paperProto',
            }),
            defineField({ name: 'title', type: 'string', title: 'Concept name' }),
            defineField({
              name: 'statusText',
              type: 'string',
              title: 'Status pill text',
              description: 'e.g. "Success Quant. (Learning)"',
            }),
            defineField({
              name: 'status',
              type: 'string',
              title: 'Status (pill color)',
              options: { list: STATUS_OPTIONS },
            }),
            defineField({
              name: 'credit',
              type: 'string',
              title: 'Credit line (optional)',
              description: 'e.g. "Sketch credit: Liz Brown"',
            }),
          ],
          preview: { select: { title: 'title', subtitle: 'statusText', media: 'image' } },
        }),
      ],
      validation: (rule) => rule.min(2).max(3),
    }),
  ],
  preview: { select: { title: 'headingPrefix', subtitle: 'headingSuffix' } },
});

export const statusKey = defineType({
  name: 'statusKey',
  title: 'Status Key (legend)',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', title: 'Label', initialValue: 'KEY' }),
    defineField({
      name: 'entries',
      type: 'array',
      title: 'Entries',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statusKeyEntry',
          fields: [
            defineField({ name: 'statusText', type: 'string', title: 'Pill text' }),
            defineField({
              name: 'status',
              type: 'string',
              title: 'Status (pill color)',
              options: { list: STATUS_OPTIONS },
            }),
            defineField({ name: 'description', type: 'text', title: 'Description', rows: 3 }),
          ],
          preview: { select: { title: 'statusText' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Status key (legend)' }) },
});

export const testBlock = defineType({
  name: 'testBlock',
  title: 'Test Cycle Block',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      type: 'string',
      title: 'Text (big blue heading)',
      description: 'e.g. "Tested with potential customers who had never used Ancestry before."',
    }),
    defineField({ name: 'subtext', type: 'text', title: 'Grey sub-paragraph (optional)', rows: 3 }),
    defineField({
      name: 'orientation',
      type: 'string',
      title: 'Orientation',
      options: { list: ['horizontal', 'vert'] },
      initialValue: 'horizontal',
    }),
  ],
  preview: { select: { title: 'text' } },
});

export const callout = defineType({
  name: 'callout',
  title: 'Callout (note / mistake)',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      title: 'Variant',
      options: {
        list: [
          { title: 'Note (info dot)', value: 'note' },
          { title: 'Owning a mistake (red dot)', value: 'mistake' },
        ],
      },
      initialValue: 'note',
    }),
    defineField({ name: 'label', type: 'string', title: 'Label (h4)', description: 'e.g. "SO YOU’RE AWARE"' }),
    defineField({ name: 'body', type: 'richText', title: 'Body (grey)' }),
  ],
  preview: { select: { title: 'label', subtitle: 'variant' } },
});

export const quoteList = defineType({
  name: 'quoteList',
  title: 'Quote List',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', title: 'Label (h4)' }),
    defineField({
      name: 'quotes',
      type: 'array',
      title: 'Quotes',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: { select: { title: 'label' } },
});

export const videoEmbed = defineType({
  name: 'videoEmbed',
  title: 'YouTube Video',
  type: 'object',
  fields: [
    defineField({ name: 'youtubeId', type: 'string', title: 'YouTube video ID' }),
    defineField({ name: 'title', type: 'string', title: 'Title (accessibility)' }),
  ],
  preview: { select: { title: 'title', subtitle: 'youtubeId' } },
});

export const ctaButton = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', title: 'Label' }),
    defineField({ name: 'url', type: 'string', title: 'URL' }),
  ],
  preview: { select: { title: 'label' } },
});

export const dottedSubhead = defineType({
  name: 'dottedSubhead',
  title: 'Dotted Subheading (h4)',
  type: 'object',
  fields: [
    defineField({ name: 'text', type: 'string', title: 'Text' }),
    defineField({
      name: 'dotPosition',
      type: 'string',
      title: 'Dot position class',
      options: { list: ['default', 'first', 'final-del'] },
      initialValue: 'default',
    }),
  ],
  preview: { select: { title: 'text' } },
});

export const dottedSection = defineType({
  name: 'dottedSection',
  title: 'Dotted Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({
      name: 'headingLevel',
      type: 'string',
      title: 'Heading level',
      options: { list: ['h2', 'h4', 'h4NoDot'] },
      initialValue: 'h2',
    }),
    defineField({ name: 'anchorId', type: 'string', title: 'Anchor ID (optional)' }),
    defineField({
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [
        richTextBlock,
        defineArrayMember({ type: 'labeledText' }),
        defineArrayMember({ type: 'imageFigure' }),
        defineArrayMember({ type: 'imageScroller' }),
        defineArrayMember({ type: 'pdfCardRow' }),
        defineArrayMember({ type: 'statusKey' }),
        defineArrayMember({ type: 'quoteList' }),
        defineArrayMember({ type: 'videoEmbed' }),
        defineArrayMember({ type: 'ctaButton' }),
        defineArrayMember({ type: 'dottedSubhead' }),
      ],
    }),
  ],
  preview: { select: { title: 'heading' } },
});

export const processStep = defineType({
  name: 'processStep',
  title: 'Process Step (1/2/3)',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      type: 'number',
      title: 'Step number',
      options: { list: [1, 2, 3] },
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({ name: 'heading', type: 'string', title: 'Heading', description: 'e.g. "Learn + Map"' }),
    defineField({
      name: 'anchorId',
      type: 'string',
      title: 'Anchor ID',
      description: 'e.g. "step-1" — used for in-page links',
    }),
    defineField({ name: 'intro', type: 'richText', title: 'Intro paragraph' }),
    defineField({ name: 'activitiesDeliverables', type: 'activitiesDeliverables' }),
  ],
  preview: {
    select: { number: 'number', heading: 'heading' },
    prepare: ({ number, heading }) => ({ title: `${number}. ${heading}` }),
  },
});

export const lessonsLearned = defineType({
  name: 'lessonsLearned',
  title: 'Lessons Learned',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading', initialValue: 'Lessons Learned' }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Lessons',
      of: [defineArrayMember({ type: 'text', rows: 3 })],
    }),
  ],
  preview: { select: { title: 'heading' } },
});

export const caseStudyBlocks = [
  kpiCard,
  labeledText,
  imageFigure,
  imageScroller,
  pdfCard,
  pdfCardRow,
  activitiesDeliverables,
  conceptGrid,
  statusKey,
  testBlock,
  callout,
  quoteList,
  videoEmbed,
  ctaButton,
  dottedSubhead,
  dottedSection,
  processStep,
  lessonsLearned,
];
