import React from 'react';
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/BeVietnamPro';
import { COLORS } from './brand';
import { HostBubble, LineAudio } from './components/Shots';
import { LoopedMusic } from './components/Music';
import type { Line, Rig } from './types';

loadFont('normal', { weights: ['500', '700', '800'], subsets: ['vietnamese', 'latin'] });
const FONT = 'Be Vietnam Pro, sans-serif';

type Part = [string, string | null];
type Step = { step: 'listen' | 'grammar' | 'vocab' | 'usage'; start: number; end: number; panel: (string | [string, string, string, string])[] };
type AShot = {
  id: string; kind: 'a-intro' | 'a-block' | 'a-summary' | 'a-outro'; start: number; dur: number; lines: Line[];
  index?: number; block?: { id: string; q: Part[] | null; a: Part[] | null; wrong: string | null; ipa: string[]; vi: string };
  steps?: Step[]; film?: { src: string; from: number; dur: number; start: number } | null; slow?: { start: number; parts: (number | null)[] } | null;
  vocab?: [string, string, string][]; formulas?: [string, string][]; endScreenAt?: number;
};
export type AnalysisTimeline = { id: string; fps: number; width: number; height: number; durationInFrames: number; duration: number; title: string;
  characters: Record<string, Rig>; bg: string; music: string; musicDur?: number; sfx: { whoosh: string; pop: string }; shots: AShot[] };

// sentence-part colours (same in every analysis video)
const ROLE: Record<string, React.CSSProperties> = {
  subj: { color: COLORS.plateBlue }, verb: { color: COLORS.stoolRed }, obj: { color: '#B7791F', background: 'rgba(242,193,78,0.25)', borderRadius: 8 },
  fixed: { textDecoration: 'underline', textDecorationThickness: 6, textUnderlineOffset: 10 }, polite: { color: COLORS.doorGreen },
};
const STEP_LABEL = { listen: '1 · Nghe câu', grammar: '2 · Ngữ pháp & cấu trúc', vocab: '3 · Từ vựng', usage: '4 · Cách dùng' } as const;

const Ipa: React.FC<{ s: string }> = ({ s }) => (
  <span>{s.split(/(\{[^}]*\})/).map((x, i) => (x.startsWith('{') ? <span key={i} style={{ color: COLORS.stoolRed, fontWeight: 800 }}>{x.slice(1, -1)}</span> : x))}</span>
);
const Sentence: React.FC<{ parts: Part[]; lit: boolean; size: number }> = ({ parts, lit, size }) => (
  <div style={{ fontSize: size, fontWeight: 800, lineHeight: 1.25, color: COLORS.outline }}>
    <span style={{ background: lit ? COLORS.highlight : 'transparent', borderRadius: 14, padding: '0 10px', boxDecorationBreak: 'clone' }}>
      {parts.map(([t, r], i) => <span key={i} style={r ? ROLE[r] : undefined}>{t}</span>)}
    </span>
  </div>
);
const Panel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ background: COLORS.cream, border: `6px solid ${COLORS.outline}`, borderRadius: 30, boxShadow: '0 10px 0 rgba(61,44,41,0.35)', fontFamily: FONT, color: COLORS.outline, ...style }}>{children}</div>
);

