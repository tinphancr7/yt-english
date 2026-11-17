// Tiny TTS permission probe (~5 characters). Never prints the key.
import fs from 'node:fs';
const env = Object.fromEntries(fs.readFileSync(new URL('../../.env', import.meta.url), 'utf8').split(/\r?\n/)
  .filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]));
const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb?output_format=mp3_44100_64', {
  method: 'POST',
  headers: { 'xi-api-key': env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Hi there.', model_id: 'eleven_flash_v2_5' }),
});
if (r.ok) {
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(new URL('../out-probe.mp3', import.meta.url), buf);
  console.log('text_to_speech OK, bytes', buf.length, '| char-cost header:', r.headers.get('character-cost') ?? r.headers.get('x-character-count') ?? 'n/a');
} else {
  const t = await r.text();
  console.log('text_to_speech', r.status, (() => { try { return JSON.parse(t).detail.message; } catch { return t.slice(0, 160); } })());
}
