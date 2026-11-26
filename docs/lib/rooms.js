// ros2: the set (load after engine.js). Inside the computer: talker's room on the left (warm), listener's room on
// the right (cool), a thick wall between them, the floor laid over the circuit board. The rooms are joined only by the
// topic's tube: violet glass that runs through the wall, a name plate hung over it. Flat paper-cut, drawn in code, in
// stage coordinates (1600 x 900): put the whole set in a scaled group to show it small (inside a screen).
//   rooms(p)                  the set; returns { wall, clock } (the wall's group, talker's alarm clock = the timer)
//   roomsTube(p, opts)        the tube { x0, x1, y, h, name, type, plateX }, through the wall when it spans it: returns its layers { back, inside, front, shine,
//                             sleeve, plate } (a message travels in inside), the rim paths to draw on (edges), its open ends
//                             (ends), and the plate's parts { sign, short, long } ("/chatter", "/chatter · String", each with its .glow)
//   roomsClock(p, { x, y, s }) the alarm clock (a node's timer): clock.time(q, ring, shake) fills its face for the
//                             fraction q of the period gone, shows its ringing (0..1) and shakes it (degrees); pure,
//                             writes only changes
//   roomsInbox(p, opts)       the 10-slot inbox (a subscription's queue) { x, y (bottom-left), n, w, h }: layers
//                             { back, slips, front }, slot(i) -> [x, y] where a card stands (slot n-1, on the right, is
//                             the front: the next to be taken), card(layer) a message card standing in a slot (drawn
//                             around its foot), numbers (slot numbers on its front, hidden), bin [x, y]: the basket at
//                             the front end where a message the queue drops goes (its rim's centre)
//   roomsBell(p, side, opts)  the mouth a node fits on the tube's end, side -1 opening left (a publisher), +1 right (a
//                             subscription); drawn around the joint (x, y) so it can pop in place; .mouth is its x
//   roomsSlip(p, opts)        a message: a folded yellow slip stamped with its type; slip.unfold(q) opens it (q 0..1)
//                             to show its field as ros2 topic echo prints it, e.g. data: hello world 229 (opts: type,
//                             field, value, or n for 'hello world n'); slip.mark is a line under the field's name
//                             (hidden). Draw it around its centre and move it with put().
'use strict';
const ROOMS = {
  wallX: [760, 840], top: 34, floor: 790, board: 816,
  warm: '#f8e8d4', warmDk: '#eed6ba', warmLn: '#e7cba9', cool: '#ddf0ea', coolDk: '#c8e3da', coolLn: '#b9d9ce',
  ceil: '#5c4f45', ceilLt: '#76675b', part: '#bfae93', partDk: '#a6957b', partLt: '#d3c4ab',
  floorC: '#dcc6a4', floorLt: '#e8d6b8', pcb: '#4a3f38', trace: '#c9a04f', chip: '#2c2622',
  violet: '#7d5bd0', violetDk: '#4f3596', violetLt: '#cdbdf4', glass: '#ebe3fb', glassDk: '#d9ccf5',
  yellow: '#f6cf55', yellowDk: '#c4951c', paper: '#fff2b8', ink: '#2e2a27', dim: '#7a6a55',
  wood: '#c9955c', woodDk: '#9e6f3d', brass: '#d9a441', clock: '#e0623f',
  mono: 'Menlo, "DejaVu Sans Mono", Consolas, "Liberation Mono", monospace',
};

