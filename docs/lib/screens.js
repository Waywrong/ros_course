// ros2: code and terminal panels inside the picture (load after engine.js): the tier-1 look, dark slate with light
// ink, hung in the robots' world wherever a beat is about code. Their text is never typed here: chapters pass lines
// read from the course's files and captured runs (a chapter's captured.js, written by a script).
//   const cp = codePanel(p, lines, { x, y, w, size, title, tint })   lines as in the file (a common indent is removed;
//     '' is a blank row, '⋮' an elision row); size is the largest type, smaller when the longest line needs it.
//     cp.row(i) -> { bar, text, y }: bar lights the row (hidden: tw(cp.row(i).bar, { o: 1 }, t)), y its baseline
//     cp.box(i, str) a box around the first `str` in row i, cp.strike(i) a line through row i (both hidden, o 0)
//     cp.h its height, cp.lineH, cp.size
//   const tp = termPanel(p, lines, { x, y, w, rows, size, title, titleSize })   a terminal (titleSize 16 by default; 22-24,
//     bold and brighter, for a title the viewer must read, such as which terminal it is): tp.show(n) shows the first n lines,
//     scrolled so the last `rows` of them are on screen (pure: call it from a clockRun with n from t); tp.show(n, k)
//     also the first k characters of line n, being typed
//     tp.bar(r) a highlight bar behind screen row r (hidden)
'use strict';
const SCREENS = {
  slate: '#23272e', slateBar: '#2f343d', ink: '#e8e4da', dim: '#8d949e', str: '#f2c94c', num: '#f7a072', kw: '#82c4f5',
  term: '#1f1d1b', termBar: '#3d3936', mono: 'Menlo, "DejaVu Sans Mono", Consolas, "Liberation Mono", monospace',
};
const screensFit = (lines, size, room) => {   // the type size at which the longest line fits `room` px
  ctx2d.font = `${size}px ${SCREENS.mono}`;
  const wMax = Math.max(1, ...lines.map(l => ctx2d.measureText(l).width));
  return Math.min(size, size * room / wMax);
};
const screensWidth = (str, size) => { ctx2d.font = `${size}px ${SCREENS.mono}`; return ctx2d.measureText(str).width; };
// light syntax colours: strings, numbers, a few keywords
function screensColour(t, line) {
  const re = /(f?'[^']*')|\b(def|self|class|try|import|from|return|while|for|in)\b|\b(\d+(?:\.\d+)?)\b/g;
  let at = 0, m;
  const add = (s, fill) => { if (!s) return; const ts = mk('tspan', fill ? { fill } : {}, t); ts.textContent = s; };
  while ((m = re.exec(line))) { add(line.slice(at, m.index)); add(m[0], m[1] ? SCREENS.str : m[2] ? SCREENS.kw : SCREENS.num); at = m.index + m[0].length; }
  add(line.slice(at));
}

