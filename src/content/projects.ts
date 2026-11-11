import type { Project } from './types';

// Order is deliberate: backend first, to match the backend-first story.
// Add `caseStudy` and `links` only with real, approved content (gate 1).
export const projects: Project[] = [
  {
    slug: 'backend-services',
    title: 'Backend services',
    layer: 'backend',
    group: 'professional',
    summary:
      'Java and Spring Boot services with REST APIs, including moving an analytics feature out of a larger application into its own service.',
    stack: ['Java', 'Spring Boot', 'REST'],
  },
  {
    slug: 'mobile-app',
    title: 'Mobile application',
    layer: 'mobile',
    group: 'professional',
    summary:
      'Production React Native app for iOS and Android. Work includes collections, document and video viewing, offline content, and a major React Native upgrade.',
    stack: ['React Native', 'iOS', 'Android'],
  },
  {
    slug: 'desktop-app',
    title: 'Desktop application',
    layer: 'desktop',
    group: 'professional',
    summary:
      'Electron app for desktop. Work includes offline content and bringing a hub experience over from the web app.',
    stack: ['Electron', 'JavaScript'],
  },
  {
    slug: 'maatram-connect',
    title: 'Maatram Connect',
    layer: 'backend',
    group: 'earlier',
    summary:
      'A platform for a foundation: students keep their profiles, and stakeholders manage approvals and follow academic progress.',
    stack: ['Java', 'Spring', 'React Native', 'AWS'],
  },
  {
    slug: 'life-jacket',
    title: 'Intelligent Life Jacket',
    layer: 'hardware',
    group: 'earlier',
    summary:
      "Sensors and LoRa send a wearer's health data to a remote monitor. Built with Embedded C for extreme conditions.",
    stack: ['Embedded C', 'LoRa'],
  },
];
