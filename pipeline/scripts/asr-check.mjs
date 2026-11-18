// QC lớp 2 — nghe lại audio bằng ASR (ElevenLabs Scribe) và so với chữ mong đợi.
// usage: node scripts/asr-check.mjs <audioDir> <id=expected text> ...   hoặc   --reflex <reflex.json>
// Báo câu nào thiếu/thừa chữ (vd. câu cắt từ phim bị lẹm chữ cuối, TTS đọc sai).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const env = Object.fromEntries(fs.readFileSync(path.join(root, '..', '.env'), 'utf8').split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const args = process.argv.slice(2);
const dir = args[0].startsWith('--') ? args[2] : args[0];
let jobs = [];
if (args[0] === '--reflex') {
  const cfg = JSON.parse(fs.readFileSync(args[1], 'utf8'));
  for (const it of cfg.items) {
    jobs.push([it.en_audio.tts ?? `C${String(it.n).padStart(2, '0')}`, it.en, 'en']);
    jobs.push([it.vi_audio, it.vi, 'vi']);
  }
} else if (args[0] === '--lines') {
  // any config with a "lines" array of {id, lang, text} (e.g. analysis.json)
  jobs = JSON.parse(fs.readFileSync(args[1], 'utf8')).lines.map((l) => [l.id, l.text, l.lang]);
} else jobs = args.slice(1).map((a) => { const [id, ...t] = a.split('='); const x = t.join('='); return [id, x, /[à-ỹđ]/i.test(x) ? 'vi' : 'en']; });

const norm = (s) => s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N} ]/gu, '').replace(/\s+/g, ' ').trim();
let bad = 0;
for (const [id, expected, lang] of jobs) {
  const fd = new FormData();
  fd.append('model_id', 'scribe_v1');
  fd.append('language_code', lang === 'vi' ? 'vie' : 'eng');
  fd.append('file', new Blob([fs.readFileSync(path.join(dir, `${id}.mp3`))]), `${id}.mp3`);
  const r = await fetch('https://api.elevenlabs.io/v1/speech-to-text', { method: 'POST', headers: { 'xi-api-key': env.ELEVENLABS_API_KEY }, body: fd });
  if (!r.ok) { console.log(id, 'HTTP', r.status, (await r.text()).slice(0, 160)); process.exit(2); }
  const got = (await r.json()).text ?? '';
  const ok = norm(got) === norm(expected);
  if (!ok) bad++;
  console.log(`${ok ? '✅' : '⚠️'} ${id}: "${got.trim()}"${ok ? '' : `  (mong đợi "${expected}")`}`);
}
console.log(`\n${jobs.length - bad}/${jobs.length} khớp`);
