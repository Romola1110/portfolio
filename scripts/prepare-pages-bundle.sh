#!/usr/bin/env bash
# Build a lean GitHub Pages artifact (exclude zips, source uploads, demos, scripts).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/_site"

rm -rf "$OUT"
mkdir -p "$OUT"
touch "$OUT/.nojekyll"

cp "$ROOT/index.html" "$ROOT/index (1).html" "$OUT/"
[ -f "$ROOT/handbook.html" ] && cp "$ROOT/handbook.html" "$OUT/"

for f in "$ROOT"/*.pdf; do
  [ -f "$f" ] && cp "$f" "$OUT/"
done

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
shopt -s dotglob
cp -r "$ROOT/assets/." "$OUT/assets/"
shopt -u dotglob

rm -rf \
  "$OUT/assets/uploads" \
  "$OUT/assets/things/incoming" \
  "$OUT/assets/things/ui/processed" \
  "$OUT/assets/decor-src-"*.jpg \
  "$OUT/assets/decor-src-"*.png

find "$OUT/assets/fonts" -maxdepth 1 -type f \( -iname '*.ttf' -o -iname '*.TTF' -o -iname '*.otf' \) -delete 2>/dev/null || true
find "$OUT/assets" -maxdepth 1 -type f -iname 'IMG_*.JPG' -delete 2>/dev/null || true

find "$OUT/assets/things/ui/items" -maxdepth 1 -type f -name '*-soft.png' -delete 2>/dev/null || true
rm -f \
  "$OUT/assets/things/THINGS_COPY_DRAFT.md" \
  "$OUT/assets/things/THINGS_COPY.md" \
  "$OUT/assets/things/DESIGN.md"

du -sh "$OUT"
find "$OUT" -type f | wc -l
