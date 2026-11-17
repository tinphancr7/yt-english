// Build a Remotion timeline JSON for an episode (all scene types) and copy needed assets into public/.
// usage: node scripts/build-timeline.mjs <episodeDir> <sceneIds|all> <outName>
//   e.g. node scripts/build-timeline.mjs ../video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A1 all a1-full
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const [epDir, sceneArg, outName] = process.argv.slice(2);
const ep = JSON.parse(fs.readFileSync(path.join(epDir, 'episode.json'), 'utf8'));
const narr = fs.existsSync(path.join(epDir, 'narration.json')) ? JSON.parse(fs.readFileSync(path.join(epDir, 'narration.json'), 'utf8')).scenes[0].lines : [];
const epKey = ep.id;
const audioDir = path.join(root, 'episodes', epKey, 'audio');
const pub = path.join(root, 'public');
const copy = (src, rel) => { const dst = path.join(pub, rel); fs.mkdirSync(path.dirname(dst), { recursive: true }); if (!fs.existsSync(dst) || fs.statSync(src).mtimeMs > fs.statSync(dst).mtimeMs) fs.copyFileSync(src, dst); return rel.replace(/\\/g, '/'); };
function pngSize(f) { const b = fs.readFileSync(f); return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }; }

const FPS = 30, LEAD = 0.5, GAP = 0.35, TAIL = 0.8;
const PLATES = { 'quan-table': ['quan-co-ba', 'table.png'], 'quan-counter': ['quan-co-ba', 'counter.png'], 'quan-wide': ['quan-co-ba', 'wide.png'], 'hem-99': ['hem-99', 'wide.png'] };
const INSERTS = { 'V-A': 'v-a.mp4', 'V-B': 'v-b.mp4', 'V-C': 'v-c.mp4' };
const GESTURE_POSE = { hold_newspaper: 'newspaper', wave: 'wave' };
const plate = (loc) => { const [l, f] = PLATES[loc]; return copy(path.join(proj, 'assets', 'locations', l, 'v1', f), `locations/${l}/${f}`); };
const sfx = (id) => copy(path.join(proj, 'assets', 'audio', 'sfx', `${id}.mp3`), `audio/sfx/${id}.mp3`);
const music = (id) => copy(path.join(proj, 'assets', 'audio', 'music', `${id}.mp3`), `audio/music/${id}.mp3`);

// ---- characters / poses -----------------------------------------------------------------
const chars = {};
const rigFor = (c, pose) => {
  const base = path.join(proj, 'assets', 'characters', c, 'v1');
  const d = pose && fs.existsSync(path.join(base, 'poses', pose, 'rig.json')) ? path.join(base, 'poses', pose) : base;
  const key = d === base ? c : `${c}@${pose}`;
  if (chars[key]) return key;
  const rig = JSON.parse(fs.readFileSync(path.join(d, 'rig.json'), 'utf8'));
  const img = copy(path.join(d, rig.image), `characters/${key.replace('@', '/')}/${rig.image}`);
  const { width, height } = pngSize(path.join(d, rig.image));
  chars[key] = { ...rig, pose: d === base ? 'stand' : pose, img, width, height };
  return key;
};
const poseOfSlot = (slot) => (slot.includes('-') ? slot.split('-').pop() : null);

// ---- audio lines --------------------------------------------------------------------------
const audioLine = (l, start) => {
  const meta = JSON.parse(fs.readFileSync(path.join(audioDir, `${l.id}.json`), 'utf8'));
  const mouth = JSON.parse(fs.readFileSync(path.join(audioDir, `${l.id}.mouth.json`), 'utf8')).mouthCues;
  const dur = meta.alignment.character_end_times_seconds.at(-1) + 0.15;
  const audio = copy(path.join(audioDir, `${l.id}.mp3`), `episodes/${epKey}/audio/${l.id}.mp3`);
  return { id: l.id, speaker: l.speaker, lang: l.lang, start, dur, audio, mouth, text: l.text, vi: l.vi || null, highlight: l.highlight || [], gesture: l.gesture || null, emotion: l.emotion || null, role: l.role || null, phrase: l.phrase || null, q: l.q ?? null, to: l.to || null };
};
const allLines = {};
for (const s of ep.scenes) { const walk = (o) => { if (Array.isArray(o)) return o.forEach(walk); if (o && typeof o === 'object') { if (o.id && /^L\d+$/.test(o.id)) allLines[o.id] = o; Object.values(o).forEach(walk); } }; walk(s); }
for (const l of narr) allLines[l.id] = l;

