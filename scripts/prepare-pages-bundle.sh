#!/usr/bin/env bash
# Build a lean GitHub Pages artifact (exclude zips, source uploads, demos, scripts).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/_site"

rm -rf "$OUT"
mkdir -p "$OUT"
touch "$OUT/.nojekyll"

cp "$ROOT/index.html" "$ROOT/index (1).html" "$OUT/"

for f in "$ROOT"/*.pdf; do
  [ -f "$f" ] && cp "$f" "$OUT/"
done

# Only root assets referenced by the live site
for f in yuwei.ttf yuweifanti.ttf 1.jpg 1.png 2.png 3.png; do
  [ -f "$ROOT/$f" ] && cp "$ROOT/$f" "$OUT/"
done

while IFS= read -r -d '' f; do
  base="$(basename "$f")"
  case "$base" in
    反诈最强音.png) cp "$f" "$OUT/" ;;
  esac
done < <(find "$ROOT" -maxdepth 1 -type f -name '*.png' -print0)

mkdir -p "$OUT/assets"
cp -r "$ROOT/assets/." "$OUT/assets/"
rm -rf \
  "$OUT/assets/uploads/1-cutout-src" \
  "$OUT/assets/uploads/2-bg-beauty-src" \
  "$OUT/assets/uploads/3-as-is-src" \
  "$OUT/assets/uploads/processed-manifest.json"

du -sh "$OUT"
find "$OUT" -type f | wc -l
