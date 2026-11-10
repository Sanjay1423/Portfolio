// Content types. Optional fields (`?:`) are omitted until real content exists.
// Never put placeholder strings like "TODO" in data: missing optional fields render nothing.

export type LayerId = 'hardware' | 'backend' | 'desktop' | 'mobile';
export type ProjectGroup = 'professional' | 'earlier';

export interface Profile {
  name: string;
  role: string;
  company: string;
  city: string;
  email: string;
  linkedin: string;
  github: string;
  degree: { title: string; school: string; dates: string };
  started: string;
  positioning: string;
  about: [string, string];
  pullQuote: string;
  aboutClosing: string;
  principles: string[];
  contactHeadline: string;
  contactSupporting: string;
  metaDescription: string;
  heroAlt: string;
  /** Path inside `public/`, e.g. "Sanjay-S-Resume.pdf". Omit until a PDF exists. */
  resume?: string;
  /** Optional one-line "Now". */
  now?: string;
}

export interface Layer {
  id: LayerId;
  name: string;
  items: string[];
  /** Small mono note, e.g. "earlier project". */
  note?: string;
  /** One sentence about what you did in this layer. */
  whatIDid?: string;
}

export interface ExperienceBullet {
  text: string;
  /** A real outcome or number for this bullet. */
  outcome?: string;
}

export interface Role {
  title: string;
  company: string;
  city: string;
  dates: string;
  bullets: ExperienceBullet[];
}

export interface Branch {
  kind: 'Education' | 'Volunteer';
  title: string;
  org: string;
  dates: string;
  bullets: string[];
}

export interface CaseStudy {
  problem: string;
  whatIDid: string;
  decision: string;
  result: string;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  layer: LayerId;
  group: ProjectGroup;
  summary: string;
  stack: string[];
  status?: string;
  caseStudy?: CaseStudy;
  links?: ProjectLink[];
}
