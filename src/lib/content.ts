/**
 * Content queries shared by pages (Theo). Every list on the site goes through here, so the
 * publishing rules live in one place:
 *
 *   published  = not draft, not visibility:draft, not confidentiality:pending  (dev shows all)
 *   listed     = published and not visibility:unlisted
 *   locked     = protected: true -> listed as title + lock only (no cover, summary or hook)
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'work'>;
export type Lab = CollectionEntry<'lab'>;
export type Note = CollectionEntry<'notes'>;
export type AnyEntry = Work | Lab | Note;
export type Profile = CollectionEntry<'profile'>['data'];
export type Site = CollectionEntry<'site'>['data'];

type Publishing = { draft: boolean; visibility: 'public' | 'unlisted' | 'draft'; confidentiality: string; protected: boolean };

export const isDev = import.meta.env.DEV;

export function isPublished(data: Publishing): boolean {
  if (isDev) return true;
  return !data.draft && data.visibility !== 'draft' && data.confidentiality !== 'pending';
}

export function isUnpublished(data: Publishing): boolean {
  return data.draft || data.visibility === 'draft' || data.confidentiality === 'pending';
}

export function isListed(data: Publishing): boolean {
  return isPublished(data) && data.visibility !== 'unlisted';
}

/** Pages that must carry `<meta name="robots" content="noindex">` and stay out of the sitemap. */
export function isNoindex(data: Publishing): boolean {
  return data.protected || data.visibility === 'unlisted' || isUnpublished(data);
}

const byOrderThenYear = <T extends { data: { order?: number; year: number; title: string } }>(a: T, b: T) =>
  (a.data.order ?? Number.POSITIVE_INFINITY) - (b.data.order ?? Number.POSITIVE_INFINITY) ||
  b.data.year - a.data.year ||
  a.data.title.localeCompare(b.data.title);

/** All work that gets a page, in display order. */
export async function getWork(): Promise<Work[]> {
  return (await getCollection('work', ({ data }) => isPublished(data))).sort(byOrderThenYear);
}

export async function getLab(): Promise<Lab[]> {
  return (await getCollection('lab', ({ data }) => isPublished(data))).sort(byOrderThenYear);
}

export async function getNotes(): Promise<Note[]> {
  return (await getCollection('notes', ({ data }) => isPublished(data))).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/** A lab entry gets its own page only when its MDX has a body. */
export function hasBody(entry: AnyEntry): boolean {
  return Boolean(entry.body && entry.body.replace(/^\s*(import|export)\s.*$/gm, '').trim().length > 0);
}

export function hrefFor(entry: AnyEntry): string {
  if (entry.collection === 'lab') {
    if (hasBody(entry)) return `/lab/${entry.id}/`;
    const external = entry.data.links[0]?.url;
    if (external && !entry.data.protected) return external;
    return `/lab/#${entry.id}`;
  }
  return `/${entry.collection}/${entry.id}/`;
}

export const pad = (n: number) => String(n).padStart(2, '0');

const workStatus: Record<Work['data']['status'], string> = {
  shipped: 'Shipped',
  'in-progress': 'In progress',
  prototype: 'Prototype',
  concept: 'Concept',
  exercise: 'Design exercise',
};
const labStatus: Record<Lab['data']['status'], string> = { live: 'Live', wip: 'In progress', archived: 'Archived' };
const labKind: Record<Lab['data']['kind'], string> = {
  tool: 'Tool',
  plugin: 'Plugin',
  'agent-team': 'Agent team',
  motion: 'Motion',
  experiment: 'Experiment',
  app: 'App',
};

export const statusLabel = (entry: Work | Lab) =>
  entry.collection === 'work' ? workStatus[entry.data.status] : labStatus[entry.data.status];
export const kindLabel = (entry: Lab) => labKind[entry.data.kind];

/** Props for Kai's <WorkIndex>. Locked (protected) rows never get a preview image. */
export function toIndexItems(entries: (Work | Lab)[]) {
  return entries.map((entry, i) => {
    const locked = entry.data.protected;
    return {
      href: hrefFor(entry),
      number: pad(i + 1),
      title: entry.data.title,
      role: entry.collection === 'work' ? entry.data.role.join(', ') : kindLabel(entry),
      shipped: `${statusLabel(entry)} · ${entry.data.year}`,
      locked,
      ...(locked ? {} : { preview: entry.data.cover, previewAlt: entry.data.coverAlt }),
    };
  });
}

export async function getProfile(): Promise<Profile> {
  const entry = await getEntry('profile', 'profile');
  if (!entry) throw new Error('[content] src/data/profile.yaml did not load.');
  return entry.data;
}

export async function getSite(): Promise<Site> {
  const entry = await getEntry('site', 'site');
  if (!entry) throw new Error('[content] src/data/site.yaml did not load.');
  return entry.data;
}

type PageCopy = { title: string; lede?: string; description: string };
/** Page heading/lede/description, overridable from site.yaml `pages.<key>` (Nora's words win). */
export async function pageCopy(key: string, defaults: PageCopy): Promise<PageCopy> {
  const site = await getSite();
  const o = site.pages?.[key] ?? {};
  return { title: o.title ?? defaults.title, lede: o.lede ?? defaults.lede, description: o.description ?? defaults.description };
}

/** Minutes to read, from the raw MDX body (imports, JSX tags and markup stripped). */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const words = body
    .replace(/^\s*(import|export)\s.*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>[\]()!-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Placeholder guard: Nora marks facts only Enrico can supply as "TODO(Enrico)". Links and contact
 * details built from such a value are skipped instead of rendering a broken href. (CI refuses to
 * deploy while any TODO(Enrico) remains in profile.yaml.)
 */
export const known = (v: string | undefined | null): v is string => Boolean(v && !v.includes('TODO('));

/** Splits a YAML block string into paragraphs. */
export const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