function codePanel(p, lines, { x, y, w, size = 22, title = '', tint = SCREENS.kw, o = 1 } = {}) {
  const ind = Math.min(...lines.filter(l => l.trim() && l.trim() !== '⋮').map(l => l.match(/^ */)[0].length));
  const rows = lines.map(l => l.trim() === '⋮' ? '⋮' : l.slice(ind));
  const pad = 18, bar = 38, fs = screensFit(rows, size, w - 2 * pad), lineH = Math.round(fs * 1.55), h = bar + 12 + rows.length * lineH + 10;
  const g = G(p, { o });
  mk('rect', { x, y, width: w, height: h, rx: 14, fill: SCREENS.slate }, g);
  path(g, `M${x} ${y + bar}V${y + 14}Q${x} ${y} ${x + 14} ${y}H${x + w - 14}Q${x + w} ${y} ${x + w} ${y + 14}V${y + bar}Z`, { fill: SCREENS.slateBar, stroke: 'none' });
  mk('rect', { x, y: y + bar - 4, width: w, height: 4, fill: tint }, g);
  if (title) T(g, title, { x: x + pad, y: y + 26, size: 19, weight: 700, fill: tint, font: SCREENS.mono });
  const out = rows.map((line, i) => {
    const top = y + bar + 12 + i * lineH, by = top + lineH * .72;
    const barEl = put(mk('rect', { x: x + 6, y: top, width: w - 12, height: lineH, rx: 6, fill: tint, 'fill-opacity': .28 }, g), { o: 0 });
    const t = put(mk('text', { 'font-size': fs, 'font-family': SCREENS.mono, fill: line === '⋮' ? SCREENS.dim : SCREENS.ink }, g), { x: x + pad, y: by });
    t.style.whiteSpace = 'pre';
    if (line === '⋮') t.textContent = '⋮'; else screensColour(t, line);
    return { bar: barEl, text: t, y: by, top, line };
  });
  const box = (i, str, { stroke = SCREENS.str } = {}) => {
    const r = out[i], k = r.line.indexOf(str), x0 = x + pad + screensWidth(r.line.slice(0, k), fs), bw = screensWidth(str, fs);
    return put(mk('rect', { x: x0 - 5, y: r.top + 3, width: bw + 10, height: lineH - 6, rx: 6, fill: 'none', stroke, 'stroke-width': 3.5 }, g), { o: 0 });
  };
  const strike = i => { const r = out[i], lw = screensWidth(r.line, fs); return put(mk('rect', { x: x + pad - 4, y: r.top + lineH * .45, width: lw + 8, height: 4, rx: 2, fill: '#ff7b6b' }, g), { o: 0 }); };
  return Object.assign(g, { row: i => out[i], box, strike, h, w, x, y, lineH, size: fs, rows: out });
}

function termPanel(p, lines, { x, y, w, rows = 6, size = 20, title = 'Terminal', titleSize = 16, o = 1 } = {}) {
  const pad = 14, bar = 34, fs = screensFit(lines, size, w - 2 * pad), lineH = Math.round(fs * 1.5), h = bar + 10 + rows * lineH + 8;
  const g = G(p, { o });
  mk('rect', { x, y, width: w, height: h, rx: 10, fill: SCREENS.term }, g);
  path(g, `M${x} ${y + bar}V${y + 10}Q${x} ${y} ${x + 10} ${y}H${x + w - 10}Q${x + w} ${y} ${x + w} ${y + 10}V${y + bar}Z`, { fill: SCREENS.termBar, stroke: 'none' });
  // a title that names the terminal (not just its folder) is read: titleSize 22-24, brighter
  T(g, title, { x: x + w / 2, y: y + 23 + (titleSize - 16) * .4, size: titleSize, fill: titleSize > 16 ? '#ece6da' : '#b9b1a6', weight: titleSize > 16 ? 700 : undefined, anchor: 'middle' });
  [0, 1, 2].forEach(k => mk('circle', { cx: x + w - 56 + k * 19, cy: y + 17, r: 6, fill: k === 2 ? '#e8743b' : '#6b645d' }, g));
  const bars = [], texts = [];
  for (let r = 0; r < rows; r++) {
    const top = y + bar + 10 + r * lineH;
    bars.push(put(mk('rect', { x: x + 5, y: top - 2, width: w - 10, height: lineH, rx: 5, fill: SCREENS.str, 'fill-opacity': .22 }, g), { o: 0 }));
    const t = put(mk('text', { 'font-size': fs, 'font-family': SCREENS.mono, fill: '#ece6da' }, g), { x: x + pad, y: top + lineH * .7 });
    t.style.whiteSpace = 'pre'; texts.push(t);
  }
  let shown = '';
  const show = (n, k = 0) => {
    n = Math.max(0, Math.min(lines.length, n)); k = n < lines.length ? Math.max(0, Math.min(lines[n].length, Math.floor(k))) : 0;
    if (`${n},${k}` === shown) return g; shown = `${n},${k}`;
    const all = k ? [...lines.slice(0, n), lines[n].slice(0, k)] : lines.slice(0, n), first = Math.max(0, all.length - rows);
    texts.forEach((t, r) => { const s = first + r < all.length ? all[first + r] : ''; if (t.textContent !== s) t.textContent = s; });
    return g;
  };
  return Object.assign(g, { show, bar: r => bars[r], h, w, x, y, lineH, size: fs, rows });
}
