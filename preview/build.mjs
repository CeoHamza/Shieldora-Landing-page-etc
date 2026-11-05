// Builds preview/option-N.html from preview/src/option-N.html.
//
// Each option template carries its own structure and stylesheet. What every
// option shares comes from here: the copy (one source, so the five differ in
// look and not in words), the phone mock-ups lifted verbatim from index.html
// (the hero lock screen, the four parent screens, the child screen), the
// waitlist form and its script, the footer, and the meta tags. The child's
// name is Layla everywhere.
//
//   node preview/build.mjs          # writes option-1.html .. option-5.html
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const index = readFileSync(join(here, "..", "index.html"), "utf8");

function between(text, startMarker, endMarker, { includeEnd = false } = {}) {
  const s = text.indexOf(startMarker);
  if (s < 0) throw new Error(`marker not found: ${startMarker.slice(0, 40)}`);
  const e = text.indexOf(endMarker, s + startMarker.length);
  if (e < 0) throw new Error(`end marker not found: ${endMarker.slice(0, 40)}`);
  return text.slice(s, includeEnd ? e + endMarker.length : e);
}
const layla = (s) => s.replace(/Emma/g, "Layla");

// --- fragments from index.html ---------------------------------------------
// The lifted CSS carries index.html's own comments; the dash and the old name
// in them are replaced so the built page carries neither.
const tidy = (s) => layla(s.replace(/—/g, ","));
const lockphoneCss = tidy(between(index, ".lockphone{", "@media (prefers-reduced-motion:reduce){.lp-notif{animation:none;opacity:1}}", { includeEnd: true }));
const lockphone = layla(between(index, '<div class="lockphone">', '      </div>\n    </div>\n  </div>\n\n</div><!-- /.wrap'));
const appdemoCss = tidy(between(index, "/* ===== Parent app preview", "    </style>"));
const parentScreens = layla(between(index, '<div class="screens appdemo quad">', "  </section>\n\n  <section class=\"preview childapp\""));
const childScreen = layla(between(index, '<div class="screens appdemo">', "  </section>\n\n  <div class=\"signup\""));