function rooms(p) {
  const { wallX: [w0, w1], top, floor, board } = ROOMS;
  const g = G(p);
  mk('rect', { x: 0, y: 0, width: w0, height: floor, fill: ROOMS.warm }, g);
  mk('rect', { x: w1, y: 0, width: 1600 - w1, height: floor, fill: ROOMS.cool }, g);
  // faint circuit traces on the back walls: we are inside the computer
  const traces = (dx, mirror, col) => {
    const X = x => mirror ? 1600 - x : x;
    const lines = [[60, 250, 210, 250, 250, 210, 430], [40, 320, 150, 320, 190, 360, 360], [300, 140, 470, 140, 510, 100, 690], [520, 300, 640, 300, 680, 260, 720]];
    let d = '';
    for (const [a, y, b, y2, c, y3, e] of lines) d += `M${X(a)} ${y}H${X(b)}L${X(c)} ${y3}H${X(e)}`;
    path(g, d, { stroke: col, 'stroke-width': 3 });
    for (const [, , , , , y3, e] of lines) mk('circle', { cx: X(e), cy: y3, r: 6, fill: 'none', stroke: col, 'stroke-width': 3 }, g);
  };
  traces(0, false, ROOMS.warmLn); traces(0, true, ROOMS.coolLn);
  // skirting
  mk('rect', { x: 0, y: floor - 24, width: w0, height: 24, fill: ROOMS.warmDk }, g);
  mk('rect', { x: w1, y: floor - 24, width: 1600 - w1, height: 24, fill: ROOMS.coolDk }, g);
  // each room's little status panel: three lit LEDs
  [[96, ROOMS.warmDk], [1360, ROOMS.coolDk]].forEach(([x, col]) => {
    mk('rect', { x, y: 92, width: 144, height: 44, rx: 12, fill: col }, g);
    ['#68b86b', '#f0b13a', '#68b86b'].forEach((c, i) => mk('circle', { cx: x + 32 + i * 40, cy: 114, r: 8, fill: c }, g));
  });
  // ceiling, floor and the circuit board under it
  mk('rect', { x: 0, y: 0, width: 1600, height: top, fill: ROOMS.ceil }, g);
  mk('rect', { x: 0, y: top - 6, width: 1600, height: 6, fill: ROOMS.ceilLt }, g);
  mk('rect', { x: 0, y: floor, width: 1600, height: board - floor, fill: ROOMS.floorC }, g);
  mk('rect', { x: 0, y: floor, width: 1600, height: 5, fill: ROOMS.floorLt }, g);
  mk('rect', { x: 0, y: board, width: 1600, height: 1100 - board, fill: ROOMS.pcb }, g);   // on past the stage's foot, for a lifted view
  path(g, 'M0 862H180L210 842H520M600 842H700L730 876H1010M1080 876H1300L1330 850H1600M260 900V870H380', { stroke: ROOMS.trace, 'stroke-width': 3, 'stroke-opacity': .8 });
  [[120, 836], [520, 852], [1010, 836], [1400, 862]].forEach(([x, y]) => {
    mk('rect', { x, y, width: 86, height: 30, rx: 3, fill: ROOMS.chip }, g);
    let pins = ''; for (let k = 8; k < 86; k += 13) pins += `M${x + k} ${y - 5}v5M${x + k} ${y + 30}v5`;
    path(g, pins, { stroke: '#a9a39a', 'stroke-width': 3, 'stroke-linecap': 'butt' });
  });
  // talker's side table with its alarm clock; a plant in listener's room
  const table = G(g);
  mk('rect', { x: 14, y: 700, width: 112, height: 14, rx: 4, fill: ROOMS.wood }, table);
  mk('rect', { x: 26, y: 714, width: 12, height: floor - 714, fill: ROOMS.woodDk }, table);
  mk('rect', { x: 102, y: 714, width: 12, height: floor - 714, fill: ROOMS.woodDk }, table);
  const clock = roomsClock(g, { x: 70, y: 642, s: 1.25 });
  roomsPlant(g, { x: 1536, y: floor });
  // the wall between the rooms: paper-cut bricks, a shadowed edge on the left, a lit edge on the right
  const wall = G(p);
  mk('rect', { x: w0, y: top, width: w1 - w0, height: floor - top, fill: ROOMS.part }, wall);
  let d = '';
  for (let y = top + 36, k = 0; y < floor; y += 36, k++) { d += `M${w0} ${y}H${w1}`; const jx = k % 2 ? w0 + (w1 - w0) / 2 : w0 + (w1 - w0) / 4; d += `M${jx} ${y}v36`; if (!(k % 2)) d += `M${jx + (w1 - w0) / 2} ${y}v36`; }
  path(wall, d, { stroke: ROOMS.partDk, 'stroke-width': 2, 'stroke-linecap': 'butt' });
  mk('rect', { x: w0, y: top, width: 7, height: floor - top, fill: ROOMS.partDk }, wall);
  mk('rect', { x: w1 - 7, y: top, width: 7, height: floor - top, fill: ROOMS.partLt }, wall);
  return { g, wall, clock };
}

