#!/bin/bash
INPUT_DIR="/Users/apple/Projects/wpdev-keyboard/public/sequence_720p"
OUTPUT_DIR="/Users/apple/Projects/wpdev-keyboard/public/sequence_4k"
NCNN="/tmp/realesrgan-ncnn/realesrgan-ncnn-vulkan"
MODELS="/tmp/realesrgan-ncnn/models"
LOG="/Users/apple/Projects/wpdev-keyboard/scripts/upscale.log"
TOTAL=192

mkdir -p "$OUTPUT_DIR"
exec > "$LOG" 2>&1

echo "=== Starting upscale at $(date) ==="
echo "Model: realesr-animevideov3-x3"
echo "Scale: 3 (1280x720 -> 3840x2160)"
echo "Total frames: $TOTAL"
echo

TOTAL_START=$(date +%s)

for i in $(seq 0 $((TOTAL - 1))); do
  INPUT_FILE="$INPUT_DIR/frame_${i}_delay-0.04s.webp"
  OUTPUT_FILE="$OUTPUT_DIR/frame_${i}_delay-0.04s.webp"

  if [ -f "$OUTPUT_FILE" ]; then
    echo "[$i/$TOTAL] SKIP — exists"
    continue
  fi

  START=$(date +%s)
  "$NCNN" \
    -i "$INPUT_FILE" \
    -o "$OUTPUT_FILE" \
    -s 3 \
    -n realesr-animevideov3-x3 \
    -f webp \
    -m "$MODELS" \
    -g 0 -t 0 2>&1 | tail -1

  ELAPSED=$(( $(date +%s) - START ))
  if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null)
    echo "[$i/$TOTAL] ${ELAPSED}s — ${SIZE}KB"
  else
    echo "[$i/$TOTAL] FAILED after ${ELAPSED}s"
  fi
done

TOTAL_TIME=$(( $(date +%s) - TOTAL_START ))
echo
echo "=== Done at $(date) in ${TOTAL_TIME}s ==="
