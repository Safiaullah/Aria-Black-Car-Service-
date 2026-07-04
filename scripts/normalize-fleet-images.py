#!/usr/bin/env python3
"""
Normalize fleet catalog images to transparent 640×205 PNGs.

Every vehicle in a group shares the exact same placement slot (W×H at X,Y)
so rows look uniform like Detailed Drivers.
"""

from __future__ import annotations

import io
import sys
from pathlib import Path

from PIL import Image, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
FLEET = ROOT / "images" / "fleet"

TARGET_W, TARGET_H = 640, 205
CAR_HEIGHT_FILL = 0.88
MAX_WIDTH_FILL = 0.94
BOTTOM_PAD = 10
# Shared tire line for homepage showcase + catalog (matches executive-sprinter-showcase)
TIRE_BASELINE_Y = 197
BBOX_PAD = (10, 8, 10, 32)
SPRINTER_BBOX_PAD = (10, 8, 10, 40)

ALL_FLEET = [
    "mercedes-e-class.png",
    "cadillac-ct6.png",
    "cadillac-lyriq.png",
    "cadillac-xt6.png",
    "mercedes-s-class.png",
    "bmw-7-series.png",
    "chevrolet-suburban.png",
    "gmc-yukon.png",
    "cadillac-escalade.png",
    "executive-sprinter.png",
    "limo-sprinter.png",
    "jet-sprinter.png",
    "ada-sprinter.png",
]

SPRINTER_IMAGES = {
    "executive-sprinter.png",
    "limo-sprinter.png",
    "jet-sprinter.png",
    "ada-sprinter.png",
}

PASSENGER_IMAGES = [n for n in ALL_FLEET if n not in SPRINTER_IMAGES]

SUV_IMAGES = [
    "chevrolet-suburban.png",
    "gmc-yukon.png",
    "cadillac-escalade.png",
]

PASSENGER_SEDANS = [n for n in PASSENGER_IMAGES if n not in SUV_IMAGES]

# Rembg suburban cutout is tighter in frame than Yukon white-studio — scale to match
SUBURBAN_REMBG_SCALE = 1.28

FEATHER = 3


def corner_bg(img: Image.Image) -> str | None:
    img = img.convert("RGB")
    w, h = img.size
    pts = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]
    pixels = [img.getpixel(p) for p in pts]
    avg = tuple(sum(c) // 4 for c in zip(*pixels))
    if avg[0] < 40 and avg[1] < 40 and avg[2] < 40:
        return "black"
    if avg[0] > 215 and avg[1] > 215 and avg[2] > 215:
        return "white"
    return None


def soft_key(img: Image.Image, bg: str) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    alpha = Image.new("L", (w, h), 0)
    apx = alpha.load()
    px = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            if bg == "black":
                d = max(r, g, b)
                a = min(255, max(0, (d - 22) * 4))
            else:
                d = min(r, g, b)
                a = min(255, max(0, (255 - d - 12) * 5))
            apx[x, y] = a
    alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER))
    out = img.copy()
    out.putalpha(alpha)
    return out