// The alarm clock (a node's timer): two bells, a round face, little legs. Returns g with .hands and .time(q, ring,
// shake): the face fills clockwise for the part of the period gone (q 0..1), ring marks show at the bells, the body shakes.
function roomsClock(p, { x, y, s = 1 } = {}) {
  const g = G(p, { x, y, s }), b = mk('g', {}, g);
  path(b, 'M-20 30L-28 48M20 30L28 48', { stroke: ROOMS.ink, 'stroke-width': 6 });
  path(b, 'M-24 -40L24 -40', { stroke: ROOMS.ink, 'stroke-width': 4 });
  mk('rect', { x: -3, y: -48, width: 6, height: 10, fill: ROOMS.ink }, b);
  [-1, 1].forEach(k => mk('circle', { cx: k * 24, cy: -32, r: 13, fill: ROOMS.brass }, b));
  mk('circle', { cx: 0, cy: 0, r: 38, fill: ROOMS.clock }, b);
  mk('circle', { cx: 0, cy: 0, r: 29, fill: '#fffaf0' }, b);
  const wedge = mk('path', { d: '', fill: '#f8b77f' }, b);
  let ticks = ''; for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; ticks += `M${23 * Math.sin(a)} ${-23 * Math.cos(a)}L${27 * Math.sin(a)} ${-27 * Math.cos(a)}`; }
  path(b, ticks, { stroke: ROOMS.ink, 'stroke-width': 2.5 });
  const hands = G(b);
  path(hands, 'M0 0V-20M0 0L13 7', { stroke: ROOMS.ink, 'stroke-width': 4 });
  mk('circle', { r: 3.5, fill: ROOMS.ink }, hands);
  const rings = mk('g', { opacity: 0 }, g);
  path(rings, 'M-50 -58Q-60 -42 -52 -24M-62 -66Q-76 -42 -64 -18M50 -58Q60 -42 52 -24M62 -66Q76 -42 64 -18', { stroke: ROOMS.ink, 'stroke-width': 3.5 });
  let last = '';
  g.time = (q, ring = 0, shake = 0) => {
    q = Math.max(0, Math.min(1, q)); const key = `${q.toFixed(3)},${ring.toFixed(2)},${shake.toFixed(1)}`;
    if (key === last) return g; last = key;
    const a = q * 2 * Math.PI, R = 27;
    wedge.setAttribute('d', q <= 0 ? '' : q >= .999 ? `M0 ${-R}A${R} ${R} 0 1 1 -0.01 ${-R}Z` : `M0 0V${-R}A${R} ${R} 0 ${q > .5 ? 1 : 0} 1 ${(R * Math.sin(a)).toFixed(2)} ${(-R * Math.cos(a)).toFixed(2)}Z`);
    rings.setAttribute('opacity', ring.toFixed(2));
    b.setAttribute('transform', shake ? `rotate(${shake.toFixed(1)} 0 40)` : '');
    return g;
  };
  return Object.assign(g, { hands, rings });
}

