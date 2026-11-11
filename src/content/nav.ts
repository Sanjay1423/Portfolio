// Section anchors. `#hero` is reached through the wordmark; `#skills` is an alias inside #stack.
export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'contact', label: 'Contact' },
] as const;

export const sectionNumbers: Record<string, string> = {
  about: '02',
  stack: '03',
  experience: '04',
  work: '05',
  contact: '06',
};
