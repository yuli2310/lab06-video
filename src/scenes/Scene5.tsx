import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {point, P} from '../bezier';

export const SCENE5_AUDIO_SEC = 12.52;
export const SCENE5_PAD = 15;
export const SCENE5_FRAMES = Math.ceil(SCENE5_AUDIO_SEC * 30) + SCENE5_PAD * 2;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const E0: P = [200, 560];
const E3: P = [1080, 560];

// the S: three cubic curves joined end to end; tangents match at the joins (both vertical)
type Seg = {pts: P[]; col: string};
const S_SEGS: Seg[] = [
  {pts: [[880, 210], [850, 90], [440, 70], [440, 250]], col: '#38bdf8'},
  {pts: [[440, 250], [440, 330], [840, 410], [840, 490]], col: '#f472b6'},
  {pts: [[840, 490], [840, 640], [430, 650], [400, 500]], col: '#4ade80'},
];
const d = (s: P[]) => `M ${s[0]} C ${s[1]} ${s[2]} ${s[3]}`;

export const Scene5: React.FC = () => {
  const f = useCurrentFrame() - SCENE5_PAD; // 0 = narration starts
  const {fps} = useVideoConfig();
  const pop = (s: number) => spring({frame: f - s, fps, config: {damping: 12}});
  const on = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

  // part A: the handles wander while the narrator talks about them
  const move = on(0, 20); // ease the movement in
  const P1: P = [330 + move * (190 * Math.sin(f / 14) + 20), 230 + move * (80 * Math.cos(f / 11))];
  const P2: P = [950 - move * (190 * Math.sin(f / 16) + 20), 230 + move * (90 * Math.sin(f / 12))];
  const A: P[] = [E0, P1, P2, E3];
  const curve = Array.from({length: 61}, (_, i) => point(A, i / 60));
  const partA = 1 - on(243, 263); // fades when the S comes in
  const ringT = on(78, 158);
  const tang = on(158, 175) * (1 - on(235, 243));

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif', color: '#e2e8f0'}}>
      <Audio src={staticFile('narr/scene5.wav')} />
      <svg width={1280} height={720}>
        {/* ---- part A: one curve with moving handles ---- */}
        <g opacity={partA}>
          <line x1={E0[0]} y1={E0[1]} x2={P1[0]} y2={P1[1]} stroke={tang > 0 ? '#fb923c' : '#94a3b8'} strokeWidth={3 + 3 * tang} strokeDasharray="10 8" />
          <line x1={E3[0]} y1={E3[1]} x2={P2[0]} y2={P2[1]} stroke={tang > 0 ? '#fb923c' : '#94a3b8'} strokeWidth={3 + 3 * tang} strokeDasharray="10 8" />
          <polyline points={curve.map((p) => p.join(',')).join(' ')} fill="none" stroke="#facc15" strokeWidth={7} strokeLinecap="round" />
          {/* pulsing rings on the end points */}
          {ringT > 0 && ringT < 1 && [E0, E3].map((p, i) => {
            const r = 20 + 30 * ((ringT * 3) % 1);
            return <circle key={i} cx={p[0]} cy={p[1]} r={r} fill="none" stroke="#38bdf8" strokeWidth={4} opacity={1 - (ringT * 3) % 1} />;
          })}
          {[E0, E3].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={16} fill="#38bdf8" />)}
          {[P1, P2].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={14} fill="#f472b6" />)}
          <text x={E0[0]} y={E0[1] + 56} textAnchor="middle" fontSize={34} fontWeight={600} fill="#e2e8f0">P0</text>
          <text x={E3[0]} y={E3[1] + 56} textAnchor="middle" fontSize={34} fontWeight={600} fill="#e2e8f0">P3</text>
          <text x={P1[0] + 22} y={P1[1] - 18} fontSize={34} fontWeight={600} fill="#e2e8f0">P1</text>
          <text x={P2[0] + 22} y={P2[1] - 18} fontSize={34} fontWeight={600} fill="#e2e8f0">P2</text>
        </g>
        {/* ---- part B: the S as three curves joined end to end ---- */}
        {S_SEGS.map((s, i) => {
          const start = [243, 294, 325][i];
          return <path key={i} d={d(s.pts)} pathLength={1} fill="none" stroke={s.col} strokeWidth={14} strokeLinecap="round"
            strokeDasharray="1 1" strokeDashoffset={1 - on(start, start + 25)} />;
        })}
        {[S_SEGS[0].pts[3], S_SEGS[1].pts[3]].map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={13 * pop([320, 350][i])} fill="#f8fafc" stroke="#0f172a" strokeWidth={4} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
