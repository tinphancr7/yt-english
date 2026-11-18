# Nguồn soạn video "Phân tích & giải thích" A1 → sinh analysis.json (dữ liệu pipeline) + analysis-review.md (bản để duyệt).
#   python analysis.src.py
# Ký hiệu:
#   câu tô màu: [(chữ, vai)] — vai: subj (xanh dương) · verb (đỏ) · obj (vàng) · fixed (gạch chân) · polite (xanh lá) · None
#   IPA: {..} = tô đỏ (âm cuối / trọng âm)
#   lời nói: chuỗi tiếng Việt; đoạn bọc «...» = câu tiếng Anh đọc bằng giọng tiếng Anh của Tín
#   film: các câu phim phát lại (cắt từ bản phim đã khóa), slow: câu đọc chậm đã có từ phim (tái dùng)
import json, sys
sys.stdout.reconfigure(encoding="utf-8")

BLOCKS = [
  dict(id='B1', source='P1', film=['L07', 'L08'], slow='N02',
    q=[('What would you like?', 'fixed')], a=[('Beef pho', 'obj'), (', ', None), ('please', 'polite'), ('.', None)],
    ipa=['/wʌt wʊ{dʒu} laɪk/', '/biːf fʌ pliː{z}/'], vi='Anh muốn ăn gì? — Cho anh phở bò.',
    steps=[
      dict(step='listen', say=['Mẫu câu thứ nhất. Nghe lại đoạn phim nhé.']),
      dict(step='grammar', panel=['Hỏi: What would you like? = cụm cố định, học nguyên cụm', 'Đáp: [loại] + [món], please.', 'phở bò → beef pho (từ bổ nghĩa đứng TRƯỚC)'],
        say=['Câu hỏi «What would you like?» là câu cố định người phục vụ hay dùng. Ở trình độ A1, bạn cứ học nguyên cụm.',
             'Câu trả lời rất gọn: tên món, cộng please.',
             'Chú ý nè: tiếng Việt nói phở bò, món trước, loại sau. Tiếng Anh thì đảo lại: «beef pho». Từ bổ nghĩa luôn đứng trước.',
             'Tương tự, cơm gà là «chicken rice», nước cam là «orange juice».']),
      dict(step='vocab', panel=[('would like', '', '/wʊd laɪk/', 'muốn (lịch sự)'), ('beef', 'n', '/biː{f}/', 'thịt bò'), ('pho', 'n', '/fʌ/', 'phở'), ('please', '', '/pliː{z}/', 'làm ơn')],
        say=['Từ vựng: «would like» là muốn, nói lịch sự. «Beef» là thịt bò. «Please» là làm ơn, nhớ đọc rõ âm z ở cuối.']),
      dict(step='usage', panel=['Biến thể: What would you like to drink? · What can I get you?', '❌ Pho beef, please.'],
        say=['Ở quán nào bạn cũng sẽ nghe câu này. Hỏi đồ uống thì thêm to drink: «What would you like to drink?»',
             'Lỗi hay gặp: dịch thẳng theo tiếng Việt thành «pho beef». Nhớ nói là «beef pho» nhé!']),
    ]),
  dict(id='B2', source='P2', film=['L09', 'L10'], slow='N06',
    q=[('Small', 'obj'), (' or ', None), ('large', 'obj'), ('?', None)], a=[('Large', 'obj'), (', ', None), ('please', 'polite'), ('.', None)],
    ipa=['/smɔːl ɔːr lɑːr{dʒ}/', '/lɑːr{dʒ} pliː{z}/'], vi='Tô nhỏ hay tô lớn? — Tô lớn nhé.',
    steps=[
      dict(step='listen', say=['Mẫu câu thứ hai.']),
      dict(step='grammar', panel=['Câu hỏi lựa chọn: [A] or [B]?', 'Không cần chủ ngữ, động từ', 'Đáp: chọn 1 từ + please.'],
        say=['Đây là câu hỏi lựa chọn: A or B. Không cần chủ ngữ, không cần động từ.',
             'Khi hỏi, giọng lên ở từ thứ nhất, xuống ở từ thứ hai: «Small or large?»',
             'Trả lời chỉ cần chọn một từ, cộng please.']),
      dict(step='vocab', panel=[('small', 'adj', '/smɔː{l}/', 'nhỏ'), ('medium', 'adj', '/ˈ{miː}diəm/', 'vừa'), ('large', 'adj', '/lɑːr{dʒ}/', 'lớn'), ('or', 'conj', '/ɔːr/', 'hay, hoặc')],
        say=['Ba cỡ thường gặp: «small» nhỏ, «medium» vừa, «large» lớn.']),
      dict(step='usage', panel=['Dùng cho cỡ tô, ly, phần ăn', 'Mẹo: large kết thúc bằng âm /dʒ/'],
        say=['Câu này dùng cho cỡ tô, cỡ ly, phần ăn. Ở quán, người ta nói large nhiều hơn big.',
             'Mẹo phát âm: «large» kết thúc bằng âm dờ nhẹ, đừng đọc thành la.']),
    ]),
  dict(id='B3', source='P3', film=['L11', 'L12'], slow='N10',
    q=[('Onions', 'obj'), ('?', None)], a=[('No', 'fixed'), (' ', None), ('onions', 'obj'), (', ', None), ('please', 'polite'), ('.', None)],
    ipa=['/ˈʌnjən{z}/', '/noʊ ˈʌnjən{z} pliː{z}/'], vi='Có hành không? — Không hành nhé.',
    steps=[
      dict(step='listen', say=['Mẫu câu thứ ba.']),
      dict(step='grammar', panel=['No + [thứ không muốn] + please.', 'Đếm được → số nhiều: No onions', 'Không đếm được → giữ nguyên: No sugar'],
        say=['Muốn bỏ thứ gì, bạn nói: No, cộng thứ không muốn, cộng please.',
             'Danh từ đếm được thì để số nhiều: «No onions». Danh từ không đếm được thì giữ nguyên: «No sugar».',
             'Còn người phục vụ hỏi rất ngắn, chỉ một từ: «Onions?» với giọng lên ở cuối.']),
      dict(step='vocab', panel=[('onion', 'n', '/ˈʌnjə{n}/', 'hành'), ('chili', 'n', '/ˈtʃɪli/', 'ớt'), ('ice', 'n', '/aɪ{s}/', 'đá'), ('sugar', 'n', '/ˈʃʊɡər/', 'đường')],
        say=['Vài thứ hay bỏ khi gọi món: «onion» hành, «chili» ớt, «ice» đá, «sugar» đường.']),
      dict(step='usage', panel=['No ice, please. · No chili, please.', 'Mẹo: onions và please đều kết thúc bằng /z/'],
        say=['Ví dụ: «No ice, please.» «No chili, please.»',
             'Mẹo phát âm: người Việt hay nuốt âm cuối. «Onions» và «please» đều kết thúc bằng âm z nhẹ.']),
    ]),
  dict(id='B4', source='P4', film=['L16', 'L17'], slow='N14',
    q=[('Is', 'verb'), (' ', None), ('it', 'subj'), (' ', None), ('spicy', 'obj'), ('?', None)], a=[('No', None), (', ', None), ('it', 'subj'), (' ', None), ("isn't", 'verb'), ('.', None)],
    ipa=['/ɪz ɪt ˈ{spaɪ}si/', '/noʊ ɪt ˈɪzən{t}/'], vi='Có cay không? — Không cay đâu.',
    steps=[
      dict(step='listen', say=['Mẫu câu thứ tư.']),
      dict(step='grammar', panel=['It is spicy. → Is it spicy?', 'Câu hỏi Yes/No: đảo is lên trước it', 'Yes, it is. / No, it isn\'t.'],
        say=['Đây là câu hỏi có hoặc không. Tiếng Việt chỉ thêm chữ không ở cuối. Tiếng Anh thì đảo is lên trước it.',
             '«It is spicy» thành «Is it spicy?»',
             'Trả lời: «Yes, it is» hoặc «No, it isn\'t».']),
      dict(step='vocab', panel=[('spicy', 'adj', '/ˈ{spaɪ}si/', 'cay'), ('hot', 'adj', '/hɑː{t}/', 'nóng; (nói) cay'), ('sweet', 'adj', '/swiː{t}/', 'ngọt')],
        say=['«Spicy» là cay. «Hot» là nóng, trong văn nói cũng có nghĩa là cay. «Sweet» là ngọt.']),
      dict(step='usage', panel=['Is it hot? · Is it sweet?', '❌ It spicy?'],
        say=['Hỏi đặc điểm nào của món cũng được: «Is it hot?» «Is it sweet?»',
             'Lỗi hay gặp: quên chữ is ở đầu câu hỏi. Nhớ phải có is nhé!']),
    ]),
  dict(id='B5', source='P5', film=['L22', 'L23'], slow='N18',
    q=[('How much', 'fixed'), (' ', None), ('is', 'verb'), (' ', None), ('it', 'subj'), ('?', None)], a=[('Sixty thousand dong', 'obj'), ('.', None)],
    ipa=['/haʊ mʌ{tʃ} ɪz ɪt/', '/ˈsɪksti ˈ{θaʊ}zənd dɒŋ/'], vi='Bao nhiêu tiền? — Sáu mươi nghìn đồng.',
    steps=[
      dict(step='listen', say=['Mẫu câu thứ năm.']),
      dict(step='grammar', panel=['How much + is + [thứ cần hỏi]?', 'Nhiều thứ: How much are they?', '[số] + thousand + dong (thousand KHÔNG thêm -s)'],
        say=['Hỏi giá: How much, cộng is, cộng thứ cần hỏi. Chữ is là bắt buộc.',
             'Hỏi nhiều thứ thì dùng are: «How much are they?»',
             'Nói số tiền: số, cộng thousand, cộng dong. Chú ý: thousand không thêm s. «Sixty thousand», không phải sixty thousands.']),
      dict(step='vocab', panel=[('how much', '', '/haʊ mʌ{tʃ}/', 'bao nhiêu (tiền)'), ('thousand', 'num', '/ˈ{θaʊ}zənd/', 'nghìn'), ('dong', 'n', '/dɒŋ/', 'đồng')],
        say=['«How much» là bao nhiêu tiền. «Thousand» là nghìn.']),
      dict(step='usage', panel=['How much is the iced tea?', '❌ How much this? · ❌ sixty thousands', 'Mẹo: thousand bắt đầu bằng /θ/'],
        say=['Hỏi cụ thể hơn: «How much is the iced tea?»',
             'Hai lỗi hay gặp: hỏi how much this mà bỏ mất chữ is, và thêm s vào thousand. Cả hai đều sai nhé!',
             'Mẹo phát âm: «thousand» bắt đầu bằng âm th, đặt đầu lưỡi giữa hai răng.']),
    ]),
  dict(id='B6', source='P6', film=['L15'], slow='N22',
    q=[('Here you are.', 'fixed')], a=None,
    ipa=['/hɪr ju ɑː{r}/'], vi='Của anh đây ạ.',
    steps=[
      dict(step='listen', say=['Mẫu câu thứ sáu.']),
      dict(step='grammar', panel=['Cụm cố định — không dịch từng chữ', 'Dùng khi ĐƯA đồ, món, tiền cho ai đó'],
        say=['«Here you are» là cụm cố định. Đừng dịch từng chữ thành đây là bạn nhé!',
             'Câu này dùng khi bạn đưa đồ, đưa món hay đưa tiền cho ai đó.']),
      dict(step='vocab', panel=[('Here you are.', '', '/hɪr ju ɑːr/', 'Đây ạ / Gửi bạn'), ('Here you go.', '', '/hɪr ju ɡoʊ/', '(thân mật hơn)')],
        say=['Thân mật hơn thì nói «Here you go».']),
      dict(step='usage', panel=['Phục vụ đưa món: Here you are.', 'Khách đưa tiền: Here you are.', 'Người nhận: Thank you!'],
        say=['Trong phim, Tín dùng câu này khi mang phở ra, và Jake cũng dùng khi đưa tiền. Người nhận thì đáp: «Thank you!»']),
    ]),
  dict(id='ERR', source='ERR', film=['L19', 'L20'], slow='N26',
    q=None, a=[('More', 'fixed'), (' ', None), ('beef', 'obj'), (', ', None), ('please', 'polite'), ('.', None)], wrong='many beef',
    ipa=['/mɔːr biːf pliː{z}/'], vi='Thêm bò nhé.',
    steps=[
      dict(step='listen', say=['Và đây là lỗi của anh Tony.']),
      dict(step='grammar', panel=['beef = danh từ KHÔNG đếm được → không dùng many', 'many + danh từ đếm được: many bowls', 'More + [món] + please. = thêm…', 'Thêm: no onion → no onions'],
        say=['«Beef» là danh từ không đếm được, nên không dùng many. Many chỉ đi với danh từ đếm được, ví dụ «many bowls».',
             'Muốn thêm món thì nói: More, cộng món, cộng please.',
             'À, anh Tony còn nói no onion. Đúng ra phải là «no onions».']),
      dict(step='usage', panel=['More noodles, please.', 'More ice, please.'],
        say=['Ví dụ: «More noodles, please.» «More ice, please.»']),
    ]),
]

