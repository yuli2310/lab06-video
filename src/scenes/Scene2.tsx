import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {lerp, P} from '../bezier';

export const SCENE2_AUDIO_SEC = 12.01;
export const SCENE2_PAD = 15;
export const SCENE2_FRAMES = Math.ceil(SCENE2_AUDIO_SEC * 30) + SCENE2_PAD * 2;

const A: P = [240, 250];
const B: P = [1040, 250];
const BAR_Y = 500, BAR_H = 44;
const BLUE = '#38bdf8', PINK = '#f472b6', GOLD = '#facc15', DIM = '#64748b';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame() - SCENE2_PAD; // 0 = narration starts
  const {fps} = useVideoConfig();
  const e = Easing.inOut(Easing.cubic);
  const pop = (s: number) => spring({frame: f - s, fps, config: {damping: 12}});
  const on = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
  const part = (s: number, col: string) => interpolateColors(on(s, s + 10), [0, 1], [DIM, col]);

  // t: 0.5 (the plain average), then 0.35 for the example, then 0, and finally a sweep 0 -> 1
  const t = f < 150 ? 0.5
    : f < 175 ? interpolate(f, [150, 175], [0.5, 0.35], {...clamp, easing: e})
    : f < 274 ? 0.35
    : f < 286 ? interpolate(f, [274, 286], [0.35, 0], {...clamp, easing: e})
    : f < 296 ? 0
    : interpolate(f, [296, 345], [0, 1], {...clamp, easing: e});
  const D = lerp(A, B, t);
  const weighted = on(139, 155); // after "plain average" the dot becomes "t of the way"
  const dotCol = interpolateColors(weighted, [0, 1], ['#f8fafc', GOLD]);
  const barOn = on(139, 159);
  const x0 = A[0], W = B[0] - A[0];

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif', color: '#e2e8f0'}}>
      <Audio src={staticFile('narr/scene2.wav')} />
      <svg width={1280} height={720}>
        {/* the two points and the line */}
        <line x1={A[0]} y1={A[1]} x2={lerp(A, B, on(12, 30))[0]} y2={B[1]} stroke="#94a3b8" strokeWidth={5} />
        <line x1={A[0]} y1={A[1]} x2={D[0]} y2={D[1]} stroke={GOLD} strokeWidth={7} strokeLinecap="round" opacity={weighted} />
        <circle cx={A[0]} cy={A[1]} r={16 * pop(5)} fill={BLUE} />
        <circle cx={B[0]} cy={B[1]} r={16 * pop(20)} fill={PINK} />
        <text x={A[0]} y={A[1] + 56} textAnchor="middle" fontSize={38} fontWeight={600} fill={BLUE} opacity={on(5, 15)}>A</text>
        <text x={B[0]} y={B[1] + 56} textAnchor="middle" fontSize={38} fontWeight={600} fill={PINK} opacity={on(20, 30)}>B</text>
        {/* the moving dot: first the midpoint, then t of the way */}
        <circle cx={D[0]} cy={D[1]} r={14 * pop(39)} fill={dotCol} />
        {/* captions for the plain average */}
        <text x={640} y={170} textAnchor="middle" fontSize={40} fill="#94a3b8" opacity={on(39, 55) * (1 - on(130, 145))}>
          {f < 92 ? 'plain average = the midpoint' : '½ · A  +  ½ · B'}
        </text>
        {/* t label above the dot */}
        <text x={D[0]} y={D[1] - 30} textAnchor="middle" fontSize={36} fontFamily="monospace" fill={GOLD} opacity={weighted}>t = {t.toFixed(2)}</text>

        {/* the formula, lit up as it is spoken */}
        <text x={640} y={430} textAnchor="middle" fontSize={56} fontFamily="Georgia, serif" opacity={barOn}>
          <tspan fill={DIM}>point = </tspan>
          <tspan fill={part(199, GOLD)}>(1 − t)</tspan>
          <tspan fill={part(220, BLUE)}> · A</tspan>
          <tspan fill={DIM}> + </tspan>
          <tspan fill={part(237, PINK)}>t · B</tspan>
        </text>

        {/* the weights as a bar: how much of A and of B */}
        <g opacity={barOn}>
          <rect x={x0} y={BAR_Y} width={(1 - t) * W} height={BAR_H} fill={BLUE} rx={6} />
          <rect x={x0 + (1 - t) * W} y={BAR_Y} width={t * W} height={BAR_H} fill={PINK} rx={6} />
          <text x={x0 + (1 - t) * W / 2} y={BAR_Y + BAR_H + 44} textAnchor="middle" fontSize={34} fill={BLUE} opacity={on(199, 212)}>
            weight of A: {(1 - t).toFixed(2)}
          </text>
          <text x={x0 + (1 - t) * W + t * W / 2} y={BAR_Y + BAR_H + 90} textAnchor="middle" fontSize={34} fill={PINK} opacity={on(237, 250)}>
            weight of B: {t.toFixed(2)}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
