/**
 * Resolves video paths written in frontmatter (`coverVideo: ./media/hero.h264.mp4`) to the
 * hashed URL Vite emits (`/_astro/hero.h264.<hash>.mp4`). Images don't need this: `image()` in
 * the schema already handles them.
 *
 * Only files that are actually resolved by a rendered page end up referenced; the URL is hashed
 * and unlisted. A missing file throws, so a typo fails the build instead of shipping a dead video.
 */
import path from 'node:path';

const videos = import.meta.glob<string>(['/src/content/**/*.{mp4,webm}', '/src/content-private/**/*.{mp4,webm}'], {
  query: '?url',
  import: 'default',
  eager: true,
});

/** `entryFile` is the entry's `filePath` (e.g. `src/content/work/x/index.mdx`). */
export function resolveVideo(entryFile: string | undefined, relative: string): string {
  if (!entryFile) throw new Error(`[media] cannot resolve "${relative}": entry has no filePath`);
  const key = '/' + path.posix.normalize(path.posix.join(path.posix.dirname(entryFile.replaceAll('\\', '/')), relative));
  const url = videos[key];
  if (!url) {
    throw new Error(`[media] video not found: ${key} (referenced from ${entryFile}). Paths are relative to index.mdx.`);
  }
  return url;
}

/** `hero.h264.mp4` -> the URL of a sibling `hero.av1.mp4`, if one exists. */
export function resolveAv1Sibling(entryFile: string | undefined, h264Relative: string): string | undefined {
  if (!/\.h264\.mp4$/i.test(h264Relative)) return undefined;
  try {
    return resolveVideo(entryFile, h264Relative.replace(/\.h264\.mp4$/i, '.av1.mp4'));
  } catch {
    return undefined;
  }
}
