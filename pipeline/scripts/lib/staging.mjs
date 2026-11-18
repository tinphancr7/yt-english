// Dàn dựng dùng chung cho build-timeline.mjs (dựng) và stage-lint.mjs (kiểm tra lớp 1).
// Nguồn dữ liệu:
//   assets/locations/<loc>/v1/staging.json   ảnh nền chứa gì, vùng cấm đứng, chỗ ngồi
//   assets/characters/<c>/v1[/poses/<p>]/rig.json → "staging": { posture, gestures, holds }
//   pipeline/src/slots.json                  vị trí ngang của slot
//   episode.json (shot puppet): positions, props [{id, holder|on, from?, until?}], enter/exit {char: lineId}, plate?
//   episode.json (shot ai_video): shows [...]  → cảnh puppet ngay sau phải có những thứ đó (liên tục)
import fs from 'node:fs';
import path from 'node:path';

const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

export function loadRegistry(proj) {
  const plates = {};
  const locRoot = path.join(proj, 'assets', 'locations');
  for (const loc of fs.readdirSync(locRoot)) {
    const f = path.join(locRoot, loc, 'v1', 'staging.json');
    if (!fs.existsSync(f)) continue;
    for (const [id, p] of Object.entries(readJson(f).plates)) {
      const file = path.join(locRoot, loc, 'v1', p.file);
      plates[id] = { ...p, id, loc, path: file, exists: fs.existsSync(file) };
    }
  }
  const poses = {};
  const chRoot = path.join(proj, 'assets', 'characters');
  for (const c of fs.readdirSync(chRoot)) {
    const base = path.join(chRoot, c, 'v1');
    if (!fs.existsSync(path.join(base, 'rig.json'))) continue;
    const list = [];
    const add = (dir, pose) => {
      const r = readJson(path.join(dir, 'rig.json'));
      const s = r.staging ?? { posture: 'stand', gestures: [], holds: [] };
      const img = fs.readFileSync(path.join(dir, r.image ?? 'hero-nomouth.png')).subarray(16, 24);
      const eyeCy = r.eyes?.length ? r.eyes.reduce((a, e) => a + e.cy, 0) / r.eyes.length : null;
      list.push({ pose, posture: s.posture, gestures: s.gestures ?? [], holds: s.holds ?? [], look: s.look ?? 'level', facing: s.facing ?? '3q',
        imgH: img.readUInt32BE(4), eyeCy, heightRel: r.height_rel ?? 1, anchorX: r.anchor_x ?? img.readUInt32BE(0) / 2, hand: s.hand ?? null });
    };
    add(base, null);
    const pd = path.join(base, 'poses');
    if (fs.existsSync(pd)) for (const p of fs.readdirSync(pd)) if (fs.existsSync(path.join(pd, p, 'rig.json'))) add(path.join(pd, p), p);
    poses[c] = list;
  }
  const slots = readJson(path.join(proj, 'pipeline', 'src', 'slots.json'));
  return { plates, poses, slots };
}

export const postureOfSlot = (slot) => (slot.endsWith('-seated') ? 'seated' : 'stand');

// Best pose for a need {posture, gesture, holds}. Posture must match; then most gestures/holds covered.
export function resolvePose(reg, c, need) {
  const cands = (reg.poses[c] ?? []).filter((p) => p.posture === need.posture);
  const missing = [];
  if (!cands.length) return { pose: null, missing: [`dáng ${need.posture}`], exact: false };
  const look = need.look ?? 'level', facing = need.facing ?? '3q';
  const score = (p) => (need.gesture && p.gestures.includes(need.gesture) ? 10 : 0) + need.holds.filter((h) => p.holds.includes(h)).length * 3 + (p.look === look ? 4 : 0) + (p.facing === facing ? 5 : 0) - (p.pose ? 0.1 : 0);
  const best = [...cands].sort((a, b) => score(b) - score(a))[0];
  if (best.facing !== facing) missing.push(facing === 'profile' ? 'xoay người về phía người nghe (nhìn nghiêng)' : 'quay 3/4');
  if (best.look !== look) missing.push(look === 'down' ? 'cúi nhìn xuống' : look === 'up' ? 'ngước lên' : 'nhìn ngang');
  if (need.gesture && !best.gestures.includes(need.gesture)) missing.push(`cử chỉ "${need.gesture}"`);
  for (const h of need.holds) if (!best.holds.includes(h)) missing.push(`cầm "${h}"`);
  return { pose: best.pose, missing, exact: !missing.length };
}

const idx = (lines, id) => lines.findIndex((l) => l.id === id);
const activeAt = (lines, i, from, until) => (from ? i >= idx(lines, from) : true) && (until ? i < idx(lines, until) : true);