def split_bg_key(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    w, h = img.size
    alpha = Image.new("L", (w, h), 0)
    apx = alpha.load()
    px = img.load()
    for y in range(h):
        for x in range(w):
            r, g, b, _ = px[x, y]
            d_dark = max(r, g, b)
            d_light = min(r, g, b)
            from_black = min(255, max(0, (d_dark - 22) * 4))
            from_white = min(255, max(0, (255 - d_light - 22) * 4))
            apx[x, y] = max(from_black, from_white)
    alpha = alpha.filter(ImageFilter.GaussianBlur(FEATHER))
    out = img.copy()
    out.putalpha(alpha)
    return out


def prepare_rgba(img: Image.Image) -> Image.Image:
    if img.mode == "RGBA":
        lo, hi = img.getextrema()[3]
        if lo < 250:
            return img

    bg = corner_bg(img)
    if bg == "black":
        return soft_key(img, "black")
    if bg == "white":
        return soft_key(img, "white")

    rgb = img.convert("RGB")
    corners = [
        rgb.getpixel(p)
        for p in [(0, 0), (rgb.size[0] - 1, 0), (0, rgb.size[1] - 1), (rgb.size[0] - 1, rgb.size[1] - 1)]
    ]
    if any(c[0] < 40 for c in corners) and any(min(c) > 200 for c in corners):
        return split_bg_key(img)
    return soft_key(img, "white")


def alpha_bbox(img: Image.Image, pad: tuple[int, int, int, int] = BBOX_PAD) -> tuple[int, int, int, int]:
    img = img.convert("RGBA")
    w, h = img.size
    px = img.load()
    min_x, min_y, max_x, max_y = w, h, 0, 0
    found = False
    for y in range(h):
        for x in range(w):
            if px[x, y][3] > 48:
                found = True
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    if not found:
        return 0, 0, w, h
    pl, pt, pr, pb = pad
    return (
        max(0, min_x - pl),
        max(0, min_y - pt),
        min(w, max_x + 1 + pr),
        min(h, max_y + 1 + pb),
    )


def extract_car(img: Image.Image, *, pad: tuple[int, int, int, int] = BBOX_PAD) -> Image.Image:
    cutout = prepare_rgba(img)
    return cutout.crop(alpha_bbox(cutout, pad))


def height_unified_dims(
    cars: list[Image.Image],
    *,
    height_fill: float = CAR_HEIGHT_FILL,
    width_fill: float = MAX_WIDTH_FILL,
) -> tuple[int, list[tuple[int, int]]]:
    """Every vehicle gets the same pixel height; slot width fits the widest."""
    slot_h = int(TARGET_H * height_fill)
    max_w = int(TARGET_W * width_fill)
    dims: list[tuple[int, int]] = []
    for car in cars:
        scale = slot_h / car.height
        w = max(1, int(car.width * scale))
        if w > max_w:
            scale = max_w / car.width
            w = max_w
            h = max(1, int(car.height * scale))
        else:
            h = slot_h
        dims.append((w, h))
    slot_w = min(max(w for w, _ in dims), max_w)
    return slot_w, dims


def compute_slot(slot_w: int, slot_h: int) -> tuple[int, int, int, int]:
    slot_x = (TARGET_W - slot_w) // 2
    slot_y = max(0, TARGET_H - BOTTOM_PAD - slot_h)
    return slot_w, slot_h, slot_x, slot_y


def alpha_bottom_y(img: Image.Image, *, threshold: int = 24) -> int | None:
    """Lowest row with meaningful opaque pixels (tire contact line)."""
    img = img.convert("RGBA")
    w, h = img.size
    apx = img.getchannel("A").load()
    min_cols = max(8, int(w * 0.05))
    for y in range(h - 1, -1, -1):
        if sum(1 for x in range(w) if apx[x, y] > threshold) >= min_cols:
            return y
    return None


def align_tire_baseline(img: Image.Image, baseline_y: int = TIRE_BASELINE_Y) -> Image.Image:
    """Shift vehicle so tire line sits on a shared horizontal baseline."""
    bottom = alpha_bottom_y(img)
    if bottom is None:
        return img
    dy = baseline_y - bottom
    if dy == 0:
        return img
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.alpha_composite(img, (0, dy))
    return out


def width_unified_dims(
    cars: list[Image.Image],
    slot_h: int,
    max_w: int,
) -> tuple[int, list[tuple[int, int]]]:
    """Scale every vehicle to the same width (Premium SUV row parity)."""
    target_w = min(max(int(c.width * slot_h / c.height) for c in cars), max_w)
    dims: list[tuple[int, int]] = []
    for car in cars:
        scale = target_w / car.width
        new_w = target_w
        new_h = max(1, int(car.height * scale))
        if new_h > slot_h:
            scale = slot_h / car.height
            new_w = max(1, int(car.width * scale))
            new_h = slot_h
        dims.append((new_w, new_h))
    slot_w = max(w for w, _ in dims)
    return slot_w, dims


def normalize_group(
    names: list[str],
    *,
    pad: tuple[int, int, int, int] = BBOX_PAD,
    slot: tuple[int, int, int, int] | None = None,
    label: str = "",
    match_width: bool = False,
) -> tuple[int, int, int, int]:
    """Fit each vehicle into one shared slot; return slot geometry."""
    items: list[tuple[Path, Image.Image]] = []
    for name in names:
        path = FLEET / name
        if not path.exists():
            print(f"skip missing {name}")
            continue
        items.append((path, extract_car(Image.open(path), pad=pad)))

    if not items:
        return (0, 0, 0, 0)

    max_w = int(TARGET_W * MAX_WIDTH_FILL)
    slot_h = int(TARGET_H * (0.92 if match_width else CAR_HEIGHT_FILL))
    cars = [car for _, car in items]
    if match_width:
        slot_w, dims = width_unified_dims(cars, slot_h, max_w)
    else:
        slot_w, dims = height_unified_dims(cars)
        slot_h = dims[0][1] if dims else slot_h
    if slot is None:
        slot = compute_slot(slot_w, slot_h)
    slot_w, slot_h, slot_x, slot_y = slot

    tag = f" [{label}]" if label else ""
    print(f"  slot{tag}: {slot_w}x{slot_h} at ({slot_x},{slot_y})")

    for (path, car), (fit_w, fit_h) in zip(items, dims):
        scale = fit_h / car.height
        new_w = max(1, int(car.width * scale))
        new_h = fit_h
        if new_w > slot_w:
            scale = slot_w / car.width
            new_w = slot_w
            new_h = max(1, int(car.height * scale))
        fitted = car.resize((new_w, new_h), Image.Resampling.LANCZOS)
        layer = Image.new("RGBA", (slot_w, slot_h), (0, 0, 0, 0))
        layer.alpha_composite(fitted, ((slot_w - new_w) // 2, slot_h - new_h))
        canvas = Image.new("RGBA", (TARGET_W, TARGET_H), (0, 0, 0, 0))
        canvas.alpha_composite(layer, (slot_x, slot_y))
        canvas = align_tire_baseline(canvas)
        canvas.save(path, "PNG", optimize=True)
        print(f"    {path.name} -> {new_w}x{new_h} in slot")

    return slot


def rembg_cutout(src: Path, *, mirror: bool = False) -> Image.Image:
    from rembg import remove

    img = Image.open(io.BytesIO(remove(src.read_bytes()))).convert("RGBA")
    if mirror:
        img = ImageOps.mirror(img)
    return img.crop(alpha_bbox(img))


def main() -> None:
    downloads = Path("/Users/samiramohammad/Downloads/Fleet")
    assets = Path("/Users/samiramohammad/.cursor/projects/Users-samiramohammad-Aria-Black-Car-Service/assets")

    sources: dict[str, list[Path]] = {
        "mercedes-e-class.png": [
            assets / "mercedes-e-class__1_-397b8b86-7dd7-4210-b05f-d18da35a6452.png",
            downloads / "mercedes-e-class.avif",
        ],
        "cadillac-ct6.png": [
            assets / "CT6-064c6c09-965c-46bb-a240-73c562a88e1b.png",
            downloads / "CT6.jpg",
        ],
        "cadillac-xt6.png": [
            assets / "download-bbce2221-f14b-4da4-a26f-9310cd62822f.png",
            downloads / "cadillac-xt6.avif",
        ],
        "cadillac-lyriq.png": [
            assets / "my26-lyriq-mov-model-walk-sport-c5a5698f-56d2-41a4-82e3-cbe93e072bb2.png",
        ],
        "mercedes-s-class.png": [
            assets / "mercedes-s-class__1_-4488350c-31cc-472b-a3d0-c7b121e53806.png",
            downloads / "mercedes-s-class.avif",
        ],
        "bmw-7-series.png": [downloads / "bmw-7-series.avif"],
        "chevrolet-suburban.png": [
            assets / "chevrolet-suburban-new-236f105f-2b42-4567-9667-5c686c0726c0.png",
        ],
        "cadillac-escalade.png": [
            assets / "cadillac-escalade.png",
            downloads / "cadillac-escalade.avif",
        ],
    }

    for dest_name, candidates in sources.items():
        for src in candidates:
            if src.exists():
                Image.open(src).save(FLEET / dest_name)
                print(f"import {src.name} -> {dest_name}")
                break

    eclass_src = downloads / "mercedes-e-class.avif"
    if not eclass_src.exists():
        eclass_src = assets / "mercedes-e-class__1_-397b8b86-7dd7-4210-b05f-d18da35a6452.png"
    if eclass_src.exists():
        try:
            rembg_cutout(eclass_src).save(FLEET / "mercedes-e-class.png", "PNG")
            print(f"e-class rembg from {eclass_src.name}")
        except Exception as exc:
            print(f"e-class rembg skip: {exc}", file=sys.stderr)

    lyriq_candidates = [
        downloads / "cadillac-lyriq.avif",
        downloads / "my26-lyriq-mov-model-walk-sport.avif",
        assets / "my26-lyriq-mov-model-walk-sport-c5a5698f-56d2-41a4-82e3-cbe93e072bb2.png",
        assets / "cadillac-lyriq-cc195e49-0953-4700-845c-c607f4b05e6d.png",
    ]
    for lyriq_src in lyriq_candidates:
        if not lyriq_src.exists():
            continue
        try:
            rembg_cutout(lyriq_src).save(FLEET / "cadillac-lyriq.png", "PNG")
            print(f"lyriq rembg from {lyriq_src.name}")
            break
        except Exception as exc:
            print(f"lyriq rembg skip ({lyriq_src.name}): {exc}", file=sys.stderr)

    sclass_candidates = [
        downloads / "mercedes-s-class.avif",
        downloads / "mercedes-s-class (1).avif",
        downloads / "mercedes-s-class-2026-6-1280.jpg",
        assets / "mercedes-s-class-2026-6-1280-ee6cece9-e4a4-42e3-a46d-e078fb83682f.png",
        assets / "mercedes-s-class__1_-4488350c-31cc-472b-a3d0-c7b121e53806.png",
    ]
    for sclass_src in sclass_candidates:
        if not sclass_src.exists():
            continue
        try:
            rembg_cutout(sclass_src).save(FLEET / "mercedes-s-class.png", "PNG")
            print(f"s-class rembg from {sclass_src.name}")
            break
        except Exception as exc:
            print(f"s-class rembg skip ({sclass_src.name}): {exc}", file=sys.stderr)

    yukon_src = downloads / "The_Chairman_GMC_Yukon_DXL_Side_Profile-1440x800px-scaled-1.webp"
    if yukon_src.exists():
        ImageOps.mirror(Image.open(yukon_src)).save(FLEET / "gmc-yukon.png")
        print(f"import {yukon_src.name} -> gmc-yukon.png (mirrored)")

    suburban_candidates = [
        downloads / "chevrolet-suburban-new.avif",
        assets / "chevrolet-suburban-new-236f105f-2b42-4567-9667-5c686c0726c0.png",
    ]
    for suburban_src in suburban_candidates:
        if not suburban_src.exists():
            continue
        try:
            cut = rembg_cutout(suburban_src, mirror=True)
            w, h = cut.size
            cut = cut.resize(
                (max(1, int(w * SUBURBAN_REMBG_SCALE)), max(1, int(h * SUBURBAN_REMBG_SCALE))),
                Image.Resampling.LANCZOS,
            )
            cut.save(FLEET / "chevrolet-suburban.png", "PNG")
            print(f"suburban rembg from {suburban_src.name} (scale {SUBURBAN_REMBG_SCALE})")
            break
        except Exception as exc:
            print(f"suburban rembg skip ({suburban_src.name}): {exc}", file=sys.stderr)

    sprinter_sources: dict[str, list[Path]] = {
        "executive-sprinter.png": [
            downloads / "executive-sprinter.avif",
            downloads / "executive-sprinter (1).avif",
        ],
        "limo-sprinter.png": [downloads / "limo-sprinter.avif"],
        "jet-sprinter.png": [downloads / "jet-sprinter.avif"],
        "ada-sprinter.png": [
            downloads / "ada-sprinter.avif",
            assets / "ada-sprinter-cc969622-b8b1-4d95-a362-d3dc15c778c4.png",
        ],
    }
    for dest_name, candidates in sprinter_sources.items():
        for src in candidates:
            if src.exists():
                Image.open(src).save(FLEET / dest_name)
                print(f"import {src.name} -> {dest_name}")
                break

    ada_asset = assets / "ada-sprinter-cc969622-b8b1-4d95-a362-d3dc15c778c4.png"
    if ada_asset.exists():
        try:
            rembg_cutout(ada_asset).save(FLEET / "ada-sprinter.png", "PNG")
            print("ada sprinter rembg done")
        except Exception as exc:
            print(f"ada rembg skip: {exc}", file=sys.stderr)

    print("sedans:")
    catalog_slot = normalize_group(PASSENGER_SEDANS, label="sedans")

    print("suvs (matched scale):")
    suv_slot = normalize_group(SUV_IMAGES, label="suvs", match_width=True)

    print("sprinters (same slot as catalog):")
    normalize_group(
        sorted(SPRINTER_IMAGES),
        pad=SPRINTER_BBOX_PAD,
        slot=suv_slot if suv_slot[0] >= catalog_slot[0] else catalog_slot,
        label="sprinters",
    )
    print("done")


if __name__ == "__main__":
    main()
