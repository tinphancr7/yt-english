// Read-only ElevenLabs account check. Never prints the API key.
import fs from 'node:fs';
const env = Object.fromEntries(
  fs.readFileSync(new URL('../../.env', import.meta.url), 'utf8')
    .split(/\r?\n/).filter((l) => /^[A-Z_]+=/.test(l)).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim()]),
);
const key = env.ELEVENLABS_API_KEY;
if (!key) { console.log('NO KEY'); process.exit(1); }
const h = { 'xi-api-key': key };
const sub = await fetch('https://api.elevenlabs.io/v1/user/subscription', { headers: h });
if (!sub.ok) { console.log('subscription HTTP', sub.status, (await sub.text()).slice(0, 200)); process.exit(1); }
const s = await sub.json();
console.log({ tier: s.tier, status: s.status, character_count: s.character_count, character_limit: s.character_limit,
  next_reset: s.next_character_count_reset_unix ? new Date(s.next_character_count_reset_unix * 1000).toISOString().slice(0, 10) : null,
  can_use_instant_voice_cloning: s.can_use_instant_voice_cloning, voice_slots_used: s.voice_slots_used, voice_limit: s.voice_limit });
const models = await fetch('https://api.elevenlabs.io/v1/models', { headers: h });
if (models.ok) console.log('models:', (await models.json()).map((m) => m.model_id).join(', '));
else console.log('models HTTP', models.status);
