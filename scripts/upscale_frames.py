import os, sys, time, gc
import torch
from PIL import Image
import numpy as np
import cv2

# --- Configuration ---
INPUT_DIR = "/Users/apple/Projects/wpdev-keyboard/public/sequence_720p"
OUTPUT_DIR = "/Users/apple/Projects/wpdev-keyboard/public/sequence_4k"
MODEL_PATH = os.path.expanduser("~/.cache/realesrgan/RealESRGAN_x4plus.pth")
TOTAL_FRAMES = 192
TILE_SIZE = 400  # split into tiles to reduce VRAM usage
OUTSCALE = 3     # 1280×720 → 3840×2160

os.makedirs(OUTPUT_DIR, exist_ok=True)

print(f"Input:  {INPUT_DIR}")
print(f"Output: {OUTPUT_DIR}")
print(f"Model:  {MODEL_PATH}")
print(f"Frames: {TOTAL_FRAMES}")
print(f"Device: mps (Metal GPU)")
print()

# --- Build model (import here so config prints even if model fails) ---
from realesrgan import RealESRGANer
from basicsr.archs.rrdbnet_arch import RRDBNet

model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
upsampler = RealESRGANer(
    scale=4,
    model_path=MODEL_PATH,
    model=model,
    tile=TILE_SIZE,
    tile_pad=10,
    pre_pad=10,
    half=False,
    device=torch.device("mps"),
)

# --- Process every frame ---
total_start = time.time()
for i in range(TOTAL_FRAMES):
    frame_start = time.time()
    in_path = os.path.join(INPUT_DIR, f"frame_{i}_delay-0.04s.webp")
    out_path = os.path.join(OUTPUT_DIR, f"frame_{i}_delay-0.04s.webp")

    if not os.path.exists(in_path):
        print(f"[{i:03d}] SKIP — missing input: {in_path}")
        continue

    # Read input
    pil_img = Image.open(in_path).convert("RGB")
    img_np = np.array(pil_img)  # RGB uint8

    # Real-ESRGAN expects BGR
    img_bgr = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)

    # Enhance
    output_bgr, _ = upsampler.enhance(img_bgr, outscale=OUTSCALE)

    # Convert back to RGB
    output_rgb = cv2.cvtColor(output_bgr, cv2.COLOR_BGR2RGB)
    out_img = Image.fromarray(output_rgb)

    # Save as WebP (quality=95 matches matcha's approach)
    out_img.save(out_path, "WEBP", quality=95, method=6)

    elapsed = time.time() - frame_start
    print(f"[{i:03d}/{TOTAL_FRAMES-1}] {elapsed:.1f}s — {os.path.getsize(out_path)//1024}KB")

total_time = time.time() - total_start
print(f"\nDone! {TOTAL_FRAMES} frames in {total_time:.0f}s ({total_time/TOTAL_FRAMES:.1f}s/frame)")
print(f"Output: {OUTPUT_DIR}")
