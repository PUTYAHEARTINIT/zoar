#!/bin/bash
# ZÖAR Image Processing Pipeline
# Converts HEIC→PNG, copies JPGs, optimizes for web

SRC="/Users/newuser/Desktop/ZOAR "
DEST="/Users/newuser/zoar/public/images/products"
SCREENSHOTS="/Users/newuser/Desktop"

mkdir -p "$DEST"

echo "=== Step 1: Convert HEIC → PNG ==="
for f in "$SRC"*.HEIC; do
  base=$(basename "$f" .HEIC)
  echo "Converting $base..."
  sips -s format png "$f" --out "$DEST/${base}.png" 2>/dev/null
done

echo "=== Step 2: Copy JPG product photos ==="
for f in "$SRC"*.jpg; do
  base=$(basename "$f" .jpg)
  # Skip the logo
  if [ "$base" = "IMG_0515" ]; then continue; fi
  # Convert spaces to underscores, lowercase
  clean=$(echo "$base" | tr ' ' '_' | tr '[:upper:]' '[:lower:]' | sed 's/__*/_/g' | sed 's/_$//')
  echo "Copying $base → ${clean}.jpg"
  cp "$f" "$DEST/${clean}.jpg"
done

echo "=== Step 3: Copy IG Story Screenshots ==="
mkdir -p "$DEST/stories"
count=1
for f in "$SCREENSHOTS"/Screenshot\ 2026-02-14*.png; do
  echo "Copying story $count..."
  cp "$f" "$DEST/stories/story_$(printf '%02d' $count).png"
  count=$((count + 1))
done

echo "=== Done! ==="
echo "Product photos:"
ls -la "$DEST"/*.{jpg,png} 2>/dev/null | wc -l
echo "Story screenshots:"
ls -la "$DEST/stories/"*.png 2>/dev/null | wc -l