// --- the copy ---------------------------------------------------------------
const copy = {
  TITLE: "Shieldora: Know when an adult site is blocked. Know when protection breaks.",
  DESCRIPTION: "Shieldora blocks adult sites on your child's iPhone or iPad, tells you when an adult site is blocked, and tells you if that protection ever stops running.",
  HERO_H1: "You get told.<br>That&rsquo;s the whole point.",
  HERO_DECK: "Most filters fail silently. Shieldora blocks adult sites on your child&rsquo;s iPhone and tells you when something is blocked, and when protection stops.",
  HERO_MICRO: "<b>Coming soon.</b> A$14.99 a month for the whole family, or A$119.99 a year. Founding price, locked while you stay subscribed. The waitlist is for early access.",
  PROBLEM_H: "Protection gets switched off in silence",
  PROBLEM_P1: "A filter a child can quietly disable isn&rsquo;t protection. It fails without a sound, and nothing arrives to tell you it stopped.",
  PROBLEM_P2: "It happens on a screen in another room, and nothing reaches you. Most parents find out long after, if at all.",
  ANSWER_H: "A notification lands on your phone.",
  ANSWER_LEAD: "When an adult site is blocked, when a browser is allowed, or when your child&rsquo;s phone goes quiet, a notification lands on your phone with the child, the device and the time. You don&rsquo;t have to go and check.",
  ANSWER_S1: "A site was blocked", ANSWER_S2: "Protection was turned off", ANSWER_S3: "We haven&rsquo;t heard from this phone",
  ANSWER_N1: "A phone going quiet usually just means it&rsquo;s switched off, flat, out of signal, or that iOS has paused Shieldora&rsquo;s background checks, so that one is a gentle heads-up after 24 hours, not an alarm. Screen Time being turned off is the one that matters. Shieldora tries to tell you straight away. If that alert can&rsquo;t get through, the phone goes quiet, and 24 hours of silence always reaches you.",
  ANSWER_N2: "And it can&rsquo;t be quietly removed first: there is no Shieldora screen that turns protection off, and lifting it in iOS Settings needs the parent&rsquo;s Apple Account password, not the child&rsquo;s passcode, not their Face ID.",
  PREVIEW_H: "What you&rsquo;ll open on your own phone",
  PREVIEW_LEAD: "The parent app isn&rsquo;t finished yet. <strong>This is the design we&rsquo;re building to, not a screenshot of working software</strong>, so treat it as where it&rsquo;s heading rather than what you&rsquo;d get today. It shows what Shieldora will do at launch. Some of it works now, and the rest, such as the alert when a site is blocked, lands before we open to families.",
  CHILD_H: "What your child sees on their phone",
  CHILD_LEAD: "No login, no dashboard, nothing to switch off. Just what a parent has set, and who to ask if something stops working.",
  SIGNUP_H: "Be the first to protect your family",
  SIGNUP_P: "Join the waitlist and we&rsquo;ll email you when Shieldora is ready for your family&rsquo;s devices.",
  SIGNUP_FINE: "No spam. We&rsquo;ll only email you about Shieldora.",
  SIGNUP_COLLECT: "We collect your email address, the date, and the page and link you arrived from. We use it for one thing: to email you when Shieldora is ready. We don&rsquo;t sell it or pass it on. <a href=\"privacy.html\">How we handle your information</a>.",
  ALERTS_H: "What an alert tells you, and what it doesn&rsquo;t",
  ALERTS_LEAD: "Every alert names three things: the child, the device, and the time. It never names the site on the lock screen or in email. In the app it names the site only if you turn that on for a child, and your child is told when you do.",
  ALERTS_NEVER: "<b>What&rsquo;s never in an alert:</b> search terms, typed text, messages, browsing history, or screenshots. A block alert names the child, the device and the time. The site itself appears only in the app, only if you turn on more detail for that child, and only for 30 days. We don&rsquo;t build a browsing history of your child&rsquo;s sites for you to read.",
  AL1: "A site was blocked on Layla&rsquo;s iPhone", AL1_T: "4:52 pm",
  AL2: "Protection was turned off on Layla&rsquo;s iPhone", AL2_T: "9:10 pm",
  AL3: "Screen Time permission was restored on Layla&rsquo;s iPhone", AL3_T: "9:24 pm",
  FOUNDER_H: "Who&rsquo;s behind this",
  FOUNDER_P1: "Most parental controls fail the same way. The filter gets switched off, or a kid gets around it, and the parent is the last to know. Sometimes that&rsquo;s weeks later, and by then the conversation they should have had is long overdue. Shieldora exists to fix that one problem: block adult sites, and make sure you get told when something is blocked or protection stops.",
  FOUNDER_P2: "Shieldora is built by one person in Perth. No outsourced support, no data sold to anyone. If you have a question, email <a href=\"mailto:contact@shieldora.app\">contact@shieldora.app</a> and you&rsquo;ll get a real reply.",
  FAQ_H: "Questions parents ask",
  FOOTER_LINE: "&copy; 2026 Shieldora. Built in Perth to help keep kids safer online.",
};

