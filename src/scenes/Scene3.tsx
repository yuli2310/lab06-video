import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {lerp, point, P} from '../bezier';

export const SCENE3_AUDIO_SEC = 8.23;
export const SCENE3_PAD = 15;
export const SCENE3_FRAMES = Math.ceil(SCENE3_AUDIO_SEC * 30) + SCENE3_PAD * 2;

const PTS: P[] = [[220, 560], [640, 130], [1060, 560]];
const SL_Y = 650, SL_X0 = 240, SL_X1 = 1040;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const line = (a: P, b: P) => ({x1: a[0], y1: a[1], x2: b[0], y2: b[1]});

export const Scene3: React.FC = () => {
  const f = useCurrentFrame() - SCENE3_PAD; // 0 = narration starts
  const {fps} = useVideoConfig();
  const pop = (s: number) => spring({frame: f - s, fps, config: {damping: 12}});
  const on = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

  // t: held at 0.4 while the dots are explained, then back to 0, then swept to 1
  const t = f < 150 ? 0.4 : f < 165 ? interpolate(f, [150, 165], [0.4, 0], clamp) : interpolate(f, [165, 235], [0, 1], clamp);
  const A = lerp(PTS[0], PTS[1], t);
  const B = lerp(PTS[1], PTS[2], t);
  const C = lerp(A, B, t);
  const n = Math.max(2, Math.round(t * 80));
  const sweeping = f >= 165;
  const trail = Array.from({length: n + 1}, (_, i) => point(PTS, (i / n) * t));
  const sx = SL_X0 + (SL_X1 - SL_X0) * t;
  const sliderOn = on(22, 40);

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif', color: '#e2e8f0'}}>
      <Audio src={staticFile('narr/scene3.wav')} />
      <svg width={1280} height={720}>
        {/* first line, then the second one when the third point arrives */}
        <line {...line(PTS[0], lerp(PTS[0], PTS[1], 1))} stroke="#94a3b8" strokeWidth={4} />
        <line {...line(PTS[1], lerp(PTS[1], PTS[2], on(15, 35)))} stroke="#94a3b8" strokeWidth={4} />
        {/* yellow trail of the last dot */}
        {sweeping && <polyline points={trail.map((p) => p.join(',')).join(' ')} fill="none" stroke="#facc15" strokeWidth={7} strokeLinecap="round" />}
        {/* pink line between the two blue dots */}
        <line {...line(A, lerp(A, B, on(104, 125)))} stroke="#f472b6" strokeWidth={5} opacity={pop(39)} />
        {PTS.map((p, i) => (
          <g key={i} transform={`translate(${p[0]} ${p[1]}) scale(${i === 2 ? pop(8) : 1})`}>
            <circle r={15} fill="#e2e8f0" />
            <text x={i === 0 ? -70 : 22} y={i === 0 ? 40 : -20} fontSize={34} fontWeight={600} fill="#e2e8f0">P{i}</text>
          </g>
        ))}
        {/* blue dots on each line */}
        {[A, B].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={13 * pop(39)} fill="#38bdf8" />)}
        {/* pink dot on the new line */}
        <circle cx={C[0]} cy={C[1]} r={17 * pop(125)} fill="#f472b6" />
        {/* t slider */}
        <g opacity={sliderOn}>
          <line x1={SL_X0} y1={SL_Y} x2={SL_X1} y2={SL_Y} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
          <line x1={SL_X0} y1={SL_Y} x2={sx} y2={SL_Y} stroke="#facc15" strokeWidth={6} strokeLinecap="round" />
          <text x={SL_X0 - 30} y={SL_Y + 10} textAnchor="end" fontSize={28} fill="#94a3b8">0</text>
          <text x={SL_X1 + 30} y={SL_Y + 10} fontSize={28} fill="#94a3b8">1</text>
          <circle cx={sx} cy={SL_Y} r={13} fill="#facc15" />
          <text x={640} y={SL_Y - 24} textAnchor="middle" fontSize={40} fontFamily="monospace" fill="#facc15">t = {t.toFixed(2)}</text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
