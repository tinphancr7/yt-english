import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, SPEAKER } from '../brand';
import type { Line, Rig, Shot, Sfx, Timeline } from '../types';
import { Character } from './Character';
import { Subtitle } from './Subtitle';

const FONT = 'Be Vietnam Pro, sans-serif';
const W = 1920, H = 1080;

// ---------- shared pieces ----------
export const SfxTrack: React.FC<{ sfx: Sfx[]; fps: number }> = ({ sfx, fps }) => (
  <>
    {sfx.map((s, i) => (
      <Sequence key={i} from={Math.max(0, Math.round(s.at * fps))} layout="none">
        <Audio src={staticFile(s.src)} volume={s.volume} />
      </Sequence>
    ))}
  </>
);

export const LineAudio: React.FC<{ lines: Line[]; fps: number }> = ({ lines, fps }) => (
  <>
    {lines.map((l) => (
      <Sequence key={l.id + l.start} from={Math.round(l.start * fps)} durationInFrames={Math.ceil((l.dur + 0.5) * fps)} layout="none">
        <Audio src={staticFile(l.audio)} />
      </Sequence>
    ))}
  </>
);

const Bg: React.FC<{ src: string; blur?: number; dim?: number }> = ({ src, blur = 0, dim = 0 }) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: blur ? `blur(${blur}px)` : undefined, transform: blur ? 'scale(1.06)' : undefined }} />
    {dim > 0 && <AbsoluteFill style={{ background: `rgba(255,244,224,${dim})` }} />}
  </AbsoluteFill>
);

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: COLORS.cream, border: `6px solid ${COLORS.outline}`, borderRadius: 32, boxShadow: '0 10px 0 rgba(61,44,41,0.35)', fontFamily: FONT, color: COLORS.outline, ...style }}>{children}</div>
);

const popIn = (frame: number, fps: number, delay = 0) => spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 160 } });

// Host in a round frame (face crop), lip-synced to the lines given.
// Bubble sits bottom-right, content is on the left → host faces left by default (heroes are drawn facing right).
export const HostBubble: React.FC<{ rig: Rig; t: number; lines: Line[]; size: number; x: number; y: number; faceLeft?: boolean }> = ({ rig, t, lines, size, x, y, faceLeft = true }) => {
  const eyes = rig.eyes;
  const ex = eyes.reduce((a, e) => a + e.cx, 0) / eyes.length, ey = eyes.reduce((a, e) => a + e.cy, 0) / eyes.length;
  const iod = Math.abs(eyes[1].cx - eyes[0].cx);
  const s = (size * 0.3) / iod;
  const h = rig.height * s;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: `6px solid ${COLORS.outline}`, background: COLORS.wallYellow, boxShadow: '0 8px 0 rgba(61,44,41,0.35)', zIndex: 40 }}>
      <Character rig={rig} t={t} lines={lines} place={{ x: size / 2 + (faceLeft ? -1 : 1) * ((rig.width / 2 - ex) * s - size * 0.07), topY: size * 0.45 - ey * s, height: h, flip: faceLeft, z: 1 }} />
    </div>
  );
};