// Per-character need at each line of a puppet shot.
// A passing gesture (wave, point, thumbs_up…) lasts only for its own line; a holding gesture ("hold_*", e.g. the
// newspaper) stays until that character's next line. (A1 SH08: Tín kept waving through Cô Ba's line.)
// Eye line: who c looks at during line i (same rule as the renderer's lookAt): the speaker; when c speaks,
// line.to, else the person c answers, else the next one to reply.
// Measured on the FRAME, not guessed from posture (A1 SH06: a 20° look-down read as staring at the floor, because the
// seated customer sits further back and his eyes are level with the waiter's on screen):
//   look   = down/up only if the eye line tilts > 15° on screen
//   facing = profile (turn the body towards the listener) when the listener is further BACK (Δdepth ≥ 0.15),
//            e.g. a foreground waiter talking to a customer seated further back.
const LOOK_DEG = 20, DEPTH_TURN = 0.15, MAX_TALK_GAP = 0.5;

// Where a character sits in the frame (same maths as Episode.tsx place()): eye x/y and depth (1 = standing foreground).
export function geometry(reg, c, posture, slot, plate) {
  const base = resolvePose(reg, c, { posture, gesture: null, holds: [], look: 'level', facing: '3q' }).pose;
  const p = (reg.poses[c] ?? []).find((x) => x.pose === base) ?? { imgH: 1, eyeCy: 0.12, heightRel: 1 };
  const S = reg.slots, H = 1080;
  if (posture === 'seated' && plate?.seat) {
    const s = plate.seat;
    return { x: s.x, eyeY: s.bottom - s.height + (p.eyeCy / p.imgH) * s.height, depth: s.depth ?? 1 };
  }
  const h = S.stand_height * p.heightRel, top = H - S.stand_top_frac * h;
  return { x: S[slot] * 1920, eyeY: top + (p.eyeCy / p.imgH) * h, depth: 1 };
}
export const presentAt = (shot, c, i) => activeAt(shot.lines, i, shot.enter?.[c], shot.exit?.[c]);

export function targetAt(shot, c, i) {
  const lines = shot.lines, cast = Object.keys(shot.positions);
  const ok = (s) => (s && s !== c && cast.includes(s) && presentAt(shot, s, i) ? s : null);
  const l = lines[i];
  if (l.speaker !== c) return ok(l.speaker);
  for (const k of [...Array(i).keys()].reverse()) if (ok(lines[k].speaker)) return ok(l.to) ?? lines[k].speaker;
  for (let k = i + 1; k < lines.length; k++) if (ok(lines[k].speaker)) return ok(l.to) ?? lines[k].speaker;
  return ok(l.to);
}

export function needsByLine(shot, c, reg, plate) {
  const lines = shot.lines;
  const posture = postureOfSlot(shot.positions[c]);
  const geo = (who) => geometry(reg, who, postureOfSlot(shot.positions[who]), shot.positions[who], plate);
  const me = geo(c);
  let gesture = null;
  return lines.map((l, i) => {
    if (l.speaker === c) gesture = l.gesture ?? null;
    else if (gesture && !gesture.startsWith('hold_')) gesture = null;
    // listener reaction for this line only, e.g. L24 { "react": { "tin": "receive" } } (Tín reaches out for the money)
    const gNow = l.speaker !== c && l.react?.[c] ? l.react[c] : gesture;
    const holds = (shot.props ?? []).filter((p) => p.holder === c && activeAt(lines, i, p.from, p.until)).map((p) => p.id);
    if (!presentAt(shot, c, i)) return { line: l.id, posture, gesture: null, holds: [], look: 'level', absent: true };
    const gesture_ = gNow;
    const t = targetAt(shot, c, i);
    let look = 'level', facing = '3q';
    if (t) {
      const o = geo(t);
      const deg = (Math.atan2(o.eyeY - me.eyeY, Math.max(1, Math.abs(o.x - me.x))) * 180) / Math.PI;
      look = deg > LOOK_DEG ? 'down' : deg < -LOOK_DEG ? 'up' : 'level';
      facing = me.depth - o.depth >= DEPTH_TURN ? 'profile' : '3q'; // only the one in FRONT turns; the one behind already faces the camera side
    }
    return { line: l.id, posture, gesture: gesture_, holds, look, facing, target: t };
  });
}

export const plateIdOf = (shot) => shot.plate ?? shot.location;

