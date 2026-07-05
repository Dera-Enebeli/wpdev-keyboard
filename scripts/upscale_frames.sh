#!/bin/bash
# Upscale all 720p frames to 4K using realesrgan-ncnn-vulkan
# Processes frames in batches to avoid overloading the GPU

INPUT_DIR="/Users/apple/Projects/wpdev-keyboard/public/sequence_720p"
OUTPUT_DIR="/Users/apple/Projects/wpdev-keyboard/public/sequence_4k"
NCNN="/tmp/realesrgan-ncnn/realesrgan-ncnn-vulkan"
MODELS="/tmp/realesrgan-ncnn/models"
TOTAL=192
BATCH_SIZE=2  # frames to process in parallel

mkdir -p "$OUTPUT_DIR"

echo "Starting upscale of $TOTAL frames from 720p to 4K"
echo "Input:  $INPUT_DIR"
echo "Output: $OUTPUT_DIR"
echo

for i in $(seq 0 $((TOTAL - 1))); do
  INPUT_FILE="$INPUT_DIR/frame_${i}_delay-0.04s.webp"
  OUTPUT_FILE="$OUTPUT_DIR/frame_${i}_delay-0.04s.webp"

  if [ -f "$OUTPUT_FILE" ]; then
    echo "[$i/$TOTAL] SKIP — already exists"
    continue
  fi

  echo "[$i/$TOTAL] Upscaling frame $i..."
  START=$(date +%s)

  "$NCNN" \
    -i "$INPUT_FILE" \
    -o "$OUTPUT_FILE" \
    -s 3 \
    -n realesrgan-x4plus \
    -f webp \
    -m "$MODELS" \
    -g 0 \
    -t 0

  END=$(date +%s)
  DURATION=$((END - START))
  if [ -f "$OUTPUT_FILE" ]; then
    SIZE=$(stat -f%z "$OUTPUT_FILE" 2>/dev/null || stat -c%s "$OUTPUT_FILE" 2>/dev/null)
    echo "[$i/$TOTAL] Done in ${DURATION}s — $((SIZE / 1024))KB"
  else
    echo "[$i/$TOTAL] FAILED after ${DURATION}s"
  fi
done

echo
echo "All done!"
