import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {lerp, P} from '../bezier';

export const SCENE2_AUDIO_SEC = 9.34;
export const SCENE2_PAD = 15;
export const SCENE2_FRAMES = Math.ceil(SCENE2_AUDIO_SEC * 30) + SCENE2_PAD * 2;

const P0: P = [240, 440];
const P1: P = [1040, 230];
const SL_Y = 610, SL_X0 = 240, SL_X1 = 1040;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Scene2: React.FC = () => {
  const f = useCurrentFrame() - SCENE2_PAD; // 0 = narration starts
  const {fps} = useVideoConfig();
  const pop = (s: number) => spring({frame: f - s, fps, config: {damping: 12}});
  const fade = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

  // t: hidden until the dot appears, held at 0.25, then swept 0.25 -> 1 -> 0.25
  const t = f < 225 ? 0.25 : f < 255 ? interpolate(f, [225, 255], [0.25, 1], clamp) : interpolate(f, [255, 280], [1, 0.25], clamp);
  const D = lerp(P0, P1, t);
  const dotOn = pop(145);
  const sliderOn = fade(65, 85);
  const sx = SL_X0 + (SL_X1 - SL_X0) * t;

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif', color: '#e2e8f0'}}>
      <Audio src={staticFile('narr/scene2.wav')} />
      <svg width={1280} height={720}>
        {/* the line between the two points */}
        <line x1={P0[0]} y1={P0[1]} x2={lerp(P0, P1, fade(40, 62))[0]} y2={lerp(P0, P1, fade(40, 62))[1]} stroke="#94a3b8" strokeWidth={4} />
        {/* travelled part */}
        <line x1={P0[0]} y1={P0[1]} x2={D[0]} y2={D[1]} stroke="#facc15" strokeWidth={6} strokeLinecap="round" opacity={dotOn} />
        {[P0, P1].map((p, i) => (
          <g key={i} transform={`translate(${p[0]} ${p[1]}) scale(${pop(5 + i * 25)})`}>
            <circle r={15} fill="#e2e8f0" />
            <text x={22} y={-20} fontSize={34} fontWeight={600} fill="#e2e8f0">P{i}</text>
          </g>
        ))}
        {/* the moving dot */}
        <circle cx={D[0]} cy={D[1]} r={16 * dotOn} fill="#38bdf8" />
        {/* the t slider */}
        <g opacity={sliderOn}>
          <line x1={SL_X0} y1={SL_Y} x2={SL_X1} y2={SL_Y} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
          <line x1={SL_X0} y1={SL_Y} x2={sx} y2={SL_Y} stroke="#facc15" strokeWidth={6} strokeLinecap="round" />
          <text x={SL_X0} y={SL_Y + 50} textAnchor="middle" fontSize={30} fill="#94a3b8">0</text>
          <text x={SL_X1} y={SL_Y + 50} textAnchor="middle" fontSize={30} fill="#94a3b8">1</text>
          <circle cx={sx} cy={SL_Y} r={14} fill="#facc15" />
          <text x={640} y={SL_Y - 34} textAnchor="middle" fontSize={44} fontFamily="monospace" fill="#facc15">
            t = {(f < 145 ? 0.25 : t).toFixed(2)}
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