// ---------- lớp 1: kiểm tra một tập ----------
export function lintEpisode(ep, reg) {
  const issues = []; // {level: 'error'|'warn'|'todo', shot, line?, msg}
  const todo = new Map(); // asset to create → brief
  const push = (level, shot, msg, line) => issues.push({ level, shot, line, msg });
  const shots = [];
  for (const sc of ep.scenes) {
    if (sc.type === 'cold_open') shots.push({ ...sc, kind: 'puppet', id: sc.id });
    if (sc.type === 'dialogue') shots.push(...sc.shots);
    if (sc.type === 'learn')
      for (const p of sc.phrases ?? []) {
        if (p.phrase && !p.vi) push('warn', sc.id, `${p.id}: thiếu bản dịch riêng "vi" cho mẫu câu`);
        // a question–answer pair ("A — B") must replay BOTH film lines, not only the question
        const n = (p.source_lines ?? (p.source_line ? [p.source_line] : [])).length;
        // every replayed film line must match a half shown on the card (A1 P3: audio "Onions?" vs card "No onions, please.")
        const nm = (x) => x.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
        const halves = (p.phrase ?? '').split(' — ').map((h) => nm(h));
        const lineText = Object.fromEntries(ep.scenes.flatMap((s) => [...(s.lines ?? []), ...(s.shots ?? []).flatMap((x) => x.lines ?? [])]).map((l) => [l.id, l.text]));
        for (const id of p.source_lines ?? (p.source_line ? [p.source_line] : []))
          if (lineText[id] && !halves.some((h) => nm(lineText[id]).includes(h))) push('warn', sc.id, `${p.id}: câu gốc ${id} "${lineText[id]}" phát ra nhưng không có trên thẻ "${p.phrase}" → thêm vào thẻ dạng "hỏi — đáp" hoặc bỏ khỏi source_lines`);
        if (p.phrase?.includes(' — ') && n < 2) push('warn', sc.id, `${p.id}: mẫu câu là cặp hỏi–đáp nhưng chỉ phát lại ${n} câu gốc → ghi "source_lines" đủ 2 câu`);
      }
  }
  for (let k = 0; k < shots.length; k++) {
    const sh = shots[k];
    if (sh.kind !== 'puppet') continue;
    const plateId = plateIdOf(sh);
    const plate = reg.plates[plateId];
    if (!plate) push('error', sh.id, `ảnh nền "${plateId}" chưa khai báo trong staging.json`);
    else if (!plate.exists) {
      push('todo', sh.id, `ảnh nền "${plateId}" chưa có file (${plate.file})`);
      todo.set(`nền ${plateId}`, plate.brief ?? '');
    }
    const cast = Object.keys(sh.positions);
    const enter = sh.enter ?? {}, exit = sh.exit ?? {};
    // ai nói phải có mặt
    sh.lines.forEach((l, i) => {
      if (!cast.includes(l.speaker)) push('error', sh.id, `${l.speaker} nói nhưng không có trong cảnh`, l.id);
      else if (!activeAt(sh.lines, i, enter[l.speaker], exit[l.speaker])) push('error', sh.id, `${l.speaker} nói khi chưa vào / đã ra khỏi cảnh`, l.id);
    });
    // vị trí đứng
    for (const c of cast) {
      const slot = sh.positions[c];
      if (reg.slots[slot] === undefined) { push('error', sh.id, `${c}: slot "${slot}" không có trong slots.json`); continue; }
      if (postureOfSlot(slot) === 'seated') {
        if (plate && !plate.seat) push('error', sh.id, `${c} ngồi nhưng ảnh nền "${plateId}" không có chỗ ngồi`);
        continue;
      }
      const x = reg.slots[slot], hw = reg.slots.body_half_width;
      for (const [a, b] of plate?.no_stand ?? [])
        if (x + hw > a && x - hw < b) push('warn', sh.id, `${c} đứng ở "${slot}" (x=${x}) chắn vùng ${a}–${b} của "${plateId}" (bàn/khách) → đổi slot`);
    }
    // hai người đứng quá sát nhau
    const standing = cast.filter((c) => postureOfSlot(sh.positions[c]) === 'stand').map((c) => [c, reg.slots[sh.positions[c]]]).sort((a, b) => a[1] - b[1]);
    for (let i = 1; i < standing.length; i++)
      if (standing[i][1] - standing[i - 1][1] < 2 * reg.slots.body_half_width - 0.02) /* vai chạm nhẹ khi đứng cạnh nhau là tự nhiên */ push('warn', sh.id, `${standing[i - 1][0]} và ${standing[i][0]} đứng chồng lên nhau`);
    // khoảng cách giao tiếp: hai người đang nói với nhau không được cách nhau quá nửa khung hình
    const pairs = new Set();
    sh.lines.forEach((l, i) => { const t = targetAt(sh, l.speaker, i); if (t) pairs.add([l.speaker, t].sort().join('|')); });
    for (const pr of pairs) {
      const [a1, b1] = pr.split('|');
      const ga = geometry(reg, a1, postureOfSlot(sh.positions[a1]), sh.positions[a1], plate), gb = geometry(reg, b1, postureOfSlot(sh.positions[b1]), sh.positions[b1], plate);
      const d = Math.abs(ga.x - gb.x) / 1920;
      if (d > MAX_TALK_GAP) push('warn', sh.id, `${a1} và ${b1} nói chuyện mà cách nhau ${(d * 100).toFixed(0)}% khung hình (> ${MAX_TALK_GAP * 100}%) → đứng gần lại`);
    }
    // đưa – nhận: tay người đưa (gesture hand_over) phải gặp lòng bàn tay người nhận (react receive) trên khung hình
    sh.lines.forEach((l, i) => {
      for (const [rc, g] of Object.entries(l.react ?? {})) {
        if (g !== 'receive' || l.gesture !== 'hand_over') continue;
        const gp = (reg.poses[l.speaker] ?? []).find((p) => p.gestures.includes('hand_over') && p.hand);
        const rp = (reg.poses[rc] ?? []).find((p) => p.gestures.includes('receive') && p.hand);
        if (!gp || !rp) continue;
        const S = reg.slots, X = (who) => S[sh.positions[who]] * 1920;
        const pt = (p, who, other) => { const sc = (S.stand_height * p.heightRel) / p.imgH, dir = X(other) < X(who) ? -1 : 1;
          return [X(who) + dir * (p.hand[0] - p.anchorX) * sc, 1080 - S.stand_top_frac * S.stand_height * p.heightRel + p.hand[1] * sc]; };
        const a = pt(gp, l.speaker, rc), b = pt(rp, rc, l.speaker);
        // horizontally on the palm (±70 px); vertically the item sits ABOVE the palm, resting on it (0–140 px)
        const dx = Math.abs(a[0] - b[0]), dy = b[1] - a[1];
        if (dx > 70 || dy < 0 || dy > 140) push('warn', sh.id, `${l.speaker} đưa đồ mà tay ${rc} nhận không khớp (lệch ngang ${dx.toFixed(0)} px, đồ cao hơn lòng bàn tay ${dy.toFixed(0)} px; chuẩn ≤ 70 và 0–140) → dời vị trí`, l.id);
      }
    });
    // đạo cụ đặt trên bàn / trong cảnh
    for (const p of sh.props ?? []) {
      if (p.on && !(plate?.contains ?? []).includes(p.id)) {
        push('todo', sh.id, `đạo cụ "${p.id}" phải nằm trên ${p.on} nhưng ảnh nền "${plateId}" không có`);
        todo.set(`nền có ${p.id} (${plateId})`, '');
      }
    }
    // dáng: tư thế + cử chỉ + đồ cầm
    for (const c of cast) {
      const seen = new Set();
      for (const need of needsByLine(sh, c, reg, plate)) {
        if (need.absent || (!need.gesture && !need.holds.length && need.posture === 'stand' && need.look === 'level' && need.facing === '3q')) continue;
        const r = resolvePose(reg, c, need);
        if (r.exact) continue;
        const key = `${c}|${need.posture}|${need.gesture}|${need.holds.join('+')}|${need.look}|${need.facing}`;
        if (seen.has(key)) continue;
        seen.add(key);
        push('todo', sh.id, `${c}: thiếu ảnh dáng — ${r.missing.join(', ')} (đang ${need.posture === 'seated' ? 'ngồi' : 'đứng'})`, need.line);
        todo.set(`dáng ${c}: ${need.posture === 'seated' ? 'ngồi' : 'đứng'}${need.facing === 'profile' ? ', xoay nghiêng về người nghe' : ''}${need.look !== 'level' ? (need.look === 'down' ? ', nhìn xuống' : ', ngước lên') : ''}${need.gesture ? ', ' + need.gesture : ''}${need.holds.length ? ', cầm ' + need.holds.join(' + ') : ''}`, '');
      }
    }
    // liên tục: cảnh chèn AI ngay trước cho thấy gì thì cảnh này phải có
    const prev = shots[k - 1];
    if (prev?.kind === 'ai_video' && prev.shows) {
      const has = new Set([...(plate?.contains ?? []), ...(sh.props ?? []).map((p) => p.id)]);
      for (const s of prev.shows) if (!has.has(s)) push('warn', sh.id, `cảnh chèn ${prev.insert} vừa cho thấy "${s}" nhưng cảnh này không có (liên tục)`);
    }
  }
  return { issues, todo: [...todo.entries()].map(([asset, brief]) => ({ asset, brief })) };
}
