/** Builds the mark's distance field off the main thread (Kai). */
import { buildSDF, type SdfInput } from './sdf';

const scope = self as unknown as Worker;

scope.onmessage = (e: MessageEvent<SdfInput>) => {
  try {
    const c = new OffscreenCanvas(e.data.n, e.data.n);
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('no 2d context');
    const out = buildSDF(ctx, e.data);
    scope.postMessage(out, [out.buffer]);
  } catch (err) {
    scope.postMessage({ error: String(err) });
  }
};
