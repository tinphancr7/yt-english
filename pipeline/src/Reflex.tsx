import React from 'react';
import { AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { loadFont } from '@remotion/google-fonts/BeVietnamPro';
import { COLORS } from './brand';
import { LoopedMusic } from './components/Music';

loadFont('normal', { weights: ['500', '700', '800'], subsets: ['vietnamese', 'latin'] });
const FONT = 'Be Vietnam Pro, sans-serif';

type Clip = { audio: string; dur: number; start: number; text: string; lang?: string };
type RShot = {
  id: string; kind: 'reflex'; phase: 'intro' | 'item' | 'transition' | 'outro'; start: number; dur: number;
  part?: 1 | 2; order?: number; endScreenAt?: number; n?: number; prompt?: Clip; answer?: Clip; voice?: Clip; cdStart?: number; reveal?: number;
};
export type ReflexTimeline = {
  id: string; fps: number; width: number; height: number; durationInFrames: number; duration: number; title: string;
  bg: string; music: string; musicDur?: number; sfx: { tick: string; ding: string; whoosh: string }; countdown: number; shots: RShot[];
};

const PART = {
  1: { label: 'PHẦN 1 · VIỆT → ANH', rule: 'Nghe câu tiếng Việt. Trong 7 giây, hãy nói to câu tiếng Anh.' },
  2: { label: 'PHẦN 2 · ANH → VIỆT', rule: 'Nghe câu tiếng Anh. Trong 7 giây, hãy nói nghĩa tiếng Việt.' },
} as const;

const Box: React.FC<{ color: string; children: React.ReactNode; scale?: number }> = ({ color, children, scale = 1 }) => (
  <div style={{ background: color, border: `7px solid ${COLORS.outline}`, borderRadius: 28, padding: '34px 56px', minWidth: 900, maxWidth: 1500, textAlign: 'center',
    fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: 1.2, color: COLORS.outline, boxShadow: '0 12px 0 rgba(61,44,41,0.35)', transform: `scale(${scale})` }}>
    {children}
  </div>
);

const Header: React.FC<{ title: string; part?: 1 | 2 }> = ({ title, part }) => (
  <>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 96, background: COLORS.outline, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', fontFamily: FONT }}>
      <div style={{ color: COLORS.cream, fontSize: 38, fontWeight: 800, letterSpacing: 0.5 }}>{title}</div>
      <div style={{ color: COLORS.wallYellow, fontSize: 36, fontWeight: 800 }}>YOLO7 English</div>
    </div>
    {part && (
      <div style={{ position: 'absolute', top: 128, left: 60, fontFamily: FONT }}>
        <div style={{ display: 'inline-block', background: part === 1 ? COLORS.stoolRed : COLORS.plateBlue, color: 'white', fontWeight: 800, fontSize: 44, borderRadius: 16, padding: '6px 26px', border: `5px solid ${COLORS.outline}` }}>{PART[part].label}</div>
        <div style={{ marginTop: 14, fontSize: 36, fontWeight: 600, color: COLORS.outline }}>{PART[part].rule} Chưa nói được = chưa đạt.</div>
      </div>
    )}
  </>
);

const Countdown: React.FC<{ left: number; frac: number }> = ({ left, frac }) => {
  const S = 300, R = 128, C = 2 * Math.PI * R; // the 00:0N text must fit inside the ring (A1 reflex: overflowed at 230 px)
  return (
    <div style={{ position: 'relative', width: S, height: S }}>
      <svg width={S} height={S} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={S / 2} cy={S / 2} r={R} fill={COLORS.cream} stroke={COLORS.outline} strokeWidth={10} />
        <circle cx={S / 2} cy={S / 2} r={R} fill="none" stroke={left <= 2 ? COLORS.stoolRed : COLORS.doorGreen} strokeWidth={18}
          strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform={`rotate(-90 ${S / 2} ${S / 2})`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 60, color: COLORS.outline, fontVariantNumeric: 'tabular-nums' }}>
        00:0{left}
      </div>
    </div>
  );
};