// ---------- S02 Title ----------
export const TitleShot: React.FC<{ shot: Extract<Shot, { kind: 'title' }>; tl: Timeline }> = ({ shot, tl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const rig = tl.characters[shot.host.rig];
  const p = popIn(frame, fps, 6);
  const hostH = 1500;
  return (
    <AbsoluteFill>
      <Bg src={shot.bg} blur={shot.blur} dim={0.25} />
      <Character rig={rig} t={t} lines={shot.lines} place={{ x: 520, topY: H - 0.72 * hostH, height: hostH, flip: false, z: 10 }} />
      <div style={{ position: 'absolute', left: 900, top: 250, width: 960, transform: `scale(${p})`, transformOrigin: '20% 50%' }}>
        <Card style={{ padding: '46px 56px' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
            <span style={{ background: COLORS.stoolRed, color: 'white', fontWeight: 800, fontSize: 44, borderRadius: 16, padding: '4px 22px' }}>{shot.badge}</span>
            <span style={{ fontSize: 30, fontWeight: 600, color: COLORS.viText }}>Người mới bắt đầu</span>
          </div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.12, whiteSpace: 'nowrap' }}>{shot.title}</div>
          <div style={{ marginTop: 22, fontSize: 32, fontWeight: 600, color: COLORS.doorGreen }}>YOLO<span style={{ color: COLORS.stoolRed }}>7</span> English</div>
        </Card>
      </div>
      <LineAudio lines={shot.lines} fps={fps} />
      {shot.lines.map((l) => (t >= l.start - 0.05 && t < l.start + l.dur + 0.45 ? <Subtitle key={l.id} line={l} t={t} /> : null))}
      <SfxTrack sfx={shot.sfx} fps={fps} />
    </AbsoluteFill>
  );
};

// ---------- S04 Learn (PhraseCard) ----------
const roleIdx = (b: Extract<Shot, { kind: 'learn' }>['blocks'][number], role: string) => b.lines.find((l) => l.role === role);

export const LearnShot: React.FC<{ shot: Extract<Shot, { kind: 'learn' }>; tl: Timeline }> = ({ shot, tl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const host = tl.characters[shot.host.rig];
  const allLines = shot.blocks.flatMap((b) => b.lines.map((l) => ({ ...l, start: l.start + b.start })));
  const b = shot.blocks.find((x) => t >= x.start && t < x.start + x.dur) ?? shot.blocks[shot.blocks.length - 1];
  const lt = t - b.start;
  const seen = (role: string) => { const l = roleIdx(b, role); return l ? lt >= l.start - 0.1 : false; };
  const speaking = (role: string) => { const l = roleIdx(b, role); return l ? lt >= l.start && lt < l.start + l.dur : false; };
  const p = popIn(frame - Math.round(b.start * fps), fps, 0);
  const isErr = b.kind === 'error';
  const idx = shot.blocks.filter((x) => x.kind === 'phrase').indexOf(b) + 1;
  const parts = (b.phrase ?? '').split(' — ');
  // replayed film lines: highlight the half being spoken, and show THAT speaker in the bubble (not a silent Tín)
  const srcs = b.lines.filter((l) => l.role === 'source');
  const srcNow = srcs.findIndex((l) => lt >= l.start && lt < l.start + l.dur);
  // a half is highlighted only while a film line that actually CONTAINS it is playing ("Onions?" ≠ "No onions, please.")
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const slow = b.lines.find((l) => l.role === 'phrase_slow' && lt >= l.start && lt < l.start + l.dur);
  const slowPart = (i: number) => {
    const ps = slow?.parts; if (!slow) return false; if (!ps || ps.some((x) => x == null)) return true;
    const k = lt - slow.start; return k >= (i === 0 ? 0 : ps[i]! - 0.05) && (i === ps.length - 1 || k < ps[i + 1]! - 0.05);
  };
  // each film line lights ONE half: the longest half it contains ("No onions, please." contains "Onions?" too → only the answer)
  const srcHalf = srcNow < 0 ? -1 : parts.reduce((best, h, i) => (norm(srcs[srcNow].text).includes(norm(h)) && (best < 0 || norm(h).length > norm(parts[best]).length) ? i : best), -1);
  const lit = (i: number) => slowPart(i) || srcHalf === i;
  const cur = allLines.find((l) => t >= l.start - 0.05 && t < l.start + l.dur + 0.3);
  const who = cur && cur.speaker !== 'tin' && tl.characters[cur.speaker] ? cur.speaker : 'tin';
  const bubbleRig = who === 'tin' ? host : tl.characters[who];
  return (
    <AbsoluteFill>
      <Bg src={shot.bg} blur={shot.blur} dim={0.35} />
      {/* progress dots */}
      <div style={{ position: 'absolute', top: 44, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14, zIndex: 5 }}>
        {shot.blocks.map((x) => (
          <div key={x.id} style={{ width: 26, height: 26, borderRadius: 13, border: `4px solid ${COLORS.outline}`, background: x === b ? (x.kind === 'error' ? COLORS.stoolRed : COLORS.wallYellow) : t > x.start ? COLORS.doorGreen : COLORS.cream }} />
        ))}
      </div>
      <div style={{ position: 'absolute', left: 120, top: 110, width: 1360, transform: `scale(${0.85 + 0.15 * p})`, opacity: p, transformOrigin: '50% 30%' }}>
        <Card style={{ padding: '40px 56px 46px' }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: isErr ? COLORS.stoolRed : COLORS.doorGreen, marginBottom: 14 }}>
            {isErr ? 'LỖI HAY GẶP' : `MẪU CÂU ${idx}`}
          </div>
          {isErr ? (
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.25 }}>
              <span style={{ textDecoration: 'line-through', textDecorationThickness: 8, textDecorationColor: COLORS.stoolRed, color: '#9b7f78', background: srcNow >= 0 && norm(srcs[srcNow].text).includes(norm(b.wrong ?? 'many beef')) ? '#F6C9C4' : 'transparent', borderRadius: 12, padding: '0 10px' }}>{b.wrong ?? 'many beef'}</span>
              <span style={{ margin: '0 24px' }}>→</span>
              <span style={{ background: speaking('phrase_slow') || (srcNow >= 0 && norm(srcs[srcNow].text).includes(norm(b.right ?? 'More beef, please.'))) ? COLORS.highlight : 'transparent', borderRadius: 12, padding: '0 12px' }}>{b.right ?? 'More beef, please.'}</span>
            </div>
          ) : (
            <div style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.22 }}>
              {parts.map((x, i) => (
                <div key={i} style={{ color: i === 0 ? COLORS.outline : COLORS.plateBlue }}>
                  <span style={{ background: lit(i) ? COLORS.highlight : 'transparent', borderRadius: 12, padding: '0 10px' }}>{x}</span>
                </div>
              ))}
            </div>
          )}
          {!isErr && b.vi && <div style={{ fontSize: 44, fontWeight: 500, color: COLORS.viText, marginTop: 12 }}>{b.vi}</div>}
          {seen('explain') && (
            <div style={{ marginTop: 28, padding: '20px 26px', background: 'white', border: `4px dashed ${COLORS.outline}`, borderRadius: 20, fontSize: 44, fontWeight: 500, lineHeight: 1.35 }}>
              💡 {b.explain}
            </div>
          )}
          {b.example && seen('example') && (
            <div style={{ marginTop: 22, fontSize: 50, fontWeight: 700 }}>
              <span style={{ color: COLORS.doorGreen }}>Ví dụ: </span>
              <span style={{ background: speaking('example') ? COLORS.highlight : 'transparent', borderRadius: 10, padding: '0 8px' }}>{b.example}</span>
            </div>
          )}
        </Card>
      </div>
      <HostBubble rig={bubbleRig} t={t} lines={allLines.filter((l) => l.speaker === who)} size={330} x={1530} y={690} />
      {who !== 'tin' && (
        <div style={{ position: 'absolute', left: 1530, width: 330, top: 985, textAlign: 'center', zIndex: 41, fontFamily: 'Be Vietnam Pro' }}>
          <span style={{ background: 'white', border: `4px solid ${COLORS.outline}`, borderRadius: 14, padding: '2px 18px', fontSize: 32, fontWeight: 800, color: (SPEAKER as Record<string, { name: string; color: string }>)[who]?.color ?? COLORS.outline }}>{(SPEAKER as Record<string, { name: string; color: string }>)[who]?.name ?? who}</span>
        </div>
      )}
      <LineAudio lines={allLines} fps={fps} />
      <SfxTrack sfx={shot.sfx} fps={fps} />
      <Audio src={staticFile(shot.music)} volume={0.06} loop />
    </AbsoluteFill>
  );
};

