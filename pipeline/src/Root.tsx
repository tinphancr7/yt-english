import React from 'react';
import { Composition } from 'remotion';
import { Episode } from './Episode';
import type { Timeline } from './types';
import a1s03 from './data/a1-s03.json';
import a1full from './data/a1-full.json';

const comps: [string, Timeline][] = [
  ['A1-S03', a1s03 as unknown as Timeline],
  ['A1-Full', a1full as unknown as Timeline],
];

export const Root: React.FC = () => (
  <>
    {comps.map(([id, tl]) => (
      <Composition key={id} id={id} component={Episode} durationInFrames={tl.durationInFrames} fps={tl.fps} width={tl.width} height={tl.height} defaultProps={{ tl }} />
    ))}
  </>
);
