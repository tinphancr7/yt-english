import React from 'react';
import { interpolate } from 'remotion';
import { COLORS, SPEAKER } from '../brand';
import type { Line } from '../types';

// Dual subtitles (A1–A2): English on top (bold), Vietnamese below. Target phrases highlighted.
const withHighlight = (text: string, hl: string[]) => {
  const h = hl.find((x) => text.includes(x));
  if (!h) return text;
  const i = text.indexOf(h);
  return (
    <>
      {text.slice(0, i)}
      <span style={{ background: COLORS.highlight, borderRadius: 8, padding: '0 8px', boxDecorationBreak: 'clone' }}>{h}</span>
      {text.slice(i + h.length)}
    </>
  );
};

export const Subtitle: React.FC<{ line: Line; t: number }> = ({ line, t }) => {
  const local = t - line.start;
  const opacity = interpolate(local, [0, 0.12, line.dur + 0.25, line.dur + 0.4], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const sp = SPEAKER[line.speaker] ?? { name: line.speaker.toUpperCase(), color: COLORS.outline };
  const main = line.lang === 'en' ? line.text : line.text;
  const sub = line.lang === 'en' ? line.vi : null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 48, display: 'flex', justifyContent: 'center', opacity, zIndex: 50 }}>
      <div
        style={{
          maxWidth: 1500,
          background: COLORS.cream,
          border: `5px solid ${COLORS.outline}`,
          borderRadius: 26,
          padding: '16px 36px 18px',
          boxShadow: '0 6px 0 rgba(61,44,41,0.35)',
          textAlign: 'center',
          fontFamily: 'Be Vietnam Pro, sans-serif',
        }}
      >
        <div style={{ fontSize: 46, fontWeight: 800, color: COLORS.outline, lineHeight: 1.25 }}>
          <span style={{ color: sp.color, marginRight: 14 }}>{sp.name}:</span>
          {withHighlight(main, line.highlight)}
        </div>
        {sub && <div style={{ fontSize: 34, fontWeight: 500, color: COLORS.viText, marginTop: 6, lineHeight: 1.3 }}>{sub}</div>}
      </div>
    </div>
  );
};
