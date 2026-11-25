/**
 * How protected entries render, decided once per run by src/integrations/protect.ts and
 * injected as the compile-time constant __PROTECT_MODE__ (it never carries the password):
 *
 *   'dev'      astro dev: plaintext + a visible "DEV: protected" badge
 *   'encrypt'  astro build with PROTECTED_PASSWORD: plaintext between sentinels, sealed after the build
 *   'locked'   astro build without PROTECTED_PASSWORD: a "locked — unavailable" notice only (fail safe)
 */
declare const __PROTECT_MODE__: string | undefined;

export type ProtectMode = 'dev' | 'encrypt' | 'locked';

const injected = typeof __PROTECT_MODE__ === 'string' ? __PROTECT_MODE__ : undefined;

export const protectMode: ProtectMode = import.meta.env.DEV
  ? 'dev'
  : injected === 'encrypt'
    ? 'encrypt'
    : 'locked'; // unknown or missing -> fail safe
