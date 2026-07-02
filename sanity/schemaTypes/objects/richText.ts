import { defineArrayMember, defineType } from 'sanity';

/**
 * Shared block config. Styles/marks map 1:1 to the Webflow classes:
 * - normal      → .p-default
 * - h3          → <h3> (proposal term subheads, BYU outcome "Qualitative")
 * - h4          → h4.blue.mt-16 label ("FOR THE CUSTOMER", "KPI RESULTS", …)
 * - grey        → .p-default.grey paragraph
 * - largeBold   → .p-default-bold.large (Timeline date line)
 * - strong/em   → <strong>/<em>
 * - link        → external link wrapping span.inline-link
 * - inlineLink  → span.inline-link without an href (footnote asterisks)
 * - bullet list → ul.ul, number list → ol.ol
 */
export const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H3 subhead', value: 'h3' },
    { title: 'H4 label (blue)', value: 'h4' },
    { title: 'Grey paragraph', value: 'grey' },
    { title: 'Large bold', value: 'largeBold' },
  ],
  lists: [
    { title: 'Bullet', value: 'bullet' },
    { title: 'Numbered', value: 'number' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
      { title: 'Inline link style (blue)', value: 'inlineLink' },
    ],
    annotations: [
      defineArrayMember({
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          {
            name: 'href',
            type: 'url',
            title: 'URL',
            validation: (rule: any) =>
              rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
          },
          { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: true },
        ],
      }),
    ],
  },
});

/** Reusable rich-text field type (for object fields like outcome.intro). */
export default defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'array',
  of: [richTextBlock],
});
