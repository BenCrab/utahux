import { defineArrayMember, defineField, defineType } from 'sanity';

export default defineType({
  name: 'proposal',
  title: 'Client Proposal',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page title',
      description: 'e.g. "Website Proposal—MHR Design"',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'clientName',
      type: 'string',
      title: 'Client name (h1)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL slug',
      description: '→ /proposals/<slug>/',
      options: { source: 'clientName' },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'proposalDate', type: 'date', title: 'Proposal date' }),
    defineField({
      name: 'onBehalfLabel',
      type: 'string',
      title: 'Label above client name',
      initialValue: 'Proposal on Behalf of',
    }),
    defineField({
      name: 'clientLogo',
      type: 'image',
      title: 'Client logo (optional)',
      description: 'Shown as a 48px circle next to the client name',
    }),
    defineField({
      name: 'forPerson',
      type: 'object',
      title: 'FOR',
      fields: [
        defineField({ name: 'name', type: 'string', title: 'Name' }),
        defineField({ name: 'title', type: 'string', title: 'Title' }),
      ],
    }),
    defineField({
      name: 'byPerson',
      type: 'object',
      title: 'BY',
      fields: [
        defineField({ name: 'name', type: 'string', title: 'Name', initialValue: 'Ben Crabtree' }),
        defineField({
          name: 'title',
          type: 'string',
          title: 'Title',
          initialValue: 'Sr. Designer, Utah UX',
        }),
      ],
    }),
    defineField({
      name: 'calendlyUrl',
      type: 'url',
      title: 'Calendly URL',
      initialValue: 'https://calendly.com/utahux/proposal-review',
    }),
    defineField({
      name: 'footerHeading',
      type: 'string',
      title: 'Footer heading',
      initialValue: 'Ready to Review Proposal?',
    }),
    defineField({
      name: 'noindex',
      type: 'boolean',
      title: 'Hide from search engines (noindex)',
      initialValue: true,
    }),
    defineField({ name: 'copyrightYear', type: 'string', title: 'Copyright year', initialValue: '2026' }),
    defineField({
      name: 'sections',
      type: 'array',
      title: 'Sections',
      of: [
        defineArrayMember({ type: 'objectiveSection' }),
        defineArrayMember({ type: 'scopeSection' }),
        defineArrayMember({ type: 'cardsSection' }),
        defineArrayMember({ type: 'maintainSection' }),
        defineArrayMember({ type: 'proposalProcessSection' }),
        defineArrayMember({ type: 'investmentSection' }),
        defineArrayMember({ type: 'genericSection' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'clientName', subtitle: 'proposalDate' },
  },
});
