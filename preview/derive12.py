"""Mock 12: the live front page (index.html on main) with a new tablet and
desktop layout in the style of duskmail.app. Phones (under 768px) are
unchanged: every rule added here sits inside a min-width:768px media query,
and the few elements added to the page are hidden or invisible below it.

  python3 preview/derive12.py index.html preview/mock-12.html
"""
import re, sys

src, out = sys.argv[1], sys.argv[2]
s = open(src).read()

def sub(pattern, repl, count=1, flags=re.S):
    global s
    s, n = re.subn(pattern, repl, s, count=count, flags=flags)
    if n != count:
        raise SystemExit("expected %d match(es), got %d: %s" % (count, n, pattern[:70]))

# keep the mock out of search results
sub(r'<link rel="icon"', '<meta name="robots" content="noindex">\n<link rel="icon"')

# the serif used for desktop headings (phones never use it, so never fetch it)
sub(r'family=Inter:wght@400;500;600;700&family=Caveat:wght@600&display=swap',
    'family=Inter:wght@400;500;600;700&family=Caveat:wght@600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap')

# drop the old desktop layer, put the new one in its place
start = s.index('/* ===== Tablet and desktop layout (768px and wider) =====')
end = s.index('</style>')
s = s[:start] + open(__file__.rsplit('/', 1)[0] + '/mock-12-desktop.css').read() + s[end:]

# page links in the middle of the menu, desktop only
sub(r'(Shieldora</a>\n)(\s*<div class="navright">)',
    r'\1    <div class="navmid"><a href="#alerts">Alerts</a><a href="#preview">The app</a><a href="#controls">Controls</a><a href="#faq">FAQ</a></div>\n\2')
sub(r'<section class="controls centre">', '<section class="controls centre" id="controls">')

# each screen gets a frame (invisible on phones) and a longer desktop caption
caps = {
    "Home. Tap a child to open their page.":
        ("Every child on one screen", "Each card shows when that phone was last heard from, and its alerts today and this week. Tap a child to open their page."),
    "Layla&rsquo;s page, after tapping her on Home: recent alerts, then the controls.":
        ("One page for each child", "When their phone was last heard from, what&rsquo;s switched on, then their recent alerts and the controls you&rsquo;ve set."),
    "Activity, today and yesterday, across both children.":
        ("Today and yesterday, in order", "Every alert across both children, each with the device and the time."),
    "Settings: your account, plan and the alert check.":
        ("A check that alerts reach you", "Settings holds your account and your plan. It also sends you a test alert and asks you to confirm it arrived."),
    "The whole child app. Nothing to log into, nothing to switch off.":
        None,
}
for old, new in caps.items():
    if new is None:
        continue
    sub(re.escape('<figcaption>' + old + '</figcaption>'),
        '<figcaption><span class="cap-m">%s</span><span class="cap-d"><strong>%s</strong><span>%s</span></span></figcaption>' % (old, new[0], new[1]))
sub(r'<figure><div class="dev">(.*?)</div><figcaption>', r'<figure><div class="frame"><div class="dev">\1</div></div><figcaption>', count=5)

# the Settings screen is cropped from the bottom, so the alert check is in view
sub(r'<div class="frame">(<div class="dev"><img src="/screens/parent-settings.png")', r'<div class="frame low">\1')

# desktop: every FAQ answer is open, like a written page
sub(r'<script>\n// The pills under the phone',
    '<script>\n// From tablet width up the FAQ reads as a written page: every answer open.\n'
    'if (window.matchMedia && window.matchMedia("(min-width:768px)").matches) {\n'
    '  document.querySelectorAll("#faq details").forEach(function (d) { d.open = true; });\n}\n'
    '</script>\n<script>\n// The pills under the phone')

open(out, 'w').write(s)
print("wrote", out, len(s))