const ShotView: React.FC<{ s: RShot; tl: ReflexTimeline }> = ({ s, tl }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const pop = (at: number) => spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 14, stiffness: 170 } });
  const audio = (c?: Clip, vol = 1) => c && (
    <Sequence from={Math.round(c.start * fps)} durationInFrames={Math.ceil((c.dur + 0.1) * fps)}><Audio src={staticFile(c.audio)} volume={vol} /></Sequence>
  );
  if (s.phase === 'outro' && t >= s.endScreenAt!) {
    return (<AbsoluteFill><Header title={tl.title} /><div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', fontFamily: FONT, fontSize: 64, fontWeight: 800, color: COLORS.outline }}>Học tiếp nhé! 👇</div></AbsoluteFill>);
  }
  if (s.phase !== 'item') {
    const big = s.phase === 'intro' ? 'BÀI THI PHẢN XẠ 7 GIÂY' : s.phase === 'transition' ? 'ĐỔI CHIỀU!' : 'BẠN ĐƯỢC MẤY ĐIỂM?';
    const sub = s.phase === 'intro' ? PART[1].label : s.phase === 'transition' ? PART[2].label : 'Bình luận: Phần 1 __/25 · Phần 2 __/25';
    return (
      <AbsoluteFill>
        <Header title={tl.title} />
        <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', fontFamily: FONT, gap: 40 }}>
          <div style={{ fontSize: 112, fontWeight: 800, color: COLORS.outline, transform: `scale(${pop(0.2)})`, textAlign: 'center' }}>{big}</div>
          <div style={{ fontSize: 56, fontWeight: 800, color: 'white', background: s.phase === 'transition' ? COLORS.plateBlue : COLORS.stoolRed, border: `6px solid ${COLORS.outline}`, borderRadius: 20, padding: '10px 36px', transform: `scale(${pop(0.6)})` }}>{sub}</div>
          {s.phase !== 'outro' && (
            <div style={{ fontSize: 40, fontWeight: 600, color: COLORS.outline, maxWidth: 1400, textAlign: 'center', opacity: interpolate(t, [1, 1.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
              {PART[s.part ?? 1].rule} Sau 7 giây chưa nói được = chưa đạt. Thi lại đến khi đạt 100%.
            </div>
          )}
        </AbsoluteFill>
        {audio(s.voice)}
        <Sequence durationInFrames={Math.round(0.8 * fps)}><Audio src={staticFile(tl.sfx.whoosh)} volume={0.5} /></Sequence>
      </AbsoluteFill>
    );
  }
  const counting = t >= s.cdStart! && t < s.reveal!;
  const left = counting ? Math.max(1, Math.ceil(s.reveal! - t)) : t < s.cdStart! ? tl.countdown : 0;
  const frac = counting ? (s.reveal! - t) / tl.countdown : t < s.cdStart! ? 1 : 0;
  const shown = t >= s.reveal!;
  return (
    <AbsoluteFill>
      <Header title={tl.title} part={s.part} />
      <div style={{ position: 'absolute', top: 128, right: 60, fontFamily: FONT, fontSize: 40, fontWeight: 800, color: COLORS.viText }}>{s.order}/25</div>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 170, gap: 26, fontFamily: FONT }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: COLORS.outline }}>Câu {s.n}</div>
        <Box color="#F6C9C4" scale={pop(0.05)}>{s.prompt!.text}</Box>
        <div style={{ height: 300, display: 'flex', alignItems: 'center' }}>
          {shown ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Box color={COLORS.wallYellow} scale={pop(s.reveal!)}>{s.answer!.text}</Box>
              {s.part === 2 && <div style={{ fontSize: 32, fontWeight: 600, color: COLORS.viText }}>Nói đúng ý là đạt.</div>}
            </div>
          ) : (
            <Countdown left={left} frac={frac} />
          )}
        </div>
      </AbsoluteFill>
      {audio(s.prompt)}
      {audio(s.answer)}
      <Sequence from={Math.round(s.cdStart! * fps)} durationInFrames={Math.round(tl.countdown * fps)}><Audio src={staticFile(tl.sfx.tick)} volume={0.35} loop /></Sequence>
      <Sequence from={Math.round(s.reveal! * fps)} durationInFrames={Math.round(1.5 * fps)}><Audio src={staticFile(tl.sfx.ding)} volume={0.5} /></Sequence>
    </AbsoluteFill>
  );
};

export const ReflexDrill: React.FC<{ tl: ReflexTimeline }> = ({ tl }) => (
  <AbsoluteFill style={{ background: COLORS.cream }}>
    <Img src={staticFile(tl.bg)} style={{ position: 'absolute', inset: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'cover', filter: 'blur(18px)' }} />
    <AbsoluteFill style={{ background: 'rgba(255,244,224,0.72)' }} />
    {tl.shots.map((s) => (
      <Sequence key={s.id} from={Math.round(s.start * tl.fps)} durationInFrames={Math.round(s.dur * tl.fps)}>
        <ShotView s={s} tl={tl} />
      </Sequence>
    ))}
    <LoopedMusic src={tl.music} fileDur={tl.musicDur ?? 30} total={tl.duration} volume={(x) => { const o = tl.shots.at(-1)!; const e = o.start + (o.endScreenAt ?? o.dur); return x < e ? 0.05 : interpolate(x, [e, e + 0.5, o.start + o.dur - 2, o.start + o.dur], [0.05, 0.5, 0.5, 0], { extrapolateRight: 'clamp' }); }} />
  </AbsoluteFill>
);
