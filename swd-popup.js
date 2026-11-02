/*!
 * SWD555 entry popup — drop-in, no dependencies.
 * Usage: <script src="swd-popup.js" defer></script>
 * Colours follow swd555games.com theme-default.css (main-bg #1f2b27, theme-txt #fbe6ae).
 * Copy strings are drafts: replace before going live.
 */
(function () {
  'use strict';

  var CONFIG = {
    paths: ['/'],                 // [] = show on every path
    delayShow: 800,               // ms after load
    frequency: 'once-per-session',// 'every-load' | 'once-per-session' | 'once-per-day'
    debug: false,                 // true = always show (local testing)
    // Relative names load from the same folder as this script (e.g. your github.io repo).
    logoUrl: 'swd555-logo.webp',  // '' = text wordmark
    logoAlt: 'SWD555',
    bannerUrl: 'swd555-banner.webp', // '' = visible placeholder box
    bannerAlt: 'SWD555',
    officialUrl: 'https://swd555.link/swd555new',
    lineUrl: 'https://swd555.link/line-swd555', // '' hides the LINE row
    text: {
      title: 'SWD555 ทางเข้าเว็บไซต์',
      lineTitle: 'LINE',
      lineSub: 'ติดต่อฝ่ายบริการลูกค้า',
      noticeTitle: 'ตรวจสอบลิงก์ก่อนใช้งาน',
      noticeBody: 'โปรดใช้เฉพาะลิงก์ด้านล่างนี้ และระวังเว็บไซต์ปลอมที่ใช้ชื่อคล้ายกัน',
      copyHint: 'แตะเพื่อคัดลอกลิงก์',
      copied: 'คัดลอกแล้ว',
      close: 'ปิด',
      footer: '© ' + new Date().getFullYear() + ' SWD555'
    }
  };

  var KEY = 'swd_popup_last';
  var ID = 'swd-pop';

  // Folder this script was loaded from, so relative asset names work cross-domain.
  var BASE = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.slice(0, s.lastIndexOf('/') + 1) : '';
  })();

  function resolve(url) {
    if (!url || /^(https?:)?\/\/|^data:|^\//.test(url)) return url;
    return BASE + url;
  }

  function store(type) {
    try { return type === 'session' ? window.sessionStorage : window.localStorage; } catch (e) { return null; }
  }

  function shouldRun() {
    if (CONFIG.debug) return true;
    if (CONFIG.paths.length && CONFIG.paths.indexOf(location.pathname) === -1) return false;
    var s;
    if (CONFIG.frequency === 'once-per-session') {
      s = store('session');
      try { if (s && s.getItem(KEY)) return false; } catch (e) {}
    } else if (CONFIG.frequency === 'once-per-day') {
      s = store('local');
      try {
        var last = s && parseInt(s.getItem(KEY), 10);
        if (last && Date.now() - last < 864e5) return false;
      } catch (e) {}
    }
    return true;
  }

  function remember() {
    var s = store(CONFIG.frequency === 'once-per-day' ? 'local' : 'session');
    try { if (s) s.setItem(KEY, String(Date.now())); } catch (e) {}
  }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Rendered inside a shadow root, so the host site's CSS can't reach it (and ours can't leak out).
  var CSS = '' +
    ':host{all:initial}' +
    '.ov{--bg:#18221f;--bg-2:#1f2b27;--bg-3:#141d1a;--sage:#445d4f;--sage-2:#24372e;' +
    '--gold:#fbe6ae;--bronze:#795222;--txt:#fff;--muted:rgba(255,255,255,.66);--line:rgba(251,230,174,.22);' +
    '--ok:#70c727;--shadow:3px 3px 4px #131617;--r:10px;' +
    'position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;' +
    'padding:20px 16px;background:rgba(10,14,12,.72);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);' +
    'font-family:"Kanit","Noto Sans Thai","Leelawadee UI",system-ui,sans-serif;color:var(--txt);' +
    'animation:swdFade .35s ease forwards;transition:opacity .3s ease}' +
    '*{box-sizing:border-box}' +
    'img,svg{display:block;max-width:100%}' +
    '.c{position:relative;width:100%;max-width:380px;max-height:calc(100dvh - 40px);overflow:auto;' +
    'border-radius:20px;border:1px solid var(--line);' +
    'background:radial-gradient(273% 141% at 100% 0%,rgba(105,119,105,.5) 0%,rgba(24,34,31,0) 100%),var(--bg);' +
    'box-shadow:0 24px 60px rgba(0,0,0,.6),inset 0 1px 0 rgba(251,230,174,.12);' +
    'animation:swdIn .5s cubic-bezier(.25,1,.2,1.1) forwards;transition:transform .3s ease,filter .3s ease}' +
    '.hd{display:flex;align-items:center;justify-content:center;position:relative;padding:18px 64px;border-bottom:1px solid var(--line)}' +
    '.logo{height:48px;width:auto;max-width:100%;display:block}' +
    '.word{font-size:30px;font-weight:800;letter-spacing:.04em;line-height:1;' +
    'background:linear-gradient(93deg,var(--gold) 0%,#e9c77d 55%,var(--bronze) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}' +
    '.x{position:absolute;right:14px;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;' +
    'display:grid;place-items:center;cursor:pointer;color:var(--gold);background:var(--bg-3);border:1px solid var(--line);transition:background .2s,transform .2s}' +
    '.x:hover{background:var(--sage-2)}' +
    '.x:active{transform:translateY(-50%) scale(.94)}' +
    '.bd{padding:20px 20px 18px;display:grid;gap:14px}' +
    'h2{margin:0;text-align:center;font-size:20px;font-weight:600;color:var(--gold)}' +
    '.ban{position:relative;overflow:hidden;border-radius:14px;border:1px solid var(--line);aspect-ratio:2/1;background:var(--bg-3)}' +
    '.ban.img{aspect-ratio:auto}' +
    '.ban img{width:100%;height:auto;display:block}' +
    '.ban::after{content:"";position:absolute;top:0;left:-150%;width:60%;height:100%;pointer-events:none;' +
    'background:linear-gradient(100deg,transparent,rgba(251,230,174,.22),transparent);transform:skewX(-20deg);animation:swdShine 4s ease-in-out 1s infinite}' +
    '.ph{height:100%;display:grid;place-items:center;text-align:center;padding:12px;font-size:13px;color:var(--muted);' +
    'border:2px dashed var(--line);border-radius:13px}' +
    '.row{display:flex;align-items:center;gap:14px;min-height:64px;padding:12px 14px;border-radius:14px;text-decoration:none;color:inherit;' +
    'background:linear-gradient(90deg,var(--sage) 0%,var(--sage-2) 100%);border:1px solid var(--line);box-shadow:var(--shadow);transition:transform .2s,border-color .2s}' +
    '.row:hover{border-color:var(--gold);transform:translateY(-1px)}' +
    '.ic{flex:none;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--bg-3);color:var(--ok);border:1px solid rgba(112,199,39,.35)}' +
    '.row b{display:block;font-size:17px}' +
    '.row small{display:block;font-size:13px;color:var(--muted)}' +
    '.row .ch{margin-left:auto;color:var(--gold)}' +
    '.nt{border-radius:14px;padding:14px;background:var(--bg-3);border:1px solid var(--line);border-left:3px solid var(--gold)}' +
    '.nt h3{display:flex;align-items:center;gap:10px;margin:0 0 8px;font-size:15px;font-weight:600;color:var(--gold)}' +
    '.nt h3 svg{animation:swdPulse 2.4s ease-in-out infinite}' +
    '.nt p{margin:0 0 12px;font-size:14px;line-height:1.6;color:var(--muted)}' +
    '.cp{width:100%;min-height:48px;display:flex;align-items:center;justify-content:center;gap:10px;padding:10px 14px;cursor:pointer;' +
    'font:inherit;font-size:15px;font-weight:600;color:var(--gold);border:1px solid rgba(251,230,174,.45);border-radius:var(--r);' +
    'background:#0d1311;box-shadow:inset 0 2px 4px rgba(0,0,0,.5);transition:border-color .2s,background .2s,transform .15s}' +
    '.cp:hover{border-color:var(--gold);background:#111a17}' +
    '.cp:active{transform:scale(.98)}' +
    '.cp span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.nt .hint{margin:14px 0 2px;text-align:center;font-size:12px;line-height:1.5;color:var(--muted);min-height:1.5em}' +
    '.hint.ok{color:var(--ok)}' +
    '.ft{padding:0 20px 18px;text-align:center;font-size:12px;color:var(--muted)}' +
    ':focus-visible{outline:2px solid var(--gold);outline-offset:3px}' +
    '@keyframes swdFade{from{opacity:0}to{opacity:1}}' +
    '@keyframes swdIn{0%{opacity:0;transform:perspective(1000px) rotateX(12deg) scale(.9) translateY(40px);filter:blur(4px)}' +
    '100%{opacity:1;transform:none;filter:none}}' +
    '@keyframes swdShine{0%{left:-150%}50%,100%{left:150%}}' +
    '@keyframes swdPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}' +
    '@media (prefers-reduced-motion:reduce){.ov,.c{animation:swdFade .2s ease forwards}' +
    '.nt h3 svg{animation:none}.ban::after{display:none}}';

  var ICON_X = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  var ICON_CHAT = '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s5.9-3.5 8-6C21.4 14.3 22 12.7 22 11c0-4.4-4.5-8-10-8z"/></svg>';
  var ICON_CHEV = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
  var ICON_SHIELD = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/></svg>';
  var ICON_COPY = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>';

  var prevFocus = null;
  var host = null;   // <swd-popup> element in the page
  var root = null;   // its shadow root (or the host itself on very old browsers)

  function close() {
    if (!host || host.dataset.closing) return;
    var h = host, el = root.querySelector('.ov');
    h.dataset.closing = '1';
    el.style.opacity = '0';
    var c = el.querySelector('.c');
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (c && !reduce) {
      c.style.transform = 'perspective(1000px) rotateX(12deg) scale(.9) translateY(40px)';
      c.style.filter = 'blur(4px)';
    }
    document.removeEventListener('keydown', onKey, true);
    setTimeout(function () {
      h.remove();
      host = root = null;
      document.documentElement.style.overflow = h.dataset.ov || '';
      if (prevFocus && prevFocus.focus) prevFocus.focus();
    }, 300);
  }

  function onKey(e) {
    if (!host) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = root.querySelectorAll('a[href],button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    var active = root.activeElement || document.activeElement;
    if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (active === last || !host.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
  }

  function copy(text, done) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(text, done); });
    } else fallback(text, done);
  }

  function fallback(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    ta.remove();
  }

  function open() {
    if (host) return;
    prevFocus = document.activeElement;
    var T = CONFIG.text;

    var logo = CONFIG.logoUrl
      ? '<img class="logo" src="' + esc(resolve(CONFIG.logoUrl)) + '" alt="' + esc(CONFIG.logoAlt) + '" width="113" height="48">'
      : '<span class="word">' + esc(CONFIG.logoAlt) + '</span>';
    var banner = CONFIG.bannerUrl
      ? '<img src="' + esc(resolve(CONFIG.bannerUrl)) + '" alt="' + esc(CONFIG.bannerAlt) + '" width="760" height="375" decoding="async">'
      : '<div class="ph">PLACEHOLDER — banner 2:1 (e.g. 760×380 WebP)<br>set CONFIG.bannerUrl</div>';
    var line = CONFIG.lineUrl
      ? '<a class="row" href="' + esc(CONFIG.lineUrl) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="ic">' + ICON_CHAT + '</span><span><b>' + esc(T.lineTitle) + '</b><small>' + esc(T.lineSub) + '</small></span>' +
        '<span class="ch">' + ICON_CHEV + '</span></a>'
      : '';

    host = document.createElement('swd-popup');
    host.id = ID;
    // Inline + all:initial so page rules on the host tag can't move or hide it.
    host.setAttribute('style', 'all:initial;position:fixed;inset:0;z-index:2147483647;display:block');
    root = host.attachShadow ? host.attachShadow({ mode: 'open' }) : host;

    var st = document.createElement('style');
    st.textContent = CSS;
    root.appendChild(st);

    var el = document.createElement('div');
    el.className = 'ov';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-labelledby', ID + '-t');
    el.innerHTML =
      '<div class="c">' +
        '<div class="hd">' + logo +
          '<button type="button" class="x" aria-label="' + esc(T.close) + '">' + ICON_X + '</button></div>' +
        '<div class="bd">' +
          '<h2 id="' + ID + '-t">' + esc(T.title) + '</h2>' +
          '<div class="ban' + (CONFIG.bannerUrl ? ' img' : '') + '">' + banner + '</div>' +
          line +
          '<div class="nt"><h3>' + ICON_SHIELD + esc(T.noticeTitle) + '</h3>' +
            '<p>' + esc(T.noticeBody) + '</p>' +
            '<button type="button" class="cp" aria-label="' + esc(T.copyHint + ' ' + CONFIG.officialUrl) + '"><span>' +
              esc(CONFIG.officialUrl.replace(/^https?:\/\//, '')) + '</span>' + ICON_COPY + '</button>' +
            '<p class="hint" aria-live="polite">' + esc(T.copyHint) + '</p></div>' +
        '</div>' +
        '<div class="ft">' + esc(T.footer) + '</div>' +
      '</div>';

    root.appendChild(el);
    host.dataset.ov = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.appendChild(host);

    el.addEventListener('click', function (e) { if (e.target === el) close(); });
    el.querySelector('.x').addEventListener('click', close);
    var hint = el.querySelector('.hint');
    el.querySelector('.cp').addEventListener('click', function () {
      copy(CONFIG.officialUrl, function () {
        hint.textContent = T.copied;
        hint.classList.add('ok');
        setTimeout(function () { hint.textContent = T.copyHint; hint.classList.remove('ok'); }, 2000);
      });
    });
    document.addEventListener('keydown', onKey, true);
    el.querySelector('.x').focus({ preventScroll: true });
    remember();
  }

  // Public hook: window.SWDPopup.open() / .close(), and override CONFIG before load via window.SWD_POPUP_CONFIG.
  if (window.SWD_POPUP_CONFIG) {
    var o = window.SWD_POPUP_CONFIG;
    for (var k in o) {
      if (k === 'text') for (var t in o.text) CONFIG.text[t] = o.text[t];
      else CONFIG[k] = o[k];
    }
  }
  window.SWDPopup = { open: open, close: close };

  function boot() { if (shouldRun()) setTimeout(open, CONFIG.delayShow); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
