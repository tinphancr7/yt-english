// Generate sound effects with ElevenLabs (text → SFX). Briefs in assets/audio/sfx/sfx.json.
// usage: node scripts/el-sfx.mjs [key ...]   (skips files that already exist)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const env = Object.fromEntries(fs.readFileSync(path.join(proj, '.env'), 'utf8').split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const dir = path.join(proj, 'assets', 'audio', 'sfx');
const briefs = JSON.parse(fs.readFileSync(path.join(dir, 'sfx.json'), 'utf8'));
const keys = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(briefs).filter((k) => !k.startsWith('_'));
for (const k of keys) {
  const b = briefs[k];
  const out = path.join(dir, `${k}.mp3`);
  if (fs.existsSync(out)) { console.log(k, 'exists'); continue; }
  const r = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
    method: 'POST',
    headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: b.text, duration_seconds: b.duration, prompt_influence: b.influence ?? 0.5, loop: !!b.loop }),
  });
  if (!r.ok) { console.log(k, 'HTTP', r.status, (await r.text()).slice(0, 200)); continue; }
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  console.log(k, '->', path.relative(proj, out), `${b.duration}s`, '| cost header:', r.headers.get('character-cost') ?? 'n/a');
}