const Block: React.FC<{ s: AShot; tl: AnalysisTimeline; t: number; frame: number; fps: number }> = ({ s, tl, t, frame, fps }) => {
  const b = s.block!;
  const step = [...s.steps!].reverse().find((x) => t >= x.start) ?? s.steps![0];
  const pop = spring({ frame: frame - Math.round(step.start * fps), fps, config: { damping: 15, stiffness: 160 } });
  const inFilm = s.film && t >= s.film.start - 0.2 && t < s.film.start + s.film.dur + 0.2;
  const slow = s.slow && t >= s.slow.start ? t - s.slow.start : null;
  const half = (i: number) => {
    if (slow == null || !s.slow) return false;
    const p = s.slow.parts; const a = p[i], z = p[i + 1];
    const slowLine = s.lines.find((l) => l.start === s.slow!.start); if (!slowLine || slow > slowLine.dur) return false;
    return a != null && slow >= a - 0.05 && (z == null || slow < z - 0.05);
  };
  const isErr = !!b.wrong;
  return (
    <>
      {/* left: the sentence */}
      <Panel style={{ position: 'absolute', left: 50, top: 130, width: 900, minHeight: 650, padding: '36px 44px' }}>
        <div style={{ fontSize: 38, fontWeight: 800, color: isErr ? COLORS.stoolRed : COLORS.doorGreen }}>{isErr ? 'LỖI CỦA ANH TONY' : `MẪU CÂU ${(s.index ?? 0) + 1}`}</div>
        {isErr && <div style={{ fontSize: 70, fontWeight: 800, color: '#9b7f78', textDecoration: 'line-through', textDecorationColor: COLORS.stoolRed, textDecorationThickness: 7, marginTop: 8 }}>{b.wrong}</div>}
        {b.q && <div style={{ marginTop: 10 }}><Sentence parts={b.q} lit={half(0)} size={76} /></div>}
        {b.a && <div style={{ marginTop: 6 }}><Sentence parts={b.a} lit={half(b.q ? 1 : 0)} size={76} /></div>}
        <div style={{ marginTop: 26, fontSize: 46, fontWeight: 600, color: COLORS.viText, fontFamily: 'Be Vietnam Pro, Segoe UI, Arial, sans-serif' }}>{b.ipa.map((x, i) => <div key={i}><Ipa s={x} /></div>)}</div>
        <div style={{ marginTop: 22, fontSize: 46, fontWeight: 600, color: COLORS.outline }}>{b.vi}</div>
      </Panel>
      {/* right: explanation of the current step */}
      <Panel style={{ position: 'absolute', left: 980, top: 130, width: 890, minHeight: 650, padding: '32px 40px', transform: `scale(${0.9 + 0.1 * pop})`, opacity: pop, transformOrigin: '50% 0%' }}>
        <div style={{ display: 'inline-block', fontSize: 40, fontWeight: 800, color: 'white', background: COLORS.plateBlue, borderRadius: 14, padding: '4px 20px' }}>{STEP_LABEL[step.step]}</div>
        <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 22 }}>
          {step.step === 'listen' && <div style={{ fontSize: 48, fontWeight: 700 }}>🎬 Nghe lại cảnh phim, rồi nghe Tín đọc chậm.</div>}
          {step.panel.map((p, i) =>
            typeof p === 'string' ? (
              <div key={i} style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.3, color: p.startsWith('❌') ? COLORS.stoolRed : COLORS.outline }}>{p}</div>
            ) : (
              <div key={i} style={{ fontSize: 46, lineHeight: 1.3 }}>
                <b>{p[0]}</b> {p[1] && <span style={{ color: COLORS.viText }}>({p[1]})</span>} <span style={{ color: COLORS.viText }}><Ipa s={p[2]} /></span> — {p[3]}
              </div>
            ),
          )}
        </div>
      </Panel>
      {/* the original film scene, replayed */}
      {s.film && (
        <Sequence from={Math.round(s.film.start * fps)} durationInFrames={Math.round(s.film.dur * fps)}>
          <AbsoluteFill style={{ background: 'rgba(61,44,41,0.55)' }}>
            <div style={{ position: 'absolute', left: 260, top: 130, width: 1400, height: 788, border: `8px solid ${COLORS.outline}`, borderRadius: 26, overflow: 'hidden', boxShadow: '0 14px 0 rgba(0,0,0,0.35)' }}>
              <OffthreadVideo src={staticFile(s.film.src)} startFrom={Math.round(s.film.from * fps)} style={{ width: '100%', height: '100%' }} />
            </div>
            <div style={{ position: 'absolute', left: 260, top: 930, fontFamily: FONT, fontSize: 44, fontWeight: 800, color: 'white' }}>🎬 Cảnh phim — nghe lại câu gốc</div>
          </AbsoluteFill>
        </Sequence>
      )}
      {!inFilm && <HostBubble rig={tl.characters.tin} t={t} lines={s.lines} size={240} x={1650} y={815} />}
    </>
  );
};

