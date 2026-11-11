import type { Layer } from './types';

// Bottom to top. The diagram renders them top to bottom (Mobile first).
export const layers: Layer[] = [
  {
    id: 'hardware',
    name: 'Hardware',
    items: ['Embedded C', 'LoRa', 'C'],
    note: 'earlier project',
  },
  {
    id: 'backend',
    name: 'Backend',
    items: [
      'Java',
      'Spring',
      'Spring Boot',
      'Microservices',
      'REST APIs',
      'FastAPI',
      'Express',
      'MongoDB',
      'AWS',
      'Python',
    ],
  },
  {
    id: 'desktop',
    name: 'Desktop & Web',
    items: ['Electron', 'React', 'JavaScript'],
  },
  {
    id: 'mobile',
    name: 'Mobile',
    items: ['React Native', 'iOS', 'Android'],
  },
];

export const tooling: string[] = ['Git'];

export const layerName = (id: Layer['id']): string =>
  layers.find((l) => l.id === id)?.name ?? id;
