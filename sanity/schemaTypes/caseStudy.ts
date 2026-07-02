import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'card', title: 'Homepage Card' },
    { name: 'outcome', title: 'Outcome' },
    { name: 'body', title: 'Body' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Project title',
      description: 'e.g. "Product Onboarding"',
      group: 'hero',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'company',
      type: 'string',
      title: 'Company label',
      description: 'e.g. "Ancestry.com"',
      group: 'hero',
    }),
    defineField({
      name: 'companyLogo',
      type: 'image',
      title: 'Company logo (SVG)',
      group: 'hero',
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL path',
      description: 'Two segments, e.g. "ancestry/onboarding" → /ancestry/onboarding/',
      group: 'hero',
      options: { source: 'title' },
      validation: (rule) =>
        rule.required().custom((slug) =>
          slug?.current && /^[a-z0-9-]+\/[a-z0-9-]+$/.test(slug.current)
            ? true
            : 'Must be two lowercase segments like "ancestry/onboarding"',
        ),
    }),
    defineField({
      name: 'teamMembers',
      type: 'text',
      title: 'Team members',
      description: 'One per line, e.g. "7 UI Teams\n2 PMs\n1 UX"',
      rows: 4,
      group: 'hero',
    }),
    defineField({
      name: 'myRoles',
      type: 'text',
      title: 'My roles',
      description: 'One per line',
      rows: 4,
      group: 'hero',
    }),
    defineField({
      name: 'card',
      type: 'object',
      title: 'Homepage card',
      group: 'card',
      fields: [
        defineField({ name: 'image', type: 'image', title: 'Thumbnail' }),
        defineField({ name: 'logoSmall', type: 'image', title: 'Small logo (SVG)' }),
        defineField({ name: 'cardTitle', type: 'string', title: 'Card title' }),
        defineField({
          name: 'outcomeBlurb',
          type: 'string',
          title: 'Outcome blurb',
          description: 'e.g. "~$15 million increase in revenue."',
        }),
        defineField({
          name: 'order',
          type: 'number',
          title: 'Sort order',
          description: 'Lower numbers appear first in the projects grid',
        }),
      ],
    }),
    defineField({
      name: 'outcome',
      type: 'object',
      title: 'The Outcome',
      group: 'outcome',
      description:
        'Intro only → rounded panel (Lendio). Add KPIs + net profit (Ancestry) and/or extra content (BYU quotes) for the bottom half.',
      fields: [
        defineField({ name: 'intro', type: 'richText', title: 'Intro (white text)' }),
        defineField({ name: 'kpiLabel', type: 'string', title: 'KPI label', initialValue: 'KPI RESULTS' }),
        defineField({
          name: 'kpis',
          type: 'array',
          title: 'KPI cards (2–3)',
          of: [defineArrayMember({ type: 'kpiCard' })],
          validation: (rule) => rule.max(3),
        }),
        defineField({
          name: 'netProfitLabel',
          type: 'string',
          title: 'Net profit label',
          initialValue: 'NET PROFIT',
        }),
        defineField({ name: 'netProfit', type: 'richText', title: 'Net profit (large bold line)' }),
        defineField({
          name: 'disclaimer',
          type: 'string',
          title: 'Disclaimer',
          description: 'e.g. "Based upon projections for 2020-2024." — rendered with a blue *',
        }),
        defineField({
          name: 'extraContent',
          type: 'richText',
          title: 'Extra bottom content',
          description: 'Freeform bottom panel (BYU: h3 subheads, h4 labels, quote lists)',
        }),
      ],
    }),
    defineField({
      name: 'body',
      type: 'array',
      title: 'Body',
      group: 'body',
      of: [
        defineArrayMember({ type: 'dottedSection' }),
        defineArrayMember({ type: 'processStep' }),
        defineArrayMember({ type: 'conceptGrid' }),
        defineArrayMember({ type: 'testBlock' }),
        defineArrayMember({ type: 'callout' }),
        defineArrayMember({ type: 'lessonsLearned' }),
      ],
    }),
    defineField({
      name: 'seo',
      type: 'object',
      title: 'SEO',
      group: 'seo',
      fields: [
        defineField({ name: 'metaTitle', type: 'string', title: 'Meta title' }),
        defineField({ name: 'metaDescription', type: 'text', title: 'Meta description', rows: 3 }),
        defineField({ name: 'ogImage', type: 'image', title: 'OG image (optional)' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'company', media: 'card.image' },
  },
});