// The inbox (a subscription's queue): an open tray of n slots on short legs; message cards stand in the slots, the
// tray's front hides their feet. (x, y) is the tray's bottom-left; slot(i) is where card i stands, counted from the left.
function roomsInbox(p, { x, y, n = 10, w = 244, h = 52, legs = 26 } = {}) {
  const g = G(p), back = G(g), slips = G(g), front = G(g), pad = 10, step = (w - 2 * pad) / n;
  // the basket at the front end, on the floor: a dropped message falls in (drawn in front of the slips)
  const bin = [x + w + 30, y - 24];
  path(front, `M${bin[0] - 24} ${bin[1]}H${bin[0] + 24}L${bin[0] + 18} ${y + legs}H${bin[0] - 18}Z`, { fill: '#9b958c', stroke: 'none' });
  mk('rect', { x: bin[0] - 27, y: bin[1] - 4, width: 54, height: 8, rx: 3, fill: '#857f77' }, front);
  [x + 14, x + w - 22].forEach(lx => mk('rect', { x: lx, y, width: 8, height: legs, fill: ROOMS.woodDk }, back));
  mk('rect', { x, y: y - h - 14, width: w, height: h + 14, rx: 6, fill: '#8f6a45' }, back);          // the back wall, inside
  let d = ''; for (let i = 1; i < n; i++) d += `M${x + pad + i * step} ${y - h - 8}V${y - h * .45}`;
  path(back, d, { stroke: '#6f5236', 'stroke-width': 3 });                                              // slot dividers
  mk('rect', { x: x - 4, y: y - h * .5, width: w + 8, height: h * .5, rx: 6, fill: ROOMS.wood }, front);  // the low front
  mk('rect', { x: x - 4, y: y - h * .5, width: w + 8, height: 6, rx: 3, fill: '#dcae78' }, front);
  const numbers = G(front, { o: 0 });
  for (let i = 0; i < n; i++) T(numbers, String(i + 1), { x: x + pad + (i + .5) * step, y: y - 6, size: 14, weight: 700, fill: '#5a3f26', anchor: 'middle' });
  const slot = i => [x + pad + (i + .5) * step, y - h * .5 + 4];
  const card = (layer = slips, o = 0) => {
    const c = G(layer, { o });
    mk('rect', { x: -10, y: -44, width: 20, height: 44, rx: 3, fill: ROOMS.yellow, stroke: ROOMS.yellowDk, 'stroke-width': 2 }, c);
    path(c, 'M-5 -36H5M-5 -29H5', { stroke: ROOMS.yellowDk, 'stroke-width': 2 });
    return c;
  };
  return { g, back, slips, front, numbers, slot, card, bin, n, x, y, w, h, step };
}

function roomsPlant(p, { x, y, s = 1 } = {}) {
  const g = G(p, { x, y, s });
  [[-28, -78, -30], [0, -92, 0], [26, -80, 32], [-14, -64, -60], [16, -62, 58]].forEach(([cx, cy, r]) =>
    mk('ellipse', { cx: 0, cy: -26, rx: 13, ry: 30, fill: '#79a85a', transform: `translate(${cx} ${cy + 26}) rotate(${r})` }, g));
  path(g, 'M-30 -52H30L24 0H-24Z', { fill: '#c7744a', stroke: 'none' });
  mk('rect', { x: -34, y: -58, width: 68, height: 12, rx: 4, fill: '#d98a5d' }, g);
  return g;
}

