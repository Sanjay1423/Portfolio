// Copy audit (spec Section 14, Phase 2/8).
// Extracts visible text, alt and aria-label values from the legacy site, removes the
// intentional removals in spec Section 2.2, and checks that every remaining string still exists.
//
//   npm run audit                 -> checks src/content/*.ts, and dist/index.html if it exists
//   npm run audit -- --legacy path/to/old-index.html   (default: `git show legacy-v1:index.html`)
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const legacyArg = args.indexOf('--legacy');

function loadLegacy() {
  if (legacyArg !== -1) return readFileSync(args[legacyArg + 1], 'utf8');
  try {
    return execSync('git show legacy-v1:index.html', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    console.error('Could not read legacy-v1:index.html. Create the tag (git tag legacy-v1 <old commit>) or pass --legacy <file>.');
    process.exit(2);
  }
}

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&#x27;': "'", '&nbsp;': ' ', '&copy;': '©' };
const decode = (s) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&[a-z#0-9]+;/gi, (e) => ENTITIES[e] ?? e);
const norm = (s) => decode(s).replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

function extract(html) {
  const body = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const out = new Set();
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (title) out.add(norm(title[1]));
  for (const m of body.matchAll(/\s(?:alt|aria-label)="([^"]*)"/g)) if (norm(m[1])) out.add(norm(m[1]));
  const bodyOnly = body.replace(/<head[\s\S]*?<\/head>/i, ' ');
  // Drop inline tags (keep their text), then split on block tags: one string per block.
  const flat = bodyOnly.replace(/<\/?(a|span|strong|em|i|b|small|code)\b[^>]*>/gi, '');
  for (const chunk of flat.split(/<[^>]+>/)) {
    const text = norm(chunk);
    if (text) out.add(text);
  }
  return [...out].filter((t) => /[A-Za-z]/.test(t));
}

// Spec Section 2.2: intentionally dropped or replaced.
const REMOVED = new Set(
  [
    'Sanjay S — Software Engineer',
    'Full-stack engineer focused on services that stay maintainable and software that holds up in production.',
    'Languages, services, clients, and the tools I use to ship them.',
    'Professional work, a degree in electronics, and volunteer teaching.',
    'Product engineering across mobile, desktop, and backend, plus earlier projects.',
    'Software Engineer at Paperflite.',
    "I'm Software Engineer",
    'Home',
    'Skills',
    'Languages',
    'Clients',
    'Databases and tools',
    'Professional',
    'Education and volunteering',
    'Email',
    'LinkedIn',
    'GitHub',
    'City',
    'City Chennai',
    'Degree',
    'Degree BE ECE, St. Peters Institute of Higher Education and Research',
    'Email sanjayssp1423@gmail.com',
    'LinkedIn linkedin.com/in/sanjay-s-developer',
    'GitHub github.com/Sanjay1423',
    'linkedin.com/in/sanjay-s-developer',
    'github.com/Sanjay1423',
    'Portrait of Sanjay S',
    'Sanjay S in a tea garden',
    '© Copyright Sanjay S All Rights Reserved',
    'Copyright',
    'All Rights Reserved',
    'Designed by BootstrapMade Distributed by ThemeWagon',
    'BootstrapMade',
    'ThemeWagon',
    'Open menu',
    'Scroll to top',
    'Filter projects',
    'Page', // old nav aria-label; now "Sections"
    // Containers whose sentences are checked individually.
    'Good engineering is more than writing code. It is understanding the problem, making careful technical decisions, working well with other people, and shipping something that is actually useful.',
  ].map(norm),
);

// Labels that legitimately appear as structural fragments in the new site under another form.
const legacy = extract(loadLegacy()).filter((t) => !REMOVED.has(t));

// Built in templates from separate fields (company + city), so only the rendered page can contain them.
const COMPOSED = new Set(['Paperflite, Chennai']);

function check(label, haystack, skipComposed = false) {
  const hay = norm(haystack);
  const missing = legacy.filter((t) => !(skipComposed && COMPOSED.has(t)) && !hay.includes(t));
  if (missing.length) {
    console.log(`✗ ${label}: ${missing.length} missing`);
    missing.forEach((m) => console.log(`   - ${m}`));
  } else {
    console.log(`✓ ${label}: all ${legacy.length} legacy strings present`);
  }
  return missing.length;
}

const sourceDirs = ['src/content', 'src/components'];
const contentText = sourceDirs
  .flatMap((dir) => readdirSync(dir).filter((f) => /\.(ts|astro)$/.test(f)).map((f) => join(dir, f)))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')
  // Strings in the data files are quoted; join list items so phrases like "Java" are found.
  .replace(/\\'/g, "'");

let failures = check('src/content + src/components', contentText, true);
if (existsSync('dist/index.html')) {
  const dist = readFileSync('dist/index.html', 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const attrs = [...dist.matchAll(/\s(?:alt|aria-label|content)="([^"]*)"/g)].map((m) => m[1]).join(' \n ');
  const text = `${dist.replace(/<[^>]+>/g, ' ')} \n ${attrs}`;
  failures += check('dist/index.html', text);
}
process.exit(failures ? 1 : 0);
