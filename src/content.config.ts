/**
 * Content schemas (Theo owns the mechanism, Nora owns the fields: study/01-content-audit.md §6).
 *
 *   src/content/work/<slug>/index.mdx    case studies   -> /work/<slug>/
 *   src/content/lab/<slug>/index.mdx     experiments    -> /lab/<slug>/ (only when the MDX has a body)
 *   src/content/notes/<slug>/index.mdx   writing        -> /notes/<slug>/
 *   src/data/profile.yaml, src/data/site.yaml
 *
 * Rules enforced here (a violation fails `astro build` and CI):
 * - work + lab: `cover` (an image file next to index.mdx) and `coverAlt` are required.
 * - notes: `cover` is optional, but a cover needs `coverAlt`.
 * - `draft: true`, `visibility: draft` and `confidentiality: pending` never build (see src/lib/loaders.ts).
 * - `protected: true` builds the page encrypted (src/integrations/protect.ts).
 */
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { entryFolders, yamlDocument } from './lib/loaders';

// ---------- shared pieces ----------

const text = z.string().trim().min(1);
const year = z.number().int().min(1990).max(2100);
/** Accepts `[a, b]` or a single `a`. */
const stringList = z
  .union([text, z.array(text)])
  .transform((v) => (Array.isArray(v) ? v : [v]));

/** `{label, url}`; `href` is accepted as an alias of `url`. */
const link = z
  .object({ label: text, url: text.optional(), href: text.optional() })
  .refine((l) => Boolean(l.url ?? l.href), { message: 'a link needs `url`' })
  .transform((l) => ({ label: l.label, url: (l.url ?? l.href) as string }));

const metric = z.object({
  label: text,
  value: z.union([text, z.number()]).transform(String),
  // "Sourced metrics only" (Nora §5): where the number comes from, e.g. "audit 2026-11-11".
  source: text,
});

const confidentiality = z.enum(['cleared', 'anonymised', 'pending']);
const visibility = z.enum(['public', 'unlisted', 'draft']).default('public');

/** Fields every collection shares. */
const publishing = {
  draft: z.boolean().default(false),
  visibility,
  /** Password-protected: the page body ships AES-256-GCM encrypted. */
  protected: z.boolean().default(false),
};

// ---------- collections ----------

const work = defineCollection({
  loader: entryFolders('work'),
  schema: ({ image }) =>
    z.object({
      title: text,
      summary: text.max(160),
      hook: text,
      client: text,
      role: stringList,
      team: text.optional(),
      year,
      period: text.optional(),
      status: z.enum(['shipped', 'in-progress', 'prototype', 'concept', 'exercise']),
      type: z.enum(['product', 'design-system', 'tool', 'brand', 'motion']),
      tools: z.array(text).default([]),
      cover: image(),
      coverAlt: text,
      /** H.264 MP4 next to index.mdx, e.g. `./media/hero.h264.mp4`. An `hero.av1.mp4` sibling is picked up automatically. */
      coverVideo: text.optional(),
      /** What the cover loop shows, in words (shown under the video). Falls back to coverAlt. */
      coverVideoDescription: text.optional(),
      poster: image().optional(),
      featured: z.boolean().default(false),
      order: z.number().optional(),
      confidentiality,
      disclaimer: text.optional(),
      metrics: z.array(metric).default([]),
      links: z.array(link).default([]),
      related: z.array(text).default([]),
      ogImage: image().optional(),
      updated: z.coerce.date().optional(),
      ...publishing,
    }),
});

const lab = defineCollection({
  loader: entryFolders('lab'),
  schema: ({ image }) =>
    z.object({
      title: text,
      summary: text.max(160),
      /** One line on what this shows about Enrico. */
      proof: text,
      kind: z.enum(['tool', 'plugin', 'agent-team', 'motion', 'experiment', 'app']),
      status: z.enum(['live', 'wip', 'archived']),
      year,
      cover: image(),
      coverAlt: text,
      confidentiality,
      video: text.optional(),
      /** What the loop shows, in words. Falls back to coverAlt. */
      videoDescription: text.optional(),
      poster: image().optional(),
      stack: z.array(text).default([]),
      links: z.array(link).default([]),
      featured: z.boolean().default(false),
      order: z.number().optional(),
      ...publishing,
    }),
});

const notes = defineCollection({
  loader: entryFolders('notes'),
  schema: ({ image }) =>
    z
      .object({
        title: text,
        summary: text.max(200),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        tags: z.array(text).default([]),
        cover: image().optional(),
        coverAlt: text.optional(),
        canonical: z.url().optional(),
        series: text.optional(),
        confidentiality: confidentiality.default('cleared'),
        ...publishing,
      })
      .refine((d) => !d.cover || Boolean(d.coverAlt), {
        message: 'a note with a `cover` also needs `coverAlt`',
        path: ['coverAlt'],
      }),
});

// ---------- data files ----------

/** Optional text that may also be left blank in YAML (`key:` or `key: ""`): both become undefined. */
const maybe = z
  .union([z.literal(''), text])
  .nullish()
  .transform((v) => v || undefined);

