#!/usr/bin/env python3
"""Knock black boxes out of the printed-card crops.

Reads public/card-lockup.jpg (source lockup) and writes:
- public/logo-mark.png — SC + house, transparent
- public/card-front.png — printed lockup on #1A1E22
- favicons / og on #1A1E22
"""

from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
GROUND = (26, 30, 34, 255)


def knock_out(src: Path, *, pad: int, thresh: int) -> Image.Image:
    rgb = np.array(Image.open(src).convert("RGB"))
    lum = rgb.mean(axis=2)
    alpha = np.clip((lum - (thresh - 4)) / 8.0, 0, 1)
    alpha = (alpha * 255).astype(np.uint8)
    ys, xs = np.where(alpha > 20)
    x0, x1 = max(0, int(xs.min()) - pad), min(rgb.shape[1], int(xs.max()) + 1 + pad)
    y0, y1 = max(0, int(ys.min()) - pad), min(rgb.shape[0], int(ys.max()) + 1 + pad)
    rgba = np.dstack([rgb[y0:y1, x0:x1], alpha[y0:y1, x0:x1]])
    return Image.fromarray(rgba, "RGBA")


def fit_square(src: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), GROUND)
    fitted = src.copy()
    fitted.thumbnail((size - 4, size - 4), Image.Resampling.LANCZOS)
    canvas.paste(fitted, ((size - fitted.size[0]) // 2, (size - fitted.size[1]) // 2), fitted)
    return canvas


def main() -> None:
    lockup = PUBLIC / "card-lockup.jpg"
    mark_src = PUBLIC / "logo-mark.png"
    source = lockup if lockup.exists() else mark_src

    mark = knock_out(source if source == mark_src else lockup, pad=6, thresh=16)
    # Prefer the dedicated mark crop when present.
    if (PUBLIC / "_mark-source.png").exists():
        mark = knock_out(PUBLIC / "_mark-source.png", pad=6, thresh=16)
    elif (PUBLIC / "logo-mark.png").exists() and source == lockup:
        # Recrop from the current mark file if it is already the house only.
        trial = knock_out(PUBLIC / "logo-mark.png", pad=6, thresh=16)
        if trial.size[0] < 700:
            mark = trial

    mark.save(PUBLIC / "logo-mark.png", "PNG")

    tile = Image.new("RGBA", (512, 512), GROUND)
    placed = mark.copy()
    placed.thumbnail((420, 420), Image.Resampling.LANCZOS)
    tile.paste(placed, ((512 - placed.size[0]) // 2, (512 - placed.size[1]) // 2), placed)
    tile.save(PUBLIC / "logo-tile.png", "PNG")

    hero = knock_out(lockup, pad=12, thresh=14)
    plate = Image.new("RGBA", hero.size, GROUND)
    plate = Image.alpha_composite(plate, hero)
    plate.save(PUBLIC / "card-front.png", "PNG")

    fit_square(mark, 512).save(PUBLIC / "icon-512.png")
    fit_square(mark, 180).save(PUBLIC / "apple-touch-icon.png")
    fit_square(mark, 32).save(PUBLIC / "favicon-32.png")
    ico = fit_square(mark, 32)
    ico.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32)])

    og = Image.new("RGBA", (1200, 630), GROUND)
    lock = plate.copy()
    lock.thumbnail((1100, 560), Image.Resampling.LANCZOS)
    og.paste(lock, ((1200 - lock.size[0]) // 2, (630 - lock.size[1]) // 2), lock)
    og.save(PUBLIC / "og.png")


if __name__ == "__main__":
    main()
