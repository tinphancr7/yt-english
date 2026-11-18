import React from 'react';
import { AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/BeVietnamPro';
import { COLORS } from './brand';
import { Character, type Placement } from './components/Character';
import { Subtitle } from './components/Subtitle';
import { LearnShot, LineAudio, OutroShot, QuizShot, SfxTrack, TitleShot } from './components/Shots';
import type { Line, Rig, Shot, Timeline } from './types';
import slots from './slots.json';

loadFont('normal', { weights: ['500', '800'], subsets: ['vietnamese', 'latin'] });

const W = 1920, H = 1080;
const ENTER_S = 0.45; // walk-in / walk-out duration
const STAND_H = 1500; // body height (px) for a standing character in a medium shot
const SLOT_X = slots as unknown as Record<string, number>; // shared with stage-lint.mjs

// Foreground occluders cut from the plate itself (frame coords, 1920×1080 cover-fit).
// Used only for slot "behind-table": the table top is re-drawn above that character.
const FOREGROUND: Record<string, string> = {
  'quan-table': 'polygon(198px 472px, 210px 458px, 890px 456px, 1124px 508px, 1124px 548px, 683px 608px, 198px 503px)',
};

type Seat = { x: number; bottom: number; height: number };

// Seated poses carry their own stool; the plate's "seat" (staging.json) says where it goes.
const place = (slot: string, rig: Rig, location: string, z: number, seat?: Seat | null): Placement => {
  const x = SLOT_X[slot] * W;
  const flip = SLOT_X[slot] > 0.6; // characters on the right face left (towards the others)
  if (rig.posture === 'seated' && seat) {
    const s = seat;
    return { x: s.x, height: s.height, topY: s.bottom - s.height, flip: false, z: 30 + z };
  }
  if (slot === 'behind-table' && location === 'quan-table') {
    // Behind the table (further back → smaller); body cut at the table edge, table-top layer covers the overlap.
    const height = 1080 * rig.height_rel;
    return { x, height, topY: 505 - 0.47 * height, flip, clipY: 506, z: 5 };
  }
  const height = STAND_H * rig.height_rel;
  return { x, height, topY: H - 0.72 * height, flip, z: 20 + z };
};

// Who a character is looking at, at time t: when someone else is talking → that speaker;
// when talking themself → line.to, else the person they are answering (previous other speaker),
// else the next one to reply. Heroes are drawn facing screen-right, so face left = flip.
const lookAt = (id: string, lines: Line[], t: number, cast: string[]): string | null => {
  if (!lines.length) return null;
  let idx = 0;
  lines.forEach((l, k) => { if (l.start <= t) idx = k; });
  const l = lines[idx];
  const ok = (s: string | null | undefined) => (s && s !== id && cast.includes(s) ? s : null);
  if (l.speaker !== id) return ok(l.speaker);
  const scan = (from: number, step: number) => { for (let k = from; k >= 0 && k < lines.length; k += step) if (ok(lines[k].speaker)) return lines[k].speaker; return null; };
  return ok(l.to) ?? scan(idx - 1, -1) ?? scan(idx + 1, 1);
};

// House-number plates the AI drew with wrong numbers → cover with the real "99" plate.
const PLATE_FIX: Record<string, { x: number; y: number; w: number; h: number }[]> = {
  'V-A': [{ x: 1436, y: 258, w: 94, h: 76 }],
  'V-C': [{ x: 800, y: 30, w: 168, h: 138 }],
};

const NumberPlate: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: COLORS.plateBlue, border: `3px solid ${COLORS.outline}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Be Vietnam Pro', fontWeight: 800, fontSize: h * 0.62 }}>
    99
  </div>
);

// Camera moves (snap zoom) — focus point in frame coords.
const CAMERA_FOCUS: Record<string, { x: number; y: number; scale: number }> = {
  'snap_zoom_to:newspaper': { x: 1500, y: 600, scale: 1.75 },
};

const ShotView: React.FC<{ shot: Shot; tl: Timeline; fps: number }> = ({ shot, tl, fps }) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  if (shot.kind === 'title') return <TitleShot shot={shot} tl={tl} />;
  if (shot.kind === 'learn') return <LearnShot shot={shot} tl={tl} />;
  if (shot.kind === 'quiz') return <QuizShot shot={shot} tl={tl} />;
  if (shot.kind === 'outro') return <OutroShot shot={shot} tl={tl} />;
  if (shot.kind === 'video') {
    const fix = PLATE_FIX[shot.insert] ?? [];
    return (
      <AbsoluteFill>
        <OffthreadVideo src={staticFile(shot.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {fix.map((p, i) => <NumberPlate key={i} {...p} />)}
        <SfxTrack sfx={shot.sfx} fps={fps} />
        {shot.ambience && <Audio src={staticFile(shot.ambience)} volume={0.3} loop />}
      </AbsoluteFill>
    );
  }
  // puppet
  const cam = shot.camera ? CAMERA_FOCUS[shot.camera.move] : null;
  const zoom = cam && shot.camera ? interpolate(t, [shot.camera.at, shot.camera.at + 0.18], [1, cam.scale], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }) : 1;
  const rigAt = (c: (typeof shot.cast)[number]) => { const p = [...(c.poses ?? [])].reverse().find((x) => t >= x.from); return p ? p.rig : c.rig; };
  return (
    <AbsoluteFill style={{ background: COLORS.cream }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: cam ? `${cam.x}px ${cam.y}px` : '50% 50%' }}>
        <Img src={staticFile(shot.bg)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {(() => {
                    const here = (c: (typeof shot.cast)[number]) => (c.from == null || t >= c.from) && (c.until == null || t < c.until + ENTER_S);
          const placed = shot.cast.filter(here).map((c, i) => { const rig = tl.characters[rigAt(c)]; return { c, rig, p: place(c.slot, rig, shot.location, i, shot.seat) }; });
          return placed.map(({ c, rig, p }) => {
            const target = placed.find((o) => o.c.id === lookAt(c.id, shot.lines, t, placed.map((o) => o.c.id)));
            const flip = target ? target.p.x < p.x : p.flip;
            // enter / exit: walk in from (out to) the nearest frame edge
            const edge = p.x > W / 2 ? W + 400 : -400;
            const k = c.from != null && t < c.from + ENTER_S ? 1 - Easing.out(Easing.cubic)((t - c.from) / ENTER_S)
              : c.until != null && t >= c.until ? Easing.in(Easing.cubic)((t - c.until) / ENTER_S) : 0;
            // a hand that gives something (staging.front) is drawn over the receiver's hand
            const z = p.z + ((rig as Rig & { staging?: { front?: boolean } }).staging?.front ? 10 : 0);
            return <Character key={c.id} rig={rig} place={{ ...p, x: p.x + (edge - p.x) * k, flip, z }} t={t} lines={shot.lines} />;
          });
        })()}
        {FOREGROUND[shot.location] && shot.cast.some((c) => c.slot === 'behind-table') && (
          <Img src={staticFile(shot.bg)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 10, clipPath: FOREGROUND[shot.location] }} />
        )}
      </AbsoluteFill>
      <LineAudio lines={shot.lines} fps={fps} />
      {shot.lines.map((l) => (t >= l.start - 0.05 && t < l.start + l.dur + 0.45 ? <Subtitle key={l.id} line={l} t={t} /> : null))}
      <SfxTrack sfx={shot.sfx} fps={fps} />
      {shot.ambience && <Audio src={staticFile(shot.ambience)} volume={0.1} loop />}
    </AbsoluteFill>
  );
};

export const Episode: React.FC<{ tl: Timeline }> = ({ tl }) => (
  <AbsoluteFill style={{ background: 'black' }}>
    {tl.shots.map((s) => (
      <Sequence key={s.id} from={Math.round(s.start * tl.fps)} durationInFrames={Math.round(s.dur * tl.fps)}>
        <ShotView shot={s} tl={tl} fps={tl.fps} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