INTRO = 'Chào bạn, mình là Tín! Hôm nay mình phân tích kỹ sáu mẫu câu gọi phở trong phim: vì sao nói vậy, từ nào cần nhớ, dùng khi nào. Và cả lỗi của anh Tony nữa!'
SUMMARY = 'Đây là bảng tổng kết. Bạn chụp màn hình lại để ôn nhé!'
OUTRO = 'Trong sáu mẫu câu này, câu nào bạn hay nói sai? Bình luận cho mình biết nhé! Giờ thử sức với bài thi phản xạ bảy giây, link ở góc màn hình.'
VOCAB = [('beef', '/biːf/', 'thịt bò (không đếm được)'), ('small / large', '/smɔːl/ · /lɑːrdʒ/', 'nhỏ / lớn'), ('onion', '/ˈʌnjən/', 'hành'),
         ('spicy', '/ˈspaɪsi/', 'cay'), ('thousand', '/ˈθaʊzənd/', 'nghìn'), ('iced tea', '/aɪst tiː/', 'trà đá'), ('delicious', '/dɪˈlɪʃəs/', 'ngon')]
FORMULAS = [('[loại] + [món], please.', 'Beef pho, please.'), ('[A] or [B]?', 'Small or large?'), ('No + [thứ không muốn], please.', 'No onions, please.'),
            ('Is it + [tính từ]?', 'Is it spicy?'), ('How much is + [thứ cần hỏi]?', 'How much is the iced tea?'), ('More + [món], please.', 'More beef, please.'),
            ('Here you are.', '(khi đưa đồ, đưa tiền)')]

