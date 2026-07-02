export const projectCardsQuery = /* groq */ `
*[_type == "caseStudy"] | order(card.order asc) {
  "slug": slug.current,
  title,
  card {
    cardTitle,
    outcomeBlurb,
    image { asset-> { url, metadata { dimensions } } },
    logoSmall { asset-> { url } }
  }
}`;

export const caseStudiesQuery = /* groq */ `
*[_type == "caseStudy"] {
  "slug": slug.current,
  title,
  company,
  companyLogo { asset-> { url } },
  teamMembers,
  myRoles,
  seo,
  outcome {
    ...,
    intro[],
    kpis[],
    netProfit[],
    extraContent[]
  },
  body[] {
    ...,
    _type == "conceptGrid" => {
      cards[] { ..., image { asset-> { url, metadata { dimensions } } } }
    },
    _type == "dottedSection" => {
      content[] {
        ...,
        _type == "imageFigure" => {
          image { asset-> { url, metadata { dimensions, lqip } } },
          lightboxImage { asset-> { url } },
          linkToPdf { asset-> { url } }
        },
        _type == "imageScroller" => {
          images[] {
            ...,
            image { asset-> { url, metadata { dimensions, lqip } } },
            lightboxImage { asset-> { url } }
          }
        },
        _type == "pdfCardRow" => {
          left { ..., thumbnail { asset-> { url, metadata { dimensions } } }, pdf { asset-> { url } } },
          right { ..., thumbnail { asset-> { url, metadata { dimensions } } }, pdf { asset-> { url } } }
        }
      }
    }
  }
}`;

export const proposalsQuery = /* groq */ `
*[_type == "proposal"] {
  "slug": slug.current,
  title,
  clientName,
  proposalDate,
  onBehalfLabel,
  clientLogo { asset-> { url } },
  forPerson,
  byPerson,
  calendlyUrl,
  footerHeading,
  noindex,
  copyrightYear,
  sections[]
}`;
