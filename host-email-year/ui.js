// Light/dark switch and text size, shared by the three host email pages. Choices are remembered in this browser.
(function () {
  var KEY = 'ef-host-ui';
  var root = document.documentElement;
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { state = {}; }
  var SIZES = [0.9, 1, 1.15, 1.3, 1.5];
  var size = SIZES.indexOf(state.size) >= 0 ? state.size : 1;

  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } }
  function isDark() {
    var t = root.getAttribute('data-theme');
    if (t) return t === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  if (state.theme === 'dark' || state.theme === 'light') root.setAttribute('data-theme', state.theme);

  var wrap = document.querySelector('.wrap');
  if (!wrap) return;

  var css = document.createElement('style');
  css.textContent = '.uibar{display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap;margin-bottom:14px}' +
    '.uibar button{font:inherit;font-size:14px;min-height:36px;min-width:44px;padding:4px 12px;border-radius:8px;cursor:pointer;' +
    'border:1px solid var(--line);background:var(--surface);color:var(--ink)}' +
    '.uibar button:disabled{opacity:.45;cursor:default}' +
    '.uibar button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}';
  document.head.appendChild(css);

  var bar = document.createElement('div');
  bar.className = 'uibar';
  function button(label, name) {
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = label; b.setAttribute('aria-label', name); b.title = name;
    bar.appendChild(b);
    return b;
  }
  var smaller = button('A−', 'Smaller text');
  var larger = button('A+', 'Larger text');
  var theme = button('', 'Switch between light and dark');

  function paint() {
    wrap.style.zoom = size;
    smaller.disabled = size === SIZES[0];
    larger.disabled = size === SIZES[SIZES.length - 1];
    theme.textContent = isDark() ? 'Light mode' : 'Dark mode';
  }
  function step(n) {
    var i = Math.min(SIZES.length - 1, Math.max(0, SIZES.indexOf(size) + n));
    size = SIZES[i]; state.size = size; save(); paint();
  }
  smaller.addEventListener('click', function () { step(-1); });
  larger.addEventListener('click', function () { step(1); });
  theme.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next); state.theme = next; save(); paint();
  });
  wrap.insertBefore(bar, wrap.firstChild);
  paint();
})();
