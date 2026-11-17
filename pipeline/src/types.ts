export type MouthCue = { start: number; end: number; value: string };

export type Line = {
  id: string;
  speaker: string;
  lang: 'en' | 'vi';
  start: number; // seconds, relative to shot start
  dur: number;
  audio: string;
  mouth: MouthCue[];
  text: string;
  vi: string | null;
  highlight: string[];
  gesture: string | null;
  emotion: string | null;
  role?: string | null;
  phrase?: string | null;
  q?: number | null;
  to?: string | null; // addressee (optional override; otherwise inferred from neighbouring lines)
};

export type Rig = {
  character: string;
  pose?: string;
  img: string;
  width: number;
  height: number;
  height_rel: number;
  skin: [number, number, number];
  mouth: { cx: number; cy: number; w: number } | null;
  eyes: { cx: number; cy: number; rx: number; ry: number }[];
};

export type Sfx = { src: string; at: number; volume: number };
export type CastItem = { id: string; slot: string; rig: string; poses?: { from: number; rig: string }[] };
export type Host = { rig: string; id: string };
export type LearnBlock = { id: string; kind: "phrase" | "error"; start: number; dur: number; lines: Line[]; phrase: string | null; vi: string | null; explain: string; example: string | null; wrong: string | null; right: string | null };
export type QuizQ = { q: string; options: string[]; answer: number; start: number; qLine: Line; cdStart: number; reveal: number; aLine: Line; end: number };

export type Shot =
  | { id: string; kind: "video"; start: number; dur: number; src: string; insert: string; sfx: Sfx[]; ambience: string | null }
  | { id: string; kind: "puppet"; start: number; dur: number; bg: string; location: string; positions: Record<string, string>; cast: CastItem[]; lines: Line[]; sfx: Sfx[]; camera: { move: string; at: number } | null; ambience: string | null }
  | { id: string; kind: "title"; start: number; dur: number; bg: string; blur: number; host: Host; title: string; badge: string; lines: Line[]; sfx: Sfx[] }
  | { id: string; kind: "learn"; start: number; dur: number; bg: string; blur: number; host: Host; blocks: LearnBlock[]; sfx: Sfx[]; music: string }
  | { id: string; kind: "quiz"; start: number; dur: number; bg: string; blur: number; host: Host; intro: Line; questions: QuizQ[]; countdown: number; sfx: Sfx[]; music: string }
  | { id: string; kind: "outro"; start: number; dur: number; endScreenAt: number; bg: string; host: Host; cat: string; teaserRig: string; lines: Line[]; cards: string[]; sfx: Sfx[]; music: string };

export type Timeline = {
  id: string;
  fps: number;
  width: number;
  height: number;
  durationInFrames: number;
  duration: number;
  characters: Record<string, Rig>;
  shots: Shot[];
  subtitleMode: string;
  title?: string;
};
