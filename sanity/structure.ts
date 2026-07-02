import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('caseStudy').title('Case Studies'),
      S.documentTypeListItem('proposal').title('Client Proposals'),
    ]);
