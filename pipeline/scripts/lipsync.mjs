// Run Rhubarb on every <id>.mp3 in an audio dir -> <id>.mouth.json (mouth cues A-H, X).
// English lines: pocketSphinx + dialog text; Vietnamese lines: phonetic recognizer.
// usage: node scripts/lipsync.mjs <audioDir>
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('..', import.meta.url));
const rhubarb = path.join(root, 'tools', 'Rhubarb-Lip-Sync-1.14.0-Windows', 'rhubarb.exe');
const dir = process.argv[2];
for (const f of fs.readdirSync(dir).filter((x) => /^[LNA]\d+\.json$/.test(x))) {
  const meta = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  const id = meta.id, mp3 = path.join(dir, `${id}.mp3`), wav = path.join(dir, `${id}.wav`), out = path.join(dir, `${id}.mouth.json`);
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs > fs.statSync(mp3).mtimeMs) { console.log(id, 'cached'); continue; }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', mp3, '-ac', '1', '-ar', '16000', wav]);
  const args = ['-f', 'json', '-o', out, '--extendedShapes', 'GHX'];
  if (meta.lang === 'en') {
    const dlg = path.join(dir, `${id}.txt`);
    fs.writeFileSync(dlg, meta.text.replace(/["“”]/g, ''));
    args.push('-r', 'pocketSphinx', '-d', dlg);
  } else args.push('-r', 'phonetic');
  args.push(wav);
  execFileSync(rhubarb, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  fs.rmSync(wav);
  const cues = JSON.parse(fs.readFileSync(out, 'utf8')).mouthCues;
  console.log(id, meta.lang, cues.length, 'cues', cues.slice(0, 8).map((c) => c.value).join(''));
}
