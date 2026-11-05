// Writes src/mock-8.html, src/mock-9.html and src/mock-10.html from
// src/base-mock-9.html. The three share one structure; only the THEME block,
// the comment and the theme colour differ.
//   node preview/derive2.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const base = readFileSync(join(here, "src", "base-mock-9.html"), "utf8");
if (!base.includes("{{THEME_CSS}}")) throw new Error("mock-9 base has lost its THEME placeholder");

const WASH_BLOBS = `radial-gradient(55% 60% at 14% 18%,#C9E0D0 0%,rgba(201,224,208,0) 70%),
  radial-gradient(45% 55% at 86% 24%,#D3EBD3 0%,rgba(211,235,211,0) 70%),
  radial-gradient(50% 45% at 50% 62%,#F3EBD6 0%,rgba(243,235,214,0) 72%)`;

const LIGHT_VARS = `:root{--ink:#16261F;--mid:#5A6761;--soft:#5F6965;--text2:#3C4642;--line:#E6E3DC;--accent:#348C52;--error:#8C3B23;
  --btn:#16261F;--btn-ink:#fff;--btn-hover:#0f1a14;--pill:#fff;--pill-line:rgba(22,38,31,.12);--pill-hover:#FAFAF8;
  --input:#fff;--input-line:#D9D5CC;--nic:#16261F;--dev-ring:rgba(0,0,0,.25);--dev-shadow:rgba(22,38,31,.55)}`;

const themes = {
  // Mock 9: mock 7's wash in the hero, fading into a white page. No sheet, no seams.
  9: {
    colour: "#D9E8DD",
    comment: "Mock 9: mock 7's pastel wash in the hero, fading into a white page below. The whole phone sits in the hero with the pills, the price and the first form under it. No white boxes, no seams.",
    css: `${LIGHT_VARS}
:root{--bg:#fff;--card:#F3F3F1;--pillbar:#EDEFEA;--pill-on:#fff;--pill-on-ink:#16261F}
.hero{background:
  ${WASH_BLOBS},
  linear-gradient(160deg,#D6E7DA 0%,#F1EDE1 50%,#D8ECD6 100%)}
.hero::after{content:"";position:absolute;left:0;right:0;bottom:0;height:min(40vh,320px);background:linear-gradient(rgba(255,255,255,0),#fff);pointer-events:none}
.hero .inner{padding-bottom:clamp(24px,4vw,40px)}`,
  },
  // Mock 8: one continuous soft wash down the whole page.
  8: {
    colour: "#D9E8DD",
    comment: "Mock 8: the soft green wash runs down the whole page as one continuous background. Text and sections sit on it directly; the cards are translucent white.",
    css: `${LIGHT_VARS}
:root{--bg:#E6EEE4;--card:rgba(255,255,255,.62);--pillbar:rgba(255,255,255,.5);--pill-on:#fff;--pill-on-ink:#16261F;--line:rgba(22,38,31,.14);--input-line:rgba(22,38,31,.16)}
body{background:
  radial-gradient(1100px 820px at 10% 3%,#BFDAC8 0%,rgba(191,218,200,0) 70%),
  radial-gradient(1000px 800px at 92% 12%,#CBE8CC 0%,rgba(203,232,204,0) 70%),
  radial-gradient(1200px 900px at 50% 28%,#F2E8CF 0%,rgba(242,232,207,0) 72%),
  radial-gradient(1100px 900px at 6% 48%,#C6E2CB 0%,rgba(198,226,203,0) 70%),
  radial-gradient(1100px 900px at 94% 66%,#EFE6D2 0%,rgba(239,230,210,0) 70%),
  radial-gradient(1200px 900px at 25% 90%,#CBE8CC 0%,rgba(203,232,204,0) 70%),
  linear-gradient(170deg,#CFE3D4 0%,#ECEADC 34%,#D5EAD3 66%,#E3EFDF 100%)}
.hero .inner{padding-bottom:clamp(8px,2vw,16px)}`,
  },
  // Mock 10: deep green page, white text, green buttons and accents.
  10: {
    colour: "#16261F",
    comment: "Mock 10: the whole page in deep green with white text. Green buttons and accents; the phone and the notifications stand out against the dark page.",
    css: `:root{--bg:#16261F;--ink:#fff;--mid:#C7D3CB;--soft:#AEBBB3;--text2:#E3E8E5;--line:rgba(255,255,255,.16);--accent:#4FBF6C;--error:#F0A08F;
  --btn:#2B7040;--btn-ink:#fff;--btn-hover:#245C35;--pill:rgba(255,255,255,.08);--pill-line:rgba(255,255,255,.18);--pill-hover:rgba(255,255,255,.14);
  --input:rgba(255,255,255,.08);--input-line:rgba(255,255,255,.2);--nic:#348C52;--dev-ring:rgba(255,255,255,.16);--dev-shadow:rgba(0,0,0,.85);
  --card:rgba(255,255,255,.08);--pillbar:rgba(255,255,255,.08);--pill-on:#2B7040;--pill-on-ink:#fff}
.hero{background:radial-gradient(70% 55% at 50% 0%,#234334 0%,rgba(35,67,52,0) 70%)}
.hero .inner{padding-bottom:clamp(8px,2vw,16px)}
.btn,.pills button[aria-pressed="true"]{box-shadow:none}
.phonewrap .dev{box-shadow:0 0 0 1px var(--dev-ring),0 0 120px -10px rgba(79,191,108,.22),0 40px 80px -30px var(--dev-shadow)}
.navlink:hover{color:var(--accent)}`,
  },
};

for (const [n, t] of Object.entries(themes)) {
  const html = base
    .replace("{{MOCK_COMMENT}}", t.comment)
    .replace("{{THEME_COLOR}}", t.colour)
    .replace("{{THEME_CSS}}", t.css);
  writeFileSync(join(here, "src", `mock-${n}.html`), html);
}
console.log("wrote src/mock-8.html, src/mock-9.html, src/mock-10.html");
