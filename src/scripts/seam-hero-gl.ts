/**
 * HERO: the Seam (Kai). Raw WebGL2, one full-screen triangle, one fragment shader over a
 * signed distance field of the real logo paths. Left of a 45° "/" seam: the mark as a lit
 * relief with a cast shadow. Right: the same mark as a construction drawing (grid, offset
 * isolines, section hatching, outline, 45° axes) that clears behind the copy.
 * Renders on demand only: no idle loop. DPR ≤ 1.5. Context loss → the SVG fallback.
 * Loaded lazily by seam-hero.ts after fonts and first paint.
 */
import { MARK_H, MARK_INNER, MARK_OUTER, MARK_W } from '../assets/brand/mark';
import { buildSDF, type SdfInput } from './sdf';
import { cssVar, hexRGB, reduced, THEME_EVENT } from './env';

const N = 768;
const FILL = 0.42;
const HANDLE_Y = 56;

const VS = '#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = `#version 300 es
precision highp float;
uniform sampler2D uSdf;uniform vec2 uRes,uC;uniform float uK,uN,uSeamX,uDpr,uMark,uLight;uniform vec4 uClear;
uniform vec3 cBg,cHair,cAcc,cLine,cInk,cSig,cPlate,cMint;
out vec4 o;
vec2 sdf(vec2 f){vec2 t=vec2(f.x-uC.x,uC.y-f.y)/uK+0.5*uN;vec2 tc=clamp(t,vec2(1.),vec2(uN-1.));return (texture(uSdf,tc/uN).rg+length(t-tc))*uK;}
float band(float d,float w){return clamp(w-abs(d)+0.5,0.,1.);}
float per(float v,float s,float w){float d=(fract(v/s+0.5)-0.5)*s;return band(d,w);}
float hgt(vec2 d,float B){return max(smoothstep(0.,B,-d.x)*0.8,smoothstep(0.,B*0.8,-d.y));}
void main(){
 vec2 f=gl_FragCoord.xy;float px=uDpr;vec2 d=sdf(f);float sdU=min(d.x,d.y);
 float B=uMark*0.045;
 vec3 r=cBg;
 vec2 ds=sdf(f+vec2(-1.,1.)*uMark*0.032);
 float sh=1.-smoothstep(-B*0.5,B*2.2,min(ds.x,ds.y));
 float ao=exp(-max(sdU,0.)/(uMark*0.022));
 float k=uLight>0.5?0.10:0.5;
 r=mix(r,uLight>0.5?cInk:vec3(0.),clamp((sh*0.75+ao*0.45)*k,0.,1.));
 if(sdU<2.*px){
  float e=1.25*px;
  float hx=hgt(sdf(f+vec2(e,0.)),B)-hgt(sdf(f-vec2(e,0.)),B);
  float hy=hgt(sdf(f+vec2(0.,e)),B)-hgt(sdf(f-vec2(0.,e)),B);
  vec3 n=normalize(vec3(-hx/(2.*e)*B,-hy/(2.*e)*B,1.));
  vec3 L=normalize(vec3(-0.55,0.62,0.58));
  float diff=max(dot(n,L),0.);
  float spec=pow(max(dot(n,normalize(L+vec3(0.,0.,1.))),0.),36.);
  float inner=step(d.y,d.x);
  vec3 mat=mix(cPlate,cMint,inner);
  vec3 lit=mat*(0.52+0.62*diff)+spec*mix(cAcc,vec3(1.),0.5)*(0.3+0.35*inner);
  float slope=1.-n.z;
  lit+=cAcc*slope*max(dot(normalize(n.xy+1e-5),normalize(L.xy)),0.)*(1.-inner)*(uLight>0.5?0.5:1.1);
  r=mix(r,lit,1.-smoothstep(-0.75*px,0.75*px,sdU));
 }
 vec3 w=cBg;
 vec2 cq=max(uClear.xy-f,f-uClear.zw);float clr=1.-0.9*(1.-smoothstep(0.,56.*px,length(max(cq,0.))));
 vec2 cp=vec2(f.x,uRes.y-f.y)/px;
 vec2 g=abs(fract(cp/24.+0.5)-0.5)*24.*px;
 vec2 G=abs(fract(cp/96.+0.5)-0.5)*96.*px;
 w=mix(w,cHair,max(band(min(g.x,g.y),0.5)*0.4,band(min(G.x,G.y),0.5)*0.9)*clr);
 float s=uMark/18.;
 if(sdU>0.){
  float idx=floor(sdU/s+0.5);float mj=1.-step(0.5,mod(idx,5.));
  float a=per(sdU,s,mj>0.5?0.8*px:0.5*px);
  float fade=1.-smoothstep(uMark*0.05,uMark*0.6,sdU);
  w=mix(w,cLine,a*fade*(mj>0.5?0.95:0.5)*clr);
 } else {
  float h1=per((f.x+f.y)*0.7071068,7.*px,0.5*px);
  if(d.y<0.) h1=max(h1,per((f.x-f.y)*0.7071068,7.*px,0.5*px));
  w=mix(w,cLine,h1*0.6*clr);
 }
 w=mix(w,cAcc,max(band(d.x,0.75*px),band(d.y,0.75*px))*clr);
 vec2 rel=f-(uC+vec2(-4.1,-1.)*(uMark/334.2));
 float al=(rel.x+rel.y)*0.7071068,ac=(rel.x-rel.y)*0.7071068;
 w=mix(w,cLine,band(ac,0.5*px)*step(0.5,fract(al/(9.*px)))*(1.-step(uMark*0.62,abs(al)))*0.8*clr);
 w=mix(w,cLine,band(al,0.5*px)*step(0.5,fract(ac/(9.*px)))*(1.-step(uMark*0.62,abs(ac)))*0.8*clr);
 float sd=dot(f-vec2(uSeamX,uRes.y*0.5),vec2(0.7071068,-0.7071068));
 vec3 col=mix(r,w,smoothstep(-0.6*px,0.6*px,sd));
 col=mix(col,cSig,band(sd,0.6*px)*(0.28+0.72*clr));
 o=vec4(col,1.);
}`;

const UNIFORMS = ['uSdf', 'uRes', 'uC', 'uK', 'uN', 'uSeamX', 'uDpr', 'uMark', 'uLight', 'uClear', 'cBg', 'cHair', 'cAcc', 'cLine', 'cInk', 'cSig', 'cPlate', 'cMint'] as const;
const COLOURS: Record<string, string> = { cBg: '--bg', cHair: '--hair', cAcc: '--accent', cLine: '--accent-line', cInk: '--ink', cSig: '--signal', cPlate: '--relief-plate', cMint: '--relief-mint' };

function sdfData(): Promise<Float32Array> {
  const input: SdfInput = { n: N, fill: FILL, w: MARK_W, h: MARK_H, paths: [MARK_OUTER, MARK_INNER] };
  const mainThread = () => {
    const c = document.createElement('canvas');
    c.width = c.height = N;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('no 2d context');
    return buildSDF(ctx, input);
  };
  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') return Promise.resolve().then(mainThread);
  return new Promise<Float32Array>((resolve) => {
    let worker: Worker;
    try {
      worker = new Worker(new URL('./sdf.worker.ts', import.meta.url), { type: 'module' });
    } catch {
      resolve(mainThread());
      return;
    }
    const fail = () => {
      worker.terminate();
      resolve(mainThread());
    };
    const timer = setTimeout(fail, 4000);
    worker.onmessage = (e: MessageEvent<Float32Array | { error: string }>) => {
      clearTimeout(timer);
      worker.terminate();
      if (e.data instanceof Float32Array) resolve(e.data);
      else resolve(mainThread());
    };
    worker.onerror = () => {
      clearTimeout(timer);
      fail();
    };
    worker.postMessage(input);
  });
}

export async function initSeamHero(hero: HTMLElement): Promise<void> {
  const canvas = hero.querySelector<HTMLCanvasElement>('.hero-canvas');
  const handle = hero.querySelector<HTMLElement>('[data-seam-handle]');
  if (!canvas || !handle) return;

  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) return; // no WebGL2: the SVG mark stays
  let alive = true;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.bindAttribLocation(prog, 0, 'p');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? 'link');
  gl.useProgram(prog);
  const U = {} as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
  UNIFORMS.forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const data = await sdfData();
  if (!alive || gl.isContextLost()) return;
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, N, N, 0, gl.RG, gl.FLOAT, data);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(U.uSdf, 0);

  let W = 0;
  let H = 0;
  let dpr = 1;
  const mark = { size: 0, cx: 0, cy: 0 };
  const seam = { x: 0, target: 0, rest: 0 };
  let anim: { from: number; to: number; t0: number; dur: number } | null = null;
  let raf = 0;
  let lastT = 0;
  let following = false;
  let dragging = false;
  let userMoved = false;

  const seamLo = () => (W < 600 ? 28 : 112) - H / 2 + HANDLE_Y;
  const seamHi = () => W - (W < 600 ? 28 : 120) - H / 2 + HANDLE_Y;
  const clampSeam = (x: number) => Math.max(seamLo(), Math.min(seamHi(), x));

  function setColours() {
    gl!.useProgram(prog);
    for (const k of Object.keys(COLOURS)) {
      const [r, g, b] = hexRGB(cssVar(COLOURS[k]));
      gl!.uniform3f(U[k as keyof typeof U], r / 255, g / 255, b / 255);
    }
    gl!.uniform1f(U.uLight, document.documentElement.getAttribute('data-theme') === 'light' ? 1 : 0);
  }

  function layout() {
    W = hero.clientWidth;
    H = hero.clientHeight;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    /* desktop: the mark bleeds off the right edge and stays clear of the headline */
    if (W >= 900) {
      mark.size = Math.min(H * 0.76, W * 0.47);
      mark.cx = W - mark.size * 0.41;
      mark.cy = H * 0.41;
    } else {
      mark.size = Math.min(W, H * 0.5);
      mark.cx = W * 0.6;
      mark.cy = Math.max(64 + mark.size * 0.5, H * 0.32);
    }
    seam.rest = clampSeam(mark.cx - H / 2 + mark.cy);
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    gl!.viewport(0, 0, canvas!.width, canvas!.height);
    gl!.useProgram(prog);
    gl!.uniform2f(U.uRes, canvas!.width, canvas!.height);
    gl!.uniform2f(U.uC, mark.cx * dpr, canvas!.height - mark.cy * dpr);
    gl!.uniform1f(U.uMark, mark.size * dpr);
    gl!.uniform1f(U.uK, (mark.size * dpr) / (FILL * N));
    gl!.uniform1f(U.uN, N);
    gl!.uniform1f(U.uDpr, dpr);
    /* clear zone: the box around the headline's glyphs, the lede and the actions */
    const hr = hero.getBoundingClientRect();
    const boxes: DOMRect[] = [];
    const h1 = hero.querySelector('[data-hero-title]');
    if (h1) {
      const rng = document.createRange();
      rng.selectNodeContents(h1);
      boxes.push(rng.getBoundingClientRect());
    }
    hero.querySelectorAll('[data-hero-lede], [data-hero-actions]').forEach((el) => boxes.push(el.getBoundingClientRect()));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const b of boxes) {
      if (!b.width) continue;
      x0 = Math.min(x0, b.left);
      y0 = Math.min(y0, b.top);
      x1 = Math.max(x1, b.right);
      y1 = Math.max(y1, b.bottom);
    }
    if (x0 === Infinity) x0 = y0 = x1 = y1 = -9999;
    x0 -= hr.left + 8;
    x1 -= hr.left - 8;
    y0 -= hr.top + 8;
    y1 -= hr.top - 8;
    gl!.uniform4f(U.uClear, x0 * dpr, (H - y1) * dpr, x1 * dpr, (H - y0) * dpr);
  }

  function draw() {
    if (!alive) return;
    gl!.uniform1f(U.uSeamX, seam.x * dpr);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    const hx = seam.x + H / 2 - HANDLE_Y;
    handle!.style.transform = `translate(${hx}px,${HANDLE_Y}px)`;
    const lo = seamLo();
    const hi = seamHi();
    const pct = Math.round(((seam.x - lo) / Math.max(1, hi - lo)) * 100);
    handle!.setAttribute('aria-valuenow', String(pct));
    handle!.setAttribute('aria-valuetext', `${pct}%: render on the left, working on the right`);
  }

  function tick(t: number) {
    raf = 0;
    const dt = lastT ? Math.min(64, t - lastT) : 16;
    lastT = t;
    if (anim) {
      const k = Math.max(0, Math.min(1, (t - anim.t0) / anim.dur));
      const e = 1 - Math.pow(2, -10 * k);
      seam.x = anim.from + (anim.to - anim.from) * e;
      if (k >= 1) anim = null;
    } else {
      seam.x += (seam.target - seam.x) * (1 - Math.exp(-dt / 90));
      if (Math.abs(seam.target - seam.x) < 0.25) seam.x = seam.target;
    }
    draw();
    if (anim || seam.x !== seam.target) raf = requestAnimationFrame(tick);
    else lastT = 0;
  }
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const setTarget = (x: number, immediate = false) => {
    anim = null;
    seam.target = clampSeam(x);
    if (immediate) {
      seam.x = seam.target;
      draw();
    } else kick();
  };

  setColours();
  layout();

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    alive = false;
    hero.classList.remove('gl-on');
  });

  /* intro: the page opens as a drawing and the seam sweeps once to reveal the render */
  const start = new URLSearchParams(location.search).get('seam');
  if (start !== null && !Number.isNaN(parseFloat(start))) {
    seam.x = seam.target = seam.rest = clampSeam(seamLo() + parseFloat(start) * (seamHi() - seamLo()));
    draw();
  } else if (reduced()) {
    seam.x = seam.target = seam.rest;
    draw();
  } else {
    seam.x = seamLo();
    seam.target = seam.rest;
    anim = { from: seam.x, to: seam.rest, t0: performance.now() + 120, dur: 1300 };
    draw();
    kick();
  }
  hero.classList.add('gl-on');

  hero.addEventListener('pointermove', (e) => {
    if (!alive || e.pointerType !== 'mouse' || reduced() || dragging) return;
    const r = hero.getBoundingClientRect();
    following = true;
    setTarget(e.clientX - r.left - H / 2 + (e.clientY - r.top));
  });
  hero.addEventListener('pointerleave', () => {
    if (following && !dragging) {
      following = false;
      setTarget(seam.rest);
    }
  });
  handle.addEventListener('pointerdown', (e) => {
    dragging = true;
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  handle.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const r = hero.getBoundingClientRect();
    setTarget(e.clientX - r.left - H / 2 + HANDLE_Y, true);
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    userMoved = true;
    seam.rest = seam.target;
  };
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
  handle.addEventListener('keydown', (e) => {
    const lo = seamLo();
    const hi = seamHi();
    const step = (hi - lo) / 20;
    let x = seam.target;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') x -= step;
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') x += step;
    else if (e.key === 'PageDown') x -= step * 4;
    else if (e.key === 'PageUp') x += step * 4;
    else if (e.key === 'Home') x = lo;
    else if (e.key === 'End') x = hi;
    else return;
    e.preventDefault();
    setTarget(x, true);
    userMoved = true;
    seam.rest = seam.target;
  });

  document.addEventListener(THEME_EVENT, () => {
    if (!alive) return;
    setColours();
    draw();
  });
  let lastW = hero.clientWidth;
  let lastH = hero.clientHeight;
  new ResizeObserver(() => {
    if (!alive) return;
    if (hero.clientWidth === lastW && Math.abs(hero.clientHeight - lastH) < 80) return;
    const frac = (seam.rest - seamLo()) / Math.max(1, seamHi() - seamLo());
    lastW = hero.clientWidth;
    lastH = hero.clientHeight;
    layout(); // recomputes seam.rest from the mark
    if (userMoved) seam.rest = clampSeam(seamLo() + frac * (seamHi() - seamLo()));
    anim = null;
    seam.x = seam.target = seam.rest;
    draw();
  }).observe(hero);
}
