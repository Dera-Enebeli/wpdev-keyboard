import os, time
from PIL import Image

FRAMES_DIR = "/Users/apple/Projects/wpdev-keyboard/public/sequence_4k"
TOTAL = 192
QUALITY = 85

print(f"Re-compressing {TOTAL} frames at WebP quality={QUALITY}...")
start = time.time()

for i in range(TOTAL):
    path = os.path.join(FRAMES_DIR, f"frame_{i}_delay-0.04s.webp")
    img = Image.open(path)
    img.save(path, "WEBP", quality=QUALITY, method=4)
    sz = os.path.getsize(path) // 1024
    elapsed = time.time() - start
    print(f"[{i+1}/{TOTAL}] {sz}KB")

elapsed = time.time() - start
print(f"\nDone in {elapsed:.0f}s")
