// Generate per-line TTS (with character timestamps) for an episode.json.
// usage: node scripts/tts-episode.mjs <episode.json> <outDir> [lineId ...]
// Cache: skips a line when <id>.mp3 exists and <id>.json has the same text+voice+model hash.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const env = Object.fromEntries(fs.readFileSync(path.join(proj, '.env'), 'utf8').split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const [epFile, outDir, ...only] = process.argv.slice(2);
const ep = JSON.parse(fs.readFileSync(epFile, 'utf8'));
const lines = [];
const walk = (o) => { if (Array.isArray(o)) return o.forEach(walk); if (o && typeof o === 'object') { if (o.id && /^[LNRA]\d+$/.test(o.id)) lines.push(o); Object.values(o).forEach(walk); } };
walk(ep);
fs.mkdirSync(outDir, { recursive: true });
const voiceOf = (speaker, lang) => {
  const v = JSON.parse(fs.readFileSync(path.join(proj, 'assets', 'characters', speaker, 'v1', 'voice.json'), 'utf8'));
  return v[lang] || v.en || v.vi; // e.g. Jake's Vietnamese line uses his English voice
};
const MODELS = ['eleven_v3', 'eleven_flash_v2_5'];
let spent = 0;
for (const l of lines) {
  if (only.length && !only.includes(l.id)) continue;
  const v = voiceOf(l.speaker, l.lang);
  const tags = (l.audio_tags || []).map((t) => `[${t}]`).join(' ');
  const text = (tags ? tags + ' ' : '') + l.text;
  const hash = crypto.createHash('sha1').update(JSON.stringify([text, v.voice_id, l.lang, l.model ?? null, l.speed ?? null])).digest('hex').slice(0, 12);
  const mp3 = path.join(outDir, `${l.id}.mp3`), meta = path.join(outDir, `${l.id}.json`);
  if (fs.existsSync(mp3) && fs.existsSync(meta) && JSON.parse(fs.readFileSync(meta, 'utf8')).hash === hash) { console.log(l.id, 'cached'); continue; }
  let ok = false;
  // per-line override: short Vietnamese prompts are steadier on multilingual v2 + speed (v3 + [slowly] tags added coughs — Sổ lỗi #35)
  for (const model of l.model ? [l.model] : MODELS) {
    const body = { text: model === 'eleven_v3' ? text : l.text, model_id: model, voice_settings: { ...(v.settings ?? {}), ...(l.speed ? { speed: l.speed } : {}) }, language_code: l.lang };
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.voice_id}/with-timestamps?output_format=mp3_44100_128`, {
      method: 'POST', headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    });
    if (!r.ok) { console.log(l.id, model, 'HTTP', r.status, (await r.text()).slice(0, 200)); continue; }
    const j = await r.json();
    fs.writeFileSync(mp3, Buffer.from(j.audio_base64, 'base64'));
    const al = j.normalized_alignment || j.alignment;
    fs.writeFileSync(meta, JSON.stringify({ id: l.id, speaker: l.speaker, lang: l.lang, text: l.text, sent_text: body.text, model, voice_id: v.voice_id, hash, alignment: al }, null, 1));
    spent += body.text.length;
    const dur = al ? al.character_end_times_seconds.at(-1) : null;
    console.log(l.id, l.speaker, l.lang, model, dur ? dur.toFixed(2) + 's' : '', '|', l.text.slice(0, 50));
    ok = true; break;
  }
  if (!ok) console.log(l.id, 'FAILED');
}
console.log('characters sent ~', spent);
