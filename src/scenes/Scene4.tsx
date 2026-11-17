import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {levels, point, P} from '../bezier';

export const SCENE4_AUDIO_SEC = 11.61;
export const SCENE4_PAD = 15;
export const SCENE4_FRAMES = Math.ceil(SCENE4_AUDIO_SEC * 30) + SCENE4_PAD * 2;

const PTS: P[] = [[200, 560], [330, 150], [950, 150], [1080, 560]];
const SL_Y = 650, SL_X0 = 240, SL_X1 = 1040;
const LINE_COL = ['#94a3b8', '#f472b6', '#4ade80']; // colour of the lines at each level
const DOT_COL = ['#e2e8f0', '#38bdf8', '#f472b6', '#facc15'];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Scene4: React.FC = () => {
  const f = useCurrentFrame() - SCENE4_PAD; // 0 = narration starts
  const {fps} = useVideoConfig();
  const pop = (s: number) => spring({frame: f - s, fps, config: {damping: 12}});
  const on = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

  // t: held at 0.4 while the levels are explained, back to 0, then swept to 1
  const t = f < 191 ? 0.4 : f < 205 ? interpolate(f, [191, 205], [0.4, 0], clamp) : interpolate(f, [205, 290], [0, 1], clamp);
  const L = levels(PTS, t);
  const sweeping = f >= 205;
  const n = Math.max(2, Math.round(t * 100));
  const trail = Array.from({length: n + 1}, (_, i) => point(PTS, (i / n) * t));
  const sx = SL_X0 + (SL_X1 - SL_X0) * t;

  // when does each level appear (frames after narration start)
  const dotStart = [0, 40, 100, 144];
  const lineStart = [20, 80, 120];

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif', color: '#e2e8f0'}}>
      <Audio src={staticFile('narr/scene4.wav')} />
      <svg width={1280} height={720}>
        {/* lines of each level */}
        {L.slice(0, -1).map((pts, li) => (
          <polyline key={li} points={pts.map((p) => p.join(',')).join(' ')} fill="none"
            stroke={LINE_COL[li]} strokeWidth={li === 0 ? 4 : 5} opacity={on(lineStart[li], lineStart[li] + 15)} />
        ))}
        {sweeping && <polyline points={trail.map((p) => p.join(',')).join(' ')} fill="none" stroke="#facc15" strokeWidth={7} strokeLinecap="round" />}
        {/* dots of each level */}
        {L.map((pts, li) => pts.map((p, i) => (
          <g key={`${li}-${i}`} transform={`translate(${p[0]} ${p[1]}) scale(${pop(dotStart[li] + (li === 0 ? i * 8 : 0))})`}>
            <circle r={li === 0 ? 15 : li === 3 ? 18 : 13} fill={DOT_COL[li]} />
            {li === 0 && <text x={22} y={-20} fontSize={34} fontWeight={600} fill="#e2e8f0">P{i}</text>}
          </g>
        )))}
        {/* t slider */}
        <g opacity={on(40, 60)}>
          <line x1={SL_X0} y1={SL_Y} x2={SL_X1} y2={SL_Y} stroke="#475569" strokeWidth={6} strokeLinecap="round" />
          <line x1={SL_X0} y1={SL_Y} x2={sx} y2={SL_Y} stroke="#facc15" strokeWidth={6} strokeLinecap="round" />
          <text x={SL_X0 - 30} y={SL_Y + 10} textAnchor="end" fontSize={28} fill="#94a3b8">0</text>
          <text x={SL_X1 + 30} y={SL_Y + 10} fontSize={28} fill="#94a3b8">1</text>
          <circle cx={sx} cy={SL_Y} r={13} fill="#facc15" />
          <text x={640} y={SL_Y - 24} textAnchor="middle" fontSize={40} fontFamily="monospace" fill="#facc15">t = {t.toFixed(2)}</text>
        </g>
        {/* name of the method, when it is said */}
        <text x={640} y={70} textAnchor="middle" fontSize={44} fontWeight={600} fill="#e2e8f0" opacity={on(267, 290)}>de Casteljau's algorithm</text>
      </svg>
    </AbsoluteFill>
  );
};
