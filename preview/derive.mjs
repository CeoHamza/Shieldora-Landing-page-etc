// Writes src/mock-5.html and src/mock-6.html from src/mock-1.html: the common
// changes (the site nav with the support link, no label above the problem
// paragraph, the founder copy comes from build.mjs), then each page's own
// section. Every replacement must match, so a drifted base fails loudly.
//   node preview/derive.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const base = readFileSync(join(here, "src", "mock-1.html"), "utf8");

function swap(text, from, to) {
  if (!text.includes(from)) throw new Error(`no match: ${from.slice(0, 60)}`);
  return text.replace(from, to);
}

const NAV_CSS = `.navright{display:flex;align-items:center;gap:18px}
.navlink{font-size:14px;color:var(--mid);text-decoration:none;white-space:nowrap}
.navlink:hover{color:var(--ink);text-decoration:underline;text-underline-offset:3px}
.btn{display:inline-block;background:var(--deep);color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:999px;border:0;cursor:pointer;min-height:50px;white-space:nowrap}
.btn:hover{background:#0f1a14}
.navbtn{padding:9px 16px;min-height:38px;font-size:14px}
@media (max-width:420px){.brand{font-size:16px}.navright{gap:12px}.navlink{font-size:13px}.navbtn{padding:8px 12px;font-size:13px}}`;

