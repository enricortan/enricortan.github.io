import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  Star, PenTool, Figma, Sparkles, Lightbulb,
  Layout, Layers, Target, Grid3x3, Zap,
  Pin, Square, Code2, Compass, Pencil,
  Globe, BookOpen, StickyNote, Ruler, Scissors,
} from 'lucide-react';

function useIsDark() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setIsDark(el.classList.contains('dark')));
    obs.observe(el, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

const DARK: Record<string, { bg: string; glow: string; border: string; icon: string }> = {
  electric: { bg: 'rgba(99,102,241,0.18)',  glow: 'rgba(99,102,241,0.35)',  border: 'rgba(129,140,248,0.35)', icon: '#818cf8' },
  cyan:     { bg: 'rgba(6,182,212,0.15)',   glow: 'rgba(6,182,212,0.30)',   border: 'rgba(34,211,238,0.30)',  icon: '#22d3ee' },
  violet:   { bg: 'rgba(167,139,250,0.15)', glow: 'rgba(167,139,250,0.30)', border: 'rgba(196,181,253,0.30)', icon: '#c4b5fd' },
  rose:     { bg: 'rgba(244,63,94,0.14)',   glow: 'rgba(244,63,94,0.28)',   border: 'rgba(251,113,133,0.28)', icon: '#fb7185' },
  amber:    { bg: 'rgba(245,158,11,0.14)',  glow: 'rgba(245,158,11,0.28)',  border: 'rgba(252,211,77,0.28)',  icon: '#fcd34d' },
  emerald:  { bg: 'rgba(16,185,129,0.14)',  glow: 'rgba(16,185,129,0.28)',  border: 'rgba(52,211,153,0.28)',  icon: '#34d399' },
  sky:      { bg: 'rgba(14,165,233,0.14)',  glow: 'rgba(14,165,233,0.28)',  border: 'rgba(56,189,248,0.28)',  icon: '#38bdf8' },
  pink:     { bg: 'rgba(236,72,153,0.14)',  glow: 'rgba(236,72,153,0.28)',  border: 'rgba(244,114,182,0.28)', icon: '#f472b6' },
  lime:     { bg: 'rgba(132,204,22,0.12)',  glow: 'rgba(132,204,22,0.26)',  border: 'rgba(163,230,53,0.26)',  icon: '#a3e635' },
  fuchsia:  { bg: 'rgba(192,38,211,0.22)',  glow: 'rgba(192,38,211,0.45)',  border: 'rgba(232,121,249,0.50)', icon: '#e879f9' },
};

const LIGHT: Record<string, { bg: string; glow: string; border: string; icon: string }> = {
  electric: { bg: 'rgba(99,102,241,0.07)',  glow: 'rgba(99,102,241,0.12)',  border: 'rgba(99,102,241,0.22)',  icon: '#6366f1' },
  cyan:     { bg: 'rgba(6,182,212,0.06)',   glow: 'rgba(6,182,212,0.10)',   border: 'rgba(6,182,212,0.20)',   icon: '#0891b2' },
  violet:   { bg: 'rgba(139,92,246,0.07)',  glow: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.22)',  icon: '#7c3aed' },
  rose:     { bg: 'rgba(244,63,94,0.06)',   glow: 'rgba(244,63,94,0.10)',   border: 'rgba(244,63,94,0.20)',   icon: '#e11d48' },
  amber:    { bg: 'rgba(217,119,6,0.06)',   glow: 'rgba(217,119,6,0.10)',   border: 'rgba(217,119,6,0.20)',   icon: '#b45309' },
  emerald:  { bg: 'rgba(5,150,105,0.06)',   glow: 'rgba(5,150,105,0.10)',   border: 'rgba(5,150,105,0.18)',   icon: '#059669' },
  sky:      { bg: 'rgba(14,165,233,0.06)',  glow: 'rgba(14,165,233,0.10)',  border: 'rgba(14,165,233,0.20)',  icon: '#0284c7' },
  pink:     { bg: 'rgba(219,39,119,0.06)',  glow: 'rgba(219,39,119,0.10)',  border: 'rgba(219,39,119,0.20)',  icon: '#db2777' },
  lime:     { bg: 'rgba(101,163,13,0.06)',  glow: 'rgba(101,163,13,0.10)',  border: 'rgba(101,163,13,0.20)',  icon: '#65a30d' },
  fuchsia:  { bg: 'rgba(162,28,175,0.09)',  glow: 'rgba(162,28,175,0.18)',  border: 'rgba(162,28,175,0.30)',  icon: '#a21caf' },
};

// ─────────────────────────────────────────────────────────────────────────────
//  EXACT GRID from Figma  —  9 columns × 9 rows, cell = 66 px
//
//  R = red (icon node)   _ = gray (empty space, same 66px)
//
//  Row 1:  R _ R _ R _ R _ R
//  Row 2:  _ _ _ _ _ _ _ _ _
//  Row 3:  R _ _ _ _ _ _ _ _
//  Row 4:  _ _ R _ R _ R _ _
//  Row 5:  R _ _ _ _ _ _ _ R   ← single tip at col 9
//  Row 6:  _ _ R _ R _ R _ _
//  Row 7:  R _ _ _ _ _ _ _ _
//  Row 8:  _ _ _ _ _ _ _ _ _
//  Row 9:  R _ R _ R _ R _ R
//
//  Cell centre (px) = ((col−1)×66 + 33,  (row−1)×66 + 33)
// ─────────────────────────────────────────────────────────────────────────────

const CELL = 66;
const COLS = 9;
const ROWS = 9;
const GRID = CELL * COLS; // 594 px

// (col, row) are 1-indexed
interface NodeDef {
  id: number; col: number; row: number;
  icon: any; color: string; size: number; delay: number;
}

const NODES: NodeDef[] = [
  // ── Row 1  (top bar: cols 1 3 5 7 9) ──────────────────────────────────────
  { id:  1, col: 1, row: 1, icon: Star,       color: 'electric', size: 62, delay: 0.00 },
  { id:  2, col: 3, row: 1, icon: PenTool,    color: 'cyan',     size: 58, delay: 0.15 },
  { id:  3, col: 5, row: 1, icon: Figma,      color: 'violet',   size: 58, delay: 0.30 },
  { id:  4, col: 7, row: 1, icon: Sparkles,   color: 'rose',     size: 58, delay: 0.45 },
  { id:  5, col: 9, row: 1, icon: Lightbulb,  color: 'amber',    size: 62, delay: 0.60 },

  // ── Row 3  (left col: col 1) ───────────────────────────────────────────────
  { id:  6, col: 1, row: 3, icon: Layout,     color: 'emerald',  size: 58, delay: 0.75 },

  // ── Row 4  (inner upper arm: cols 3 5 7) ──────────────────────────────────
  { id:  7, col: 3, row: 4, icon: Target,     color: 'electric', size: 58, delay: 2.10 },
  { id:  8, col: 5, row: 4, icon: Grid3x3,    color: 'sky',      size: 58, delay: 2.22 },
  { id:  9, col: 7, row: 4, icon: Zap,        color: 'cyan',     size: 58, delay: 2.34 },

  // ── Row 5  (left col + single tip) ────────────────────────────────────────
  { id: 10, col: 1, row: 5, icon: Layers,     color: 'sky',      size: 58, delay: 0.90 },
  { id: 11, col: 9, row: 5, icon: Pin,        color: 'fuchsia',  size: 68, delay: 2.55 }, // ◀ TIP

  // ── Row 6  (inner lower arm: cols 3 5 7) ──────────────────────────────────
  { id: 12, col: 3, row: 6, icon: Code2,      color: 'lime',     size: 58, delay: 2.10 },
  { id: 13, col: 5, row: 6, icon: Compass,    color: 'emerald',  size: 58, delay: 2.22 },
  { id: 14, col: 7, row: 6, icon: Pencil,     color: 'violet',   size: 58, delay: 2.34 },

  // ── Row 7  (left col: col 1) ────────────────────────────────────────────��
  { id: 15, col: 1, row: 7, icon: Square,     color: 'pink',     size: 58, delay: 1.05 },

  // ── Row 9  (bottom bar: cols 1 3 5 7 9) ───────────────────────────────────
  { id: 16, col: 1, row: 9, icon: BookOpen,   color: 'electric', size: 62, delay: 1.20 },
  { id: 17, col: 3, row: 9, icon: StickyNote, color: 'cyan',     size: 58, delay: 1.35 },
  { id: 18, col: 5, row: 9, icon: Ruler,      color: 'violet',   size: 58, delay: 1.50 },
  { id: 19, col: 7, row: 9, icon: Scissors,   color: 'rose',     size: 58, delay: 1.65 },
  { id: 20, col: 9, row: 9, icon: Globe,      color: 'amber',    size: 62, delay: 1.80 },
];

// px centre of a node within the 594×594 grid box
const cx = (n: NodeDef) => (n.col - 1) * CELL + CELL / 2;
const cy = (n: NodeDef) => (n.row - 1) * CELL + CELL / 2;
const byId = (id: number) => NODES.find(n => n.id === id)!;

// [fromId, toId]
const EDGES: [number, number][] = [
  // Top bar ────────────────────────────────────────────────────────────
  [1, 2], [2, 3], [3, 4], [4, 5],
  // Left column ──────────────────────────────────────────────────────────────
  [1, 6], [6, 10], [10, 15], [15, 16],
  // Bottom bar ───────────────────────────────────────────────────────────────
  [16, 17], [17, 18], [18, 19], [19, 20],
  // Inner upper arm ──────────────────────────────────────────────────────────
  [7, 8], [8, 9],
  // Inner lower arm ──────────────────────────────────────────────────────────
  [12, 13], [13, 14],
  // Two diagonals converging at single tip (id 11) ───────────────────────────
  [9, 11],   // g4 → i5  (upper arm → tip)
  [14, 11],  // g6 → i5  (lower arm → tip)
];

// ────────────────────────────��───────────────────────────────────────────
export function NetworkBackground() {
  const isDark = useIsDark();
  const col = (k: string) => isDark ? (DARK[k] ?? DARK.electric) : (LIGHT[k] ?? LIGHT.electric);

  const glowOp = isDark ? [0.30, 0.60, 0.30] : [0.10, 0.25, 0.10];
  const midOp  = isDark ? [0.38, 0.65, 0.38] : [0.12, 0.28, 0.12];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
      {/*
        Position the 594×594 grid on the right side of the hero, centred vertically.
        Gray cells (empty slots) are transparent — only nodes are visible.
        The SVG lines are drawn within the same coordinate space.
      */}
      <div
        className="absolute"
        style={{
          right: 180,
          top: '50%',
          transform: 'translateY(-50%) rotate(-45deg) scale(0.78)',
          transformOrigin: 'center center',
          width:  GRID,
          height: GRID,
        }}
      >
        {/* ── SVG connection lines ─────────────────────────────────────── */}
        <svg
          className="absolute inset-0"
          width={GRID} height={GRID}
          style={{ zIndex: 1 }}
        >
          <defs>
            <linearGradient id="lgD" x1="0" y1="0" x2="594" y2="594" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#818cf8" stopOpacity="0.70" />
              <stop offset="50%"  stopColor="#f472b6" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.70" />
            </linearGradient>
            <linearGradient id="lgL" x1="0" y1="0" x2="594" y2="594" gradientUnits="userSpaceOnUse">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.45" />
              <stop offset="50%"  stopColor="#db2777" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.45" />
            </linearGradient>
            {/* glow filter — mimics the glowing border ring on the Pin node */}
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* glow layer — blurred duplicate for the halo effect */}
          {EDGES.map(([aId, bId], i) => {
            const a = byId(aId);
            const b = byId(bId);
            const isInner = i >= 12;
            return (
              <motion.line
                key={`eg-${i}`}
                x1={cx(a)} y1={cy(a)}
                x2={cx(b)} y2={cy(b)}
                stroke={isDark ? 'url(#lgD)' : 'url(#lgL)'}
                strokeWidth={isInner ? 4 : 3}
                strokeLinecap="round"
                filter="url(#lineGlow)"
                style={{ opacity: isDark ? 0.45 : 0.25 }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: isDark ? 0.45 : 0.25 }}
                transition={{
                  duration: 1.1,
                  delay: isInner ? 1.9 + (i - 12) * 0.12 : i * 0.10,
                  ease: 'easeInOut',
                }}
              />
            );
          })}

          {/* crisp top layer */}
          {EDGES.map(([aId, bId], i) => {
            const a = byId(aId);
            const b = byId(bId);
            const isInner = i >= 12;
            return (
              <motion.line
                key={`e-${i}`}
                x1={cx(a)} y1={cy(a)}
                x2={cx(b)} y2={cy(b)}
                stroke={isDark ? 'url(#lgD)' : 'url(#lgL)'}
                strokeWidth={isInner ? 1.8 : 1.4}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 1.1,
                  delay: isInner ? 1.9 + (i - 12) * 0.12 : i * 0.10,
                  ease: 'easeInOut',
                }}
              />
            );
          })}
        </svg>

        {/* ── Icon nodes ───────────────────────────────────────────────── */}
        {NODES.map(node => {
          const c   = col(node.color);
          const sz  = node.size;
          const x   = cx(node) - sz / 2;
          const y   = cy(node) - sz / 2;
          return (
            <motion.div
              key={`n-${node.id}`}
              className="absolute"
              style={{ left: x, top: y, width: sz, height: sz, zIndex: 2 }}
              initial={{ opacity: 0, scale: 0, rotate: 45 }}
              animate={{ opacity: 1, scale: 1, rotate: 45 }}
              transition={{ duration: 0.45, delay: node.delay, ease: 'easeOut' }}
              whileHover={{ scale: 1.15, rotate: 45 }}
            >
              {/* outer glow */}
              <motion.div
                className="absolute rounded-full blur-2xl"
                style={{ inset: -18, background: c.glow }}
                animate={{ scale: [1, 1.4, 1], opacity: glowOp }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
              />
              {/* mid glow */}
              <motion.div
                className="absolute rounded-full blur-md"
                style={{ inset: -6, background: c.glow }}
                animate={{ scale: [1, 1.2, 1], opacity: midOp }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay + 0.5 }}
              />
              {/* body */}
              <motion.div
                className="absolute inset-0 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{
                  background: c.bg,
                  border:     `1px solid ${c.border}`,
                  boxShadow:  isDark ? `0 0 18px ${c.glow}` : `0 2px 12px ${c.glow}`,
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear', delay: node.delay }}
              >
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: node.delay + 0.8 }}
                >
                  <node.icon size={32} color={c.icon} strokeWidth={1.5} />
                </motion.span>
              </motion.div>
              {/* pulse ring 1 */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `1px solid ${c.border}` }}
                animate={{ scale: [1, 2.1], opacity: [isDark ? 0.55 : 0.32, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: node.delay + 1.0 }}
              />
              {/* pulse ring 2 */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: `1px solid ${c.border}` }}
                animate={{ scale: [1, 2.8], opacity: [isDark ? 0.32 : 0.18, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: node.delay + 1.6 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}