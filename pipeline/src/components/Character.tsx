import React from 'react';
import { Img, staticFile } from 'remotion';
import { COLORS } from '../brand';
import type { Line, Rig } from '../types';
import { MouthShape, mouthAt } from './Mouth';

export type Placement = { x: number; topY: number; height: number; flip: boolean; clipY?: number; z: number };

const seed = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// One shared, deterministic blink schedule: events every 0.8–1.4 s, handed to the cast in a
// shuffled round-robin, so two characters never blink at the same moment (each blinks ~3–5.5 s).
const BLINKERS = ['tin', 'jake', 'co-ba', 'tony'];
const BLINK_DUR = 0.13;
const schedule: Record<string, number[]> = (() => {
  let a = 20261117;
  const r = () => { a = (a + 0x6d2b79f5) | 0; let x = Math.imul(a ^ (a >>> 15), 1 | a); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  const out: Record<string, number[]> = Object.fromEntries(BLINKERS.map((n) => [n, [] as number[]]));
  let t = 0.6;
  while (t < 900) {
    const order = [...BLINKERS].sort(() => r() - 0.5);
    for (const n of order) { out[n].push(t); t += 0.8 + r() * 0.6; }
  }
  return out;
})();

const isBlinking = (name: string, t: number) => {
  const own = schedule[name] ?? schedule[BLINKERS[seed(name) % BLINKERS.length]].map((x) => x + 0.45);
  for (const s of own) {
    if (s > t) break;
    if (t < s + BLINK_DUR) return Math.abs(t - (s + BLINK_DUR / 2)) < 0.035 ? 1 : 0.6;
  }
  return 0;
};

export const Character: React.FC<{ rig: Rig; place: Placement; t: number; lines: Line[]; shotStartFrame?: number }> = ({ rig, place, t, lines }) => {
  const scale = place.height / rig.height;
  const w = rig.width * scale;
  // anchor_x (image px): the body's centre line. Poses with an arm stretched out are wider than the base image;
  // anchoring on the body keeps the character from sliding sideways when the pose changes.
  const ax = (rig.anchor_x ?? rig.width / 2) * scale;
  // Active line for this character
  const mine = lines.filter((l) => l.speaker === rig.character);
  const cur = mine.find((l) => t >= l.start && t < l.start + l.dur);
  const shape = cur ? mouthAt(cur.mouth, t - cur.start) : 'X';
  // Smooth motion only (no per-mouth-shape switching → no jitter):
  // a gentle breath, plus a soft head-nod envelope that fades in/out over 0.25 s around each line.
  // Measured: even 0.3% breathing moved the head ~11 px (feet pivot is far below frame) → read as bouncing.
  // Characters stay still; life comes from mouth, blinks and (later) gestures — like the reference channels.
  const breathe = 1;
  const bob = 0;
  const blink = rig.eyes?.length ? isBlinking(rig.character, t) : 0;
  const m = rig.mouth;
  const mouthScale = m ? m.w / 100 : 1; // MouthShape box is 100 units wide
  const skin = `rgb(${(rig.skin ?? [0, 0, 0]).join(',')})`;

  return (
    <div
      style={{
        position: 'absolute',
        left: place.x - ax,
        top: place.topY + bob,
        width: w,
        height: place.height,
        zIndex: place.z,
        transform: `scaleX(${place.flip ? -1 : 1}) scaleY(${breathe})`,
        transformOrigin: `${ax}px 100%`,
        clipPath: place.clipY !== undefined ? `inset(0 0 ${Math.max(0, place.topY + place.height - place.clipY)}px 0)` : undefined,
      }}
    >
      <Img src={staticFile(rig.img)} style={{ width: '100%', height: '100%', display: 'block' }} />
      <svg viewBox={`0 0 ${rig.width} ${rig.height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {m && (
          <g transform={`translate(${m.cx},${m.cy}) scale(${mouthScale * (m.sx ?? 1)},${mouthScale})`}>
            <MouthShape shape={shape} />
          </g>
        )}
        {blink > 0 &&
          rig.eyes.map((e, i) => (
            <g key={i}>
              <ellipse cx={e.cx} cy={e.cy - e.ry * (1 - blink) * 0.6} rx={e.rx * 1.18} ry={e.ry * 1.22 * blink} fill={skin} />
              <path
                d={`M${e.cx - e.rx * 1.1},${e.cy + e.ry * 0.25} Q${e.cx},${e.cy + e.ry * (0.25 + 0.5 * blink)} ${e.cx + e.rx * 1.1},${e.cy + e.ry * 0.25}`}
                fill="none"
                stroke={COLORS.outline}
                strokeWidth={6}
                strokeLinecap="round"
              />
            </g>
          ))}
      </svg>
    </div>
  );
};
