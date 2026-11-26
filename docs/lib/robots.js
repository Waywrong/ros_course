// ros2: the robots (load after engine.js). talker is orange, with a boxy head and a loudspeaker grille on its chest;
// listener is teal, with a rounder head and big ear discs; helper (from ch05) is a small grey robot in a cap with a
// terminal prompt >_ on its chest, the one that plays a command (ros2 run): its name tag reads as the command.
// Flat paper-cut figures seen from the front, standing on the floor: the origin is between the feet. About 348 px
// tall at s = 1 (to the top of the antenna bulb); the chapters use s = .9 for talker and listener, a third of the
// stage, and about .75 for the helper. Arms are two segments on a simple skeleton, so any pose can be set or blended
// at any moment of a beat.
//   const tk = robot(p, 'talker', { x, y, s, pose, name })   who: 'talker' | 'listener' | 'helper'; name: the tag's text
//   tk.pose('rest')  tk.pose('rest', 'reachR', q)   a pose, or a blend of two (q 0..1); a pose is a name in ROBOT_POSE
//                    or an object of the same shape (one hand holding, the other pressing: { ...a, R: b.R })
//   tk.look(dx, dy)  eyes, -1..1 each   tk.blink(closed)   tk.mood('smile'|'happy'|'o'|'flat')
//   tk.tag           the name tag on the chest, hidden until shown: tw(tk.tag, { o: 1, s: 1 }, t, .45, back)
//   tk.top()         [x, y] just above the antenna bulb, in the parent's coordinates (chips, bubbles)
//   tk.eye()         [x, y] between the eyes, in the parent's coordinates (sight lines)
//   tk.bulb()        [x, y] the antenna bulb, in the parent's coordinates (what the robot is tuned to)
//   Acting on the beat clock: tk.to(t, pose, dur)  tk.eyes(t, dx, dy, dur)  tk.face(t, mood)  tk.hop(t, h, dur)
//     tk.flash(t)    the antenna bulb flares (a "hello")
//     tk.sleep(t0, t1)   its program not running yet: eyes shut, bulb dark, head down (t1 omitted: to the end)
//     tk.freeze(t0, t1)  stands frozen (no spin: nothing happens): it stops where it was at t0, bulb dark
//     tk.walk(t0, x1, speed)   walks to x1 (parent's coordinates) from t0 at about `speed` px/s, easing in and out;
//       its feet step with the distance covered (a stride of 64 px at s = 1), so they never slide. Returns the time
//       it arrives. tk.xAt(t) is where it stands at beat time t
//     then tk.live(D) once (tk.live(D, { still: t }): drawn once as at time t, no per-frame writes, for a robot that
//     is only seen small, e.g. under a camera push): pose blends, eyes, blinks, breathing, hops, flashes and walks, all pure functions of t.
//   tk.handAt(t, 'R')  where that hand is at beat time t, in the parent's coordinates (a prop that follows a hand
//     calls it from a prog or clockRun; it is a pure function of t, so seeking draws the same frame)
//   robotSay(p, lines, { x, y, to })   a speech bubble centred on (x, y), its tail pointing at to = [tx, ty]
//   robotPatrol(p, { x, y, rx, ry, color })   spin: the robot's patrol loop, a dashed ring that runs clockwise, its
//     marker going round; loop.at(q) the point a fraction q round from the top, loop.set(q) puts the marker there,
//     loop.halt(h) greys the loop out (h 0..1). Pure: the chapter passes values from the beat clock
'use strict';
const ROBOT = {
  joint: '#4b4541', screen: '#2b3340', eye: '#fff3cf', cheek: '#ff9d8a', tag: '#fffdf6', ink: '#2e2a27',
  bulb: '#ffd34d', glow: '#ffe9a0', shadow: '#5a4630',
  talker: { body: '#ee8a3a', dark: '#c4651f', light: '#f8b77f', name: 'talker' },
  listener: { body: '#2ea597', dark: '#1d7b70', light: '#8fd5cb', name: 'listener' },
  helper: { body: '#a2a8ae', dark: '#6c737b', light: '#d4d8dc', name: 'ros2 run' },
};
// Segment angles in degrees: 0 hangs straight down, positive swings outward (away from the body), 180 is straight up;
// a negative forearm angle folds the hand in across the chest. L is the arm on the viewer's left, R on the viewer's
// right. head: tilt in degrees (positive leans to the viewer's right).
const ROBOT_POSE = {
  rest: { L: [10, -4], R: [10, -4], head: 0 },
  tiltR: { L: [10, -4], R: [10, -4], head: 10 },        // head on one side: curious
  tiltL: { L: [10, -4], R: [10, -4], head: -10 },
  wave: { L: [10, -4], R: [135, 150], head: 6 },        // R hand up and out, a hello
  waveL: { L: [135, 150], R: [10, -4], head: -6 },
  reachR: { L: [10, -4], R: [86, 92], head: 4 },        // R arm straight out to the viewer's right, shoulder high
  reachL: { L: [86, 92], R: [10, -4], head: -4 },
  holdR: { L: [10, -4], R: [30, 150], head: 2 },        // R hand up beside the shoulder, holding something
  holdL: { L: [30, 150], R: [10, -4], head: -2 },
  tagR: { L: [10, -4], R: [16, -120], head: 6 },        // R hand taps its chest just above its name tag
  tagL: { L: [16, -120], R: [10, -4], head: -6 },
  takeR: { L: [10, -4], R: [25, -30], head: 6 },        // R hand low and out: into a tray beside it
  takeL: { L: [25, -30], R: [10, -4], head: -6 },
  showR: { L: [10, -4], R: [40, 175], head: 4 },        // R forearm upright beside the head: showing what it holds
  showL: { L: [40, 175], R: [10, -4], head: -4 },
  pointR: { L: [10, -4], R: [130, 140], head: -4 },     // pointing up to the viewer's right
  pointL: { L: [130, 140], R: [10, -4], head: 4 },
  shrug: { L: [50, 128], R: [50, 128], head: 8 },
  shrugL: { L: [50, 128], R: [50, 128], head: -8 },
  cheer: { L: [150, 168], R: [150, 168], head: 0 },
  pressR: { L: [10, -4], R: [135, 130], head: 4 },     // R hand out and up, level with its head: pressing a button there
  pressL: { L: [135, 130], R: [10, -4], head: -4 },
  raiseR: { L: [10, -4], R: [165, 172], head: 6 },      // R arm straight up: holding something high, to compare it with what is above
  raiseL: { L: [165, 172], R: [10, -4], head: -6 },
};
const ROBOT_ARM = [50, 46], ROBOT_SH = [76, -154], ROBOT_HEAD = -240, ROBOT_NECK = -182;
const robotBlend = (a, b, q) => Object.fromEntries(Object.keys(a).map(k => [k, Array.isArray(a[k]) ? a[k].map((v, i) => v + (b[k][i] - v) * q) : a[k] + (b[k] - a[k]) * q]));
const robotArm = (side, [a1, a2]) => {
  const r = Math.PI / 180, sx = side * ROBOT_SH[0], sy = ROBOT_SH[1];
  const ex = sx + side * ROBOT_ARM[0] * Math.sin(a1 * r), ey = sy + ROBOT_ARM[0] * Math.cos(a1 * r);
  return [sx, sy, ex, ey, ex + side * ROBOT_ARM[1] * Math.sin(a2 * r), ey + ROBOT_ARM[1] * Math.cos(a2 * r)];
};