# ---------- sinh lời nói thành các câu TTS (A###): tiếng Việt = Tín VI (eleven_v4), «…» = Tín EN ----------
lines, n = [], [0]
def split_say(text):
    # One TTS line per sentence, read by Tín's Vietnamese voice with the English words inline (eleven_v4 code-switches well).
    # Splitting English out into separate clips gave 1–3-word fragments that sounded choppy (Sổ lỗi #36). «…» only marks
    # English for the review doc / screen.
    return [('vi', text.replace('«', '').replace('»', ''))]
def add(lang, text):
    n[0] += 1
    lid = 'A%03d' % n[0]
    l = {'id': lid, 'speaker': 'tin', 'lang': lang, 'text': text}
    if lang == 'vi':
        l.update(model='eleven_v4', speed=0.95)
    lines.append(l)
    return lid
def say_ids(sentences):
    return [add(lang, t) for s in sentences for lang, t in split_say(s)]

data = {'$note': 'Sinh từ analysis.src.py — sửa ở đó rồi chạy lại.', 'id': 'an-uong-th01-A1-analysis',
        'title': 'Phân tích 6 câu gọi món tiếng Anh – Ngữ pháp, từ vựng, cách dùng | A1',
        'pipeline': {'timeline': 'a1-analysis', 'composition': 'A1-Analysis', 'build': 'scripts/build-analysis.mjs', 'film': 'out/a1-full-v5.mp4', 'film_timeline': 'src/data/a1-full.json'},
        'segments': [{'id': 'Y1', 'name': 'Mở đầu + mẫu câu 1–2 (duyệt khuôn)', 'from': 'AI', 'to': 'B2'},
                     {'id': 'Y2', 'name': 'Mẫu câu 3–6', 'from': 'B3', 'to': 'B6'},
                     {'id': 'Y3', 'name': 'Lỗi hay gặp + tổng kết + kết thúc', 'from': 'ERR', 'to': 'AO'}],
        'publish': {'youtube_studio': {'_note': 'Gắn trong YouTube Studio, không vẽ vào video. Thẻ lúc Tín nhắc bài thi phản xạ; màn hình cuối = 15 s cuối.',
                    'cards': [{'at': 'lời kết', 'type': 'video', 'target': 'an-uong-th01-A1-reflex'}],
                    'end_screen': {'elements': [{'type': 'video', 'target': 'an-uong-th01-A1-reflex'}, {'type': 'video', 'target': 'an-uong-th01-A2 (phim)'}, {'type': 'subscribe'}]}}},
        'intro': say_ids([INTRO]), 'blocks': [], 'summary': {'say': say_ids([SUMMARY]), 'vocab': VOCAB, 'formulas': FORMULAS}, 'outro': say_ids([OUTRO])}
