// ros2: the workshop and the warehouses inside the computer (load after engine.js and rooms.js, whose colours and
// mono face it shares). A colcon workspace drawn as one long hall: the source folder is a workbench, the build tool a
// machine that turns what is on the bench into finished goods, each install prefix a warehouse of shelves, and an
// environment list (AMENT_PREFIX_PATH) a board of pinned address cards. Flat paper-cut, drawn in code, in world
// coordinates on the hall's floor (ROOMS.floor); a chapter shows parts of it through a camera. Every text a part
// shows is passed in by the chapter (read from real files and captured runs), never written here.
//   shopHall(p, { x0, x1, zones })        the hall from x0 to x1: back wall (zones [[xa, xb, colour]] tint parts of it),
//                                         faint circuit traces, ceiling, floor over the circuit board
//   shopSign(p, str, { x, y, size, bg, ink, hang, sub })   a name plate centred on (x, y), hung from the ceiling on
//                                         two cords when hang is true; sub a smaller second line; .w, .h, .glow (hidden)
//   shopBench(p, { x, w, top })           a workbench from x to x + w, its top at y = top: { g, top, x, w }
//   shopMat(p, { x, w, y, label })        a folder lying on the bench (a package's folder): a mat with a tab label
//   shopNameCard(p, { x, y, name, note }) a tent card standing at (x, y) (package.xml): name large, note small
//   shopOrder(p, { x, y, title, rows })   a work order on a clipboard standing at (x, y) (setup.py): rows grey lines;
//                                         .row(i) a highlight bar behind line i (hidden); .extra a new line (hidden)
//   shopCrate(p, { x, y, w, label, parts })   a crate standing at (x, y) (a folder of code) with file cards in it,
//                                         parts [{ name, color }]; .partAt(i) -> { g, top: [x, y], socket: [x, y] }
//                                         (socket: a round port on the card's face, where a wire plugs in; hidden
//                                         until .partAt(i).plug is shown)
//   shopMachine(p, { x, w, h, label })    the build machine standing on the floor from x to x + w: a hopper on top,
//                                         gears behind a window, lights, a chute on the right; .run(q, on) turns the
//                                         gears to angle q (turns) and lights it (on 0..1); pure, writes changes only.
//                                         .hopper [x, y] the hopper's mouth, .chute [x, y] the chute's lip, .plate
//   shopBelt(p, [x0, y0], [x1, y1])       a conveyor belt between two points; .move(d) shifts its slats by d px
//   shopBin(p, { x, label })              a bin of offcuts on the floor (build/): .scraps (hidden), .lip [x, y]
//   shopClip(p, { x, y, label })          a clipboard hung on the wall (log/): .sheet (hidden)
//   shopShelves(p, { x, w, top, levels, sign, tint, labels })   a shelving unit (an install prefix) from x to x + w,
//                                         its sign over it; levels [{ y, label, size, align }] shelf surfaces from the top
//                                         (align 'end', the default: the label at the right end; 'start': at the left).
//                                         .level(i) -> { g, y, x0, x1, label }: g the shelf board with its label (fade a
//                                         whole shelf), label its path at the right end, as large as fits (size, 28 by
//                                         default); labels: false starts them hidden (o 0), to show when named. .sign
//   shopBox(p, { x, y, name, color, dark, light })   an executable: a box standing at (x, y) with a big round button
//                                         on its front; .press(q) pushes it in (0..1), .button [x, y] its centre
//   shopTag(p, { x, y, name, note })      a name tag hanging from a hook at (x, y) (an ament index marker)
//   shopBoard(p, { x, y, w, title, rows, size, cardSize })   a list board (an environment variable): title strip and `rows`
//                                         card slots; .card(str, i) a pinned card in slot i (hidden, o 0), .slotAt(i)
//                                         [x, y] the slot's left middle, .h its height
//   shopWire(p, pts, { color, width })    a cable through points (a smooth curve, drawn with draw(): .line), .at(q)
//                                         the point a fraction q along it (pure, from the points), .spark a glowing
//                                         dot to move with put() (hidden)
'use strict';
const SHOP = {
  wall: '#f7ead7', wallLn: '#ebd5b6', wallCool: '#e9eef0', wallCoolLn: '#d3dde1',
  wood: '#c9955c', woodDk: '#9e6f3d', woodLt: '#ddb27c',
  mat: '#7fae7a', matDk: '#5d8a59',
  steel: '#8d97a2', steelDk: '#66707b', steelLt: '#bcc4cc',
  mach: '#6b7f97', machDk: '#4d5d71', machLt: '#9cafc5', glass: '#2f3a46',
  paper: '#fffdf6', line: '#cfc6b6', ink: '#2e2a27', dim: '#7a6a55',
  cork: '#dcb989', corkDk: '#b48d5c', pin: '#e0503f',
  sign: '#3d3833', signInk: '#fff6e6', hi: '#f6cf55',
  mono: 'Menlo, "DejaVu Sans Mono", Consolas, "Liberation Mono", monospace',
};
const shopTextW = (str, size, weight = 400, font = SHOP.mono) => { ctx2d.font = `${weight} ${size}px ${font}`; return ctx2d.measureText(str).width; };
// a text placed by transform, as T() does (tools read a text's baseline as its local y = 0); white space kept
const shopText = (p, str, { x = 0, y = 0, size = 24, weight = 400, fill = SHOP.ink, font = SHOP.mono, anchor = 'start', o } = {}) => {
  const t = put(mk('text', { 'font-size': size, 'font-weight': weight, 'font-family': font, fill, 'text-anchor': anchor }, p), { x, y, ...(o == null ? {} : { o }) });
  t.textContent = str; t.style.whiteSpace = 'pre'; return t;
};