const faq = [
  ["What exactly do the alerts tell me?", "The exceptions that matter: a site being blocked, Screen Time being turned off, the phone going quiet for 24 hours, or you allowing a non-Safari browser. Each comes with the child, the device and the time. Nothing about what your child searched or typed."],
  ["Do you see my child's browsing history or messages?", "No. We don't collect search terms, typed text, messages, or a history of sites that weren't blocked. That's a deliberate line, not a feature we haven't built yet."],
  ["Can my child just turn it off?", "No. There is no Shieldora screen that turns protection off, and the app can't be deleted. Lifting it means going into iOS Settings, where iOS asks for the parent's Apple Account password, not the child's device passcode or Face ID. And if protection is switched off, Shieldora tries to alert you straight away. If that signal does not get through, the phone falls silent, and silence that lasts 24 hours reaches you on its own, so a switch-off does not stay hidden."],
  ["Will you tell me what my child tried to visit?", "Only if you turn on more detail for that child, with your second factor. Then the app shows the website address of each blocked site and whether it was classed adult or harmful content, kept for 30 days and deleted at once if you turn it off. Your child&rsquo;s phone shows that this is on. Off, which is the default, a block alert names the child, the device and the time, never the site. Either way we never record searches, pages or messages, and never build a browsing history of the sites your child visits."],
  ["Will it catch everything?", "No filter is perfect, and some content will get through. What we focus on is different and, we think, more useful: if the filtering stops running, Shieldora tries to tell you, and a phone that goes quiet for 24 hours will reach you on its own. That is the failure that actually leaves a child exposed, and the one most filters never mention."],
  ["How does the blocking actually work?", "Shieldora uses filtering built into iOS, on your child's iPhone or iPad. The filtering happens on the device itself."],
  ["Which browsers does it cover?", "Safari, including private browsing. Other browsers are blocked by default. You can allow one if your child needs it, and we'll warn you that content inside it isn't filtered."],
  ["What do I need to use it?", "Your child&rsquo;s iPhone or iPad needs to be on iOS 26.5 or later. That&rsquo;s the version where Shieldora can watch for Screen Time being turned off, on top of noticing when the phone goes quiet. Your own phone can be on an older version. If your child&rsquo;s device is behind, Shieldora asks you to update it before setting it up, rather than guard it in a way it can&rsquo;t stand behind."],
  ["When can I get it?", "Shieldora isn't released yet. Join the waitlist and you'll be among the first families we let in."],
];
const FAQ = faq.map(([q, a]) => `    <details><summary>${q}</summary><p>${a}</p></details>`).join("\n");

const META = `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${copy.TITLE}</title>
<meta name="description" content="${copy.DESCRIPTION}">
<meta property="og:title" content="${copy.TITLE}">
<meta property="og:description" content="${copy.DESCRIPTION}">
<meta property="og:type" content="website">
<meta property="og:url" content="https://shieldora.app">
<meta property="og:image" content="https://shieldora.app/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="You get told. That's the whole point. A phone showing Shieldora alerts.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://shieldora.app/og-image.png">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">`;