function robot(p, who, { x = 0, y = 0, s = 1, o = 1, pose = 'rest', name } = {}) {
  const C = { ...ROBOT[who], ...(name ? { name } : {}) }, talker = who === 'talker', helper = who === 'helper', g = G(p, { x, y, s, o });
  mk('ellipse', { cx: 0, cy: 2, rx: 84, ry: 11, fill: ROBOT.shadow, 'fill-opacity': .16 }, g);   // on the floor
  const body = mk('g', {}, g);
  // legs and feet, each leg in its own group so it can lift when walking
  const legs = {};
  [-1, 1].forEach(k => {
    const lg = legs[k] = mk('g', {}, body);
    mk('rect', { x: k * 29 - 11, y: -64, width: 22, height: 46, fill: ROBOT.joint }, lg);
    mk('rect', { x: k * 30 - 24, y: -26, width: 48, height: 26, rx: 11, fill: C.dark }, lg);
    mk('rect', { x: k * 30 - 18, y: -24, width: 30, height: 6, rx: 3, fill: C.body }, lg);    // a lighter toe cap
  });
  // arms first, behind the torso; the hands go on top
  const arms = { L: {}, R: {} };
  ['L', 'R'].forEach(k => {
    arms[k].upper = path(body, '', { stroke: C.dark, 'stroke-width': 17, fill: 'none' });
    arms[k].elbow = mk('circle', { r: 10, fill: ROBOT.joint }, body);
  });
  // torso: a rounded box with a darker hem and a lighter chest panel
  mk('rect', { x: -76, y: -170, width: 152, height: 114, rx: 26, fill: C.body }, body);
  path(body, 'M-76 -82Q-76 -56 -50 -56H50Q76 -56 76 -82Z', { fill: C.dark, stroke: 'none' });
  mk('rect', { x: -54, y: -158, width: 108, height: 82, rx: 14, fill: C.light }, body);
  if (talker) path(body, 'M-28 -142H28M-28 -131H28M-28 -120H28', { stroke: C.dark, 'stroke-width': 5 });   // the loudspeaker grille
  else if (helper) {                                                                                     // a terminal prompt >_
    mk('rect', { x: -38, y: -158, width: 76, height: 42, rx: 8, fill: ROBOT.screen }, body);       // above where its name tag hangs
    path(body, 'M-26 -148L-15 -138L-26 -128M-6 -126H14', { stroke: '#9fe3a0', 'stroke-width': 5, fill: 'none' });
  } else {
    mk('circle', { cx: 0, cy: -130, r: 15, fill: C.body }, body);                                     // a little gauge
    path(body, 'M0 -130L9 -139', { stroke: ROBOT.tag, 'stroke-width': 4 });
  }
  // name tag (hidden until shown): a white card across the chest, its name at 37 px (33 px on stage at s = .9),
  // smaller only if a long name would not fit the torso
  const tag = G(body, { y: -90, o: 0, s: .6 });
  ctx2d.font = `700 37px ${UI}`;
  const tagW = ctx2d.measureText(C.name).width, size = Math.min(37, 37 * 130 / tagW), w = tagW * size / 37 + 18;
  mk('rect', { x: -w / 2, y: -23, width: w, height: 46, rx: 10, fill: ROBOT.tag, stroke: C.dark, 'stroke-width': 3 }, tag);
  T(tag, C.name, { x: 0, y: size * .36, size, weight: 700, fill: C.dark, anchor: 'middle' });
  // neck and head
  mk('rect', { x: -15, y: ROBOT_NECK, width: 30, height: 16, fill: ROBOT.joint }, body);
  const head = mk('g', {}, body);
  const ant = mk('g', {}, head);
  path(ant, 'M0 -56V-86', { stroke: ROBOT.joint, 'stroke-width': 7 });
  const glow = mk('circle', { cx: 0, cy: -96, r: 24, fill: ROBOT.glow, opacity: .35 }, ant);
  const bulbEl = mk('circle', { cx: 0, cy: -96, r: 12, fill: ROBOT.bulb, stroke: ROBOT.joint, 'stroke-width': 3 }, ant);
  if (talker) [-1, 1].forEach(k => mk('rect', { x: k * 86 - 9, y: -16, width: 18, height: 32, rx: 6, fill: C.dark }, head));   // side bolts
  else if (helper) [-1, 1].forEach(k => mk('circle', { cx: k * 84, cy: 4, r: 15, fill: C.dark }, head));   // small round ears
  else [-1, 1].forEach(k => { mk('circle', { cx: k * 84, cy: 0, r: 30, fill: C.dark }, head); mk('circle', { cx: k * 84, cy: 0, r: 15, fill: C.light }, head); });   // ear discs
  const hr = talker ? 20 : helper ? 32 : 48;
  mk('rect', { x: -82, y: -58, width: 164, height: 116, rx: hr, fill: C.body }, head);
  path(head, `M-82 36Q-82 58 ${-82 + hr} 58H${82 - hr}Q82 58 82 36Z`, { fill: C.dark, stroke: 'none', 'fill-opacity': .55 });
  if (helper) {                                                                                          // a cap with a brim; the bulb sits on it
    path(head, 'M-72 -52Q-70 -92 0 -92Q70 -92 72 -52Z', { fill: '#4f565d', stroke: 'none' });
    mk('rect', { x: -90, y: -60, width: 180, height: 14, rx: 7, fill: '#3e444a' }, head);
    path(head, 'M-40 -80Q0 -90 40 -80', { stroke: '#6c747c', 'stroke-width': 5, fill: 'none' });
  }
  mk('rect', { x: -60, y: -38, width: 120, height: 74, rx: 18, fill: ROBOT.screen }, head);   // the face screen
  const eyes = mk('g', {}, head), eyeOpen = mk('g', {}, eyes), eyeHappy = mk('g', { display: 'none' }, eyes);
  [-1, 1].forEach(k => mk('rect', { x: k * 24 - 10, y: -20, width: 20, height: 28, rx: 9, fill: ROBOT.eye }, eyeOpen));
  path(eyeHappy, 'M-34 -2Q-24 -18 -14 -2M14 -2Q24 -18 34 -2', { stroke: ROBOT.eye, 'stroke-width': 6, fill: 'none' });
  [-1, 1].forEach(k => mk('circle', { cx: k * 44, cy: 18, r: 6, fill: ROBOT.cheek, 'fill-opacity': .55 }, head));
  const mouth = path(head, '', { stroke: ROBOT.eye, 'stroke-width': 4.5, fill: 'none' });
  // hands on top of everything in the body
  const hands = { L: mk('circle', { r: 14, fill: C.body, stroke: C.dark, 'stroke-width': 4 }, body), R: mk('circle', { r: 14, fill: C.body, stroke: C.dark, 'stroke-width': 4 }, body) };
  const MOUTH = {
    smile: ['M-13 16Q0 26 13 16', 'none'], happy: ['M-15 12Q0 32 15 12Z', ROBOT.eye], o: ['M0 13a6 7 0 1 0 0.1 0Z', ROBOT.eye],
    flat: ['M-11 20H11', 'none'],
  };
  let cur = ROBOT_POSE[pose], hand = { L: [0, 0], R: [0, 0] }, lastKey = '';
  const set = Pz => {
    const key = JSON.stringify(Pz); if (key === lastKey) return; lastKey = key; cur = Pz;
    ['L', 'R'].forEach(k => {
      const [sx, sy, ex, ey, hx, hy] = robotArm(k === 'L' ? -1 : 1, Pz[k]);
      arms[k].upper.setAttribute('d', `M${sx} ${sy}L${ex} ${ey}L${hx} ${hy}`);
      arms[k].elbow.setAttribute('cx', ex); arms[k].elbow.setAttribute('cy', ey);
      hands[k].setAttribute('cx', hx); hands[k].setAttribute('cy', hy); hand[k] = [hx, hy];
    });
    head.setAttribute('transform', `rotate(${Pz.head} 0 ${ROBOT_NECK}) translate(0 ${ROBOT_HEAD})`);
  };
  const setMood = k => {
    const [d, f] = MOUTH[k]; mouth.setAttribute('d', d); mouth.setAttribute('fill', f);
    eyeOpen.setAttribute('display', k === 'happy' ? 'none' : 'inline'); eyeHappy.setAttribute('display', k === 'happy' ? 'inline' : 'none');
  };
  const toParent = ([lx, ly], dy = 0, x0) => { const S0 = st(g); return [(x0 ?? S0.x) + S0.s * lx, S0.y + S0.s * (ly + dy)]; };
  Object.assign(g, { who, name: C.name, tag, glow,
    pose(a, b, q = 0) { const A = typeof a === 'string' ? ROBOT_POSE[a] : a, B = typeof b === 'string' ? ROBOT_POSE[b] : b; set(B ? robotBlend(A, B, q) : A); return g; },
    look(dx = 0, dy = 0) { eyeOpen.setAttribute('transform', `translate(${8 * dx} ${6 * dy})`); eyeHappy.setAttribute('transform', `translate(${8 * dx} ${6 * dy})`); return g; },
    mood(k) { setMood(k); return g; },
    blink(closed) { eyes.setAttribute('transform', closed ? 'translate(0 -6) scale(1 .12) translate(0 6)' : ''); return g; },
    hand(k = 'R') { return toParent(hand[k]); },
    top: () => toParent([0, ROBOT_HEAD - 116]),
    eye: () => toParent([0, ROBOT_HEAD - 6]),
    bulb: () => toParent([0, ROBOT_HEAD - 96]),
  });
  // Acting on the beat clock. Keys are collected first, then live(D) plays them as a pure function of t, so a seek or
  // ?beat=N&t=S draws the same frame: pose blends, eyes ease, moods switch, the eyes blink, the body breathes and hops,
  // the bulb flares. Every write happens only when its value changes.
  const K = { pose: [], eyes: [], face: [], hops: [], flash: [], sleep: [], freeze: [], walk: [] }, phase = talker ? .7 : helper ? 1.3 : 1.9;
  const within = (list, t) => list.find(([a, b]) => t >= a && t < b);
  const ease = q => q < .5 ? 2 * q * q : 1 - 2 * (1 - q) * (1 - q);
  const sweep = (keys, v0, t, mixv) => { let v = v0; for (const k of keys) if (t >= k.t0) v = mixv(v, k.v, ease(Math.min(1, k.dur ? (t - k.t0) / k.dur : 1))); return v; };
  const lerp2 = (a, b, q) => a.map((v, i) => v + (b[i] - v) * q);
  const sorted = list => list.sort((a, b) => a.t0 - b.t0);
  const P0 = cur;
  const poseAt = t => sweep(K.pose, P0, t, robotBlend);
  // walking: each walk eases from where the last one left it; dist(t) the path covered so far, for the feet
  const X0 = x, STRIDE = 64;
  const walkAt = t => {
    let at = X0, dist = 0;
    for (const w of K.walk) {
      if (t < w.t0) break;
      const q = Math.min(1, (t - w.t0) / w.dur), e = ease(q), from = at;
      at = from + (w.x1 - from) * e; dist += Math.abs(w.x1 - from) * e;
    }
    return [at, dist];
  };
  const walking = t => K.walk.some(w => t >= w.t0 && t < w.t0 + w.dur);
  const bobAt = t => {
    let dy = 1.6 * Math.sin(2 * Math.PI * t / 3.1 + phase);
    for (const [a, h, d] of K.hops) if (t >= a && t < a + d) dy -= h * Math.sin(Math.PI * (t - a) / d);
    return dy;
  };
  const wrote = {};
  const once = (k, v, f) => { if (wrote[k] !== v) { wrote[k] = v; f(v); } };
  Object.assign(g, {
    to(t0, pose, dur = .5) { K.pose.push({ t0, v: typeof pose === 'string' ? ROBOT_POSE[pose] : pose, dur }); sorted(K.pose); return g; },
    eyes(t0, dx, dy, dur = .3) { K.eyes.push({ t0, v: [dx, dy], dur }); sorted(K.eyes); return g; },
    face(t0, mood) { K.face.push({ t0, v: mood }); sorted(K.face); return g; },
    hop(t0, h = 14, dur = .42) { K.hops.push([t0, h, dur]); return g; },
    flash(t0) { K.flash.push(t0); return g; },
    sleep(t0, t1 = Infinity) { K.sleep.push([t0, t1]); return g; },
    freeze(t0, t1 = Infinity) { K.freeze.push([t0, t1]); return g; },
    handAt(t, k = 'R') { const Pz = poseAt(t), [, , , , hx, hy] = robotArm(k === 'L' ? -1 : 1, Pz[k]); return toParent([hx, hy], bobAt(t), K.walk.length ? walkAt(t)[0] : undefined); },
    walk(t0, x1, speed = 240) {
      const from = K.walk.length ? K.walk[K.walk.length - 1].x1 : X0, dur = Math.max(.4, Math.abs(x1 - from) / speed + .3);
      K.walk.push({ t0, x1, dur }); return t0 + dur;
    },
    xAt: t => K.walk.length ? walkAt(t)[0] : st(g).x,
    live(D, { still } = {}) {   // still: a time; the robot is drawn as it is then, once, and nothing is written per frame
      const frame = t0 => {
        const fz = within(K.freeze, t0), asleep = !!within(K.sleep, t0), t = fz ? fz[0] : t0;   // frozen: time stops for it
        const Pz = poseAt(t);
        set(asleep ? { ...Pz, head: Pz.head + 9, L: [4, 0], R: [4, 0] } : Pz);
        const [dx, dy] = sweep(K.eyes, [0, 0], t, lerp2).map(v => Math.round(v * 20) / 20);
        once('look', dx + ',' + dy, () => g.look(dx, dy));
        let mood = 'smile'; for (const k of K.face) if (t >= k.t0) mood = k.v;
        once('mood', asleep ? 'flat' : mood, setMood);
        once('blink', asleep || (t + phase) % 4.1 < .13, c => g.blink(c));
        once('bulb', asleep || !!fz, off => bulbEl.setAttribute('fill', off ? '#c9c0b2' : ROBOT.bulb));
        once('y', Math.round(bobAt(t) * 2) / 2, v => body.setAttribute('transform', `translate(0 ${v})`));
        if (K.walk.length) {   // where it stands, and its feet: each lifts in turn with the distance covered
          const [wx, dist] = walkAt(t), ph = 2 * Math.PI * dist / (STRIDE * s), on = walking(t) ? 1 : 0;
          put(g, { x: Math.round(wx * 2) / 2 });
          [-1, 1].forEach(k => once('leg' + k, Math.round(on * 12 * Math.max(0, k * Math.sin(ph))), v => legs[k].setAttribute('transform', v ? `translate(0 ${-v})` : '')));
        }
        let f = 0; for (const a of K.flash) if (t >= a && t < a + .9) f = Math.max(f, Math.sin(Math.PI * (t - a) / .9));
        const pulse = .35 + .1 * Math.sin(2 * Math.PI * t / 1.7 + phase);
        const go = asleep || fz ? 0 : Math.round((pulse + .65 * f) * 40) / 40, gr = Math.round((24 + 14 * f) * 2) / 2;   // both from t, written together
        once('glow', go + ',' + gr, () => { glow.setAttribute('opacity', go); glow.setAttribute('r', gr); });
      };
      if (still != null) frame(still); else clockRun(frame, D, { tail: true });
      return g;
    },
  });
  setMood('smile');
  return g.pose(pose);
}

