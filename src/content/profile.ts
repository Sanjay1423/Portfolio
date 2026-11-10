import type { Profile } from './types';

// Copy is verbatim from the original site (see docs/REDESIGN_SPEC.md, Section 6).
export const profile: Profile = {
  name: 'Sanjay S',
  role: 'Software Engineer',
  company: 'Paperflite',
  city: 'Chennai',
  email: 'sanjayssp1423@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sanjay-s-developer/',
  github: 'https://github.com/Sanjay1423',
  degree: {
    title: 'BE ECE',
    school: 'St. Peters Institute of Higher Education and Research',
    dates: 'Sep 2020 – May 2024',
  },
  started: 'Mar 2023',
  // Gate 3, chosen Nov 10, 2026.
  positioning: 'I work across backend, mobile, and desktop, and care most about backend systems.',
  about: [
    'I joined Paperflite as an intern in March 2023 and moved into a full-time software engineer role in May 2023. Since then I have been building production software across backend services, web, mobile, and desktop.',
    'Working across those surfaces has shaped how I think about the way components interact, how systems change, and how to approach a problem on any part of the stack. I am most interested in backend engineering: designing services that stay maintainable, taking on hard technical problems, and making software more reliable.',
  ],
  pullQuote: 'Good engineering is more than writing code.',
  aboutClosing:
    'It is understanding the problem, making careful technical decisions, working well with other people, and shipping something that is actually useful.',
  principles: [
    'Services that stay maintainable.',
    'Understand the problem first.',
    'Ship something actually useful.',
  ],
  // Chosen Nov 10, 2026.
  contactHeadline: 'Let’s build something that holds up.',
  contactSupporting: 'Email is the most direct way to reach me. I am based in Chennai.',
  metaDescription:
    'Sanjay S is a software engineer in Chennai working across backend services, web, mobile, and desktop.',
  heroAlt: 'Black and white portrait of Sanjay S on a hillside',
  // resume: 'Sanjay-S-Resume.pdf',  // add the PDF to public/ and uncomment
};
