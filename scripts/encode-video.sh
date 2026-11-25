#!/usr/bin/env bash
# Encode a screen recording or render into web loops (Kai's presets, study/02-brand-motion.md §7,
# verified on ffmpeg 8.1.1). Masters never go in git; only the outputs below do.
#
# Usage:
#   bash scripts/encode-video.sh <master.mov> <out-dir>/<name> [start=0.5] [end=5.5] [width=1600]
#
# Example:
#   bash scripts/encode-video.sh ~/Captures/lease-table.mov src/content/work/flnt-maps-ai/hero 0.5 5.5
#
# Writes:
#   <name>.av1.mp4    AV1 10-bit (primary; no banding on navy), screen-content mode
#   <name>.h264.mp4   H.264 fallback (+faststart)
#   <name>.poster.webp  first frame, for the poster
#
# Budgets: each loop <= 2 MB, the hero loop <= 3 MB (warning), 25 MB per file (hard fail:
# GitHub Pages). Longer films go to YouTube/Vimeo behind a click-to-load poster.
#
# In MDX:
#   import loop from './hero.h264.mp4';
#   import loopAv1 from './hero.av1.mp4';
#   import poster from './hero.poster.webp';
#   <Video h264={loop} av1={loopAv1} poster={poster} description="What the loop shows, in words." />
# Or in frontmatter: coverVideo: ./hero.h264.mp4 (the .av1.mp4 sibling is found automatically) + poster: ./hero.poster.webp
set -euo pipefail

if [[ $# -lt 2 ]]; then
  sed -n '2,25p' "$0"
  exit 1
fi
command -v ffmpeg >/dev/null || { echo "ffmpeg not found (install ffmpeg 7+ with libsvtav1 and libx264)"; exit 1; }

IN="$1"
OUT="$2"
SS="${3:-0.5}"
TO="${4:-5.5}"
W="${5:-1600}"
mkdir -p "$(dirname "$OUT")"

echo "AV1 → $OUT.av1.mp4"
ffmpeg -hide_banner -loglevel warning -y -ss "$SS" -to "$TO" -i "$IN" -an \
  -vf "fps=30,scale=${W}:-2:flags=lanczos,format=yuv420p10le" \
  -c:v libsvtav1 -preset 5 -crf 32 -g 150 -svtav1-params tune=0:scm=1 \
  -movflags +faststart "$OUT.av1.mp4"

echo "H.264 → $OUT.h264.mp4"
ffmpeg -hide_banner -loglevel warning -y -ss "$SS" -to "$TO" -i "$IN" -an \
  -vf "fps=30,scale=${W}:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 22 -tune animation -profile:v high \
  -movflags +faststart "$OUT.h264.mp4"

echo "Poster → $OUT.poster.webp"
ffmpeg -hide_banner -loglevel warning -y -i "$OUT.h264.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT.poster.webp"

status=0
for f in "$OUT.av1.mp4" "$OUT.h264.mp4" "$OUT.poster.webp"; do
  bytes=$(wc -c <"$f" | tr -d ' ')
  mb=$(awk "BEGIN { printf \"%.2f\", $bytes / 1048576 }")
  if (( bytes > 25 * 1048576 )); then
    echo "FAIL  $f  ${mb} MB  (over the 25 MB per-file cap: shorten it, or host it on YouTube/Vimeo)"
    status=1
  elif (( bytes > 3 * 1048576 )); then
    echo "WARN  $f  ${mb} MB  (over the 3 MB loop budget: try a shorter clip, width 1280, or crf +2)"
  else
    echo "ok    $f  ${mb} MB"
  fi
done
exit $status
