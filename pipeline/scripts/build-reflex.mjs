// Timeline cho video "Phản xạ 7 giây" (bài thi 2 chiều) từ <bản>/reflex.json.
// usage: node scripts/build-reflex.mjs <reflex.json> <outName>
//   Phần 1 Việt → Anh: giọng Tín đọc đề (R##) → đếm 7 s → hiện đáp án + giọng nhân vật (C## cắt từ phim / R49+ giọng mới)
//   Phần 2 Anh → Việt: giọng nhân vật đọc đề → đếm 7 s → hiện nghĩa + giọng Tín
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const [cfgFile, outName] = process.argv.slice(2);
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
const epKey = cfg.id.replace(/-reflex$/, '');
const audioDir = path.join(root, 'episodes', epKey, 'audio');
const pub = path.join(root, 'public');
const copy = (src, rel) => { const dst = path.join(pub, rel); fs.mkdirSync(path.dirname(dst), { recursive: true }); if (!fs.existsSync(dst) || fs.statSync(src).mtimeMs > fs.statSync(dst).mtimeMs) fs.copyFileSync(src, dst); return rel.replace(/\\/g, '/'); };
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], { encoding: 'utf8' }));
const clip = (id) => { const f = path.join(audioDir, `${id}.mp3`); if (!fs.existsSync(f)) throw new Error(`thiếu audio ${id}`); return { audio: copy(f, `episodes/${epKey}/audio/${id}.mp3`), dur: dur(f) }; };
const sfx = (id) => copy(path.join(proj, 'assets', 'audio', 'sfx', `${id}.mp3`), `audio/sfx/${id}.mp3`);
const music = copy(path.join(proj, 'assets', 'audio', 'music', 'bg-cozy-ukulele.mp3'), 'audio/music/bg-cozy-ukulele.mp3');
const bg = copy(path.join(proj, 'assets', 'locations', 'quan-co-ba', 'v1', 'wide.png'), 'locations/quan-co-ba/wide.png');

const FPS = 30, CD = cfg.countdown_sec ?? 7, LEAD = 0.35, GAP = 0.4, AFTER = 0.25, HOLD = 1.3;
const line = (id) => cfg.lines.find((l) => l.id === id);
const enOf = (it) => clip(it.en_audio.tts ?? `C${String(it.n).padStart(2, '0')}`);
const viOf = (it) => clip(it.vi_audio);

const shots = [];
let T = 0;
const push = (s) => { shots.push({ ...s, start: T }); T += s.dur; };

const card = (id, phase, lineId, extra = {}) => {
  const a = clip(lineId);
  push({ id, kind: 'reflex', phase, dur: 1.0 + a.dur + 1.2, voice: { ...a, start: 1.0, text: line(lineId).text }, points: [{ t: 1.0 + a.dur / 2, tag: phase, text: line(lineId).text }], ...extra });
};
const item = (part, order, it) => {
  const prompt = part === 1 ? { ...viOf(it), text: it.vi, lang: 'vi' } : { ...enOf(it), text: it.en, lang: 'en' };
  const answer = part === 1 ? { ...enOf(it), text: it.en, lang: 'en' } : { ...viOf(it), text: it.vi, lang: 'vi' };
  const cdStart = LEAD + prompt.dur + GAP, reveal = cdStart + CD;
  const d = reveal + AFTER + answer.dur + HOLD;
  push({ id: `${part === 1 ? 'A' : 'B'}${String(order).padStart(2, '0')}`, kind: 'reflex', phase: 'item', part, order, n: it.n, dur: d,
    prompt: { ...prompt, start: LEAD }, answer: { ...answer, start: reveal + AFTER }, cdStart, reveal,
    points: [{ t: cdStart + 2, tag: `P${part} câu ${it.n}`, text: `đề: ${prompt.text}` }, { t: reveal + AFTER + answer.dur / 2, tag: `P${part} câu ${it.n} đáp án`, text: answer.text }] });
};

card('RI', 'intro', 'R00', { part: 1 });
cfg.items.forEach((it, i) => item(1, i + 1, it));
card('RT', 'transition', 'R80', { part: 2 });
cfg.part2_order.forEach((n, i) => item(2, i + 1, cfg.items.find((x) => x.n === n)));
// end screen: 15 s of clean background for YouTube end-screen elements (≥ 5 s required)
{ const a = clip('R90'); const endScreenAt = 1.0 + a.dur + 1.2; push({ id: 'RO', kind: 'reflex', phase: 'outro', part: 2, dur: endScreenAt + 15, endScreenAt, voice: { ...a, start: 1.0, text: line('R90').text }, points: [{ t: 1.0 + a.dur / 2, tag: 'outro', text: line('R90').text }, { t: endScreenAt + 3, tag: 'END', text: 'màn hình cuối' }] }); }

const tl = { id: cfg.id, fps: FPS, width: 1920, height: 1080, durationInFrames: Math.round(T * FPS), duration: T, title: cfg.title, characters: {},
  bg, music, sfx: { tick: sfx('clock-tick'), ding: sfx('correct-ding'), whoosh: sfx('whoosh') }, countdown: CD, shots };
const out = path.join(root, 'src', 'data', `${outName}.json`);
fs.writeFileSync(out, JSON.stringify(tl, null, 1));
console.log(`${out} | duration ${T.toFixed(1)}s (${Math.floor(T / 60)}:${String(Math.round(T % 60)).padStart(2, '0')}) | ${shots.length} shots`);
