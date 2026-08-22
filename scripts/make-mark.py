#!/usr/bin/env python3
"""Rasterize the Solid Craft house mark for chrome and favicons.

The mark matches the printed card: white block SC as the house body,
gold roofline, four-pane window in the peak, chimney on the right slope.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
PUBLIC.mkdir(exist_ok=True)

CHARCOAL = (20, 20, 20, 255)
GOLD = (201, 162, 39, 255)
WHITE = (245, 245, 243, 255)
CLEAR = (0, 0, 0, 0)

FONT = "/usr/share/fonts/truetype/macos/Inter-Bold.ttf"


def draw_mark(size: int, *, background: tuple[int, int, int, int]) -> Image.Image:
    img = Image.new("RGBA", (size, size), background)
    draw = ImageDraw.Draw(img)

    # Geometry in a 1000-unit square, then scaled.
    s = size / 1000

    def xy(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
        return [(x * s, y * s) for x, y in points]

    def w(n: float) -> int:
        return max(1, round(n * s))

    # Gold roof as a filled chevron so the eaves stay square.
    peak_x, peak_y = 500, 168
    left_x, right_x, eave_y = 168, 832, 430
    t = 36
    roof = [
        (left_x, eave_y),
        (left_x, eave_y - t),
        (peak_x, peak_y),
        (right_x, eave_y - t),
        (right_x, eave_y),
        (peak_x, peak_y + t * 1.35),
    ]
    draw.polygon(xy(roof), fill=GOLD)

    # Chimney block on the right slope.
    draw.rectangle([690 * s, 210 * s, 748 * s, 268 * s], fill=GOLD)

    # Four-pane window in the peak, to the right of SC.
    win = (548, 268, 638, 358)
    frame = w(8)
    draw.rectangle([win[0] * s, win[1] * s, win[2] * s, win[3] * s], outline=GOLD, width=frame)
    mid_x = (win[0] + win[2]) / 2 * s
    mid_y = (win[1] + win[3]) / 2 * s
    draw.line([(mid_x, win[1] * s), (mid_x, win[3] * s)], fill=GOLD, width=frame)
    draw.line([(win[0] * s, mid_y), (win[2] * s, mid_y)], fill=GOLD, width=frame)

    font = ImageFont.truetype(FONT, size=int(340 * s))
    # SC as one tight block under the roof.
    text = "SC"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = (size - tw) / 2 - bbox[0]
    ty = 430 * s - bbox[1] - 18 * s
    draw.text((tx, ty), text, font=font, fill=WHITE)

    return img


def fit_square(src: Image.Image, size: int, background: tuple[int, int, int, int]) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), background)
    fitted = src.resize((size, size), Image.Resampling.LANCZOS)
    canvas.alpha_composite(fitted)
    return canvas


def main() -> None:
    mark = draw_mark(1024, background=CLEAR)
    mark.save(PUBLIC / "logo-mark.png", "PNG")

    charcoal = draw_mark(1024, background=CHARCOAL)
    charcoal.save(PUBLIC / "logo-tile.png", "PNG")

    icon_512 = fit_square(charcoal, 512, CHARCOAL)
    icon_512.save(PUBLIC / "icon-512.png", "PNG")

    apple = fit_square(charcoal, 180, CHARCOAL)
    apple.save(PUBLIC / "apple-touch-icon.png", "PNG")

    fav32 = fit_square(charcoal, 32, CHARCOAL)
    fav32.save(PUBLIC / "favicon-32.png", "PNG")

    ico = Image.new("RGBA", (32, 32), CHARCOAL)
    ico.alpha_composite(fav32)
    ico.save(
        PUBLIC / "favicon.ico",
        sizes=[(16, 16), (32, 32)],
    )

    # Open Graph: charcoal plate, mark left, wordmark right.
    og = Image.new("RGBA", (1200, 630), CHARCOAL)
    og_draw = ImageDraw.Draw(og)
    badge = draw_mark(420, background=CLEAR)
    og.alpha_composite(badge, (90, 105))
    bold = ImageFont.truetype(FONT, 72)
    thin = ImageFont.truetype("/usr/share/fonts/truetype/macos/Inter-Medium.ttf", 28)
    og_draw.text((540, 210), "SOLID", font=bold, fill=WHITE)
    og_draw.text((800, 210), "CRAFT", font=bold, fill=GOLD)
    og_draw.line([(540, 300), (820, 300)], fill=GOLD, width=3)
    og_draw.text((540, 318), "CONSTRUCTION", font=thin, fill=WHITE)
    og_draw.line([(540, 362), (820, 362)], fill=GOLD, width=3)
    og_draw.text((540, 380), "LLC", font=thin, fill=GOLD)
    og.save(PUBLIC / "og.png", "PNG")


if __name__ == "__main__":
    main()
