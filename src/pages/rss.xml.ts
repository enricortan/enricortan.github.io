import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getNotes, getProfile, isListed } from '@/lib/content';

/** Public notes only: never protected, unlisted, draft or pending entries. */
export async function GET(context: APIContext) {
  const profile = await getProfile();
  const notes = (await getNotes()).filter((n) => isListed(n.data) && !n.data.protected);
  return rss({
    title: `${profile.name} — Notes`,
    description: `Notes by ${profile.name}: ${profile.headline}`,
    site: context.site ?? 'https://enricortan.com',
    trailingSlash: true,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.summary,
      pubDate: n.data.date,
      link: `/notes/${n.id}/`,
      categories: n.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
