// JSON-LD helpers for SEO + AEO (answer engine optimization).
// Returns plain objects; SEO.astro serializes them into <script type="application/ld+json">.

const SITE = 'https://theautomationfoundry.com';

const PERSON_ID = `${SITE}/#nick`;
const ORG_ID = `${SITE}/#org`;
const WEBSITE_ID = `${SITE}/#website`;

type GraphNode = Record<string, unknown>;

export interface SiteGraphOptions {
  /** LinkedIn, GitHub, etc. — only what you actually want indexed. */
  personSameAs?: string[];
  /** Org-level social profiles. */
  orgSameAs?: string[];
  /** Optional portrait URL (absolute). */
  portraitUrl?: string;
  /** One-sentence personal bio. Falls back to a generic line. */
  personDescription?: string;
  /** Topics the org is known for — feeds AEO context graphs. */
  knowsAbout?: string[];
}

export function siteGraph(opts: SiteGraphOptions = {}): { '@context': string; '@graph': GraphNode[] } {
  const {
    personSameAs = [],
    orgSameAs = [],
    portraitUrl,
    personDescription = 'Founder of The Automation Foundry. Helps entrepreneurs and business leaders use AI thoughtfully — to focus, strategize, and thrive.',
    knowsAbout = [
      'AI integration',
      'Workflow automation',
      'Systems consulting',
      'Fractional CTO advisory',
    ],
  } = opts;

  const person: GraphNode = {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: 'Nick Parsons',
    givenName: 'Nick',
    familyName: 'Parsons',
    jobTitle: 'Founder',
    email: 'nick@theautomationfoundry.com',
    url: SITE,
    worksFor: { '@id': ORG_ID },
    description: personDescription,
    ...(portraitUrl ? { image: portraitUrl } : {}),
    ...(personSameAs.length > 0 ? { sameAs: personSameAs } : {}),
  };

  const organization: GraphNode = {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: 'The Automation Foundry',
    url: SITE,
    logo: `${SITE}/favicon.svg`,
    founder: { '@id': PERSON_ID },
    description:
      'A solo digital studio helping people become more fully alive through thoughtfully leveraging technology. We build systems, automations, and AI integrations with intention.',
    slogan: 'Thoughtful technology craftsmanship.',
    knowsAbout,
    areaServed: 'Worldwide',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'nick@theautomationfoundry.com',
      contactType: 'customer support',
      availableLanguage: ['en'],
    },
    ...(orgSameAs.length > 0 ? { sameAs: orgSameAs } : {}),
  };

  const website: GraphNode = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE,
    name: 'The Automation Foundry',
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-US',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [person, organization, website],
  };
}
