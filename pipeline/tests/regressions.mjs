// Kiểm tra tái hiện lỗi (regression) — mỗi lỗi trong Sổ lỗi (docs/13-quy-trinh-qc.md) có một ca ở đây.
// Ca = dựng lại ĐÚNG tình huống sai cũ trên bản sao của A1 → bộ kiểm tra PHẢI báo. Nếu không báo nghĩa là
// lớp bảo vệ đã hỏng (do sửa code / dữ liệu) → sửa trước khi làm tiếp.
//   npm run check        (chạy trước mỗi tập mới và sau mỗi lần sửa pipeline)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lintEpisode, loadRegistry, needsByLine, resolvePose } from '../scripts/lib/staging.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const EP = path.join(root, 'video-mau/chu-de-an-uong/th01-goi-pho-quan-co-ba/A1/episode.json');
const reg = loadRegistry(root);
const fresh = () => JSON.parse(fs.readFileSync(EP, 'utf8'));
const shot = (ep, id) => ep.scenes.flatMap((s) => (s.type === 'dialogue' ? s.shots : [{ ...s, kind: 'puppet' }])).find((s) => s.id === id);
const lint = (ep) => lintEpisode(ep, reg).issues;
const has = (issues, level, re) => issues.some((i) => i.level === level && re.test(i.msg));

const cases = [
  ['A1 hiện tại sạch: 0 lỗi, 0 cảnh báo, 0 thiếu tài sản', () => {
    const iss = lint(fresh());
    assert.equal(iss.length, 0, iss.map((i) => `${i.shot} ${i.msg}`).join('\n'));
  }],
  ['#10 Jake đang ngồi không được tự đứng dậy khi làm cử chỉ chưa có dáng', () => {
    const r = resolvePose(reg, 'jake', { posture: 'seated', gesture: 'thumbs_up', holds: [] });
    const p = reg.poses.jake.find((x) => x.pose === r.pose);
    assert.equal(p.posture, 'seated');
    assert.ok(!r.exact);
  }],
  ['#11 thẻ mẫu câu thiếu bản dịch riêng → cảnh báo', () => {
    const ep = fresh(); delete ep.scenes.find((s) => s.id === 'S04').phrases[3].vi;
    assert.ok(has(lint(ep), 'warn', /thiếu bản dịch riêng/));
  }],
  ['#24 mẫu câu hỏi–đáp mà chỉ phát lại câu hỏi → cảnh báo', () => {
    const ep = fresh(); delete ep.scenes.find((s) => s.id === 'S04').phrases[0].source_lines;
    assert.ok(has(lint(ep), 'warn', /cặp hỏi–đáp/));
  }],
  ['#30 câu phát lại từ phim không có trên thẻ → cảnh báo', () => {
    const ep = fresh(); ep.scenes.find((s) => s.id === 'S04').phrases[2].phrase = 'No onions, please.';
    assert.ok(has(lint(ep), 'warn', /không có trên thẻ/));
  }],
  ['#29 đọc chậm cặp hỏi–đáp: có mốc thời gian từng nửa để tô lần lượt (không tô cả hai cùng lúc)', () => {
    const tl = JSON.parse(fs.readFileSync(path.join(root, 'pipeline/src/data/a1-full.json'), 'utf8'));
    const blocks = tl.shots.find((s) => s.kind === 'learn').blocks.filter((b) => (b.phrase ?? '').includes(' — '));
    assert.ok(blocks.length >= 3);
    for (const b of blocks) {
      const slow = b.lines.find((l) => l.role === 'phrase_slow');
      assert.ok(slow?.parts?.length === 2 && slow.parts.every((x) => x != null) && slow.parts[1] > slow.parts[0], `${b.id}: thiếu mốc từng nửa`);
    }
  }],
  ['#12 nhân vật nói trước khi vào cảnh → lỗi', () => {
    const ep = fresh(); shot(ep, 'SH06').enter = { tony: 'L21' };
    assert.ok(has(lint(ep), 'error', /chưa vào/));
  }],
  ['#14 Tín đứng giữa, chắn bàn và khách → cảnh báo', () => {
    const ep = fresh(); shot(ep, 'SH06').positions.tin = 'center';
    assert.ok(has(lint(ep), 'warn', /chắn vùng/));
  }],
  ['#15 mang phở ra mà ảnh nền không có phở → thiếu tài sản', () => {
    const ep = fresh(); delete shot(ep, 'SH06').plate;
    assert.ok(has(lint(ep), 'todo', /pho-bowl/));
  }],
  ['#15 cảnh chèn cho thấy món mà cảnh sau không có → cảnh báo liên tục', () => {
    const ep = fresh(); const s = shot(ep, 'SH06'); delete s.plate; s.props = s.props.filter((p) => !p.on);
    assert.ok(has(lint(ep), 'warn', /liên tục/));
  }],
  ['#16 cử chỉ thoáng qua (vẫy) hết khi hết câu', () => {
    const s = shot(fresh(), 'SH08');
    const n = needsByLine(s, 'tin', reg, reg.plates['quan-counter']);
    assert.equal(n.find((x) => x.line === 'L25').gesture, 'wave');
    assert.equal(n.find((x) => x.line === 'L26').gesture, null);
  }],
  ['#18 người đứng trước nói với khách ngồi phía sau → xoay nghiêng, nhìn ngang', () => {
    const s = shot(fresh(), 'SH06');
    const n = needsByLine(s, 'tin', reg, reg.plates['quan-table-served']).find((x) => x.line === 'L15');
    assert.equal(n.facing, 'profile');
    assert.equal(n.look, 'level');
  }],
  ['#18 người ngồi phía sau giữ 3/4 (không xoay)', () => {
    const s = shot(fresh(), 'SH06');
    const n = needsByLine(s, 'jake', reg, reg.plates['quan-table-served']).find((x) => x.line === 'L16');
    assert.equal(n.facing, '3q');
  }],
  ['#21 hai người nói chuyện cách nhau quá nửa khung → cảnh báo', () => {
    const ep = fresh(); shot(ep, 'SH04').positions.tin = 'right';
    assert.ok(has(lint(ep), 'warn', /cách nhau/));
  }],
  ['#21 (S01) Jake đứng xa Cô Ba ở quầy → cảnh báo', () => {
    const ep = fresh(); ep.scenes.find((s) => s.id === 'S01').positions.jake = 'left';
    assert.ok(has(lint(ep), 'warn', /cách nhau/));
  }],
  ['#23 đưa tiền mà tay người nhận lệch → cảnh báo', () => {
    const ep = fresh(); shot(ep, 'SH08').positions = { jake: 'left', tin: 'center', 'co-ba': 'right' };
    assert.ok(has(lint(ep), 'warn', /không khớp/));
  }],
  ['#13 cử chỉ trong kịch bản chưa có ảnh dáng → thiếu tài sản', () => {
    const ep = fresh(); shot(ep, 'SH06').lines.find((l) => l.id === 'L20').gesture = 'facepalm';
    assert.ok(has(lint(ep), 'todo', /facepalm/));
  }],
];

let fail = 0;
for (const [name, fn] of cases) {
  try { fn(); console.log(`✅ ${name}`); } catch (e) { fail++; console.log(`❌ ${name}\n   ${e.message.split('\n').join('\n   ')}`); }
}
console.log(`\n${cases.length - fail}/${cases.length} ca đạt`);
process.exit(fail ? 1 : 0);
