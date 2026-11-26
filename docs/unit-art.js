// Chalk sketches for the unit headers on the contents page, one per unit, drawn in the unit's colour.
// Each entry is the inside of an SVG with viewBox 0 0 600 180; keep the left ~200 px light (the unit title sits there
// on narrow screens). Classes, styled in lib/units.css:
//   d  a stroke that draws itself in when the unit scrolls into view (--k orders the strokes)
//   t  text or a filled shape that fades in
//   a  faint chalk white instead of the unit colour;  faint  even fainter
// A sketch may add one looping motion after it is drawn: give an element a class that lib/units.css animates (swap-a,
// hop, orbit, ride, spin, tilt, breathe, ...), or add your own .seen .unit-art .NAME rule and keyframes in a <style> in index.html.
'use strict';
(() => {
  let k = 0;
  const P = (d, cls = '', extra = '') => `<path class="d ${cls}" pathLength="1" style="--k:${k++}" d="${d}" ${extra}/>`;
  const Tx = (x, y, s, size = 24, cls = '', anchor = 'start') => `<text class="t ${cls}" style="--k:${k++}" x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}">${s}</text>`;
  const C = (cx, cy, r, cls = '') => `<circle class="d ${cls}" pathLength="1" style="--k:${k++}" cx="${cx}" cy="${cy}" r="${r}"/>`;
  const reset = s => { k = 0; return s; };

  window.UNIT_ART = [
    // W04 第一個 ROS 2 程式: two nodes joined by the /chatter tube, a message riding from talker to listener.
    reset(P('M236 72h86v60h-86Z') + P('M498 72h86v60h-86Z') + P('M322 94H498M322 110H498', 'a') +
      Tx(279, 108, 'talker', 18, '', 'middle') + Tx(541, 108, 'listener', 18, '', 'middle') + Tx(410, 80, '/chatter', 20, '', 'middle') +
      `<rect class="t hop" x="-9" y="-6" width="18" height="12" rx="2" fill="currentColor" stroke="none" style="--k:${k++};offset-path:path('M330 102H490')"/>`),
  ];
})();
