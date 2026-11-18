import React from 'react';
import { Composition } from 'remotion';
import { Episode } from './Episode';
import type { Timeline } from './types';
import a1full from './data/a1-full.json';
import a1reflex from './data/a1-reflex.json';
import { ReflexDrill, type ReflexTimeline } from './Reflex';
import a1analysis from './data/a1-analysis.json';
import { AnalysisVideo, type AnalysisTimeline } from './Analysis';

const comps: [string, Timeline][] = [
  ['A1-Full', a1full as unknown as Timeline],
];

export const Root: React.FC = () => (
  <>
    {comps.map(([id, tl]) => (
      <Composition key={id} id={id} component={Episode} durationInFrames={tl.durationInFrames} fps={tl.fps} width={tl.width} height={tl.height} defaultProps={{ tl }} />
    ))}
    {([['A1-Reflex', a1reflex as unknown as ReflexTimeline]] as [string, ReflexTimeline][]).map(([id, tl]) => (
      <Composition key={id} id={id} component={ReflexDrill} durationInFrames={tl.durationInFrames} fps={tl.fps} width={tl.width} height={tl.height} defaultProps={{ tl }} />
    ))}
    {([['A1-Analysis', a1analysis as unknown as AnalysisTimeline]] as [string, AnalysisTimeline][]).map(([id, tl]) => (
      <Composition key={id} id={id} component={AnalysisVideo} durationInFrames={tl.durationInFrames} fps={tl.fps} width={tl.width} height={tl.height} defaultProps={{ tl }} />
    ))}
  </>
);
