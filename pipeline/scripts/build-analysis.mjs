// Timeline cho video "Phân tích & giải thích" từ <bản>/analysis.json.
// usage: node scripts/build-analysis.mjs <analysis.json> <outName>
// Mỗi khối: 1 Nghe câu (Tín dẫn → phát lại ĐÚNG đoạn phim đã khóa → Tín đọc chậm) · 2 Ngữ pháp · 3 Từ vựng · 4 Cách dùng.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const [cfgFile, outName] = process.argv.slice(2);
const cfg = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
const epKey = cfg.id.replace(/-analysis$/, '');
const audioDir = path.join(root, 'episodes', epKey, 'audio');
const pub = path.join(root, 'public');
const copy = (src, rel) => { const dst = path.join(pub, rel); fs.mkdirSync(path.dirname(dst), { recursive: true }); if (!fs.existsSync(dst) || fs.statSync(src).mtimeMs > fs.statSync(dst).mtimeMs) fs.copyFileSync(src, dst); return rel.replace(/\\/g, '/'); };
const pngSize = (f) => { const b = fs.readFileSync(f); return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }; };

// Tín rig for the corner bubble
const tinDir = path.join(proj, 'assets', 'characters', 'tin', 'v1');
const tinRig = JSON.parse(fs.readFileSync(path.join(tinDir, 'rig.json'), 'utf8'));
const characters = { tin: { ...tinRig, pose: 'stand', posture: 'stand', img: copy(path.join(tinDir, tinRig.image), `characters/tin/${tinRig.image}`), ...pngSize(path.join(tinDir, tinRig.image)) } };

// the approved film: its timeline gives where each dialogue line sits in the mp4
const film = JSON.parse(fs.readFileSync(path.join(root, cfg.pipeline.film_timeline), 'utf8'));
const filmSrc = copy(path.join(root, cfg.pipeline.film), `episodes/${epKey}/film.mp4`);
const filmLine = (id) => { for (const s of film.shots) for (const l of s.lines ?? []) if (l.id === id) return { start: s.start + l.start, end: s.start + l.start + l.dur }; throw new Error(`không thấy ${id} trong phim`); };

const line = (id, start) => {
  const meta = JSON.parse(fs.readFileSync(path.join(audioDir, `${id}.json`), 'utf8'));
  const mf = path.join(audioDir, `${id}.mouth.json`);
  const mouth = fs.existsSync(mf) ? JSON.parse(fs.readFileSync(mf, 'utf8')).mouthCues : [];
  const al = meta.alignment;
  const dur = al.character_end_times_seconds.at(-1) + 0.15;
  return { id, speaker: 'tin', lang: meta.lang, start, dur, audio: copy(path.join(audioDir, `${id}.mp3`), `episodes/${epKey}/audio/${id}.mp3`), mouth, text: meta.text, vi: null, highlight: [], gesture: null, emotion: null, al };
};
const GAP = 0.3;
const run = (ids, t0) => { const out = []; let t = t0; for (const id of ids) { const l = line(id, t); out.push(l); t += l.dur + GAP; } return { lines: out, end: t - GAP }; };
const strip = (l) => { const { al, ...x } = l; return x; };
// start time of each half of a slow "A ... B" reading (to highlight question then answer)
const halves = (l, texts) => {
  const chars = l.al.characters.join('').toLowerCase(); let from = 0;
  return texts.map((h) => { const k = chars.indexOf(h.toLowerCase().replace(/[.?!]+$/, ''), from); from = Math.max(from, k + 1); return k < 0 ? null : l.al.character_start_times_seconds[k]; });
};
const plain = (parts) => (parts ? parts.map((p) => p[0]).join('') : null);

const shots = [];
let T = 0;
const push = (s) => { shots.push({ ...s, start: T }); T += s.dur; };
const pt = (t, tag, text) => ({ t, tag, text });

// intro
{ const { lines, end } = run(cfg.intro, 1.2); push({ id: 'AI', kind: 'a-intro', dur: end + 1.0, lines: lines.map(strip), points: [pt(end / 2, 'mở đầu', lines.map((l) => l.text).join(' '))] }); }

cfg.blocks.forEach((b, bi) => {
  const steps = [], lines = [], points = [];
  let t = 0.6, film = null, slow = null;
  for (const s of b.steps) {
    const st = { step: s.step, panel: s.panel ?? [], start: t };
    const r = run(s.say, t + 0.3);
    lines.push(...r.lines); t = r.end;
    if (s.step === 'listen') {
      const a = filmLine(b.film[0]), z = filmLine(b.film.at(-1));
      const from = Math.max(0, a.start - 0.25), d = z.end + 0.35 - from;
      film = { src: filmSrc, from, dur: d, start: t + 0.5 }; t = film.start + d;
      if (b.slow) {
        const l = line(b.slow, t + 0.5); slow = { id: l.id, start: l.start, parts: halves(l, [plain(b.q), plain(b.a)].filter(Boolean)) }; lines.push(l); t = l.start + l.dur;
      }
      points.push(pt(film.start + d / 2, `${b.id} phim`, b.film.join('+')));
    }
    st.end = t + 0.6; t = st.end; steps.push(st);
    points.push(pt(s.step === 'listen' ? Math.max(st.start + 0.5, t - 1) : (st.start + st.end) / 2, `${b.id} ${s.step}`, r.lines.map((l) => l.text).join(' ').slice(0, 110)));
  }
  push({ id: b.id, kind: 'a-block', index: bi, dur: t + 0.4, block: { id: b.id, q: b.q, a: b.a, wrong: b.wrong ?? null, ipa: b.ipa, vi: b.vi }, steps, film, slow, lines: lines.map(strip), points });
});

{ const { lines, end } = run(cfg.summary.say, 0.6); const d = end + 7; push({ id: 'AS', kind: 'a-summary', dur: d, vocab: cfg.summary.vocab, formulas: cfg.summary.formulas, lines: lines.map(strip), points: [pt(end + 3, 'tổng kết', 'bảng tổng kết (giữ 5 s)')] }); }
{ const { lines, end } = run(cfg.outro, 0.6); const endAt = end + 0.8; push({ id: 'AO', kind: 'a-outro', dur: endAt + 15, endScreenAt: endAt, lines: lines.map(strip), points: [pt(end / 2, 'kết', lines.map((l) => l.text).join(' ').slice(0, 110)), pt(endAt + 3, 'END', 'màn hình cuối')] }); }

const copyAsset = (a, rel) => copy(path.join(proj, 'assets', a), rel);
const tl = { id: cfg.id, fps: 30, width: 1920, height: 1080, durationInFrames: Math.round(T * 30), duration: T, title: cfg.title, characters,
  bg: copyAsset('locations/quan-co-ba/v1/wide.png', 'locations/quan-co-ba/wide.png'), music: copyAsset('audio/music/bg-cozy-ukulele.mp3', 'audio/music/bg-cozy-ukulele.mp3'),
  sfx: { whoosh: copyAsset('audio/sfx/whoosh.mp3', 'audio/sfx/whoosh.mp3'), pop: copyAsset('audio/sfx/pop.mp3', 'audio/sfx/pop.mp3') }, shots };
const out = path.join(root, 'src', 'data', `${outName}.json`);
fs.writeFileSync(out, JSON.stringify(tl, null, 1));
console.log(`${out} | duration ${T.toFixed(1)}s (${Math.floor(T / 60)}:${String(Math.round(T % 60)).padStart(2, '0')}) | ${shots.length} shots`);
