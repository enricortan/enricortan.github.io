/**
 * Generic brand Open Graph image (1200×630), used by protected entries and pages without a cover.
 * If Kai drops a finished `src/assets/brand/og-default.png`, that file is used as-is (resized);
 * otherwise this draws the mark from Kai's geometry (src/assets/brand/mark.ts) on the Blueprint ground.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { MARK_H, MARK_INNER, MARK_OUTER, MARK_W } from '@/assets/brand/mark';

const W = 1200;
const H = 630;

function brandSvg(): string {
  const scale = 300 / MARK_H;
  const mx = (W - MARK_W * scale) / 2;
  const my = (H - MARK_H * scale) / 2;
  const grid: string[] = [];
  for (let x = 0; x <= W; x += 50) grid.push(`<path d="M${x} 0V${H}"/>`);
  for (let y = 15; y <= H; y += 50) grid.push(`<path d="M0 ${y}H${W}"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#0A1426"/>
  <g stroke="#22385A" stroke-width="1">${grid.join('')}</g>
  <path d="M${W * 0.62} ${H}L${W * 0.62 + H} 0" stroke="#FF8E6E" stroke-width="2"/>
  <g transform="translate(${mx} ${my}) scale(${scale})">
    <path d="${MARK_OUTER}" fill="#E6EDF5"/>
    <path d="${MARK_INNER}" fill="#7EE3C9"/>
  </g>
</svg>`;
}

export async function GET() {
  const provided = path.join(process.cwd(), 'src', 'assets', 'brand', 'og-default.png');
  const input = existsSync(provided) ? sharp(provided).resize(W, H, { fit: 'cover' }) : sharp(Buffer.from(brandSvg()));
  const png = await input.png({ compressionLevel: 9, palette: true }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
