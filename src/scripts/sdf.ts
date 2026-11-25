/**
 * Signed distance field of the ER mark (Kai): the two paths are rasterised at N×N, run
 * through an exact Euclidean distance transform (Felzenszwalb & Huttenlocher), signed, and
 * smoothed twice with a 3-tap box so 45° raster staircases don't show in the relief.
 * Output: Float32Array N*N*2 (R = outer frame, G = inner arrow), distances in texels.
 * Runs in a Worker (OffscreenCanvas) or, failing that, on the main thread.
 */
type Ctx2D = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

function edt1d(f: Float64Array, n: number, d: Float64Array, v: Int32Array, z: Float64Array) {
  let k = 0;
  v[0] = 0;
  z[0] = -1e20;
  z[1] = 1e20;
  for (let q = 1; q < n; q++) {
    let s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    while (s <= z[k]) {
      k--;
      s = (f[q] + q * q - (f[v[k]] + v[k] * v[k])) / (2 * q - 2 * v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k + 1] = 1e20;
  }
  k = 0;
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++;
    d[q] = (q - v[k]) * (q - v[k]) + f[v[k]];
  }
}

function edt(g: Float64Array, n: number) {
  const f = new Float64Array(n);
  const d = new Float64Array(n);
  const v = new Int32Array(n);
  const z = new Float64Array(n + 1);
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) f[y] = g[y * n + x];
    edt1d(f, n, d, v, z);
    for (let y = 0; y < n; y++) g[y * n + x] = d[y];
  }
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) f[x] = g[y * n + x];
    edt1d(f, n, d, v, z);
    for (let x = 0; x < n; x++) g[y * n + x] = d[x];
  }
}

function smooth(g: Float32Array, n: number) {
  const t = new Float32Array(n * n);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      t[i] = (g[i - (x > 0 ? 1 : 0)] + g[i] + g[i + (x < n - 1 ? 1 : 0)]) / 3;
    }
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      g[i] = (t[i - (y > 0 ? n : 0)] + t[i] + t[i + (y < n - 1 ? n : 0)]) / 3;
    }
}

export type SdfInput = { n: number; fill: number; w: number; h: number; paths: [string, string] };

export function buildSDF(ctx: Ctx2D, { n, fill, w, h, paths }: SdfInput): Float32Array {
  const s = (fill * n) / w;
  const out = new Float32Array(n * n * 2);
  paths.forEach((path, ch) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, n, n);
    ctx.setTransform(s, 0, 0, s, n / 2 - (w / 2) * s, n / 2 - (h / 2) * s);
    ctx.fillStyle = '#fff';
    ctx.fill(new Path2D(path));
    const px = ctx.getImageData(0, 0, n, n).data;
    const a = new Float64Array(n * n);
    const b = new Float64Array(n * n);
    for (let i = 0; i < n * n; i++) {
      const inside = px[i * 4 + 3] > 127;
      a[i] = inside ? 0 : 1e20;
      b[i] = inside ? 1e20 : 0;
    }
    edt(a, n);
    edt(b, n);
    const sd = new Float32Array(n * n);
    for (let i = 0; i < n * n; i++) {
      const da = Math.sqrt(a[i]);
      const db = Math.sqrt(b[i]);
      sd[i] = (da > 0 ? da - 0.5 : 0) - (db > 0 ? db - 0.5 : 0);
    }
    smooth(sd, n);
    smooth(sd, n);
    for (let i = 0; i < n * n; i++) out[i * 2 + ch] = sd[i];
  });
  return out;
}
