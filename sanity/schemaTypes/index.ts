import richText from './objects/richText';
import { caseStudyBlocks } from './objects/caseStudyBlocks';
import { proposalSections } from './objects/proposalSections';
import caseStudy from './caseStudy';
import proposal from './proposal';

export const schemaTypes = [
  richText,
  ...caseStudyBlocks,
  ...proposalSections,
  caseStudy,
  proposal,
];