function common(text, comment) {
  text = swap(text, /\/\* Mock 1, after the Hustla reference:[\s\S]*?\*\//.exec(text)[0], comment);
  text = swap(text, `.links{display:none;gap:26px;font-size:14px;color:var(--mid)}
.links a{text-decoration:none}
.links a:hover{color:var(--ink)}
@media (min-width:760px){.links{display:flex}}
.btn{display:inline-block;background:var(--deep);color:#fff;text-decoration:none;font-weight:600;font-size:16px;padding:14px 24px;border-radius:999px;border:0;cursor:pointer;min-height:50px}
.btn:hover{background:#0f1a14}
.navbtn{padding:9px 16px;min-height:38px;font-size:14px}`, NAV_CSS);
  text = swap(text, `  <nav class="topnav" aria-label="Site">
    <a class="brand" href="#top">{{MARK}}Shieldora</a>
    <div class="links"><a href="#alerts">Alerts</a><a href="#preview">The app</a><a href="#faq">Questions</a></div>
    <a class="btn navbtn" href="#waitlist">Join the waitlist</a>
  </nav>`, `  {{SITE_NAV}}`);
  text = swap(text, `    <p class="label">{{PROBLEM_H}}</p>\n`, "");
  text = swap(text, "font-weight:300;color:#6F7975;max-width:40ch", "font-weight:300;color:#66706C;max-width:40ch");
  text = swap(text, ".ntext{font-size:14.5px;line-height:1.35;color:#3C4642;margin-top:2px}", ".ntext{display:block;font-size:14.5px;line-height:1.35;color:#3C4642;margin-top:2px}");
  text = swap(text, `.problem .label{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--soft);font-weight:500;margin:0 0 22px}\n`, "");
  return text;
}

// --- mock 5: mock 1 plus one deep green band for the notifications ---------
let m5 = common(base, `/* Mock 5: mock 1 plus one contrasting band. The notification section sits on
   deep green with the four notifications as iOS cards at slightly different
   widths and white text. Everything else stays white. */`);
m5 = swap(m5, `.notes{max-width:60ch;margin:clamp(32px,5vw,48px) auto 0;font-size:15.5px;color:var(--mid);text-align:left}
.notes p:last-child{margin-bottom:0}`, `.notes{max-width:60ch;margin:clamp(32px,5vw,48px) auto 0;font-size:15.5px;color:var(--mid);text-align:left}
.notes p:last-child{margin-bottom:0}
/* the one band */
.band{background:var(--deep);color:#fff;margin-top:clamp(72px,10vw,128px);padding:clamp(72px,10vw,128px) 0}
.band h2{color:#fff}
.band .lead,.band .notes{color:#C7D3CB}
.band .notif{background:rgba(255,255,255,.13);color:#fff;margin:0 auto}
.band .notif:nth-child(2){width:95%}
.band .notif:nth-child(3){width:90%}
.band .notif:nth-child(4){width:85%}
.band .nic{background:rgba(255,255,255,.14)}
.band .nhead span{color:#B8C4BC}
.band .ntext{color:#E3E8E5}`);
m5 = swap(m5, `  <section class="answer centre" id="alerts">
    <h2>{{ANSWER_H}}</h2>
    <p class="lead">{{ANSWER_LEAD}}</p>
    {{NOTIFS}}
    <div class="notes">
      <p>{{ANSWER_N1}}</p>
      <p>{{ANSWER_N2}}</p>
    </div>
  </section>
`, `</div>

<section class="band centre" id="alerts">
  <div class="wrap">
    <h2>{{ANSWER_H}}</h2>
    <p class="lead">{{ANSWER_LEAD}}</p>
    {{NOTIFS}}
    <div class="notes">
      <p>{{ANSWER_N1}}</p>
      <p>{{ANSWER_N2}}</p>
    </div>
  </div>
</section>

<div class="wrap">
`);
writeFileSync(join(here, "src", "mock-5.html"), m5);

// --- mock 6: notification-led hero ------------------------------------------
let m6 = common(base, `/* Mock 6: notification-led hero. One large phone showing the parent's lock
   screen with the four notifications arriving (the page's one motion moment);
   the three-phone row from mock 1 moves down to the parent app section. */`);
m6 = swap(m6, `@media (prefers-reduced-motion:no-preference){
  .dev{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}
  .dev.main{animation-delay:.08s}.dev:last-child{animation-delay:.16s}
  @keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
}`, `/* the lock screen: a real frame, the screen drawn in HTML */
.dev.lock{width:clamp(250px,70vw,380px);aspect-ratio:402/874;-webkit-box-reflect:below 2px linear-gradient(transparent 86%,rgba(0,0,0,.06))}
.dev.lock .scr{height:100%;border-radius:10% / 4.6%;background:radial-gradient(120% 70% at 50% 0%,#1E3A2B,#0C0D0F 70%);display:flex;flex-direction:column;padding:13% 4% 5%;overflow:hidden;color:#fff;text-align:center}
.lp-date{display:block;font-size:clamp(12px,1.6vw,16px);font-weight:500;color:#D5DDD8}
.lp-time{display:block;font-size:clamp(58px,9vw,84px);font-weight:300;letter-spacing:-0.03em;line-height:1.05}
.lp-stack{margin-top:auto;display:grid;gap:7px;text-align:left}
.lock .notif{background:rgba(255,255,255,.16);color:#fff;border-radius:16px;padding:9px 11px;gap:9px}
.lock .nic{width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,.12)}
.lock .nic svg{width:20px;height:20px}
.lock .nhead{font-size:clamp(10.5px,1.45vw,13.5px)}
.lock .nhead span{color:#C9D1CC;font-size:clamp(9px,1.2vw,11px)}
.lock .ntext{color:#E8EDEA;font-size:clamp(10px,1.35vw,12.5px)}
@media (prefers-reduced-motion:no-preference){
  .lp-stack .notif{animation:land .6s cubic-bezier(.2,.7,.2,1) both}
  .lp-stack .notif:nth-child(2){animation-delay:.3s}
  .lp-stack .notif:nth-child(3){animation-delay:.6s}
  .lp-stack .notif:nth-child(4){animation-delay:.9s}
  @keyframes land{from{opacity:0;transform:translateY(-14px) scale(.98)}to{opacity:1;transform:none}}
}
/* the three-phone row, now in the parent app section */
.trio{margin-top:clamp(36px,5vw,56px);padding-bottom:clamp(70px,13vw,170px)}
.trio .caption{color:var(--mid);font-size:14.5px;margin:4px 0 0}`);
m6 = swap(m6, `    <div class="devices">
      <div class="dev side"><img src="screens/child-set-up.png" width="804" height="1748" alt="The child's phone: This phone is set up, with the list of what is on" loading="eager"></div>
      <div class="dev main"><img src="screens/parent-home.png" width="804" height="1748" alt="The parent app's Home screen: Layla and Noah, last heard from minutes ago, ten alerts this week" loading="eager"></div>
      <div class="dev side"><img src="screens/parent-activity.png" width="804" height="1748" alt="The parent app's Activity screen: today's and yesterday's alerts" loading="eager"></div>
    </div>`, `    <div class="devices">
      <div class="dev lock" role="img" aria-label="The parent's lock screen with four Shieldora notifications">
        <div class="scr">
          <span class="lp-date">Thursday 5 November</span>
          <span class="lp-time">9:41</span>
          {{LOCK_STACK}}
        </div>
      </div>
    </div>`);
m6 = swap(m6, `    <p class="lead">{{PREVIEW_LEAD}}</p>
    <div class="shots">
      <figure><div class="dev"><img src="screens/parent-child-layla.png" width="804" height="1748" alt="Layla's page: recent alerts and the controls on her devices" loading="lazy"></div><figcaption>Each child's page: recent alerts, then the controls.</figcaption></figure>
      <figure><div class="dev"><img src="screens/parent-social-apps.png"`, `    <p class="lead">{{PREVIEW_LEAD}}</p>
    <div class="devices trio">
      <div class="dev side"><img src="screens/parent-activity.png" width="804" height="1748" alt="The parent app's Activity screen: today's and yesterday's alerts" loading="lazy"></div>
      <div class="dev main"><img src="screens/parent-home.png" width="804" height="1748" alt="The parent app's Home screen: Layla and Noah, last heard from minutes ago, ten alerts this week" loading="lazy"></div>
      <div class="dev side"><img src="screens/parent-child-layla.png" width="804" height="1748" alt="Layla's page: recent alerts and the controls on her devices" loading="lazy"></div>
    </div>
    <p class="caption">Activity across both children, Home, and each child's page with its recent alerts and controls.</p>
    <div class="shots">
      <figure><div class="dev"><img src="screens/parent-social-apps.png"`);
m6 = swap(m6, `.trio .caption{color:var(--mid);font-size:14.5px;margin:4px 0 0}`, `.preview .caption{color:var(--mid);font-size:14.5px;margin:4px auto 0;max-width:60ch}`);
writeFileSync(join(here, "src", "mock-6.html"), m6);
console.log("wrote src/mock-5.html and src/mock-6.html");