// spin, drawn as the robot's patrol: a dashed ring with arrowheads running clockwise and a marker going round it.
function robotPatrol(p, { x, y, rx = 200, ry = 110, color = ROBOT.ink, o = 1 } = {}) {
  const g = G(p, { o }), at = q => { const a = 2 * Math.PI * q - Math.PI / 2; return [x + rx * Math.cos(a), y + ry * Math.sin(a)]; };
  const ring = mk('ellipse', { cx: x, cy: y, rx, ry, fill: 'none', stroke: color, 'stroke-width': 6, 'stroke-dasharray': '16 12', 'stroke-linecap': 'round' }, g);
  let heads = '';
  [.08, .33, .58, .83].forEach(q => {
    const [ax, ay] = at(q), [bx, by] = at(q + .01), a = Math.atan2(by - ay, bx - ax);
    heads += `M${ax - 16 * Math.cos(a - .5)} ${ay - 16 * Math.sin(a - .5)}L${ax} ${ay}L${ax - 16 * Math.cos(a + .5)} ${ay - 16 * Math.sin(a + .5)}`;
  });
  const arrows = path(g, heads, { stroke: color, 'stroke-width': 6 });
  const dot = mk('circle', { r: 14, fill: color, stroke: '#fffdf8', 'stroke-width': 4 }, g);
  let last = '';
  Object.assign(g, { at, ring, dot,
    set(q) { const [mx, my] = at(q), k = `${mx.toFixed(1)},${my.toFixed(1)}`; if (k !== last) { last = k; dot.setAttribute('cx', mx.toFixed(1)); dot.setAttribute('cy', my.toFixed(1)); } return g; },
    halt(h) { const c = h > .5 ? '#a9a197' : color; [ring, arrows].forEach(e => e.setAttribute('stroke', c)); dot.setAttribute('fill', c); return g; },
  });
  return g.set(0);
}

