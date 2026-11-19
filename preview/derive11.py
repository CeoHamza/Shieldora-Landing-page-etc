"""Mock 11: the live front page (index.html on main) re-laid out the way
tarjam.ai uses the width. Same words, screens and scripts as the live page;
only the layout below the hero changes.

  git show origin/main:index.html > /tmp/live.html
  python3 preview/derive11.py /tmp/live.html preview/mock-11.html

One 1120px box (1024px of content) with one left edge for every section,
two-column sections, two full-width colour bands (deep green behind the
alerts, mint behind the app screens), equal padding top and bottom, and on
phones the app screens become a sideways swipe. Founder and FAQ stay narrow.
"""
import re, sys

src, out = sys.argv[1], sys.argv[2]
s = open(src).read()

def section(sel):
    m = re.search(r'  <section class="%s"[^>]*>\n(.*?)\n  </section>' % re.escape(sel), s, re.S)
    if not m: raise SystemExit("section not found: " + sel)
    return m.group(1)

def take(html, pattern):
    m = re.search(pattern, html, re.S)
    if not m: raise SystemExit("not found: " + pattern[:60])
    return m.group(0)

ctl = section("controls centre")
alerts = section("answer centre")
prev = re.search(r'<section class="preview centre" id="preview">\n(.*?)\n  </section>', s, re.S).group(1)
child = re.search(r'<section class="preview centre" id="childapp">\n(.*?)\n  </section>', s, re.S).group(1)
sign = section("signup centre")
founder = section("founder centre narrow")
faq = section("faq centre")

h = lambda html: take(html, r'<h2>.*?</h2>')
lead = lambda html: take(html, r'<p class="lead">.*?</p>')

main = f'''<main>
  <section class="band plain controls">
    <div class="wrap">
      {h(ctl)}
      {take(ctl, r'<div class="grid">.*?\n    </div>')}
    </div>
  </section>

  <section class="band dark" id="alerts">
    <div class="wrap">
      <div class="split">
        <div class="side">
          {h(alerts)}
          {lead(alerts)}
          {take(alerts, r'<p class="never">.*?</p>')}
        </div>
        <div class="side">
          {take(alerts, r'<div class="stack".*?\n    </div>')}
        </div>
      </div>
      {take(alerts, r'<div class="notes">.*?\n    </div>')}
    </div>
  </section>

  <section class="band mint preview" id="preview">
    <div class="wrap">
      <div class="intro">
        {h(prev)}
        {lead(prev)}
      </div>
      {take(prev, r'<div class="shots four">.*?\n    </div>')}
    </div>
  </section>

  <section class="band plain childapp" id="childapp">
    <div class="wrap">
      <div class="split">
        <div class="side">
          {h(child)}
          {lead(child)}
        </div>
        <div class="side one">
          {take(child, r'<figure>.*?</figure>')}
        </div>
      </div>
    </div>
  </section>

  <section class="band plain signup" id="waitlist">
    <div class="wrap">
      <div class="split">
        <div class="side">
          {h(sign)}
          {lead(sign)}
        </div>
        <div class="side">
          {take(sign, r'<form.*?</form>')}
          {take(sign, r'<p class="fine">.*?</p>')}
          {take(sign, r'<p class="collect">.*?</p>')}
        </div>
      </div>
    </div>
  </section>

  <section class="band plain founder" id="founder">
    <div class="wrap narrow">
{founder}
    </div>
  </section>

  <section class="band plain faq centre" id="faq">
    <div class="wrap">
{faq}
    </div>
  </section>
</main>'''

i = s.index('<main class="col">'); j = s.index('</main>') + len('</main>')
s = s[:i] + main + s[j:]

