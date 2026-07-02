import { defineArrayMember, defineField, defineType } from 'sanity';

/** Section types for the proposal document, verified against both existing proposals. */

export const comparisonTable = defineType({
  name: 'comparisonTable',
  title: 'Comparison Table',
  type: 'object',
  fields: [
    defineField({
      name: 'columns',
      type: 'array',
      title: 'Column headers',
      of: [defineArrayMember({ type: 'string' })],
      description:
        'First header may be empty. "Before"/"After" headers get their grey/navy cell styling automatically.',
    }),
    defineField({
      name: 'rows',
      type: 'array',
      title: 'Rows',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tableRow',
          fields: [
            defineField({
              name: 'cells',
              type: 'array',
              title: 'Cells',
              of: [defineArrayMember({ type: 'string' })],
            }),
          ],
          preview: {
            select: { cells: 'cells' },
            prepare: ({ cells }) => ({ title: cells?.[0] ?? 'Row' }),
          },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Comparison table' }) },
});

export const objectiveSection = defineType({
  name: 'objectiveSection',
  title: 'Core Objective',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading', initialValue: 'Core Objective' }),
    defineField({ name: 'lead', type: 'text', title: 'Lead paragraph (24px)', rows: 4 }),
  ],
  preview: { select: { title: 'heading' } },
});

export const scopeSection = defineType({
  name: 'scopeSection',
  title: 'Project Scope & Deliverables',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      initialValue: 'Project Scope & Deliverables',
    }),
    defineField({ name: 'intro', type: 'richText', title: 'Intro paragraph' }),
    defineField({
      name: 'deliverables',
      type: 'array',
      title: 'Deliverables (numbered list)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'deliverable',
          fields: [
            defineField({ name: 'heading', type: 'string', title: 'Bold lead-in' }),
            defineField({ name: 'body', type: 'text', title: 'Body', rows: 3 }),
            defineField({
              name: 'pagesGrid',
              type: 'array',
              title: 'Pages grid (optional)',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'pageItem',
                  fields: [
                    defineField({ name: 'name', type: 'string', title: 'Page name' }),
                    defineField({ name: 'desc', type: 'text', title: 'Description', rows: 3 }),
                  ],
                  preview: { select: { title: 'name' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'heading' } },
});

export const cardsSection = defineType({
  name: 'cardsSection',
  title: 'Key Benefits / Enhancements',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading', initialValue: 'Key Benefits' }),
    defineField({
      name: 'cards',
      type: 'array',
      title: 'Cards (text-only)',
      of: [defineArrayMember({ type: 'string' })],
    }),
    defineField({ name: 'table', type: 'comparisonTable', title: 'Comparison table (optional)' }),
  ],
  preview: { select: { title: 'heading' } },
});

export const maintainSection = defineType({
  name: 'maintainSection',
  title: 'Maintainability',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading', initialValue: 'Maintainability' }),
    defineField({ name: 'intro', type: 'richText', title: 'Intro paragraph (optional)' }),
    defineField({
      name: 'subheading',
      type: 'string',
      title: 'Subheading (h3)',
      initialValue: 'WHAT YOU CAN UPDATE ON YOUR OWN',
    }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items (numbered list)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'maintainItem',
          fields: [
            defineField({ name: 'heading', type: 'string', title: 'Bold lead-in' }),
            defineField({ name: 'body', type: 'text', title: 'Body', rows: 3 }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'heading' } },
});

export const proposalProcessSection = defineType({
  name: 'proposalProcessSection',
  title: 'Process & Timeline',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      type: 'string',
      title: 'Heading',
      initialValue: 'Process & Timeline',
    }),
    defineField({ name: 'intro', type: 'richText', title: 'Intro paragraph' }),
    defineField({
      name: 'steps',
      type: 'array',
      title: 'Steps (numbered list)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'processItem',
          fields: [
            defineField({ name: 'heading', type: 'string', title: 'Bold lead-in' }),
            defineField({ name: 'body', type: 'text', title: 'Body', rows: 4 }),
            defineField({
              name: 'starred',
              type: 'boolean',
              title: 'Starred (blue asterisk after lead-in)',
              initialValue: false,
            }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
    defineField({
      name: 'footnote',
      type: 'string',
      title: 'Footnote',
      description: 'e.g. "Additional revision rounds are billed at $175/hour." — rendered with a blue *',
    }),
    defineField({ name: 'deliveryLabel', type: 'string', title: 'Delivery label (optional)', description: 'e.g. "DELIVERY DATE"' }),
    defineField({ name: 'deliveryValue', type: 'string', title: 'Delivery value (optional)', description: 'e.g. "Mid-May 2026"' }),
  ],
  preview: { select: { title: 'heading' } },
});

export const investmentSection = defineType({
  name: 'investmentSection',
  title: 'Investment',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading', initialValue: 'Investment' }),
    defineField({ name: 'price', type: 'string', title: 'Price', description: 'e.g. "$2,100"' }),
    defineField({
      name: 'terms',
      type: 'array',
      title: 'Terms (PAYMENT / OWNERSHIP / …)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'term',
          fields: [
            defineField({ name: 'heading', type: 'string', title: 'Heading (h3)' }),
            defineField({ name: 'body', type: 'text', title: 'Body', rows: 4 }),
          ],
          preview: { select: { title: 'heading' } },
        }),
      ],
    }),
    defineField({
      name: 'nextStepsHeading',
      type: 'string',
      title: 'Next steps heading',
      initialValue: 'NEXT STEPS',
    }),
    defineField({
      name: 'nextSteps',
      type: 'array',
      title: 'Next steps (numbered list)',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: { select: { title: 'heading', subtitle: 'price' } },
});

export const genericSection = defineType({
  name: 'genericSection',
  title: 'Generic Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string', title: 'Heading' }),
    defineField({ name: 'content', type: 'richText', title: 'Content' }),
  ],
  preview: { select: { title: 'heading' } },
});

export const proposalSections = [
  comparisonTable,
  objectiveSection,
  scopeSection,
  cardsSection,
  maintainSection,
  proposalProcessSection,
  investmentSection,
  genericSection,
];