function roomsTube(p, { x0 = 400, x1 = 1200, y = 630, h = 96, name = '/chatter', type = 'String', plateX } = {}) {
  const r = h / 2, [w0, w1] = ROOMS.wallX, through = x0 < w0 && x1 > w1, cx = plateX ?? (through ? (w0 + w1) / 2 : (x0 + x1) / 2), g = G(p);
  const back = G(g), inside = G(g), front = G(g), sleeve = G(g), plate = G(g);
  // the glass: light violet inside, a deeper band along the bottom, a highlight streak along the top
  mk('rect', { x: x0, y: y - r, width: x1 - x0, height: h, fill: ROOMS.glass }, back);
  mk('rect', { x: x0, y: y + r - 24, width: x1 - x0, height: 18, fill: ROOMS.glassDk }, back);
  const shine = G(front);
  (through ? [[x0 + 18, w0 - 16], [w1 + 16, x1 - 18]] : [[x0 + 18, x1 - 18]]).forEach(([a, b]) => mk('rect', { x: a, y: y - r + 6, width: b - a, height: 6, rx: 3, fill: '#fff', 'fill-opacity': .75 }, shine));
  const edges = (through ? [`M${w0} ${y - r}H${x0}`, `M${w0} ${y + r}H${x0}`, `M${w1} ${y - r}H${x1}`, `M${w1} ${y + r}H${x1}`] : [`M${x0} ${y - r}H${x1}`, `M${x0} ${y + r}H${x1}`])
    .map(d => path(front, d, { stroke: ROOMS.violet, 'stroke-width': 7 }, { d: 0 }));
  const ends = G(front);
  [x0, x1].forEach(x => mk('ellipse', { cx: x, cy: y, rx: 13, ry: r, fill: ROOMS.violetDk, stroke: ROOMS.violet, 'stroke-width': 6 }, ends));
  // through the wall: the wall covers the tube there, a collar rings it on each face
  if (through) {
  mk('rect', { x: w0, y: y - r - 6, width: w1 - w0, height: h + 12, fill: ROOMS.part }, sleeve);
  path(sleeve, `M${w0} ${y - 6}H${w1}M${cx} ${y - r - 6}V${y - 6}M${w0 + (w1 - w0) / 4} ${y - 6}V${y + r + 6}M${w1 - (w1 - w0) / 4} ${y - 6}V${y + r + 6}`, { stroke: ROOMS.partDk, 'stroke-width': 2, 'stroke-linecap': 'butt' });
  [w0, w1].forEach(x => mk('rect', { x: x - 9, y: y - r - 11, width: 18, height: h + 22, rx: 6, fill: ROOMS.violet }, sleeve));
  }
  // the name plate, hung over the wall (or over the tube) on two rods: the short sign ("/chatter") and the long one with the type
  const sign = G(plate, { x: cx, y: y - r - 92 });
  path(sign, `M-64 28V${r + 92 - r - 4}M64 28V${r + 92 - r - 4}`, { stroke: ROOMS.violetDk, 'stroke-width': 6 });
  const board = (str, extra) => {
    const b = G(sign);
    ctx2d.font = `700 34px ${ROOMS.mono}`;
    const w1s = ctx2d.measureText(str).width, w2s = extra ? ctx2d.measureText(extra).width : 0, w = w1s + w2s + 44;
    const glow = G(b, { o: 0 });   // the board lit: a soft halo its own size
    mk('rect', { x: -w / 2 - 16, y: -46, width: w + 32, height: 92, rx: 26, fill: ROOMS.violetLt, 'fill-opacity': .8 }, glow);
    mk('rect', { x: -w / 2, y: -30, width: w, height: 60, rx: 12, fill: ROOMS.violet, stroke: ROOMS.violetDk, 'stroke-width': 4 }, b);
    const t = put(mk('text', { 'font-size': 34, 'font-weight': 700, 'font-family': ROOMS.mono, fill: '#fff' }, b), { x: -w / 2 + 22, y: 12 });   // placed by transform, as T() does
    t.textContent = str; t.style.whiteSpace = 'pre';
    if (extra) { const ts = mk('tspan', { fill: '#ffe08a' }, t); ts.textContent = extra; }
    return Object.assign(b, { w, glow });
  };
  const short = board(name), long = put(board(name, ` · ${type}`), { o: 0 });
  return { g, back, inside, front, shine, sleeve, plate, edges, ends, sign: Object.assign(sign, { short, long }), x0, x1, y, h };
}

// The mouth a node fits on an end of the tube: a horn that flares from the tube to an opening. side -1 opens to the
// left of the joint x (talker's publisher), +1 to the right (listener's subscription). Returns g; g.mouth is the
// opening's x in the parent's coordinates.
function roomsBell(p, side, { x, y, h = 96, color, dark, light, o = 1, s = 1 } = {}) {
  const r = h / 2, R = r + 24, L = 52, xm = side * L, g = G(p, { x, y, o, s });
  path(g, `M0 ${-r - 2}L${xm} ${-R}V${R}L0 ${r + 2}Z`, { fill: color, stroke: 'none' });
  path(g, `M${side * 8} ${-r + 9}L${xm - side * 8} ${-R + 12}`, { stroke: light, 'stroke-width': 7 });
  mk('rect', { x: -9, y: -r - 9, width: 18, height: h + 18, rx: 6, fill: dark }, g);
  mk('ellipse', { cx: xm, cy: 0, rx: 15, ry: R, fill: '#3a2e38', stroke: dark, 'stroke-width': 7 }, g);
  return Object.assign(g, { mouth: x + xm });
}

