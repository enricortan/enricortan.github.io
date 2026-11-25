/**
 * Open Graph images. Each public entry gets a 1200×630 JPEG cut from its `ogImage` or `cover`
 * (sharp, at build time). Protected entries and pages without a cover get the generic brand
 * image from src/pages/og/default.png.ts, so protected screens never reach a social preview.
 */
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

export const DEFAULT_OG_PATH = '/og/default.png';
export const DEFAULT_OG_ALT = 'The ER mark: an open diamond with an arrow leaving through its open side.';

type OgSource = { protected: boolean; cover?: ImageMetadata; ogImage?: ImageMetadata; coverAlt?: string };

export async function ogImageFor(data: OgSource, site: URL | undefined): Promise<{ url: string; alt: string }> {
  const fallback = { url: new URL(DEFAULT_OG_PATH, site).href, alt: DEFAULT_OG_ALT };
  if (data.protected) return fallback;
  const src = data.ogImage ?? data.cover;
  if (!src) return fallback;
  const og = await getImage({ src, width: 1200, height: 630, fit: 'cover', format: 'jpg', quality: 80 });
  return { url: new URL(og.src, site).href, alt: data.coverAlt ?? '' };
}
