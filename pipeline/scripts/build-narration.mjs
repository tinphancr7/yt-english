// Build narration lines (N01…) for the Learn (PhraseCard) and Quiz scenes from episode.json.
// Output: <episodeDir>/narration.json — same line format as episode lines so tts-episode/lipsync can process it.
// usage: node scripts/build-narration.mjs <episodeDir>
import fs from 'node:fs';
import path from 'node:path';
const epDir = process.argv[2];
const ep = JSON.parse(fs.readFileSync(path.join(epDir, 'episode.json'), 'utf8'));
const learn = ep.scenes.find((s) => s.type === 'learn');
const quiz = ep.scenes.find((s) => s.type === 'quiz');
const lines = [];
let n = 0;
const add = (lang, text, extra = {}) => { const id = `N${String(++n).padStart(2, '0')}`; lines.push({ id, speaker: 'tin', lang, text, ...extra }); return id; };
const ord = ['một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'];

learn.phrases.forEach((p, i) => {
  const parts = p.phrase.split(' — ');
  add('vi', `Mẫu câu số ${ord[i]}.`, { role: 'title', phrase: p.id });
  add('en', parts.join(' ... '), { role: 'phrase_slow', phrase: p.id, audio_tags: ['slowly', 'clearly'] });
  add('vi', p.explain_vi, { role: 'explain', phrase: p.id });
  if (p.example) add('en', p.example, { role: 'example', phrase: p.id, audio_tags: ['clearly'] });
});
if (learn.error_fix) {
  const e = learn.error_fix;
  add('vi', `Lỗi hay gặp! Anh Tony nói: many beef.`, { role: 'error_title', phrase: 'ERR' });
  add('vi', e.explain_vi, { role: 'explain', phrase: 'ERR' });
  add('en', `${e.right.charAt(0).toUpperCase()}${e.right.slice(1)}`.replace(/([^.!?])$/, '$1.'), { role: 'phrase_slow', phrase: 'ERR', audio_tags: ['slowly', 'clearly'] });
  if (e.example) add('en', e.example, { role: 'example', phrase: 'ERR', audio_tags: ['clearly'] });
}
quiz.questions.forEach((q, i) => {
  const qq = q.q.replace(/"[^"]+"/, 'Câu tiếng Anh này').replace(/nghĩa là:$/, 'nghĩa là gì?').replace(/:$/, ' thế nào?');
  add('vi', `Câu ${ord[i]}. ${qq}`, { role: 'quiz_q', q: i });
  const right = q.options[q.answer];
  const isEn = /^[\x00-\x7F]+$/.test(right);
  add(isEn ? 'en' : 'vi', isEn ? `${right}!` : `Đáp án: ${right}`, { role: 'quiz_a', q: i });
});
const out = { id: `${ep.id}-narration`, scenes: [{ id: 'N', lines }] };
fs.writeFileSync(path.join(epDir, 'narration.json'), JSON.stringify(out, null, 1));
console.log(lines.length, 'narration lines,', lines.reduce((a, l) => a + l.text.length, 0), 'chars');
for (const l of lines) console.log(l.id, l.lang, l.role, '|', l.text);
