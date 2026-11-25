/**
 * The one client entry (Kai), loaded by SeamHead on every page. Each piece looks for its
 * markup and inits idempotently, on DOMContentLoaded and again on `protected:unlocked`
 * (components inside an encrypted case body appear only after unlock).
 * The WebGL hero is a lazy chunk; everything else is small.
 */
import { onReady } from './env';
import { initTheme } from './theme';
import { initWorking } from './working';
import { initNav } from './nav';
import { initWorkIndex } from './work-index';
import { initSpecScrub } from './spec-scrub';
import { initMeasure } from './measure';
import { initDecisionTrail } from './decision-trail';
import { initVideo } from './video';
import { initHero } from './seam-hero';

/* each in its own guard, so one failure never takes the others down */
[initTheme, initWorking, initNav, initHero, initWorkIndex, initSpecScrub, initMeasure, initDecisionTrail, initVideo].forEach((fn) =>
  onReady(fn),
);
