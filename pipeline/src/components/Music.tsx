import React from 'react';
import { Audio, Sequence, staticFile, useVideoConfig } from 'remotion';

// Background music with a volume curve in ABSOLUTE time.
// <Audio loop volume={(f) => …}> restarts f at 0 on every loop, so a time-based curve goes wrong after the first loop
// (A1 analysis: the music muted itself during the summary hold because f/fps "looked like" the film clip of block 1 — Sổ lỗi #39).
// Here each repetition is its own Sequence and gets its absolute offset.
export const LoopedMusic: React.FC<{ src: string; fileDur: number; total: number; volume: (absSec: number) => number; from?: number }> = ({ src, fileDur, total, volume, from = 0 }) => {
  const { fps } = useVideoConfig();
  const n = Math.ceil(total / fileDur);
  return (
    <>
      {Array.from({ length: n }, (_, k) => (
        <Sequence key={k} from={Math.round((from + k * fileDur) * fps)} durationInFrames={Math.round(Math.min(fileDur, total - k * fileDur) * fps)}>
          <Audio src={staticFile(src)} volume={(f) => volume(from + k * fileDur + f / fps)} />
        </Sequence>
      ))}
    </>
  );
};
