// Probe which ElevenLabs permissions the key has (read-only calls only). Never prints the key.
import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync(new URL('../../.env', import.meta.url), 'utf8').split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const h = { 'xi-api-key': env.ELEVENLABS_API_KEY };
const probes = [
  ['models_read', 'https://api.elevenlabs.io/v1/models'],
  ['voices_read', 'https://api.elevenlabs.io/v2/voices?page_size=1'],
  ['user_read', 'https://api.elevenlabs.io/v1/user'],
];
for (const [name, url] of probes) {
  const r = await fetch(url, { headers: h });
  const t = await r.text();
  console.log(name.padEnd(12), r.status, r.ok ? 'OK' : (JSON.parse(t)?.detail?.message || t).slice(0, 120));
}
