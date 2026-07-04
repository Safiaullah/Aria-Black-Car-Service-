#!/usr/bin/env python3
"""
Optional fleet image cleanup — disabled by default.

Hard thresholding destroys photo detail (harsh edges). The site uses CSS
mix-blend-mode: multiply on .fleet-list-row__visual--blend instead.

Only run this if you need transparent PNG exports; uses soft alpha feathering.
"""
from pathlib import Path

from PIL import Image, ImageFilter

FLEET_DIR = Path(__file__).resolve().parent.parent / "images" / "fleet"
PAD = 16
FEATHER = 8


def corner_bg(img: Image.Image) -> str | None:
    w, h = img.size
    pts = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    pixels = [img.getpixel(p)[:3] for p in pts]
    avg = tuple(sum(c) // len(pixels) for c in zip(*pixels))
    if avg[0] < 35 and avg[1] < 35 and avg[2] < 35:
        return "black"
    if avg[0] > 220 and avg[1] > 220 and avg[2] > 220:
        return "white"
    return None


def soft_key(img: Image.Image, bg: str) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    alpha = Image.new("L", (w, h), 255)
    apx = alpha.load()
    px = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if bg == "black":
                d = max(r, g, b)
                a = min(255, max(0, (d - 18) * 3))
            else:
                d = min(r, g, b)
                a = min(255, max(0, (255 - d - 18) * 3))
            apx[x, y] = a
    alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER))
    img.putalpha(alpha)
    bbox = img.getbbox()
    if bbox:
        x0, y0, x1, y1 = bbox
        img = img.crop(
            (max(0, x0 - PAD), max(0, y0 - PAD), min(w, x1 + PAD), min(h, y1 + PAD))
        )
    return img


def main():
    print("Not run by default — use CSS blend on site. Pass --apply to process files.")
    import sys

    if "--apply" not in sys.argv:
        return
    for path in sorted(FLEET_DIR.glob("*.png")):
        if path.name == "fleet-lineup-hero.png":
            continue
        img = Image.open(path)
        if img.mode == "RGBA" and img.split()[3].getextrema()[0] < 250:
            print(f"skip: {path.name}")
            continue
        bg = corner_bg(img)
        if not bg:
            print(f"skip: {path.name}")
            continue
        out = soft_key(img, bg)
        out.save(path, optimize=True)
        print(f"ok: {path.name}")


if __name__ == "__main__":
    main()
