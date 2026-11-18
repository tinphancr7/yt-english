// QC lớp 1 — kiểm tra logic + dàn dựng của episode.json TRƯỚC khi tạo giọng / xuất video.
// usage: node scripts/stage-lint.mjs <episodeDir>
// In ra lỗi (error), cảnh báo (warn), việc cần tạo tài sản (todo) và ghi out/qc/<ep>-stage-lint.md.
// Thoát với mã 1 nếu có error.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintEpisode, loadRegistry } from './lib/staging.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const proj = path.join(root, '..');
const epDir = process.argv[2];
const ep = JSON.parse(fs.readFileSync(path.join(epDir, 'episode.json'), 'utf8'));
const { issues, todo } = lintEpisode(ep, loadRegistry(proj));

const icon = { error: '❌', warn: '⚠️', todo: '🧩' };
const out = [`# QC lớp 1 (dàn dựng) — ${ep.id}`, ''];
const count = (l) => issues.filter((i) => i.level === l).length;
out.push(`❌ lỗi: ${count('error')} · ⚠️ cảnh báo: ${count('warn')} · 🧩 thiếu tài sản: ${count('todo')}`, '');
for (const lvl of ['error', 'warn', 'todo']) {
  const list = issues.filter((i) => i.level === lvl);
  if (!list.length) continue;
  out.push(`## ${icon[lvl]} ${{ error: 'Lỗi (phải sửa)', warn: 'Cảnh báo (không hợp lý)', todo: 'Thiếu tài sản' }[lvl]}`, '');
  for (const i of list) out.push(`- ${i.shot}${i.line ? ' · ' + i.line : ''}: ${i.msg}`);
  out.push('');
}
if (todo.length) {
  out.push('## Danh sách tài sản cần tạo', '');
  for (const t of todo) out.push(`- [ ] ${t.asset}${t.brief ? ' — ' + t.brief : ''}`);
  out.push('');
}
const text = out.join('\n');
const dst = path.join(root, 'out', 'qc', `${ep.id}-stage-lint.md`);
fs.mkdirSync(path.dirname(dst), { recursive: true });
fs.writeFileSync(dst, text + '\n');
console.log(text);
process.exit(count('error') ? 1 : 0);
