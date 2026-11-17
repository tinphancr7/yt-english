import React from 'react';
import { COLORS } from '../brand';

// Rhubarb mouth shapes (A–H, X) drawn as flat cartoon SVG in a 100×60 box centred at (0,0).
// Stroke ≈ 5 units so it matches the ~3px outline of the STYLE LOCK once scaled.
const S = { stroke: COLORS.outline, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const open = (top: number, bottom: number, half: number) =>
  `M${-half},0 Q0,${top} ${half},0 Q0,${bottom} ${-half},0 Z`;

export const MouthShape: React.FC<{ shape: string }> = ({ shape }) => {
  switch (shape) {
    case 'A': // M B P — lips pressed
      return <path d="M-26,2 Q0,5 26,2" fill="none" {...S} />;
    case 'B': // K S T EE — slightly open, teeth together
      return (
        <g>
          <path d={open(-6, 12, 32)} fill={COLORS.mouthInside} {...S} />
          <path d="M-26,-1 L26,-1 L24,5 L-24,5 Z" fill={COLORS.teeth} />
          <path d={open(-6, 12, 32)} fill="none" {...S} />
        </g>
      );
    case 'C': // EH AE — open
      return (
        <g>
          <path d={open(-10, 26, 32)} fill={COLORS.mouthInside} {...S} />
          <path d="M-24,-3 Q0,-7 24,-3 L22,3 Q0,1 -22,3 Z" fill={COLORS.teeth} />
          <ellipse cx="0" cy="11" rx="13" ry="5" fill={COLORS.tongue} />
          <path d={open(-10, 26, 32)} fill="none" {...S} />
        </g>
      );
    case 'D': // AA — wide open
      return (
        <g>
          <path d={open(-14, 40, 36)} fill={COLORS.mouthInside} {...S} />
          <path d="M-27,-5 Q0,-10 27,-5 L25,2 Q0,-2 -25,2 Z" fill={COLORS.teeth} />
          <ellipse cx="0" cy="17" rx="16" ry="7" fill={COLORS.tongue} />
          <path d={open(-14, 40, 36)} fill="none" {...S} />
        </g>
      );
    case 'E': // AO ER — rounded open
      return (
        <g>
          <ellipse cx="0" cy="4" rx="17" ry="15" fill={COLORS.mouthInside} {...S} />
          <ellipse cx="0" cy="12" rx="9" ry="4" fill={COLORS.tongue} />
          <ellipse cx="0" cy="4" rx="17" ry="15" fill="none" {...S} />
        </g>
      );
    case 'F': // UW OO W — puckered
      return (
        <g>
          <ellipse cx="0" cy="3" rx="11" ry="10" fill={COLORS.mouthInside} {...S} />
          <path d="M-14,-2 Q-17,3 -14,8 M14,-2 Q17,3 14,8" fill="none" {...S} strokeWidth={3} />
        </g>
      );
    case 'G': // F V — upper teeth on lower lip
      return (
        <g>
          <path d={open(-8, 14, 28)} fill={COLORS.mouthInside} {...S} />
          <path d="M-20,-4 L20,-4 L19,5 L-19,5 Z" fill={COLORS.teeth} stroke={COLORS.outline} strokeWidth={2} />
          <path d="M-26,7 Q0,13 26,7" fill="none" {...S} />
        </g>
      );
    case 'H': // L — open, tongue up behind teeth
      return (
        <g>
          <path d={open(-10, 24, 30)} fill={COLORS.mouthInside} {...S} />
          <path d="M-22,-3 Q0,-7 22,-3 L20,2 Q0,0 -20,2 Z" fill={COLORS.teeth} />
          <ellipse cx="0" cy="4" rx="12" ry="6" fill={COLORS.tongue} />
          <path d={open(-10, 24, 30)} fill="none" {...S} />
        </g>
      );
    default: // X — rest: friendly closed smile
      return <path d="M-28,-3 Q0,12 28,-3" fill="none" {...S} />;
  }
};

export const mouthAt = (cues: { start: number; end: number; value: string }[], t: number): string => {
  for (const c of cues) if (t >= c.start && t < c.end) return c.value;
  return 'X';
};
