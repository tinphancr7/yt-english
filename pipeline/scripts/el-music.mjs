// Generate background music with ElevenLabs Music. usage: node scripts/el-music.mjs <name> <seconds> "<prompt>"
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const env = Object.fromEntries(fs.readFileSync(path.join(proj, '.env'), 'utf8').split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const [name, secs, prompt] = process.argv.slice(2);
const out = path.join(proj, 'assets', 'audio', 'music', `${name}.mp3`);
const r = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', {
  method: 'POST',
  headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, music_length_ms: Number(secs) * 1000, force_instrumental: true }),
});
if (!r.ok) { console.log('HTTP', r.status, (await r.text()).slice(0, 300)); process.exit(1); }
fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
const meta = path.join(proj, 'assets', 'audio', 'music', 'music.json');
const m = fs.existsSync(meta) ? JSON.parse(fs.readFileSync(meta, 'utf8')) : {};
m[name] = { file: `${name}.mp3`, seconds: Number(secs), prompt, source: 'ElevenLabs Music API (force_instrumental)', date: new Date().toISOString().slice(0, 10) };
fs.writeFileSync(meta, JSON.stringify(m, null, 2) + '\n');
console.log(name, '->', path.relative(proj, out), '| cost header:', r.headers.get('character-cost') ?? 'n/a');
