"""Emit the shipping brand assets for Shieldora.

Single source of geometry: build_logo_variants.py. The page mark, favicon and
OG image are all generated here so they cannot drift apart.

The mark is a plain shield: green tile, deeper green shield, a single gold
rule on the outline, white checkmark. No pattern inside the shield.
"""
import build_logo_variants as G

XF = f"translate({G.OFF:.2f} {G.OFF:.2f}) scale({G.SC:.4f})"


def mark(uid="", tile=True):
    """Full 512 tile. uid namespaces the defs so the SVG can be inlined next
    to other SVGs on a page without id collisions."""
    p = f"{uid}-" if uid else ""
    tile_bg = f'<rect width="512" height="512" rx="{G.RX:.1f}" fill="url(#{p}tg)"/>' if tile else ""
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Shieldora logo"><defs><linearGradient id="{p}tg" x1="0.281" y1="-0.103" x2="0.719" y2="1.103">
    <stop offset="0" stop-color="{G.GREEN_HI}"/><stop offset="1" stop-color="{G.GREEN_LO}"/>
  </linearGradient>
  <linearGradient id="{p}sg" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="{G.SHIELD_HI}"/><stop offset="1" stop-color="{G.SHIELD_LO}"/>
  </linearGradient></defs>{tile_bg}
  <g transform="{XF}"><path d="{G.SHIELD_D}" fill="url(#{p}sg)"/></g>
  <g transform="{XF}" fill="none">
    <path d="{G.SHIELD_D}" stroke="{G.GOLD}" stroke-opacity="0.95" stroke-width="1.3"/>
    <path d="{G.CHECK_D}" stroke="#ffffff" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g></svg>'''


def favicon():
    """Same plain shield as the page mark, sized for a 64px tile."""
    sh = 64.0 * 26 / 46
    off, sc = (64.0 - sh) / 2, sh / 24
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"
     role="img" aria-label="Shieldora shield logo">
  <defs>
    <linearGradient id="ft" x1="0.281" y1="-0.103" x2="0.719" y2="1.103">
      <stop offset="0" stop-color="{G.GREEN_HI}"/>
      <stop offset="1" stop-color="{G.GREEN_LO}"/>
    </linearGradient>
    <linearGradient id="fs" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="{G.SHIELD_HI}"/>
      <stop offset="1" stop-color="{G.SHIELD_LO}"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="{64 * 13 / 46:.2f}" fill="url(#ft)"/>
  <g transform="translate({off:.2f} {off:.2f}) scale({sc:.4f})" fill="none">
    <path d="{G.SHIELD_D}" fill="url(#fs)"/>
    <path d="{G.SHIELD_D}" stroke="{G.GOLD}" stroke-opacity="0.95" stroke-width="1.3"/>
    <path d="{G.CHECK_D}" stroke="#ffffff" stroke-width="2.1"
      stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>'''


def lockup_page(mark_px, bg, pad_x=0, pad_y=0, canvas=None):
    """The .logo lockup from index.html, reproduced for offscreen rendering.
    The SVG paints the tile itself now, so the span only carries the glow."""
    gap, fs, rad = mark_px * 14 / 46, mark_px * 26 / 46, mark_px * 13 / 46
    frame = (f"width:{canvas[0]}px;height:{canvas[1]}px;"
             if canvas else f"padding:{pad_y}px {pad_x}px;width:max-content;")
    return f'''<!doctype html><meta charset="utf-8"><style>
  html,body{{margin:0;background:{bg};}}
  .stage{{{frame}display:flex;align-items:center;justify-content:center;}}
  .logo{{display:flex;align-items:center;gap:{gap:.2f}px;}}
  .mark{{width:{mark_px}px;height:{mark_px}px;border-radius:{rad:.2f}px;
    box-shadow:0 {mark_px*6/46:.1f}px {mark_px*16/46:.1f}px rgba(43,112,64,.45);}}
  .mark svg{{width:100%;height:100%;display:block;}}
  .wordmark{{font:800 {fs:.2f}px -apple-system,BlinkMacSystemFont,"Segoe UI",
    Roboto,Helvetica,Arial,sans-serif;letter-spacing:-.03em;color:#f4f5f6;}}
</style><div class="stage"><div class="logo">
  <span class="mark">{mark("og")}</span>
  <span class="wordmark">Shieldora</span>
</div></div>'''


# --- standalone logo pack (logos/) ------------------------------------------
# Same geometry as the page mark; only the ground colour and the shield fill
# change. On the brand green the shield sits darker than its ground; on black
# it takes the brighter tile gradient so the silhouette still reads.
BLACK = "#000000"
WORDMARK_W = 710.09        # "Shieldora" at 800/170px, measured in Chrome
FONT = ("-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, "
        "Arial, sans-serif")

# shield bbox inside the 24-unit viewBox
BB_X, BB_Y, BB_W, BB_H = 3.8, 2.2, 16.4, 18.6

# Shield height as a share of the frame. Deliberately airy: the mark reads as
# a small glyph in a generous field rather than filling its tile.
FILL = 0.38


