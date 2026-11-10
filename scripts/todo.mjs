// Lists every optional content field that is still missing (spec Section 6).
// Uses Node's built-in TypeScript type stripping (Node >= 22.18).
import { profile } from '../src/content/profile.ts';
import { layers } from '../src/content/stack.ts';
import { roles } from '../src/content/experience.ts';
import { projects } from '../src/content/projects.ts';

const todo = [];
if (!profile.resume) todo.push('profile.resume: add a PDF to public/ and set the filename');
if (!profile.now) todo.push('profile.now (optional): one line on what you are working on');
for (const l of layers) if (!l.whatIDid) todo.push(`stack.${l.id}.whatIDid: one sentence on what you did in this layer`);
for (const r of roles)
  r.bullets.forEach((b, i) => {
    if (!b.outcome) todo.push(`experience "${r.title}" bullet ${i + 1}.outcome: a real outcome or number`);
  });
for (const p of projects) {
  if (!p.caseStudy) todo.push(`projects.${p.slug}.caseStudy: problem / whatIDid / decision / result`);
  if (!p.links?.length) todo.push(`projects.${p.slug}.links: public links, if any`);
}

console.log(todo.length ? `${todo.length} optional fields still missing:\n` : 'Nothing missing.');
todo.forEach((t) => console.log(`  - ${t}`));