CSS = '''
/* ===== Mock 11: tarjam-style use of the width (see preview/derive11.py) ===== */
section{padding:0}
.band{padding:clamp(64px,8vw,96px) 0}
.band.plain + .band.plain{padding-top:0}
.band h2{max-width:22ch}
.band .lead{max-width:56ch}
.split{display:grid;gap:clamp(32px,5vw,80px);align-items:center}
@media (min-width:900px){.split{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
.side > :last-child{margin-bottom:0}
.controls h2{font-size:clamp(24px,3vw,30px)}
.controls .grid{max-width:none;margin:clamp(28px,4vw,40px) 0 0;grid-template-columns:repeat(3,1fr)}
@media (min-width:700px){.controls .grid{grid-template-columns:repeat(5,1fr)}}
@media (min-width:1000px){.controls .grid{grid-template-columns:repeat(9,1fr);gap:12px}}
@media (max-width:699.98px){.controls .grid{grid-template-columns:repeat(2,1fr)}.controls .grid .ctl:last-child:nth-child(odd){grid-column:auto}}
.ctl{text-align:left}
.ctl svg{margin:0 0 10px}
.dark{background:#16261F;--ink:#fff;--mid:#C7D3CB;--soft:#AEBBB3;--text2:#E3E8E5;--line:rgba(255,255,255,.16);--card:rgba(255,255,255,.08);--nic:#348C52;--accent:#6FD08A;color:var(--ink)}
.dark .stack{margin:0;max-width:none}
.dark .never{margin:20px 0 0;max-width:none;text-align:left}
.dark .notes{max-width:none;margin:clamp(40px,5vw,64px) 0 0;padding-top:clamp(28px,4vw,40px);border-top:1px solid var(--line);display:grid;gap:8px 48px;font-size:15.5px;text-align:left}
@media (min-width:900px){.dark .notes{grid-template-columns:repeat(3,1fr)}}
.dark .notes p{margin:0 0 12px}
.dark .notes strong{color:var(--ink)}
.mint{background:#E9F2EC;--card:#fff}
.mint .hint span{color:#256437}
.mint .hint svg{stroke:#256437}
.preview .intro{display:grid;gap:8px 80px;align-items:end}
@media (min-width:900px){.preview .intro{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.preview .intro .lead{margin:0}}
.preview .lead{max-width:52ch}
.shots,.shots.four{display:flex;flex-wrap:nowrap;justify-content:space-between;gap:72px;max-width:none;margin:clamp(32px,4vw,48px) 0 0;column-gap:72px}
.shots figure{width:auto;flex:1 1 0;max-width:260px;margin:0}
.shots figcaption{text-align:left}
@media (min-width:761px){.shots.four .hint{left:calc((100% - 216px) / 4 + 36px)}}
@media (max-width:1100px) and (min-width:761px){.shots,.shots.four{gap:28px;column-gap:28px}.shots.four .hint{display:none}}
@media (max-width:760px){
  .shots,.shots.four{overflow-x:auto;scroll-snap-type:x mandatory;gap:16px;margin-left:calc(-1 * clamp(16px,4vw,48px));margin-right:calc(-1 * clamp(16px,4vw,48px));padding:0 clamp(16px,4vw,48px) 8px;scrollbar-width:none}
  .shots::-webkit-scrollbar{display:none}
  .shots figure{flex:0 0 70%;max-width:none;scroll-snap-align:center}
  .shots.four .hint{display:none}
}
.childapp .one{display:flex;justify-content:center}
.childapp .one figure{margin:0;width:clamp(200px,40vw,280px)}
.childapp .one figcaption{color:var(--mid);font-size:14.5px;margin-top:12px;text-align:center}
.childapp .one .dev{width:100%}
.signup form{margin:0;justify-content:flex-start;max-width:none}
.signup .fine,.signup .collect{margin-left:0;text-align:left}
.founder .narrow{max-width:776px}
.founder p{max-width:62ch}
.faq .faqlist{max-width:680px}
footer{max-width:1120px}
'''
s = s.replace('</style>', CSS + '</style>', 1)
# the mock is served from /preview/, the live paths are root-relative already
s = s.replace('<title>', '<meta name="robots" content="noindex">\n<title>', 1)
if '—' in s: raise SystemExit("em dash")
open(out, 'w').write(s)
print("wrote", out, len(s) // 1024, "KB")
