"""Generate favicons and the social/WhatsApp share image for Ena's Beauty Salon.

Run from the `web` folder:  python scripts/make-brand-assets.py
Sources: the original PNG logos in brand/logos (never modified). Output goes to public/.
The favicon is a crop of the original symbol (profile in the burgundy circle), not a redraw.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

WEB = Path(__file__).resolve().parents[1]
BRAND = WEB.parent / "brand" / "logos"
PUBLIC = WEB / "public"
FONTS = Path("C:/Windows/Fonts")

WINE = (121, 12, 50)
ROSE = (217, 168, 181)
CREAM = (255, 247, 239)
INK = (49, 34, 42)


def symbol():
    logo = Image.open(BRAND / "ena-logo-vertical-original.png").convert("RGBA")
    # Symbol occupies the upper part of the vertical logo; the wordmark starts near y=840.
    top = logo.crop((0, 0, logo.width, 835))
    return top.crop(top.getbbox())


def icons():
    sym = symbol()
    for size, name, pad in [(512, "icon-512.png", .14), (192, "icon-192.png", .14), (180, "apple-touch-icon.png", .14)]:
        bg = Image.new("RGB", (size, size), CREAM)
        s = sym.copy()
        s.thumbnail((int(size * (1 - 2 * pad)), int(size * (1 - 2 * pad))), Image.LANCZOS)
        bg.paste(s, ((size - s.width) // 2, (size - s.height) // 2), s)
        bg.save(PUBLIC / name, optimize=True)
    side = max(sym.size)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(sym, ((side - sym.width) // 2, (side - sym.height) // 2), sym)
    square.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    square.resize((32, 32), Image.LANCZOS).save(PUBLIC / "favicon-32.png", optimize=True)


def share_image():
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(canvas)
    # Quiet rose arcs echoing the hair movement of the symbol.
    d.ellipse([(860, 40), (1420, 600)], fill=ROSE)
    d.ellipse([(820, 0), (1460, 640)], outline=WINE, width=3)
    d.ellipse([(900, 80), (1340, 520)], outline=CREAM, width=2)
    d.rectangle([(0, H - 74), (W, H)], fill=WINE)

    logo = Image.open(BRAND / "ena-logo-horizontal-original.png").convert("RGBA")
    logo = logo.crop(logo.getbbox())
    logo.thumbnail((700, 240), Image.LANCZOS)
    canvas.paste(logo, (80, 70), logo)

    serif_i = ImageFont.truetype(str(FONTS / "georgiai.ttf"), 46)
    sans_b = ImageFont.truetype(str(FONTS / "segoeuib.ttf"), 22)
    sans = ImageFont.truetype(str(FONTS / "segoeuib.ttf"), 30)
    d.text((84, 340), "HAIRSTYLIST & BARBER  ·  KATY, TEXAS", font=sans_b, fill=WINE, spacing=4)
    d.text((80, 390), "A fresh look starts", font=serif_i, fill=INK)
    d.text((80, 445), "with a conversation.", font=serif_i, fill=INK)
    d.text((84, H - 58), "Book an appointment · Agenda tu cita   713-820-5793", font=sans, fill=CREAM)

    out = PUBLIC / "og-image.jpg"
    for quality in (88, 82, 76):
        canvas.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
        if out.stat().st_size < 290_000:
            break
    print(f"og-image.jpg {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    PUBLIC.mkdir(parents=True, exist_ok=True)
    icons()
    share_image()
