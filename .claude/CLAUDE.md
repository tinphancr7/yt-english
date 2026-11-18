# YOLO7 English — project notes

Planning workspace for an AI-assisted animated YouTube channel teaching English conversation to
Vietnamese learners (A1–B2; main character: Tín). Content = Topic › Situation › 4 versions
(A1, A2, B1, B2) of the SAME scene, each longer and harder; each version = film + analysis/explanation
video + 7-second reflex video; one compilation video per completed situation. Docs are written in Vietnamese; dialogue, prompts and
on-screen English are in English; lesson explanations are in Vietnamese.

- `README.md` — executive summary and index. Keep it in sync when adding docs.
- `docs/` — research and plan, numbered by section (01–13, 99 = sources and AI limitations; 12 = contingency plan; 13 = QC workflow and defect log); 11 = companion videos (analysis & explanation, 7-second reflex) attached to every version (A1–B2) of every situation.
- `video-mau/chu-de-<topic>/th<NN>-<situation>/{A1,A2,B1,B2}/` — one folder per situation, one subfolder per version.
  A full production package is `script.md` (EN + VI), `storyboard.md` (shots + prompts),
  `episode.json` (single source of truth for the pipeline), `subtitles.srt`, `README.md`.
- `prompts/` — reusable prompts (script writer/editor with situation rules, character sheets).
  The STYLE LOCK block must stay identical everywhere it appears
  (`docs/03-nhan-vat.md`, `prompts/character-sheet.md`).
- `assets/research/` — screenshots of reference channels (analysis only, never reuse in videos).

Conventions:

- Start of each new episode: read the defect log (Sổ lỗi) and lessons in `docs/13-quy-trinh-qc.md`, run `npm run check` in `pipeline/`. Every new defect gets the 5-step loop there (fix → log → check/checklist/prompt rule → regression case in `pipeline/tests/regressions.mjs` → memory if it is a working lesson).
- Before reporting a render as done, run `pipeline/scripts/qc-video.py`, review the contact sheets against the checklist in `docs/13-quy-trinh-qc.md`, fix what you can, and log every new defect in its defect log (Sổ lỗi).

- Cast, looks, voices and the Hẻm 99 world are defined in `docs/03-nhan-vat.md`; change them there first.
- Situations: all 4 versions keep the same setting; each keeps the previous version's beats and recycles ≥ 50% of its phrases (see `docs/04-chu-de-va-50-y-tuong.md`).
- Prices quoted in docs carry a date and a source; mark third-party figures as such.
- Line ids (`L01`…) in `episode.json` match the numbered lines in that level's `script.md`;
  every line has `lang` (`en` | `vi`).
