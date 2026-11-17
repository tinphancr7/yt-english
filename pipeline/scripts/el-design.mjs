// ElevenLabs Voice Design: generate 3 previews per character (does NOT save voices / use slots).
// usage: node scripts/el-design.mjs [charKey ...]   (default: all in voices/design.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const env = Object.fromEntries(fs.readFileSync(path.join(root, '..', '.env'), 'utf8').split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const briefs = JSON.parse(fs.readFileSync(path.join(root, 'voices', 'design.json'), 'utf8'));
const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(briefs).filter((k) => !k.startsWith('_'));
for (const k of keys) {
  const b = briefs[k];
  const r = await fetch('https://api.elevenlabs.io/v1/text-to-voice/design?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ voice_description: b.description, model_id: 'eleven_ttv_v3', text: b.text }),
  });
  if (!r.ok) { console.log(k, 'HTTP', r.status, (await r.text()).slice(0, 300)); continue; }
  const j = await r.json();
  const dir = path.join(root, 'voices', k);
  fs.mkdirSync(dir, { recursive: true });
  const meta = { date: new Date().toISOString().slice(0, 10), model: 'eleven_ttv_v3', description: b.description, text: j.text || b.text, previews: [] };
  j.previews.forEach((p, i) => {
    const f = `preview-${i + 1}.mp3`;
    fs.writeFileSync(path.join(dir, f), Buffer.from(p.audio_base_64, 'base64'));
    meta.previews.push({ file: f, generated_voice_id: p.generated_voice_id, duration_secs: p.duration_secs, language: p.language });
  });
  fs.writeFileSync(path.join(dir, 'previews.json'), JSON.stringify(meta, null, 2));
  console.log(k, '->', j.previews.length, 'previews', j.previews.map((p) => `${p.duration_secs?.toFixed?.(1)}s/${p.language}`).join(' '));
}
