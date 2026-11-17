import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bezier, P} from '../bezier';

const bg: React.CSSProperties = {background: '#0f172a', color: 'white', fontFamily: 'sans-serif'};
const useT = () => {
  const f = useCurrentFrame(); const {durationInFrames: d} = useVideoConfig();
  return interpolate(f, [10, d - 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};
const Caption: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', top: 40, width: '100%', textAlign: 'center', fontSize: 44, fontWeight: 600}}>{children}</div>
);
const TLabel: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontSize: 40, fontFamily: 'monospace', color: '#facc15'}}>t = {t.toFixed(2)}</div>
);
const S1: P[] = [[200, 560], [1000, 560], [300, 160], [1080, 200]];
const SQ: P[] = [[200, 560], [640, 150], [1080, 560]];
const CU: P[] = [[180, 560], [330, 130], [900, 130], [1100, 560]];

export const Scene1 = () => {
  const t = useT();
  return <AbsoluteFill style={bg}><Caption>Smooth curves, one tiny trick</Caption><Bezier pts={S1} t={t} showLevels={false} labels={false} /></AbsoluteFill>;
};
export const Scene2 = () => {
  const t = useT(); const pts: P[] = [[220, 500], [1060, 220]];
  return <AbsoluteFill style={bg}><Caption>Two points: a line</Caption><Bezier pts={pts} t={t} /><TLabel t={t} /></AbsoluteFill>;
};
export const Scene3 = () => {
  const t = useT();
  return <AbsoluteFill style={bg}><Caption>Three points: lines between lines</Caption><Bezier pts={SQ} t={t} /><TLabel t={t} /></AbsoluteFill>;
};
export const Scene4 = () => {
  const t = useT();
  return <AbsoluteFill style={bg}><Caption>Four points: a cubic Bézier curve</Caption><Bezier pts={CU} t={t} /><TLabel t={t} /></AbsoluteFill>;
};
export const Scene5 = () => {
  const f = useCurrentFrame();
  const pts: P[] = [CU[0], [330 + 200 * Math.sin(f / 18), 130 + 120 * Math.cos(f / 14)], [900 - 200 * Math.sin(f / 16), 130 + 150 * Math.sin(f / 12)], CU[3]];
  return <AbsoluteFill style={bg}><Caption>Drag a handle, the curve follows</Caption><Bezier pts={pts} t={1} showLevels={false} /></AbsoluteFill>;
};
export const Scene6 = () => {
  const t = useT(); const f = useCurrentFrame();
  const o = interpolate(f, [20, 50], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={bg}>
      <Bezier pts={CU} t={t} showLevels={false} labels={false} />
      <div style={{position: 'absolute', top: 60, width: '100%', textAlign: 'center', fontSize: 36, fontFamily: 'serif', opacity: o}}>
        B(t) = (1−t)³·P0 + 3(1−t)²t·P1 + 3(1−t)t²·P2 + t³·P3
      </div>
    </AbsoluteFill>
  );
};
export const Scene7 = () => {
  const t = useT();
  return <AbsoluteFill style={bg}><Caption>Repeated midpoints → smooth curves</Caption><Bezier pts={S1} t={1} showLevels={false} labels={false} /><div style={{position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', fontSize: 30, opacity: t}}>Bézier curves · de Casteljau</div></AbsoluteFill>;
};