/** A social link whose `href`/`url` may still be missing: the site hides it until it's filled. */
const social = z
  .object({ label: text, href: maybe, url: maybe })
  .transform((s) => ({ label: s.label, url: s.url ?? s.href }));

const experienceItem = z.looseObject({
  role: text,
  company: text,
  /** Omit if unknown; the page shows what exists. */
  start: z.union([text, z.number()]).nullish().transform((v) => (v == null ? undefined : String(v))),
  /** `null` (or `end:` left blank) = current role ("Present"); omit the key if unknown. */
  end: z.union([text, z.number()]).nullish().transform((v) => (v === null ? null : v === undefined ? undefined : String(v))),
  location: text.optional(),
  summary: text.optional(),
  highlights: z.array(text).default([]),
});

const skillGroup = z.union([
  text,
  z.object({ group: text, items: z.array(text) }),
]);

const profile = defineCollection({
  loader: yamlDocument('src/data/profile.yaml', 'profile'),
  schema: ({ image }) =>
    z.looseObject({
      name: text,
      shortName: text.optional(),
      /** Hero lede, e.g. "I design products, build them, …". */
      headline: text,
      /** Short positioning line, used in the site title: "Designer who ships." */
      tagline: text.optional(),
      /** Long bio for /about: a list of paragraphs (or one string with blank lines between paragraphs). */
      bio: z.union([text, z.array(text).min(1)]).transform((v) =>
        Array.isArray(v) ? v : v.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      ),
      /** One or two sentences for the home page. Falls back to the first bio paragraph. */
      bioShort: text.optional(),
      photo: image().optional(),
      photoAlt: text.optional(),
      location: maybe,
      /** Required: the contact section and footer need it. */
      email: text,
      availability: maybe,
      cv: maybe,
      socials: z.array(social).default([]),
      experience: z.array(experienceItem).default([]),
      skills: z.array(skillGroup).default([]),
      speaking: z
        .array(
          z.looseObject({
            title: text,
            event: text.optional(),
            kind: text.optional(),
            date: z.union([text, z.number(), z.date()]).transform(String).optional(),
            status: text.optional(),
            summary: text.optional(),
            url: text.optional(),
          }),
        )
        .default([]),
    })
    .refine((d) => !d.photo || Boolean(d.photoAlt), { message: 'a `photo` needs `photoAlt`', path: ['photoAlt'] }),
});

const cta = z.object({ label: text, href: text });
/** A home-page section: heading, optional intro and "see all" link. */
const homeSection = z.looseObject({ heading: text.optional(), intro: text.optional(), cta: cta.optional() });

const site = defineCollection({
  loader: yamlDocument('src/data/site.yaml', 'site'),
  schema: z.looseObject({
    title: text,
    locale: text.default('en'),
    nav: z.array(z.object({ label: text, href: text })).min(1),
    seo: z
      .looseObject({
        /** `%s · Enrico R. Tan` — `%s` is the page title. */
        titleTemplate: text.refine((s) => s.includes('%s'), { message: 'titleTemplate must contain %s' }).optional(),
        /** Home page <title>. */
        defaultTitle: text.optional(),
        description: text.optional(),
        /** Default share image: a path under public/ or src/pages (e.g. /og/default.png). */
        ogImage: text.optional(),
      })
      .optional(),
    home: z
      .looseObject({
        hero: z
          .looseObject({
            eyebrow: text.optional(),
            title: text.optional(),
            lede: text.optional(),
            primaryCta: cta.optional(),
            secondaryCta: cta.optional(),
          })
          .optional(),
        selectedWork: homeSection.optional(),
        howIWork: z
          .looseObject({
            id: text.optional(),
            heading: text,
            lede: text.optional(),
            steps: z.array(z.object({ label: text, title: text, body: text })).min(1),
            cta: cta.optional(),
          })
          .optional(),
        lab: homeSection.optional(),
        notes: homeSection.optional(),
        about: z.looseObject({ heading: text.optional(), body: text.optional(), cta: cta.optional() }).optional(),
        contact: z
          .looseObject({ id: text.optional(), heading: text.optional(), body: text.optional(), emailLabel: text.optional() })
          .optional(),
      })
      .optional(),
    footer: z.looseObject({ note: text.optional(), colophonHref: text.optional() }).optional(),
    notFound: z.looseObject({ title: text.optional(), body: text.optional(), cta: cta.optional() }).optional(),
    protectedPage: z.looseObject({ heading: text.optional(), body: text.optional() }).optional(),
    /** Optional per-page copy: pages.work.lede, pages.about.description, … */
    pages: z
      .record(text, z.looseObject({ title: text.optional(), lede: text.optional(), description: text.optional() }))
      .optional(),
    /** Read by astro.config.mjs (exact paths -> static redirect pages) and 404.astro (wildcards). */
    redirects: z.array(z.object({ from: text, to: text })).default([]),
  }),
});

export const collections = { work, lab, notes, profile, site };