function shopHall(p, { x0 = -300, x1 = 3400, zones = [] } = {}) {
  const { floor, board, top } = ROOMS, g = G(p);
  mk('rect', { x: x0, y: -900, width: x1 - x0, height: floor + 900, fill: SHOP.wall }, g);
  zones.forEach(([a, b, c]) => mk('rect', { x: a, y: -900, width: b - a, height: floor + 900, fill: c }, g));
  // faint circuit traces on the back wall, repeated every 800 px
  let d = '', rings = [];
  for (let ox = Math.floor(x0 / 800) * 800; ox < x1; ox += 800) {
    [[40, 250, 190, 290, 430], [300, 140, 450, 100, 690], [520, 300, 610, 260, 760]].forEach(([a, y, b, y2, e]) => { d += `M${ox + a} ${y}H${ox + b}L${ox + b + 40} ${y2}H${ox + e}`; rings.push([ox + e, y2]); });
  }
  path(g, d, { stroke: SHOP.wallLn, 'stroke-width': 3 });
  rings.forEach(([cx, cy]) => mk('circle', { cx, cy, r: 6, fill: 'none', stroke: SHOP.wallLn, 'stroke-width': 3 }, g));
  mk('rect', { x: x0, y: floor - 24, width: x1 - x0, height: 24, fill: '#ead7bb' }, g);                  // skirting
  mk('rect', { x: x0, y: -900, width: x1 - x0, height: top + 900, fill: ROOMS.ceil }, g);               // ceiling (far up, for a wide view)
  mk('rect', { x: x0, y: top - 6, width: x1 - x0, height: 6, fill: ROOMS.ceilLt }, g);
  mk('rect', { x: x0, y: floor, width: x1 - x0, height: board - floor, fill: ROOMS.floorC }, g);         // floor
  mk('rect', { x: x0, y: floor, width: x1 - x0, height: 5, fill: ROOMS.floorLt }, g);
  mk('rect', { x: x0, y: board, width: x1 - x0, height: 900, fill: ROOMS.pcb }, g);                     // the circuit board under it
  let tr = '', pins = '';
  for (let ox = Math.floor(x0 / 800) * 800; ox < x1; ox += 800) {
    tr += `M${ox} 862H${ox + 180}L${ox + 210} 842H${ox + 520}M${ox + 600} 842H${ox + 700}L${ox + 730} 876H${ox + 800}`;
    [[ox + 120, 836], [ox + 520, 852]].forEach(([x, y]) => { mk('rect', { x, y, width: 86, height: 30, rx: 3, fill: ROOMS.chip }, g); for (let k = 8; k < 86; k += 13) pins += `M${x + k} ${y - 5}v5M${x + k} ${y + 30}v5`; });
  }
  path(g, tr, { stroke: ROOMS.trace, 'stroke-width': 3, 'stroke-opacity': .8 });
  path(g, pins, { stroke: '#a9a39a', 'stroke-width': 3, 'stroke-linecap': 'butt' });
  return g;
}