// A message: a yellow slip folded small with its type stamped on it; unfold(q) opens it to show its one field.
function roomsSlip(p, { x = 0, y = 0, n = 0, o = 1, s = 1, type = 'String', field = 'data', value = `hello world ${n}` } = {}) {
  const g = G(p, { x, y, o, s });
  ctx2d.font = `19px ${ROOMS.mono}`;
  const lineW = ctx2d.measureText(`${field}: ${value}`).width, keyW = ctx2d.measureText(field).width;
  const W0 = 84, H0 = 52, W1 = Math.max(200, lineW + 40), H1 = 68;
  const sheet = mk('rect', { rx: 6, stroke: ROOMS.yellowDk, 'stroke-width': 3 }, g);
  const creases = mk('path', { stroke: ROOMS.yellowDk, 'stroke-width': 1.5, 'stroke-dasharray': '4 4', fill: 'none' }, g);
  const corner = mk('path', { d: `M${W0 / 2 - 16} ${-H0 / 2}L${W0 / 2} ${-H0 / 2 + 16}L${W0 / 2 - 16} ${-H0 / 2 + 16}Z`, fill: ROOMS.yellowDk, 'fill-opacity': .55 }, g);
  // texts are placed by transform, as T() does (tools read a text's baseline as its local y = 0)
  const stamp = put(mk('text', { 'font-size': 19, 'font-weight': 700, 'font-family': ROOMS.mono, fill: ROOMS.ink, 'text-anchor': 'middle' }, g), { y: 7 });
  stamp.textContent = type;
  const head = put(mk('text', { 'font-size': 15, 'font-weight': 700, 'font-family': ROOMS.mono, fill: ROOMS.dim }, g), { x: -W1 / 2 + 14, y: -H1 / 2 + 22 });
  head.textContent = type;
  const line = put(mk('text', { 'font-size': 19, 'font-family': ROOMS.mono, fill: ROOMS.ink, 'text-anchor': 'middle' }, g), { y: 20 });
  line.style.whiteSpace = 'pre';
  const key = mk('tspan', { 'font-weight': 700, fill: '#a0620c' }, line); key.textContent = field;
  const val = mk('tspan', {}, line); val.textContent = `: ${value}`;
  const mark = put(mk('rect', { x: -lineW / 2 - 2, y: 25, width: keyW + 4, height: 4, rx: 2, fill: '#a0620c' }, g), { o: 0 });
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const [ya, yb] = [hex(ROOMS.yellow), hex(ROOMS.paper)];
  let last = null;
  g.unfold = q => {
    q = Math.max(0, Math.min(1, Math.round(q * 100) / 100)); if (q === last) return g; last = q;
    const e = q < .5 ? 2 * q * q : 1 - 2 * (1 - q) * (1 - q), w = W0 + (W1 - W0) * e, h = H0 + (H1 - H0) * e;
    sheet.setAttribute('x', -w / 2); sheet.setAttribute('y', -h / 2); sheet.setAttribute('width', w); sheet.setAttribute('height', h);
    sheet.setAttribute('fill', `rgb(${ya.map((v, i) => Math.round(v + (yb[i] - v) * e)).join(',')})`);
    creases.setAttribute('d', q > .05 ? [1, 2, 3].map(k => `M${-w / 2 + k * w / 4} ${-h / 2 + 3}v9M${-w / 2 + k * w / 4} ${h / 2 - 12}v9`).join('') : '');   // fold marks at the edges, clear of the text
    creases.setAttribute('opacity', Math.sin(Math.PI * q).toFixed(3));   // only while it opens or closes: none across the text
    corner.setAttribute('opacity', 1 - Math.min(1, q * 3));
    put(stamp, { o: 1 - Math.min(1, q * 2.5) });
    const tq = Math.max(0, (q - .55) / .45);
    put(head, { o: tq }); put(line, { o: tq });
    return g;
  };
  g.mark = mark;
  return g.unfold(0);
}