// A speech bubble: rounded box centred on (x, y), lines in the UI face, tail pointing at `to`. Returns its group,
// placed at the tail's tip and drawn around it, so a pop or a pulse (scale) grows the bubble out of its speaker
// instead of sliding it in from the parent's origin.
function robotSay(p, lines, { x, y, to, size = 34, fill = '#fffdf8', ink = ROBOT.ink, o = 1, weight = 700 } = {}) {
  lines = [].concat(lines);
  ctx2d.font = `${weight} ${size}px ${UI}`;
  const w = Math.max(size * 1.9, Math.max(...lines.map(str => ctx2d.measureText(str).width)) + size * 1.2), h = lines.length * size * 1.3 + size * .7;
  const [tx, ty] = to || [x, y + h / 2 + 40], g = G(p, { x: tx, y: ty, o });
  const cx = x - tx, cy = y - ty, bx = Math.max(cx - w / 2 + 26, Math.min(cx + w / 2 - 26, 0));
  path(g, `M${bx - 14} ${cy + h / 2 - 2}L0 0L${bx + 14} ${cy + h / 2 - 2}Z`, { fill, stroke: ink, 'stroke-width': 3, 'stroke-linejoin': 'round' });
  mk('rect', { x: cx - w / 2, y: cy - h / 2, width: w, height: h, rx: Math.min(h / 2, size * .8), fill, stroke: ink, 'stroke-width': 3 }, g);
  path(g, `M${bx - 11} ${cy + h / 2 - 1.5}H${bx + 11}`, { stroke: fill, 'stroke-width': 4 });   // open the box into the tail
  lines.forEach((str, i) => T(g, str, { x: cx, y: cy - h / 2 + size * .35 + (i + 1) * size * 1.3 - size * .3, size, weight, fill: ink, anchor: 'middle' }));
  return g;
}