function shopSign(p, str, { x, y, size = 30, bg = SHOP.sign, ink = SHOP.signInk, hang = false, sub, subInk = SHOP.hi, o = 1, font = SHOP.mono, weight = 700 } = {}) {
  const g = G(p, { x, y, o });
  const w1 = shopTextW(str, size, weight, font), w2 = sub ? shopTextW(sub, size * .62, 500, font) : 0;
  const w = Math.max(w1, w2) + size * 1.2, h = size * 1.7 + (sub ? size * .8 : 0);
  if (hang) path(g, `M${-w / 2 + 22} ${-h / 2}L${-w / 2 + 22} ${-y - 40}M${w / 2 - 22} ${-h / 2}L${w / 2 - 22} ${-y - 40}`, { stroke: ROOMS.ceil, 'stroke-width': 4 });
  const glow = G(g, { o: 0 });
  mk('rect', { x: -w / 2 - 14, y: -h / 2 - 14, width: w + 28, height: h + 28, rx: 20, fill: SHOP.hi, 'fill-opacity': .55 }, glow);
  mk('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 10, fill: bg }, g);
  shopText(g, str, { x: 0, y: -h / 2 + size * 1.18, size, weight, fill: ink, font, anchor: 'middle' });
  if (sub) shopText(g, sub, { x: 0, y: h / 2 - size * .42, size: size * .62, weight: 500, fill: subInk, font, anchor: 'middle' });
  return Object.assign(g, { w, h, glow });
}

function shopBench(p, { x, w, top }) {
  const g = G(p), floor = ROOMS.floor;
  [x + 26, x + w - 48].forEach(lx => mk('rect', { x: lx, y: top + 20, width: 22, height: floor - top - 20, fill: SHOP.woodDk }, g));
  mk('rect', { x: x + 34, y: top + 120, width: w - 68, height: 14, fill: SHOP.woodDk }, g);                  // a stretcher
  mk('rect', { x: x - 10, y: top, width: w + 20, height: 26, rx: 5, fill: SHOP.wood }, g);                   // the top
  mk('rect', { x: x - 10, y: top, width: w + 20, height: 6, rx: 3, fill: SHOP.woodLt }, g);
  mk('rect', { x: x + 6, y: top + 26, width: w - 12, height: 34, fill: '#b5834e' }, g);                      // the apron
  return { g, top, x, w };
}

function shopMat(p, { x, w, y, label, size = 24 }) {
  const g = G(p), tw = shopTextW(label, size, 700) + 28;
  path(g, `M${x} ${y}L${x + 16} ${y - 14}H${x + w - 16}L${x + w} ${y}Z`, { fill: SHOP.mat, stroke: 'none' });   // lying flat, seen a little from above
  mk('rect', { x, y: y - 2, width: w, height: 8, rx: 3, fill: SHOP.matDk }, g);
  const tab = G(g, { x: x + 22, y: y + 6 });                                                                   // the folder's tab, over the bench's edge
  path(tab, `M0 0H${tw}V${size * 1.5}Q${tw} ${size * 1.5 + 8} ${tw - 8} ${size * 1.5 + 8}H8Q0 ${size * 1.5 + 8} 0 ${size * 1.5}Z`, { fill: SHOP.mat, stroke: SHOP.matDk, 'stroke-width': 3 });
  shopText(tab, label, { x: 14, y: size * 1.12, size, weight: 700, fill: '#fff' });
  return Object.assign(g, { tab });
}

function shopNameCard(p, { x, y, name, note, size = 30, o = 1 }) {
  const g = G(p, { x, y, o }), w = Math.max(shopTextW(name, size, 700), note ? shopTextW(note, size * .55, 500, UI) : 0) + 40, h = size * 2.7;
  path(g, `M${-w / 2 - 8} 0L${-w / 2} ${-h}H${w / 2}L${w / 2 + 8} 0Z`, { fill: '#e9e2d2', stroke: 'none' });   // the back leaf
  path(g, `M${-w / 2} 0L${-w / 2 + 6} ${-h + 4}H${w / 2 - 6}L${w / 2} 0Z`, { fill: SHOP.paper, stroke: SHOP.line, 'stroke-width': 3 });
  mk('rect', { x: -w / 2 + 14, y: -h + 14, width: w - 28, height: 6, rx: 3, fill: '#e0762f' }, g);
  shopText(g, name, { x: 0, y: -h + size * 1.55, size, weight: 700, anchor: 'middle' });
  if (note) shopText(g, note, { x: 0, y: -14, size: size * .55, weight: 500, fill: SHOP.dim, font: UI, anchor: 'middle' });
  return Object.assign(g, { w, h });
}

function shopOrder(p, { x, y, title, rows = 6, w = 150, size = 24, o = 1 }) {
  const g = G(p, { x, y, o }), h = 70 + rows * 18 + 26;
  path(g, `M-18 0L${-w / 2 + 6} ${-h * .9}M18 0L${w / 2 - 6} ${-h * .9}`, { stroke: SHOP.woodDk, 'stroke-width': 7 });   // its easel
  const board = G(g, { y: -h - 12 });
  mk('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 8, fill: SHOP.woodDk }, board);
  mk('rect', { x: -w / 2 + 10, y: 18, width: w - 20, height: h - 28, rx: 3, fill: SHOP.paper }, board);
  mk('rect', { x: -26, y: -6, width: 52, height: 22, rx: 6, fill: '#8f969c' }, board);                       // the clip
  shopText(board, title, { x: 0, y: 46, size: Math.min(size, size * (w - 24) / shopTextW(title, size, 700)), weight: 700, anchor: 'middle' });
  const bars = [], marks = [];
  for (let i = 0; i < rows; i++) {
    const ly = 68 + i * 18, lw = (w - 44) * [.9, .7, .82, .6, .86, .74, .8, .66][i % 8];
    bars.push(put(mk('rect', { x: -w / 2 + 14, y: ly - 7, width: w - 28, height: 14, rx: 4, fill: SHOP.hi, 'fill-opacity': .7 }, board), { o: 0 }));
    marks.push(mk('rect', { x: -w / 2 + 22, y: ly - 3, width: lw, height: 6, rx: 3, fill: SHOP.line }, board));
  }
  const extra = G(board, { o: 0 });   // a new line written at the foot
  mk('rect', { x: -w / 2 + 14, y: 68 + rows * 18 - 7, width: w - 28, height: 14, rx: 4, fill: '#ff9d8a', 'fill-opacity': .7 }, extra);
  mk('rect', { x: -w / 2 + 22, y: 68 + rows * 18 - 3, width: (w - 44) * .7, height: 6, rx: 3, fill: '#d9473a' }, extra);
  return Object.assign(g, { w, h, board, row: i => bars[i], extra, top: [x, y - h - 12] });
}

function shopCrate(p, { x, y, w = 200, h = 84, label, parts = [], size = 22, cw = 170, rise = 86 }) {
  const g = G(p, { x, y }), back = G(g), cards = G(g), front = G(g);
  mk('rect', { x: -w / 2 + 8, y: -h - 16, width: w - 16, height: 20, fill: '#8f6a45' }, back);                // the inside of the back
  // file cards standing in it, the first at the back (higher, on the left), each next one lower and to the right, so
  // every card's name stays in sight above the one in front of it
  const n = parts.length, stepX = n > 1 ? (w - 30 - cw) / (n - 1) : 0, stepY = size * 2.3;
  const out = parts.map((pt, i) => {
    const cx = -w / 2 + 15 + cw / 2 + i * stepX, top = -h - rise - (n - 1 - i) * stepY, ch = -top - h + 30;
    const c = G(cards, { x: cx, y: 0 });
    mk('rect', { x: -cw / 2, y: top, width: cw, height: ch, rx: 6, fill: SHOP.paper, stroke: pt.color, 'stroke-width': 4 }, c);
    mk('rect', { x: -cw / 2, y: top, width: cw, height: 10, rx: 4, fill: pt.color }, c);
    const fs = Math.min(size, size * (cw - 14) / shopTextW(pt.name, size, 700));
    shopText(c, pt.name, { x: -cw / 2 + 8, y: top + 14 + fs, size: fs, weight: 700 });
    const plug = G(c, { o: 0 }), sx = -cw / 2 + 26, sy = top + 14 + fs + 24;
    mk('circle', { cx: sx, cy: sy, r: 11, fill: SHOP.ink }, plug); mk('circle', { cx: sx, cy: sy, r: 5, fill: SHOP.hi }, plug);
    return { g: c, top: [x + cx, y + top], socket: [x + cx + sx, y + sy], plug, card: c };
  });
  mk('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 6, fill: SHOP.wood }, front);
  let d = ''; for (let k = 1; k < 3; k++) d += `M${-w / 2} ${-h + k * h / 3}H${w / 2}`;
  path(front, d, { stroke: SHOP.woodDk, 'stroke-width': 3, 'stroke-linecap': 'butt' });
  mk('rect', { x: -w / 2, y: -h, width: w, height: 7, rx: 3, fill: SHOP.woodLt }, front);
  const lw = shopTextW(label, size, 700) + 24;
  mk('rect', { x: -lw / 2, y: -h / 2 - size * .8, width: lw, height: size * 1.6, rx: 6, fill: SHOP.paper, stroke: SHOP.woodDk, 'stroke-width': 3 }, front);
  shopText(front, label, { x: 0, y: -h / 2 + size * .36, size, weight: 700, anchor: 'middle' });
  return Object.assign(g, { partAt: i => out[i], parts: out, w, h });   // (not .part: every element has one)
}

function shopMachine(p, { x, w = 320, h = 360, label, size = 28 }) {
  const floor = ROOMS.floor, y0 = floor - h, g = G(p);
  // the hopper on top, a little left of centre
  const hx = x + w * .34;
  path(g, `M${hx - 80} ${y0 - 70}H${hx + 80}L${hx + 34} ${y0 + 4}H${hx - 34}Z`, { fill: SHOP.machLt, stroke: SHOP.machDk, 'stroke-width': 5, 'stroke-linejoin': 'round' });
  mk('rect', { x: hx - 86, y: y0 - 80, width: 172, height: 16, rx: 6, fill: SHOP.machDk }, g);
  // body, feet, a darker base
  [x + 24, x + w - 64].forEach(fx => mk('rect', { x: fx, y: floor - 18, width: 40, height: 18, rx: 4, fill: SHOP.machDk }, g));
  mk('rect', { x, y: y0, width: w, height: h - 16, rx: 22, fill: SHOP.mach }, g);
  mk('rect', { x, y: floor - 70, width: w, height: 54, rx: 14, fill: SHOP.machDk }, g);
  mk('rect', { x: x + 12, y: y0 + 10, width: w - 24, height: 8, rx: 4, fill: SHOP.machLt, 'fill-opacity': .6 }, g);
  // a round window with two gears behind it
  const wx = x + w * .38, wy = y0 + h * .4, wr = Math.min(w, h) * .25;
  mk('circle', { cx: wx, cy: wy, r: wr + 10, fill: SHOP.machDk }, g);
  mk('circle', { cx: wx, cy: wy, r: wr, fill: SHOP.glass }, g);
  const gear = (r, teeth, col) => {
    const e = mk('g', {}, g); let d = '';
    for (let k = 0; k < teeth; k++) { const a0 = k / teeth * 2 * Math.PI, a1 = a0 + Math.PI / teeth * .9; d += `M0 0L${(r + 7) * Math.cos(a0)} ${(r + 7) * Math.sin(a0)}A${r + 7} ${r + 7} 0 0 1 ${(r + 7) * Math.cos(a1)} ${(r + 7) * Math.sin(a1)}Z`; }
    path(e, d, { fill: col, stroke: 'none' });
    mk('circle', { r, fill: col }, e); mk('circle', { r: r * .35, fill: SHOP.glass }, e);
    return e;
  };
  const r1 = wr * .46, r2 = wr * .34;
  const g1 = gear(r1, 10, '#d9a441'), g2 = gear(r2, 8, '#e8c066');
  const c1 = [wx - wr * .26, wy + wr * .1], c2 = [wx + r1 * .62 + r2 * .62 + 2, wy - wr * .32];
  mk('circle', { cx: wx, cy: wy, r: wr, fill: 'none', stroke: '#fff', 'stroke-opacity': .18, 'stroke-width': 6 }, g);
  // lights on the right of the window
  const lights = ['#68b86b', '#f0b13a', '#e0503f'].map((c, i) => {
    const cx = x + w - 52, cy = y0 + 46 + i * 40;
    mk('circle', { cx, cy, r: 14, fill: SHOP.machDk }, g);
    return [mk('circle', { cx, cy, r: 9, fill: '#5c6570' }, g), c];
  });
  // the chute on the right
  const cy = floor - 150;
  path(g, `M${x + w - 6} ${cy - 46}H${x + w + 34}L${x + w + 46} ${cy + 6}H${x + w - 6}Z`, { fill: SHOP.machDk, stroke: 'none' });
  // the name plate
  const plate = shopSign(g, label, { x: x + w / 2, y: floor - 112, size, bg: '#2b3340', ink: '#e8e4da' });
  let last = '';
  g.run = (q, on = 0) => {
    const key = `${q.toFixed(3)},${on > .5 ? 1 : 0},${Math.floor(q * 6)}`;
    if (key === last) return g; last = key;
    g1.setAttribute('transform', `translate(${c1[0]} ${c1[1]}) rotate(${(q * 360).toFixed(1)})`);
    g2.setAttribute('transform', `translate(${c2[0]} ${c2[1]}) rotate(${(-q * 360 * 10 / 8 + 18).toFixed(1)})`);
    lights.forEach(([e, c], i) => e.setAttribute('fill', on > .5 && (i === 0 || (Math.floor(q * 6) + i) % 2 === 0) ? c : '#5c6570'));
    return g;
  };
  g.run(0, 0);
  return Object.assign(g, { hopper: [hx, y0 - 70], chute: [x + w + 40, cy], plate, x, w, h, top: y0 });
}

function shopBelt(p, [x0, y0], [x1, y1], { h = 18 } = {}) {
  const g = G(p), L = Math.hypot(x1 - x0, y1 - y0), a = Math.atan2(y1 - y0, x1 - x0) * 180 / Math.PI;
  const inner = G(g); inner.setAttribute('transform', `translate(${x0} ${y0}) rotate(${a.toFixed(2)})`);
  mk('rect', { x: -8, y: -h / 2, width: L + 16, height: h, rx: h / 2, fill: '#4a4542' }, inner);
  const slats = path(inner, '', { stroke: '#7a736c', 'stroke-width': 4, 'stroke-linecap': 'butt' });
  [0, L].forEach(cx => mk('circle', { cx, cy: 0, r: h / 2 - 2, fill: '#8f8780' }, inner));
  // legs to the floor at both ends
  path(g, `M${x0 + 10} ${y0 + h / 2}V${ROOMS.floor}M${x1 - 10} ${y1 + h / 2}V${ROOMS.floor}`, { stroke: '#6b645d', 'stroke-width': 8 });
  let last = null;
  g.move = dd => {
    const k = Math.round(((dd % 30) + 30) % 30); if (k === last) return g; last = k;
    let d = ''; for (let s = k; s < L; s += 30) d += `M${s} ${-h / 2 + 4}V${h / 2 - 4}`;
    slats.setAttribute('d', d); return g;
  };
  return g.move(0);
}

function shopBin(p, { x, w = 120, h = 90, label, size = 24, o = 1 }) {
  const floor = ROOMS.floor, g = G(p, { o });
  const scraps = G(g, { o: 0 });
  [[-34, -8, 20, '#e0762f'], [-6, -16, -30, '#9fb0c4'], [22, -6, 40, '#2ea597'], [8, 4, 10, '#f6cf55'], [-22, 6, -12, '#c9955c']].forEach(([dx, dy, r, c]) =>
    mk('rect', { x: -12, y: -7, width: 24, height: 14, rx: 3, fill: c, transform: `translate(${x + w / 2 + dx} ${floor - h + dy}) rotate(${r})` }, scraps));
  path(g, `M${x} ${floor - h}H${x + w}L${x + w - 10} ${floor}H${x + 10}Z`, { fill: SHOP.steel, stroke: 'none' });
  mk('rect', { x: x - 4, y: floor - h - 6, width: w + 8, height: 12, rx: 4, fill: SHOP.steelDk }, g);
  path(g, `M${x + 22} ${floor - h + 22}V${floor - 12}M${x + w - 22} ${floor - h + 22}V${floor - 12}`, { stroke: SHOP.steelLt, 'stroke-width': 5 });
  const lw = shopTextW(label, size, 700) + 20;
  mk('rect', { x: x + w / 2 - lw / 2, y: floor - h / 2 - size * .75, width: lw, height: size * 1.5, rx: 6, fill: SHOP.paper }, g);
  shopText(g, label, { x: x + w / 2, y: floor - h / 2 + size * .36, size, weight: 700, anchor: 'middle' });
  return Object.assign(g, { scraps, lip: [x + w / 2, floor - h] });
}

function shopClip(p, { x, y, label, size = 24, o = 1 }) {
  const g = G(p, { x, y, o }), w = Math.max(96, shopTextW(label, size, 700) + 30), h = 120;
  path(g, 'M0 -14V0', { stroke: SHOP.steelDk, 'stroke-width': 4 }); mk('circle', { cx: 0, cy: -16, r: 5, fill: SHOP.steelDk }, g);   // its nail
  mk('rect', { x: -w / 2, y: 0, width: w, height: h, rx: 8, fill: SHOP.woodDk }, g);
  mk('rect', { x: -w / 2 + 9, y: 14, width: w - 18, height: h - 22, rx: 3, fill: SHOP.paper }, g);
  mk('rect', { x: -20, y: -4, width: 40, height: 18, rx: 5, fill: '#8f969c' }, g);
  shopText(g, label, { x: 0, y: 20 + size, size, weight: 700, anchor: 'middle' });
  const sheet = G(g, { o: 0 });
  for (let i = 0; i < 4; i++) mk('rect', { x: -w / 2 + 18, y: 36 + size + i * 13, width: (w - 36) * [.9, .6, .8, .5][i], height: 5, rx: 2.5, fill: SHOP.line }, sheet);
  return Object.assign(g, { sheet, w, h });
}

function shopShelves(p, { x, w, top, levels, sign, signSize = 30, tint = SHOP.wood, dark = SHOP.woodDk, light = SHOP.woodLt, labelSize = 28, labels = true }) {
  const floor = ROOMS.floor, g = G(p), back = G(g), front = G(g);
  mk('rect', { x: x + 10, y: top, width: w - 20, height: floor - top, fill: '#000', 'fill-opacity': .045 }, back);   // its shadow on the wall
  [x, x + w - 18].forEach(ux => mk('rect', { x: ux, y: top, width: 18, height: floor - top, rx: 4, fill: dark }, back));
  const out = levels.map(({ y, label, size = labelSize, align = 'end' }) => {
    const lg = G(front);
    mk('rect', { x: x - 6, y, width: w + 12, height: 16, rx: 4, fill: tint }, lg);
    mk('rect', { x: x - 6, y, width: w + 12, height: 5, rx: 2, fill: light }, lg);
    const fs = label ? Math.min(size, size * (w - 36) / shopTextW(label, size, 700)) : 0;
    const lab = label ? shopText(lg, label, { x: align === 'start' ? x + 34 : x + w - 18, y: y + 16 + fs * 1.02, size: fs, weight: 700, fill: dark, anchor: align, o: labels ? 1 : 0 }) : null;
    return { g: lg, y, x0: x + 18, x1: x + w - 18, label: lab };
  });
  const sg = sign ? shopSign(front, sign, { x: x + w / 2, y: top - signSize * 1.1, size: signSize }) : null;
  return Object.assign(g, { back, front, level: i => out[i], levels: out, sign: sg, x, w, top });
}

function shopBox(p, { x, y, name, color, dark, light, w = 96, h = 70, size = 22, o = 1 }) {
  const g = G(p, { x, y, o }), d = 14;
  path(g, `M${-w / 2} ${-h}L${-w / 2 + d} ${-h - d}H${w / 2 + d}L${w / 2} ${-h}Z`, { fill: light, stroke: 'none' });   // its top
  path(g, `M${w / 2} 0V${-h}L${w / 2 + d} ${-h - d}V${-d}Z`, { fill: dark, stroke: 'none' });                          // its side
  mk('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 4, fill: color }, g);
  const fs = Math.min(size, size * (w - 14) / shopTextW(name, size, 700));
  shopText(g, name, { x: 0, y: -h + fs + 6, size: fs, weight: 700, fill: '#fff', anchor: 'middle' });
  const by = -h * .34, br = Math.min(17, h * .2);
  mk('circle', { cx: 0, cy: by, r: br + 5, fill: dark }, g);
  const btn = mk('circle', { cx: 0, cy: by, r: br, fill: '#ffd34d', stroke: '#c4951c', 'stroke-width': 3 }, g);
  let last = null;
  g.press = q => {
    q = Math.round(Math.max(0, Math.min(1, q)) * 20) / 20; if (q === last) return g; last = q;
    btn.setAttribute('r', (br * (1 - .22 * q)).toFixed(2)); btn.setAttribute('fill', q > .5 ? '#ffe9a0' : '#ffd34d'); return g;
  };
  return Object.assign(g, { button: [x, y + by], w, h, top: [x, y - h - d] });
}

function shopTag(p, { x, y, name, note, size = 22, color = '#e0762f', o = 1 }) {
  const g = G(p, { x, y, o }), w = Math.max(shopTextW(name, size, 700), note ? shopTextW(note, size * .7, 500, UI) : 0) + 34, h = size * (note ? 2.9 : 1.9);
  mk('circle', { cx: 0, cy: 0, r: 6, fill: SHOP.steelDk }, g);                                              // its hook
  path(g, `M0 0L${-w / 2 + 16} 30`, { stroke: SHOP.dim, 'stroke-width': 2.5 });
  const body = G(g, { x: -w / 2 + 16, y: 30 });
  path(body, `M-10 0H${w - 16}V${h}H-10L-22 ${h / 2}Z`, { fill: SHOP.paper, stroke: color, 'stroke-width': 3, 'stroke-linejoin': 'round' });
  mk('circle', { cx: -6, cy: h / 2, r: 4, fill: color }, body);
  shopText(body, name, { x: (w - 26) / 2, y: size * 1.25, size, weight: 700, anchor: 'middle' });
  if (note) shopText(body, note, { x: (w - 26) / 2, y: h - size * .5, size: size * .7, weight: 500, fill: SHOP.dim, font: UI, anchor: 'middle' });
  return Object.assign(g, { w, h, mid: [x, y + 30 + h / 2] });
}

function shopBoard(p, { x, y, w, title, rows = 2, size = 24, cardSize = size, o = 1 }) {
  const g = G(p, { o }), pad = 16, head = size * 1.9, rowH = Math.max(size, cardSize) * 1.9, h = head + rows * rowH + pad * 1.2;
  mk('rect', { x: x - 10, y: y - 10, width: w + 20, height: h + 20, rx: 12, fill: SHOP.woodDk }, g);
  mk('rect', { x, y, width: w, height: h, rx: 6, fill: SHOP.cork }, g);
  let dots = ''; for (let k = 0; k < 40; k++) dots += `M${x + 20 + (k * 97) % (w - 40)} ${y + 14 + (k * 53) % (h - 28)}h2`;
  path(g, dots, { stroke: SHOP.corkDk, 'stroke-width': 3 });
  mk('rect', { x, y, width: w, height: head, rx: 6, fill: SHOP.sign }, g);
  const titleT = shopText(g, title, { x: x + w / 2, y: y + head * .66, size, weight: 700, fill: SHOP.hi, anchor: 'middle' });
  const slot = i => [x + pad, y + head + pad * .6 + i * rowH + rowH / 2];
  const card = (str, i, { color = SHOP.ink, fs = cardSize } = {}) => {
    const [sx, sy] = slot(i), c = G(g, { x: sx, y: sy, o: 0 }), cw = Math.min(w - 2 * pad, shopTextW(str, fs) + 30), ch = rowH - 10;
    mk('rect', { x: 0, y: -ch / 2, width: cw, height: ch, rx: 4, fill: SHOP.paper }, c);
    mk('circle', { cx: 12, cy: -ch / 2 + 8, r: 6, fill: SHOP.pin }, c);
    shopText(c, str, { x: 15, y: fs * .36, size: fs, fill: color });
    return Object.assign(c, { w: cw, h: ch });
  };
  return Object.assign(g, { card, slotAt: slot, h, w, x, y, title: titleT, rowH });   // (not .slot: every element has one)
}

// A smooth cable through points: Catmull-Rom through them, sampled once, so at(q) is a pure function of the points.
function shopWire(p, pts, { color = '#3a3633', width = 5, o = 1 } = {}) {
  const g = G(p, { o }), P = [pts[0], ...pts, pts[pts.length - 1]], segs = [];
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < P.length - 2; i++) {
    const [p0, p1, p2, p3] = [P[i - 1], P[i], P[i + 1], P[i + 2]];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
    segs.push([p1, c1, c2, p2]);
  }
  const bez = ([a, b, c, e], u) => [0, 1].map(k => (1 - u) ** 3 * a[k] + 3 * u * (1 - u) ** 2 * b[k] + 3 * u * u * (1 - u) * c[k] + u ** 3 * e[k]);
  const samp = [[0, ...pts[0]]];
  segs.forEach(s => { for (let k = 1; k <= 40; k++) { const [x, y] = bez(s, k / 40), l = samp[samp.length - 1]; samp.push([l[0] + Math.hypot(x - l[1], y - l[2]), x, y]); } });
  const L = samp[samp.length - 1][0];
  const at = q => { const l = Math.max(0, Math.min(1, q)) * L; let k = samp.findIndex(s => s[0] >= l); if (k <= 0) return samp[0].slice(1); const [l0, x0, y0] = samp[k - 1], [l1, x1, y1] = samp[k], u = (l - l0) / ((l1 - l0) || 1); return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]; };
  const line = path(g, d, { stroke: color, 'stroke-width': width, fill: 'none' }, { d: 0 });
  const spark = G(g, { o: 0 });
  mk('circle', { r: 16, fill: SHOP.hi, 'fill-opacity': .45 }, spark); mk('circle', { r: 8, fill: '#fff6c8', stroke: SHOP.hi, 'stroke-width': 3 }, spark);
  return Object.assign(g, { line, at, spark, length: L, ends: [pts[0], pts[pts.length - 1]] });
}
