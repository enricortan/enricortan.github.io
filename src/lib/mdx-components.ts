/**
 * Components available in every MDX body WITHOUT an import. Pages pass this map to
 * `<Content components={mdxComponents} />`. Media still needs an import in the MDX:
 *
 *   import shot from './media/01-directory.png';
 *   <Figure src={shot} alt="…" caption="…" />
 */
import DecisionTrail from '@/components/seam/DecisionTrail.astro';
import Figure from '@/components/seam/Figure.astro';
import MarginNote from '@/components/seam/MarginNote.astro';
import SpecScrub from '@/components/seam/SpecScrub.astro';
import SpecSheet from '@/components/seam/SpecSheet.astro';
import Video from '@/components/seam/Video.astro';

export const mdxComponents = { Figure, Video, SpecScrub, DecisionTrail, MarginNote, SpecSheet };