// ---------- S05 Quiz ----------
export const QuizShot: React.FC<{ shot: Extract<Shot, { kind: 'quiz' }>; tl: Timeline }> = ({ shot, tl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const host = tl.characters[shot.host.rig];
  const lines = [shot.intro, ...shot.questions.flatMap((q) => [q.qLine, q.aLine])];
  const q = [...shot.questions].reverse().find((x) => t >= x.start) ?? null;
  const p = q ? popIn(frame - Math.round(q.start * fps), fps) : popIn(frame, fps);
  const cdLeft = q ? Math.ceil(q.reveal - t) : 0;
  const counting = q && t >= q.cdStart && t < q.reveal;
  const revealed = q && t >= q.reveal;
  return (
    <AbsoluteFill>
      <Bg src={shot.bg} blur={shot.blur} dim={0.35} />
      {!q ? (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', transform: `scale(${p})` }}>
          <Card style={{ padding: '50px 80px', fontSize: 90, fontWeight: 800 }}>🎯 ĐỐ VUI!</Card>
        </div>
      ) : (
        <div style={{ position: 'absolute', left: 150, top: 130, width: 1180, transform: `scale(${0.85 + 0.15 * p})`, opacity: p }}>
          <Card style={{ padding: '40px 54px' }}>
            <div style={{ fontSize: 34, fontWeight: 800, color: COLORS.stoolRed }}>CÂU {shot.questions.indexOf(q) + 1}</div>
            <div style={{ fontSize: 56, fontWeight: 800, margin: '10px 0 26px' }}>{q.q}</div>
            {q.options.map((o, i) => {
              const right = revealed && i === q.answer;
              const wrong = revealed && i !== q.answer;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 22, margin: '14px 0', padding: '14px 24px', borderRadius: 18, border: `4px solid ${COLORS.outline}`, background: right ? '#BFE8C9' : 'white', opacity: wrong ? 0.45 : 1, fontSize: 46, fontWeight: 700 }}>
                  <span style={{ width: 58, height: 58, borderRadius: 29, background: right ? COLORS.doorGreen : COLORS.wallYellow, color: right ? 'white' : COLORS.outline, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800 }}>{'ABC'[i]}</span>
                  {o}
                  {right && <span style={{ marginLeft: 'auto', fontSize: 50 }}>✔</span>}
                </div>
              );
            })}
          </Card>
        </div>
      )}
      {counting && (
        <div style={{ position: 'absolute', right: 150, top: 160, width: 210, height: 210, borderRadius: 105, background: COLORS.stoolRed, border: `8px solid ${COLORS.outline}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: FONT, fontWeight: 800, fontSize: 120, transform: `scale(${1 + 0.08 * Math.max(0, 1 - ((t - q!.cdStart) % 1) * 4)})` }}>
          {cdLeft}
        </div>
      )}
      {q && t >= q.cdStart - 0.2 && t < q.cdStart + 1.6 && (
        <div style={{ position: 'absolute', right: 90, top: 410, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: COLORS.outline, background: COLORS.cream, border: `4px solid ${COLORS.outline}`, borderRadius: 16, padding: '8px 18px' }}>⏸ Dừng video để trả lời!</div>
      )}
      <HostBubble rig={host} t={t} lines={lines} size={330} x={1530} y={690} />
      <LineAudio lines={lines} fps={fps} />
      <SfxTrack sfx={shot.sfx} fps={fps} />
      {/* music swells under the countdown (no voice there) so the thinking time is not near-silent (A1 P5: −30 LUFS) */}
      <Audio src={staticFile(shot.music)} loop volume={(f) => { const x = f / fps; return shot.questions.some((qq) => x >= qq.cdStart + 0.3 && x < qq.reveal - 0.2) ? 0.3 : 0.05; }} />
    </AbsoluteFill>
  );
};

// ---------- S06 Outro + end screen ----------
export const OutroShot: React.FC<{ shot: Extract<Shot, { kind: 'outro' }>; tl: Timeline }> = ({ shot, tl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const host = tl.characters[shot.host.rig];
  const cat = tl.characters[shot.cat];
  const tony = tl.characters[shot.teaserRig];
  const inEnd = t >= shot.endScreenAt;
  const l28 = shot.lines[0], l29 = shot.lines[1];
  const showTeaser = !inEnd && t >= l29.start;
  const pe = popIn(frame - Math.round(shot.endScreenAt * fps), fps);
  const hostH = 1500;
  return (
    <AbsoluteFill>
      <Bg src={shot.bg} blur={inEnd ? 10 : 0} dim={inEnd ? 0.3 : 0} />
      {!inEnd && <Character rig={host} t={t} lines={shot.lines} place={{ x: 470, topY: H - 0.72 * hostH, height: hostH, flip: false, z: 10 }} />}
      {!inEnd && <Character rig={cat} t={t} lines={[]} place={{ x: 820, topY: H - 360, height: 360, flip: false, z: 11 }} />}
      {/* links to the companion videos = real YouTube Cards (Studio), not drawn: drawn ones look clickable but are not */}
      {showTeaser && (
        <div style={{ position: 'absolute', right: 90, top: 300, width: 760, transform: `scale(${popIn(frame - Math.round(l29.start * fps), fps)})` }}>
          <Card style={{ padding: '26px 34px', display: 'flex', alignItems: 'center', gap: 26, overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: 230, height: 300, overflow: 'hidden', flexShrink: 0 }}>
              <Character rig={tony} t={t} lines={[]} place={{ x: 115, topY: 0, height: 760, flip: true, z: 1 }} />
            </div>
            <div>
              <div style={{ display: 'inline-block', background: COLORS.plateBlue, color: 'white', fontWeight: 800, fontSize: 40, borderRadius: 14, padding: '2px 18px' }}>A2</div>
              <div style={{ fontSize: 42, fontWeight: 800, marginTop: 10, lineHeight: 1.2 }}>Tony bưng nhầm món!</div>
              <div style={{ fontSize: 30, fontWeight: 500, color: COLORS.viText, marginTop: 6 }}>Tập tiếp theo</div>
            </div>
          </Card>
        </div>
      )}
      {inEnd && (
        <AbsoluteFill style={{ fontFamily: FONT }}>
          <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', fontSize: 64, fontWeight: 800, color: COLORS.outline, transform: `scale(${pe})` }}>Học tiếp nhé! 👇</div>
          {/* YouTube end-screen elements (2 videos + subscribe) are added in Studio over this clean area — nothing drawn here */}
        </AbsoluteFill>
      )}
      <LineAudio lines={shot.lines} fps={fps} />
      {shot.lines.map((l) => (t >= l.start - 0.05 && t < l.start + l.dur + 0.45 ? <Subtitle key={l.id} line={l} t={t} /> : null))}
      <SfxTrack sfx={shot.sfx} fps={fps} />
      <Audio src={staticFile(shot.music)} volume={(f) => interpolate(f / fps, [0, shot.endScreenAt - 0.5, shot.endScreenAt, shot.dur - 2, shot.dur], [0.06, 0.06, 0.5, 0.5, 0], { extrapolateRight: 'clamp' })} loop />
    </AbsoluteFill>
  );
};