def _defs(uid, hi, lo, ground=None):
    g = (f'<linearGradient id="{uid}-bg" x1="0.281" y1="-0.103" x2="0.719" y2="1.103">'
         f'<stop offset="0" stop-color="{ground[0]}"/>'
         f'<stop offset="1" stop-color="{ground[1]}"/></linearGradient>') if ground else ""
    return (f'<defs>{g}<linearGradient id="{uid}-s" x1="0" y1="0" x2="0" y2="1">'
            f'<stop offset="0" stop-color="{hi}"/>'
            f'<stop offset="1" stop-color="{lo}"/></linearGradient></defs>')


def _shield(uid, tx, ty, sc):
    """Shield + gold rule + white check, scaled about the 24-unit viewBox."""
    return (f'<g transform="translate({tx:.2f} {ty:.2f}) scale({sc:.4f})" fill="none">'
            f'<path d="{G.SHIELD_D}" fill="url(#{uid}-s)"/>'
            f'<path d="{G.SHIELD_D}" stroke="{G.GOLD}" stroke-opacity="0.95" stroke-width="1.3"/>'
            f'<path d="{G.CHECK_D}" stroke="#ffffff" stroke-width="2.1"'
            f' stroke-linecap="round" stroke-linejoin="round"/></g>')


def logo_square(dark, size=1024, fill=FILL):
    """Mark only, centred on its ground."""
    uid = "d" if dark else "l"
    hi, lo = (G.GREEN_HI, G.GREEN_LO) if dark else (G.SHIELD_HI, G.SHIELD_LO)
    sc = size * fill / BB_H
    tx = (size - BB_W * sc) / 2 - BB_X * sc
    ty = (size - BB_H * sc) / 2 - BB_Y * sc
    ground = (f'<rect width="{size}" height="{size}" fill="{BLACK}"/>' if dark
              else f'<rect width="{size}" height="{size}" fill="url(#{uid}-bg)"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}"'
            f' width="{size}" height="{size}" role="img" aria-label="Shieldora logo">'
            f'{_defs(uid, hi, lo, None if dark else (G.GREEN_HI, G.GREEN_LO))}'
            f'{ground}{_shield(uid, tx, ty, sc)}</svg>')


def logo_lockup(dark, w=1600, h=480, mark=300, fill=FILL):
    """Mark + wordmark, the pair centred as one unit.

    `mark` sets the typographic scale (font size and gap); `fill` sets the
    shield independently, so the shield can shrink without taking the
    wordmark down with it.
    """
    uid = "dl" if dark else "ll"
    hi, lo = (G.GREEN_HI, G.GREEN_LO) if dark else (G.SHIELD_HI, G.SHIELD_LO)
    gap, fs = mark * 14 / 46, mark * 26 / 46
    text_w = WORDMARK_W * fs / 170.0
    sh_h = h * fill                                # shield height
    sc = sh_h / BB_H
    sh_w = BB_W * sc
    x0 = (w - (sh_w + gap + text_w)) / 2           # left edge of the lockup
    tx = x0 - BB_X * sc
    ty = (h - sh_h) / 2 - BB_Y * sc
    ground = (f'<rect width="{w}" height="{h}" fill="{BLACK}"/>' if dark
              else f'<rect width="{w}" height="{h}" fill="url(#{uid}-bg)"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}"'
            f' width="{w}" height="{h}" role="img" aria-label="Shieldora">'
            f'{_defs(uid, hi, lo, None if dark else (G.GREEN_HI, G.GREEN_LO))}'
            f'{ground}{_shield(uid, tx, ty, sc)}'
            f'<text x="{x0 + sh_w + gap:.2f}" y="{h / 2:.2f}" fill="#ffffff"'
            f' font-family="{FONT}" font-size="{fs:.2f}" font-weight="800"'
            f' letter-spacing="{-0.03 * fs:.2f}" dominant-baseline="central">Shieldora</text></svg>')


LOGO_PACK = {
    "shieldora-mark-green": lambda: logo_square(False),
    "shieldora-mark-black": lambda: logo_square(True),
    "shieldora-lockup-green": lambda: logo_lockup(False),
    "shieldora-lockup-black": lambda: logo_lockup(True),
}


if __name__ == "__main__":
    import os
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "."
    with open("logo-mark.svg", "w", encoding="utf-8") as fh:
        fh.write(mark() + "\n")
    with open("favicon.svg", "w", encoding="utf-8") as fh:
        fh.write(favicon() + "\n")
    with open(f"{out}/mark-inline.svg", "w", encoding="utf-8") as fh:
        fh.write(mark("bm"))
    with open(f"{out}/og.html", "w", encoding="utf-8") as fh:
        fh.write(lockup_page(210, "#000000", canvas=(1200, 630)))
    with open(f"{out}/lockup.html", "w", encoding="utf-8") as fh:
        fh.write(lockup_page(512, "transparent", pad_x=300, pad_y=260))
    os.makedirs("logos", exist_ok=True)
    for name, fn in LOGO_PACK.items():
        with open(f"logos/{name}.svg", "w", encoding="utf-8") as fh:
            fh.write(fn() + "\n")
    print("wrote logo-mark.svg, favicon.svg, mark-inline.svg, og.html, lockup.html")
    print("wrote logos/: " + ", ".join(f"{n}.svg" for n in LOGO_PACK))