const ShotView: React.FC<{ s: AShot; tl: AnalysisTimeline }> = ({ s, tl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 160 } });
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 96, background: COLORS.outline, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px' }}>
        <div style={{ color: COLORS.cream, fontSize: 36, fontWeight: 800 }}>PHÂN TÍCH & GIẢI THÍCH · GỌI PHỞ Ở QUÁN CÔ BA · A1</div>
        <div style={{ color: COLORS.wallYellow, fontSize: 36, fontWeight: 800 }}>YOLO7 English</div>
      </div>
      {s.kind === 'a-intro' && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 30 }}>
          <div style={{ fontSize: 120, fontWeight: 800, color: COLORS.outline, transform: `scale(${pop})` }}>VÌ SAO NÓI VẬY?</div>
          <div style={{ fontSize: 52, fontWeight: 800, color: 'white', background: COLORS.stoolRed, border: `6px solid ${COLORS.outline}`, borderRadius: 20, padding: '8px 34px' }}>6 mẫu câu gọi phở + 1 lỗi hay gặp</div>
          <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.viText }}>Ngữ pháp · Từ vựng · Cách dùng</div>
        </AbsoluteFill>
      )}
      {s.kind === 'a-block' && <Block s={s} tl={tl} t={t} frame={frame} fps={fps} />}
      {s.kind === 'a-summary' && (
        <div style={{ position: 'absolute', left: 50, right: 50, top: 125, display: 'flex', gap: 30 }}>
          <Panel style={{ flex: 1, padding: '26px 34px', minHeight: 650 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.doorGreen, marginBottom: 12 }}>TỪ VỰNG</div>
            {s.vocab!.map(([w, ipa, m]) => <div key={w} style={{ fontSize: 40, lineHeight: 1.55 }}><b>{w}</b> <span style={{ color: COLORS.viText }}>{ipa}</span> — {m}</div>)}
          </Panel>
          <Panel style={{ flex: 1.3, padding: '26px 34px', minHeight: 650 }}>
            <div style={{ fontSize: 40, fontWeight: 800, color: COLORS.doorGreen, marginBottom: 12 }}>CÔNG THỨC CÂU</div>
            {s.formulas!.map(([f, e]) => <div key={f} style={{ fontSize: 38, lineHeight: 1.5 }}><b>{f}</b> <span style={{ color: COLORS.viText }}>→ {e}</span></div>)}
          </Panel>
        </div>
      )}
      {s.kind === 'a-summary' && <div style={{ position: 'absolute', bottom: 60, left: 0, right: 300, textAlign: 'center', fontSize: 44, fontWeight: 800, color: COLORS.stoolRed }}>📸 Chụp màn hình lại để ôn nhé!</div>}
      {s.kind === 'a-outro' && t < s.endScreenAt! && (
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: 72, fontWeight: 800, color: COLORS.outline, textAlign: 'center' }}>Câu nào bạn hay nói sai?<br />Bình luận nhé! 💬</div>
        </AbsoluteFill>
      )}
      {s.kind === 'a-outro' && t >= s.endScreenAt! && (
        <div style={{ position: 'absolute', top: 130, left: 0, right: 0, textAlign: 'center', fontSize: 64, fontWeight: 800, color: COLORS.outline }}>Học tiếp nhé! 👇</div>
      )}
      {s.kind !== 'a-block' && !(s.kind === 'a-outro' && t >= s.endScreenAt!) && <HostBubble rig={tl.characters.tin} t={t} lines={s.lines} size={250} x={1630} y={800} />}
      <LineAudio lines={s.lines} fps={fps} />
      {s.kind === 'a-block' && <Sequence durationInFrames={Math.round(0.8 * fps)}><Audio src={staticFile(tl.sfx.whoosh)} volume={0.4} /></Sequence>}
    </AbsoluteFill>
  );
};

export const AnalysisVideo: React.FC<{ tl: AnalysisTimeline }> = ({ tl }) => {
  const frame = useCurrentFrame();
  const t = frame / tl.fps;
  // music: soft under speech, up while the film plays its own audio? no — down during film, up during the silent summary hold / end screen
  const vol = (x: number) => {
    const s = tl.shots.find((z) => x >= z.start && x < z.start + z.dur);
    if (!s) return 0.05;
    const lt = x - s.start;
    if (s.film && lt >= s.film.start && lt < s.film.start + s.film.dur) return 0.0;
    if (s.kind === 'a-summary' && lt > s.lines.at(-1)!.start + s.lines.at(-1)!.dur) return 0.25;
    if (s.kind === 'a-outro' && lt >= s.endScreenAt!) return interpolate(lt, [s.endScreenAt!, s.endScreenAt! + 0.5, s.dur - 2, s.dur], [0.05, 0.5, 0.5, 0], { extrapolateRight: 'clamp' });
    return 0.05;
  };
  void t;
  return (
    <AbsoluteFill style={{ background: COLORS.cream }}>
      <Img src={staticFile(tl.bg)} style={{ position: 'absolute', inset: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'cover', filter: 'blur(18px)' }} />
      <AbsoluteFill style={{ background: 'rgba(255,244,224,0.7)' }} />
      {tl.shots.map((s) => (
        <Sequence key={s.id} from={Math.round(s.start * tl.fps)} durationInFrames={Math.round(s.dur * tl.fps)}>
          <ShotView s={s} tl={tl} />
        </Sequence>
      ))}
      <LoopedMusic src={tl.music} fileDur={tl.musicDur ?? 30} total={tl.duration} volume={vol} />
    </AbsoluteFill>
  );
};
