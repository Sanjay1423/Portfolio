import type { Branch, Role } from './types';

// Newest first. Copy is verbatim from the original site.
export const roles: Role[] = [
  {
    title: 'Software Engineer',
    company: 'Paperflite',
    city: 'Chennai',
    dates: 'May 2023 – Present',
    bullets: [
      { text: 'Build and maintain a production mobile app on iOS and Android.' },
      {
        text: 'Contribute to the desktop app, including offline content and a hub experience brought over from the web app.',
      },
      { text: 'Design and maintain backend services and REST APIs.' },
    ],
  },
  {
    title: 'Software Engineer Intern',
    company: 'Paperflite',
    city: 'Chennai',
    dates: 'Mar 2023 – May 2023',
    bullets: [
      {
        text: 'Built web applications and worked with several teams on design, development, and testing.',
      },
    ],
  },
];

export const promotion = { label: 'Promoted to full-time', date: 'May 2023' };

export const branches: Branch[] = [
  {
    kind: 'Education',
    title: 'BE ECE',
    org: 'St. Peters Institute of Higher Education and Research',
    dates: 'Sep 2020 – May 2024',
    bullets: [],
  },
  {
    kind: 'Volunteer',
    title: 'Volunteer',
    org: 'Maatram Foundation, Chennai',
    dates: 'From Jun 2021',
    bullets: [
      'Conducted Python training sessions for students.',
      'Helped coordinate student logistics for the Maatram Summit.',
    ],
  },
];