for b in BLOCKS:
    bb = {k: v for k, v in b.items() if k != 'steps'}
    bb['steps'] = [{**{k: v for k, v in s.items() if k != 'say'}, 'say': say_ids(s['say'])} for s in b['steps']]
    data['blocks'].append(bb)
data['lines'] = lines
json.dump(data, open('analysis.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# ---------- bản duyệt ----------
txt = lambda parts: ''.join(t for t, _ in parts) if parts else ''
STEP = {'listen': '1 · Nghe câu', 'grammar': '2 · Ngữ pháp & cấu trúc', 'vocab': '3 · Từ vựng', 'usage': '4 · Cách dùng'}
md = ['# Phân tích & giải thích A1 — LỜI DẪN ĐỂ DUYỆT', '',
      'Sinh từ `analysis.src.py`. Mỗi khối: màn hình (bên trái câu tô màu + IPA + nghĩa, bên phải khung giải thích) và lời Tín đọc. '
      'Chữ *nghiêng* = câu tiếng Anh do giọng tiếng Anh của Tín đọc; ở bước "Nghe câu" phát lại đúng đoạn phim gốc rồi Tín đọc chậm.', '',
      f'**Mở đầu:** {INTRO}', '']
total = len(INTRO)
for b in BLOCKS:
    head = (f'❌ {b["wrong"]} → ' if b.get('wrong') else '') + ' — '.join(x for x in [txt(b['q']), txt(b['a'])] if x)
    md += [f'## {b["id"]} · {head}', '', f'IPA: {"  ·  ".join(b["ipa"]).replace("{", "**").replace("}", "**")} — *{b["vi"]}*', '',
           '| Bước | Màn hình (khung phải) | Tín nói |', '| --- | --- | --- |']
    for s in b['steps']:
        panel = '<br>'.join(p if isinstance(p, str) else f'{p[0]} ({p[1]}) {p[2]} — {p[3]}' if p[1] else f'{p[0]} {p[2]} — {p[3]}' for p in s.get('panel', [])) or f'(phim: {", ".join(b["film"])} → Tín đọc chậm)'
        said = ' '.join(s['say']).replace('«', '*').replace('»', '*')
        total += len(said)
        md.append(f'| {STEP[s["step"]]} | {panel.replace("{", "**").replace("}", "**")} | {said} |')
    md.append('')
md += ['## Bảng tổng kết', '', f'Tín: {SUMMARY}', '', '| Từ | IPA | Nghĩa |', '| --- | --- | --- |'] + [f'| {a} | {b} | {c} |' for a, b, c in VOCAB]
md += ['', '| Công thức | Ví dụ |', '| --- | --- |'] + [f'| {a} | {b} |' for a, b in FORMULAS]
md += ['', f'**Kết thúc:** {OUTRO}', '', f'_Tổng lời dẫn ≈ {total + len(SUMMARY) + len(OUTRO)} ký tự (≈ {round((total + len(SUMMARY) + len(OUTRO)) / 14 / 60, 1)} phút đọc), {len(lines)} câu TTS._']
open('analysis-review.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(len(lines), 'câu TTS ·', total + len(SUMMARY) + len(OUTRO), 'ký tự')