// Sequential lines with gaps; returns {lines, end}
const runLines = (ls, t0 = LEAD, gap = GAP) => { const out = []; let t = t0; for (const l of ls) { const a = audioLine(l, t); out.push(a); t += a.dur + gap; } return { lines: out, end: t - gap }; };

// ---- shots --------------------------------------------------------------------------------
const shots = [];
let T = 0;
const push = (s) => { shots.push({ ...s, start: T }); T += s.dur; };

const puppet = (id, location, positions, lineDefs, opts = {}) => {
  const { lines, end } = runLines(lineDefs);
  const cast = Object.entries(positions).map(([c, slot]) => {
    const rig = rigFor(c, poseOfSlot(slot));
    // per-line pose switches from gestures (e.g. hold_newspaper → newspaper pose)
    const poses = lines.filter((l) => l.speaker === c && GESTURE_POSE[l.gesture]).map((l) => ({ from: l.start - 0.1, rig: rigFor(c, GESTURE_POSE[l.gesture]) }));
    return { id: c, slot, rig, poses };
  });
  const extra = opts.hold ?? 0;
  const sfxs = (opts.sfx || []).map((s) => { const after = lines.find((l) => l.id === s.after_line); return { src: sfx(s.id), at: after ? after.start + after.dur + (s.delay ?? 0.05) : (s.at ?? 0), volume: s.volume ?? 0.8 }; });
  let camera = null;
  if (opts.camera) { const l = lines.find((x) => x.id === opts.camera.at_line); camera = { ...opts.camera, at: l ? l.start + 0.5 : 0 }; }
  push({ id, kind: 'puppet', dur: end + TAIL + extra, bg: plate(location), location, positions, cast, lines, sfx: sfxs, camera, ambience: opts.ambience ? sfx(opts.ambience) : null });
};

