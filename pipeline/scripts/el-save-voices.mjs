// Save chosen Voice Design previews as permanent voices and write assets/characters/<c>/v1/voice.json.
// usage: node scripts/el-save-voices.mjs tin-en=2 tin-vi=1 jake=3 co-ba=2 tony=1
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const env = Object.fromEntries(fs.readFileSync(path.join(proj, '.env'), 'utf8').split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const names = { 'tin-en': 'YOLO7 Tín (EN)', 'tin-vi': 'YOLO7 Tín (VI)', jake: 'YOLO7 Jake', 'co-ba': 'YOLO7 Cô Ba', tony: 'YOLO7 Tony' };
const charDir = { 'tin-en': ['tin', 'en'], 'tin-vi': ['tin', 'vi'], jake: ['jake', 'en'], 'co-ba': ['co-ba', 'vi'], tony: ['tony', 'en'] };
for (const arg of process.argv.slice(2)) {
  const [k, n] = arg.split('=');
  const meta = JSON.parse(fs.readFileSync(path.join(root, 'voices', k, 'previews.json'), 'utf8'));
  const pick = meta.previews[Number(n) - 1];
  const r = await fetch('https://api.elevenlabs.io/v1/text-to-voice', {
    method: 'POST',
    headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ voice_name: names[k], voice_description: meta.description, generated_voice_id: pick.generated_voice_id }),
  });
  if (!r.ok) { console.log(k, 'HTTP', r.status, (await r.text()).slice(0, 300)); continue; }
  const v = await r.json();
  const [c, lang] = charDir[k];
  const dir = path.join(proj, 'assets', 'characters', c, 'v1');
  const vf = path.join(dir, 'voice.json');
  const cur = fs.existsSync(vf) ? JSON.parse(fs.readFileSync(vf, 'utf8')) : { character: c };
  const sample = `voice-sample-${lang}.mp3`;
  fs.copyFileSync(path.join(root, 'voices', k, pick.file), path.join(dir, sample));
  cur[lang] = {
    voice_id: v.voice_id, name: names[k], created: new Date().toISOString().slice(0, 10),
    source: `Voice Design (${meta.model}), preview ${n}`, description: meta.description,
    tts_model: 'eleven_v3', settings: { stability: 0.5, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true },
    sample_file: sample, sample_text: meta.text,
  };
  fs.writeFileSync(vf, JSON.stringify(cur, null, 2) + '\n');
  console.log(k, '-> saved', v.voice_id.slice(0, 6) + '…', '->', path.relative(proj, vf));
}
