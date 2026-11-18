// Làm video theo từng đoạn ~1 phút: duyệt bảng ảnh tĩnh → xuất đoạn → QC → người duyệt → khóa.
// Đoạn được khai báo trong episode.json → "segments" (from/to = id shot, hoặc "S04:P1" = khối học trong shot).
//
//   node scripts/segment.mjs status  <episodeDir>         trạng thái các đoạn (chưa duyệt / đã khóa / đã thay đổi sau khi khóa)
//   node scripts/segment.mjs board   <episodeDir> <P>     QC lớp 1 + bảng ảnh tĩnh (1 ảnh mỗi câu) — chưa xuất video
//   node scripts/segment.mjs render  <episodeDir> <P>     xuất video của đoạn + QC lớp 3
//   node scripts/segment.mjs approve <episodeDir> <P>     khóa đoạn đã được người duyệt đồng ý
//
// board/render tự chạy build-timeline trước. Kết quả ở out/segments/<ep>/<P>/.
import { execFileSync, spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const [cmd, epDirArg, segId] = process.argv.slice(2);
// <episodeDir> (film: episode.json) or a companion-video config file (e.g. <bản>/reflex.json)
const argPath = path.resolve(epDirArg);
const isFile = argPath.endsWith('.json');
const epDir = isFile ? path.dirname(argPath) : argPath;
const cfgFile = isFile ? argPath : path.join(epDir, 'episode.json');
const ep = JSON.parse(fs.readFileSync(cfgFile, 'utf8'));
const isFilm = !isFile || path.basename(cfgFile) === 'episode.json';
const { timeline: tlName, composition } = ep.pipeline;
const tlPath = path.join(root, 'src', 'data', `${tlName}.json`);
const lockPath = isFilm ? path.join(epDir, 'segments.lock.json') : cfgFile.replace(/\.json$/, '.lock.json');
const lock = fs.existsSync(lockPath) ? JSON.parse(fs.readFileSync(lockPath, 'utf8')) : {};
const outRoot = path.join(root, 'out', 'segments', ep.id);
const sh = (bin, args) => { const r = spawnSync(bin, args, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' }); if (r.status) process.exit(r.status); };
const mmss = (t) => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;

function buildTimeline() {
  if (ep.pipeline.build) sh('node', [ep.pipeline.build, cfgFile, tlName]);
  else sh('node', ['scripts/build-timeline.mjs', epDir, 'all', tlName]);
  return JSON.parse(fs.readFileSync(tlPath, 'utf8'));
}

// "SH04" → shot bounds; "S04:P3" → learn block bounds (first block starts at the shot start, last ends at the shot end)
function bound(tl, ref, side) {
  const [sid, bid] = ref.split(':');
  const s = tl.shots.find((x) => x.id === sid);
  if (!s) throw new Error(`không thấy shot ${sid}`);
  if (!bid) return side === 'from' ? s.start : s.start + s.dur;
  const bs = s.blocks ?? [];
  const i = bs.findIndex((b) => b.id === bid);
  if (i < 0) throw new Error(`không thấy khối ${ref}`);
  if (side === 'from') return i === 0 ? s.start : s.start + bs[i].start;
  return i === bs.length - 1 ? s.start + s.dur : s.start + bs[i + 1].start;
}

function windowOf(tl, seg) {
  const f0 = Math.round(bound(tl, seg.from, 'from') * tl.fps), f1 = Math.round(bound(tl, seg.to, 'to') * tl.fps);
  return { f0, f1, t0: f0 / tl.fps, t1: f1 / tl.fps };
}

// Fingerprint of everything a segment shows: its slice of the timeline (relative times) + the content of every file it uses.
function fingerprint(tl, w) {
  const slice = tl.shots
    .filter((s) => s.start < w.t1 - 0.01 && s.start + s.dur > w.t0 + 0.01)
    .map((s) => {
      const { start, ...rest } = s;
      if (s.blocks) rest.blocks = s.blocks.filter((b) => s.start + b.start >= w.t0 - 0.01 && s.start + b.start < w.t1 - 0.01);
      return rest;
    });
  const h = crypto.createHash('sha1');
  const json = JSON.stringify(slice);
  h.update(json);
  const rigs = new Set(json.match(/"rig":"([^"]+)"/g)?.map((m) => m.slice(7, -1)) ?? []);
  const files = new Set(json.match(/"[^"]+\.(png|mp3|mp4|jpg|webm)"/g)?.map((m) => m.slice(1, -1)) ?? []);
  for (const r of rigs) if (tl.characters[r]) { h.update(JSON.stringify(tl.characters[r])); files.add(tl.characters[r].img); }
  for (const f of [...files].sort()) { const p = path.join(root, 'public', f); h.update(f); if (fs.existsSync(p)) h.update(fs.readFileSync(p)); }
  return h.digest('hex').slice(0, 16);
}

const segOf = (id) => { const s = ep.segments.find((x) => x.id === id); if (!s) { console.error(`Không có đoạn ${id}. Có: ${ep.segments.map((x) => x.id).join(', ')}`); process.exit(1); } return s; };
const latest = (dir, re) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => re.test(f)).sort((a, b) => parseInt(a.match(/v(\d+)/)?.[1] ?? 0) - parseInt(b.match(/v(\d+)/)?.[1] ?? 0)).pop() : null);

if (cmd === 'status') {
  const tl = JSON.parse(fs.readFileSync(tlPath, 'utf8'));
  console.log(`Đoạn của ${ep.id} (timeline ${tlName}, ${mmss(tl.duration)}):\n`);
  for (const seg of ep.segments) {
    const w = windowOf(tl, seg);
    const fp = fingerprint(tl, w);
    const l = lock[seg.id];
    const state = !l ? '⬜ chưa duyệt' : l.hash === fp ? `✅ đã khóa (${l.approved_at.slice(0, 10)})` : '⚠️ ĐÃ THAY ĐỔI sau khi khóa — cần duyệt lại';
    const vid = latest(path.join(outRoot, seg.id), /^v\d+\.mp4$/);
    console.log(`${seg.id}  ${mmss(w.t0)}–${mmss(w.t1)} (${(w.t1 - w.t0).toFixed(0)} s)  ${state}  ${seg.name}${vid ? `  · bản mới nhất ${seg.id}/${vid}` : ''}`);
  }
} else if (cmd === 'board') {
  const seg = segOf(segId);
  if (isFilm) {
    const lint = spawnSync('node', ['scripts/stage-lint.mjs', epDir], { cwd: root, encoding: 'utf8' });
    console.log(lint.stdout.split('\n').slice(0, 3).join('\n') + `\n(chi tiết: out/qc/${ep.id}-stage-lint.md)\n`);
    if (lint.status) { console.error('❌ QC lớp 1 có lỗi — sửa trước khi làm bảng ảnh.'); process.exit(1); }
  }
  const tl = buildTimeline();
  const w = windowOf(tl, seg);
  const pts = JSON.parse(execFileSync('python', ['scripts/sheet.py', 'points', tlPath, String(w.t0), String(w.t1)], { cwd: root, encoding: 'utf8' }));
  const dir = path.join(outRoot, seg.id, 'board');
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const { bundle } = await import('@remotion/bundler');
  const { renderStill, selectComposition } = await import('@remotion/renderer');
  console.log(`Bảng ảnh ${seg.id}: ${pts.length} ảnh tĩnh…`);
  const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
  const comp = await selectComposition({ serveUrl, id: composition, inputProps: {} });
  const items = [];
  for (const p of pts) {
    const img = path.join(dir, `f${String(Math.round(p.t * tl.fps)).padStart(5, '0')}.png`);
    await renderStill({ composition: comp, serveUrl, output: img, frame: Math.round(p.t * tl.fps), scale: 0.25 });
    items.push({ img, head: p.head, text: p.text });
  }
  fs.writeFileSync(path.join(dir, 'items.json'), JSON.stringify(items, null, 1));
  // versioned name: a sheet left open in an image viewer is locked on Windows and cannot be overwritten
  const prevB = latest(path.join(outRoot, seg.id), /^board-v\d+-01\.png$/);
  const bv = prevB ? parseInt(prevB.match(/v(\d+)/)[1]) + 1 : 1;
  const sheets = JSON.parse(execFileSync('python', ['scripts/sheet.py', 'make', path.join(dir, 'items.json'), path.join(outRoot, seg.id), `board-v${bv}`], { cwd: root, encoding: 'utf8' }));
  console.log(`→ ${sheets.map((s) => path.join('out', 'segments', ep.id, seg.id, s)).join(', ')}`);
} else if (cmd === 'render') {
  const seg = segOf(segId);
  const tl = buildTimeline();
  const w = windowOf(tl, seg);
  const dir = path.join(outRoot, seg.id);
  fs.mkdirSync(dir, { recursive: true });
  const prev = latest(dir, /^v\d+\.mp4$/);
  const v = prev ? parseInt(prev.match(/\d+/)[0]) + 1 : 1;
  const out = path.join(dir, `v${v}.mp4`);
  sh('npx', ['remotion', 'render', 'src/index.ts', composition, out, `--frames=${w.f0}-${w.f1 - 1}`, '--log=error']);
  sh('python', ['scripts/master-audio.py', out]); // mastered audio = what ships; QC measures this
  sh('python', ['scripts/qc-video.py', out, tlPath, path.join(dir, `v${v}-qc`), String(w.t0), String(w.t1)]);
  fs.writeFileSync(path.join(dir, `v${v}.json`), JSON.stringify({ hash: fingerprint(tl, w), window: w, rendered_at: new Date().toISOString() }, null, 1));
  console.log(`\n→ ${path.relative(root, out)}  (QC: ${path.relative(root, path.join(dir, `v${v}-qc`, 'report.md'))})`);
} else if (cmd === 'approve') {
  const seg = segOf(segId);
  const tl = JSON.parse(fs.readFileSync(tlPath, 'utf8'));
  const w = windowOf(tl, seg);
  const vid = latest(path.join(outRoot, seg.id), /^v\d+\.mp4$/);
  lock[seg.id] = { hash: fingerprint(tl, w), approved_at: new Date().toISOString(), video: vid ? `${seg.id}/${vid}` : null, window: [mmss(w.t0), mmss(w.t1)] };
  fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
  console.log(`✅ Đã khóa ${seg.id} (${seg.name}). Sửa gì làm đổi đoạn này, "status" sẽ báo cần duyệt lại.`);
} else {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(0, 9).join('\n'));
}
