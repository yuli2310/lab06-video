import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {lerp, P, point} from '../bezier';

export const SCENE1_AUDIO_SEC = 14.95;
export const SCENE1_PAD = 15;
export const SCENE1_FRAMES = Math.ceil(SCENE1_AUDIO_SEC * 30) + SCENE1_PAD * 2;

// The four stored points of the "S" (one cubic Bézier).
export const S_PTS: P[] = [[420, 600], [960, 640], [320, 90], [860, 130]];
const COLORS = ['#38bdf8', '#f472b6', '#f472b6', '#38bdf8'];
const path = `M ${S_PTS[0]} C ${S_PTS[1]} ${S_PTS[2]} ${S_PTS[3]}`;
const FOCUS = point(S_PTS, 0.15); // a bend near the start
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Formula demo: A -- B with a dot t of the way along
const A: P = [380, 505], B: P = [900, 505];
const T_SHOWN = 0.35;
const GOLD = '#facc15', BLUE = '#38bdf8', PINK = '#f472b6';

export const Scene1: React.FC = () => {
  const f = useCurrentFrame() - SCENE1_PAD; // 0 = narration starts
  const {fps} = useVideoConfig();
  const ease = Easing.inOut(Easing.cubic);
  const on = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);
  const pop = (s: number) => spring({frame: f - s, fps, config: {damping: 12}});

  // "...at any size": zoom into a bend, then back out
  const zoom = interpolate(f, [40, 110, 130, 160], [1, 4, 4, 1], {...clamp, easing: ease});
  const k = (zoom - 1) / 3; // slide the zoom target to the screen centre as we zoom in
  // letter -> thin curve once "four points" starts
  const thin = on(160, 185);
  const fadeIn = on(-10, 10);
  const strokeW = 110 - 104 * thin;
  const startAt = [167, 180, 193, 206];
  // "a weighted average": the curve moves up and shrinks, the formula takes the bottom
  const shrink = interpolate(f, [251, 275], [0, 1], {...clamp, easing: ease});
  const sh = 1 - 0.5 * shrink;
  const card = on(251, 275);

  // dot sliding from A towards B while "The point t of the way from A to B" is said
  const tt = interpolate(f, [297, 345], [0, T_SHOWN], {...clamp, easing: ease});
  const D = lerp(A, B, tt);
  const lineOn = on(297, 315);
  // formula parts light up as they are spoken
  const part = (start: number, base: string, col: string) => interpolateColors(on(start, start + 10), [0, 1], [base, col]);
  const dim = '#64748b';

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif'}}>
      <Audio src={staticFile('narr/scene1.wav')} />
      <svg width={1280} height={720} style={{opacity: fadeIn}}>
        <g transform={`translate(640 90) scale(${sh}) translate(-640 -90)`}>
          <g transform={`translate(${FOCUS[0] + (640 - FOCUS[0]) * k} ${FOCUS[1] + (360 - FOCUS[1]) * k}) scale(${zoom}) translate(${-FOCUS[0]} ${-FOCUS[1]})`}>
            <polyline points={S_PTS.map((p) => p.join(',')).join(' ')} fill="none" stroke="#94a3b8" strokeWidth={2 / zoom} strokeDasharray="10 8" opacity={on(190, 210)} />
            <path d={path} fill="none" strokeLinecap="round" strokeWidth={strokeW}
              stroke={interpolateColors(thin, [0, 1], ['#f8fafc', GOLD])} />
            {S_PTS.map((p, i) => (
              <g key={i} transform={`translate(${p[0]} ${p[1]}) scale(${pop(startAt[i])})`}>
                <circle r={15} fill={COLORS[i]} />
                <text x={22} y={-20} fill="#e2e8f0" fontSize={34} fontWeight={600}>P{i}</text>
              </g>
            ))}
          </g>
        </g>

        {/* the formula card */}
        <g opacity={card} transform={`translate(0 ${(1 - card) * 30})`}>
          <text x={640} y={420} textAnchor="middle" fontSize={34} fill="#94a3b8" opacity={1 - on(290, 305)}>a weighted average of two points</text>
          <g opacity={lineOn}>
            <line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#94a3b8" strokeWidth={5} />
            <line x1={A[0]} y1={A[1]} x2={D[0]} y2={D[1]} stroke={GOLD} strokeWidth={7} strokeLinecap="round" />
            <circle cx={A[0]} cy={A[1]} r={15} fill={BLUE} />
            <circle cx={B[0]} cy={B[1]} r={15} fill={PINK} />
            <circle cx={D[0]} cy={D[1]} r={13} fill={GOLD} />
            <text x={A[0]} y={A[1] + 52} textAnchor="middle" fontSize={36} fontWeight={600} fill={BLUE}>A</text>
            <text x={B[0]} y={B[1] + 52} textAnchor="middle" fontSize={36} fontWeight={600} fill={PINK}>B</text>
            <text x={D[0]} y={D[1] - 28} textAnchor="middle" fontSize={34} fontFamily="monospace" fill={GOLD}>t = {tt.toFixed(2)}</text>
          </g>
          <text x={640} y={655} textAnchor="middle" fontSize={54} fontFamily="Georgia, serif" opacity={on(297, 315)}>
            <tspan fill={dim}>point = </tspan>
            <tspan fill={part(350, dim, GOLD)}>(1 − t)</tspan>
            <tspan fill={part(385, dim, BLUE)}> · A</tspan>
            <tspan fill={dim}> + </tspan>
            <tspan fill={part(412, dim, PINK)}>t · B</tspan>
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