const MARK = `<span class="mk" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2.2 3.8 5.4v6c0 4.6 3.2 7.9 8.2 9.4 5-1.5 8.2-4.8 8.2-9.4v-6L12 2.2Z" fill="#16261F" stroke="#dcb978" stroke-width="1.3"/><path d="M8.2 12.1 10.8 14.7 15.8 9.5" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const NAV = `<nav class="topnav" aria-label="Site">
    <a class="brand" href="#top">${MARK}Shieldora</a>
    <a class="btn navbtn" href="#waitlist">Join the waitlist</a>
  </nav>`;

const WAITLIST_FORM = (cls = "") => `<form class="wl-form ${cls}" onsubmit="return false">
      <input type="email" name="email" placeholder="you@example.com" aria-label="Email address" autocomplete="email" inputmode="email">
      <div class="wl-hp" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <button class="btn" type="submit">Join the waitlist</button>
    </form>`;

const FOOTER = `<footer>
    <span>${copy.FOOTER_LINE}</span>
    <nav class="footlinks" aria-label="Footer">
      <a href="/limits/">What Shieldora can&rsquo;t do</a>
      <a href="/screentime/">Set up Screen Time</a>
      <a href="../privacy.html">Privacy policy</a>
      <a href="/support">Support</a>
      <a href="mailto:contact@shieldora.app">contact@shieldora.app</a>
    </nav>
  </footer>`;

const WAITLIST_JS = between(index, "<script>\n// Waitlist: POST both forms", "</script>", { includeEnd: true });

// Shared mock-up CSS: the phone mock-ups come across as they are, with the
// decorative gradients inside them flattened to the palette.
const MOCK_CSS = `
${lockphoneCss}
.lockphone{background:#0f1a14}
.lp-ic{background:rgba(255,255,255,.14)}
${appdemoCss}
.appdemo .dm-avatar,.appdemo .dm-pill-av,.appdemo .dm-drop-av,.appdemo .dm-seg.dm-active{background:#348C52}
.appdemo .dm-hero{background:#14161a}
.appdemo .dm-bar,.appdemo .dm-src-fill{background:#348C52}
.appdemo .dm-lock-card{background:#2b7040;box-shadow:none}
.appdemo .dm-phone{box-shadow:0 30px 60px rgba(0,0,0,.35),inset 0 0 0 2px rgba(255,255,255,.08)}
`;

// The push notifications as the app sends them: the title is always
// "Update about <device>" and the body is the server's alertHeadline. Never a
// site name. Social and streaming blocks don't push, so they are not here.
const NOTIF_ICON = `<span class="nic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2.6 4.6 5.3v6c0 4.3 3 7.4 7.4 8.8 4.4-1.4 7.4-4.5 7.4-8.8v-6L12 2.6Z" fill="#348C52" stroke="#dcb978" stroke-width="1.2"/><path d="M8.4 12 10.9 14.6 15.8 9.3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`;
const PUSH_TITLE = "Update about Layla&rsquo;s iPhone";
const pushes = [
  ["A site was blocked on Layla&rsquo;s iPhone", "now"],
  ["Likely pop-ups or redirects were blocked on Layla&rsquo;s iPhone", "7:52 am"],
  ["Protection was turned off on Layla&rsquo;s iPhone", "yesterday"],
  ["Web filtering may be off on Layla&rsquo;s iPhone", "yesterday"],
];
const notif = ([body, when]) => `<div class="notif">${NOTIF_ICON}<span class="nbody"><span class="nhead">${PUSH_TITLE}<span>${when}</span></span><span class="ntext">${body}</span></span></div>`;
const NOTIFS = `<div class="stack" aria-label="Four example notifications">\n      ${pushes.map(notif).join("\n      ")}\n    </div>`;
const NOTIF_LIST = pushes.map(notif).join("\n");
// The same four as they land on the parent's lock screen (mock 6's hero).
const LOCK_STACK = `<div class="lp-stack" aria-label="Four notifications arriving">\n          ${pushes.map(notif).join("\n          ")}\n        </div>`;
const SITE_NAV = `<nav class="topnav" aria-label="Site">
    <a class="brand" href="#top">${MARK}Shieldora</a>
    <div class="navright"><a class="navlink" href="/support">Report a problem</a><a class="btn navbtn" href="#waitlist">Join the waitlist</a></div>
  </nav>`;

const fragments = { META, NAV, FOOTER, WAITLIST_JS, FAQ, MOCK_CSS, LOCKPHONE: lockphone, PARENT_SCREENS: parentScreens, CHILD_SCREEN: childScreen,
  WAITLIST_FORM: WAITLIST_FORM(), MARK, NOTIFS, NOTIF_LIST, NOTIF_ICON, NOTIF_ICON_SMALL: NOTIF_ICON, PUSH_TITLE, LOCK_STACK, SITE_NAV, ...copy };

const srcDir = join(here, "src");
for (const name of readdirSync(srcDir).filter((f) => /^(option|mock)-\d+\.html$/.test(f))) {
  let html = readFileSync(join(srcDir, name), "utf8");
  html = html.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, key) => {
    if (!(key in fragments)) throw new Error(`${name}: unknown placeholder ${key}`);
    return fragments[key];
  });
  if (/Emma/.test(html)) throw new Error(`${name}: Emma survived`);
  if (/—/.test(html)) throw new Error(`${name}: em dash`);
  writeFileSync(join(here, name), html);
  console.log(`built ${name} (${Math.round(html.length / 1024)} KB)`);
}