const want = (s) => sceneArg === 'all' || sceneArg.split(',').includes(s.id);
for (const sc of ep.scenes.filter(want)) {
  if (sc.type === 'cold_open') {
    puppet(sc.id, sc.location, sc.positions, sc.lines, { sfx: (sc.sfx || []).map((x, i) => ({ ...x, delay: 0.1 + i * 0.7 })), camera: sc.camera, hold: 2.0 });
  } else if (sc.type === 'title') {
    const host = rigFor(sc.host.character, sc.host.pose);
    const { lines, end } = runLines(sc.lines, 1.6);
    push({ id: sc.id, kind: 'title', dur: end + 1.0, bg: plate(sc.background.location), blur: sc.background.blur, host: { rig: host, id: sc.host.character }, title: sc.title_text, badge: sc.badge, lines, sfx: [{ src: music('jingle-yolo7'), at: 0, volume: 0.7 }] });
  } else if (sc.type === 'dialogue') {
    for (const sh of sc.shots) {
      if (sh.kind === 'ai_video') {
        const src = copy(path.join(epDir, 'assets', INSERTS[sh.insert]), `episodes/${epKey}/${INSERTS[sh.insert]}`);
        const fx = (sh.sfx || []).filter((x) => x !== 'morning-street-ambience').map((x) => ({ src: sfx(x), at: x === 'iron-gate-slide' ? 0.3 : 0.6, volume: 0.8 }));
        push({ id: sh.id, kind: 'video', dur: sh.duration_sec, src, insert: sh.insert, sfx: fx, ambience: sfx('morning-street-ambience') });
      } else if (sh.kind === 'puppet') puppet(sh.id, sh.location, sh.positions, sh.lines, { ambience: 'morning-street-ambience' });
    }
  } else if (sc.type === 'learn') {
    const blocks = [];
    let t = 0.6;
    const nar = (pid) => narr.filter((l) => l.phrase === pid);
    const items = [...sc.phrases.map((p) => ({ ...p, kind: 'phrase' })), ...(sc.error_fix ? [{ id: 'ERR', kind: 'error', ...sc.error_fix }] : [])];
    for (const p of items) {
      const b = { id: p.id, kind: p.kind, start: t, items: [] };
      const ns = nar(p.id);
      const title = ns.find((l) => l.role === 'title' || l.role === 'error_title');
      const seq = [];
      if (title) seq.push(title);
      if (p.source_line && allLines[p.source_line]) seq.push(allLines[p.source_line]); // original dialogue line
      seq.push(...ns.filter((l) => l.role === 'phrase_slow'), ...ns.filter((l) => l.role === 'explain'), ...ns.filter((l) => l.role === 'example'));
      const { lines, end } = runLines(seq, 0.4, 0.45);
      const src = allLines[p.source_line];
      Object.assign(b, { dur: end + 1.0, lines, phrase: p.phrase || null, vi: src?.vi || null, explain: p.explain_vi, example: p.example || null, wrong: p.wrong || null, right: p.right || null });
      blocks.push(b);
      t += b.dur;
    }
    push({ id: sc.id, kind: 'learn', dur: t + 0.4, bg: plate(sc.background.location), blur: sc.background.blur, host: { rig: rigFor('tin'), id: 'tin' }, blocks, sfx: blocks.map((b) => ({ src: sfx('pop'), at: b.start, volume: 0.6 })), music: music('bg-cozy-ukulele') });
  } else if (sc.type === 'quiz') {
    const intro = audioLine(sc.intro_line, 0.4);
    let t = intro.start + intro.dur + 0.6;
    const qs = [];
    sc.questions.forEach((q, i) => {
      const qa = narr.filter((l) => l.role === 'quiz_q' && l.q === i)[0];
      const an = narr.filter((l) => l.role === 'quiz_a' && l.q === i)[0];
      const qLine = audioLine(qa, t);
      const cdStart = qLine.start + qLine.dur + 0.3;
      const reveal = cdStart + sc.countdown_sec;
      const aLine = audioLine(an, reveal + 0.5);
      qs.push({ ...q, start: t, qLine, cdStart, reveal, aLine, end: aLine.start + aLine.dur + 1.0 });
      t = aLine.start + aLine.dur + 1.2;
    });
    const fx = qs.flatMap((q) => [{ src: sfx('clock-tick'), at: q.cdStart, volume: 0.5 }, { src: sfx('correct-ding'), at: q.reveal, volume: 0.8 }]);
    push({ id: sc.id, kind: 'quiz', dur: t + 0.3, bg: plate('quan-wide'), blur: 16, host: { rig: rigFor('tin'), id: 'tin' }, intro, questions: qs, countdown: sc.countdown_sec, sfx: [{ src: sfx('whoosh'), at: 0, volume: 0.6 }, ...fx], music: music('bg-cozy-ukulele') });
  } else if (sc.type === 'outro') {
    const host = rigFor('tin', 'wave');
    const { lines, end } = runLines(sc.lines, 0.6, 0.6);
    const endScreen = sc.end_screen_sec || 15;
    push({ id: sc.id, kind: 'outro', dur: end + 0.8 + endScreen, endScreenAt: end + 0.8, bg: plate(sc.background.location), host: { rig: host, id: 'tin' }, cat: rigFor('muop'), teaserRig: rigFor('tony'), lines, cards: sc.card_links, sfx: [{ src: sfx('cat-meow-happy'), at: 0.3, volume: 0.7 }, { src: music('jingle-yolo7'), at: end + 0.8, volume: 0.8 }], music: music('bg-cozy-ukulele') });
  }
}

const timeline = { id: `${epKey}-${outName}`, fps: FPS, width: 1920, height: 1080, durationInFrames: Math.ceil(T * FPS), duration: T, characters: chars, shots, subtitleMode: ep.subtitle_mode || 'dual', title: ep.title };
const out = path.join(root, 'src', 'data', `${outName}.json`);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(timeline, null, 1));
console.log(out, '| duration', T.toFixed(1) + 's', `(${Math.floor(T / 60)}:${String(Math.round(T % 60)).padStart(2, '0')})`);
console.log(shots.map((s) => `${s.id}:${s.kind}:${s.dur.toFixed(1)}s`).join(' '));
