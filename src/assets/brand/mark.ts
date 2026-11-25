/**
 * The ER mark: an open diamond, and an arrow that leaves through its open side.
 * Single source of truth for every place the mark is drawn (inline SVG, the
 * WebGL seam hero's distance field, favicons).
 *
 * OUTER is kept verbatim from the 2025 logo (src/imports/enricortan-logo.svg).
 * INNER is the tidied arrow (2026-11-25, approved by Enrico): the source had
 * 0.1–0.2 unit jogs and 32.1–32.3 unit horizontal/vertical arms against 33 unit
 * diagonals. Now every arm is 33 wide, every edge is exactly 0°, 45° or 90°, and
 * both tails end in true r 16.5 semicircles.
 */
export const MARK_W = 334.2;
export const MARK_H = 324;
export const MARK_VIEWBOX = `0 0 ${MARK_W} ${MARK_H}`;

export const MARK_OUTER =
  'M302.7,141.9L162.9,281.8L46.1,165L185.8,25.3L162.5,2L11.1,153.4c-6.4,6.4-6.4,16.8,0,23.1l140.2,140.2c6.4,6.4,16.8,6.4,23.1,0L326,165.2L302.7,141.9z';

export const MARK_INNER =
  'M244.2,83.4V152.87L173.935,223.135A16.5,16.5,0,0,1,150.6,199.8L211.2,139.2V116.4H187.67L127.535,176.535A16.5,16.5,0,0,1,104.2,153.2L174,83.4z';

/**
 * 16px simplified cut (viewBox 0 0 16 16). At 16px the two 1.5px tails of the
 * arrow clog, so the cut keeps the frame (2px stroke, open top-right side) and
 * draws the arrow as one ↗: a pixel-aligned 4×4 head and a 2px shaft, each at
 * least 0.84px clear of the frame. FRAME is stroked, ARROW is filled.
 */
export const FAV16_FRAME = 'M8 1.4 1.4 8 8 14.6 14.6 8';
export const FAV16_ARROW = 'M8 4H12V8L10.71 6.71 6.71 10.71 5.29 9.29 9.29 5.29Z';
