# Shieldora logos

Generated — do not hand-edit. To change anything, edit the geometry or the
`LOGO_PACK` builders in `../build_brand_assets.py` and re-run:

```
python3 build_brand_assets.py
```

That rewrites these SVGs from the same shield geometry the site favicon and
OG image use, so the set cannot drift. The PNGs are rendered from the SVGs.

| File | Size | Use |
|---|---|---|
| `shieldora-mark-green` | 1024×1024 | App icon, avatars, favicons |
| `shieldora-mark-black` | 1024×1024 | Mark on dark UI or dark slides |
| `shieldora-lockup-green` | 1600×480 | Headers, banners on brand green |
| `shieldora-lockup-black` | 1600×480 | Headers, email signatures, dark decks |

Each comes as `.svg` (source, scales cleanly) and `.png` (upload anywhere).

## Notes

- The shield fill flips by ground: the deeper green (`#2a7346`→`#17502c`) on
  brand green, the brighter tile green (`#4aa863`→`#256437`) on black, so the
  silhouette keeps its contrast either way. Gold rule and white check are
  the same in all four.
- The lockup SVGs set the wordmark as live `<text>` in the system UI stack
  (SF on Apple, Segoe on Windows). Anywhere that stack is missing it will
  fall back and the spacing will shift — use the PNG when you can't control
  the font, or outline the text first.
- Backgrounds are baked in. If you need the mark on an arbitrary colour,
  ask for a transparent variant rather than keying one out of these.
