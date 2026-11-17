import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {point, P} from '../bezier';

export const SCENE6_AUDIO_SEC = 5.72;
export const SCENE6_PAD = 15;
export const SCENE6_FRAMES = Math.ceil(SCENE6_AUDIO_SEC * 30) + SCENE6_PAD * 2;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const CX = [230, 640, 1050]; // panel centres
const PW = 340, PY0 = 130, PH = 340; // panel size and top

// 1. a font letter: the S made of three cubic curves (same shape as scene 5)
const S_PATH = 'M 880 210 C 850 90 440 70 440 250 C 440 330 840 410 840 490 C 840 640 430 650 400 500';
// 2. a vector logo: a heart from two cubic curves (centred on 0,0)
const HEART = 'M 0 70 C -130 -20 -70 -110 0 -45 C 70 -110 130 -20 0 70 Z';
// 3. ease-in-out as a cubic Bézier: control points on a 0..1 box
const EASE: P[] = [[0, 0], [0.42, 0], [0.58, 1], [1, 1]];

const Panel: React.FC<{i: number; label: string; show: number; children: React.ReactNode}> = ({i, label, show, children}) => (
  <g opacity={show} transform={`translate(0 ${(1 - show) * 24})`}>
    <rect x={CX[i] - PW / 2} y={PY0} width={PW} height={PH} rx={22} fill="#1e293b" stroke="#334155" strokeWidth={2} />
    {children}
    <text x={CX[i]} y={PY0 + PH + 56} textAnchor="middle" fontSize={36} fontWeight={600} fill="#e2e8f0">{label}</text>
  </g>
);

export const Scene6: React.FC = () => {
  const f = useCurrentFrame() - SCENE6_PAD; // 0 = narration starts
  const on = (a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

  // easing demo: dot on the ease curve; ball position = eased progress
  const tp = Math.min(1, Math.max(0, (((f - 47) % 80) - 5) / 70)); // hold at both ends
  const ep = point(EASE, Math.max(0, tp));
  const BX = CX[2] - 120, BY = PY0 + 40, BS = 240; // graph box (top-left, size)
  const graph = (p: P): P => [BX + p[0] * BS, BY + BS - p[1] * BS];
  const curve = Array.from({length: 41}, (_, i) => graph(point(EASE, i / 40)));
  const ballY = PY0 + PH - 30 - ep[1] * 0; // keep ball on a horizontal track below
  const trackX0 = CX[2] - 120, trackX1 = CX[2] + 120;
  const ballX = trackX0 + ep[1] * (trackX1 - trackX0);

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif', color: '#e2e8f0'}}>
      <Audio src={staticFile('narr/scene6.wav')} />
      <svg width={1280} height={720}>
        <Panel i={0} label="Fonts" show={on(3, 18)}>
          <g transform={`translate(${CX[0]} ${PY0 + PH / 2}) scale(0.5) translate(-640 -360)`}>
            <path d={S_PATH} fill="none" stroke="#f8fafc" strokeWidth={46} strokeLinecap="round" />
          </g>
        </Panel>
        <Panel i={1} label="Vector logos" show={on(20, 35)}>
          <g transform={`translate(${CX[1]} ${PY0 + PH / 2}) scale(1.7)`}>
            <path d={HEART} fill="#f472b6" stroke="#fda4af" strokeWidth={3} strokeLinejoin="round" />
          </g>
        </Panel>
        <Panel i={2} label="Animation easing" show={on(47, 62)}>
          <rect x={BX} y={BY} width={BS} height={BS} fill="none" stroke="#475569" strokeWidth={2} />
          <polyline points={curve.map((p) => p.join(',')).join(' ')} fill="none" stroke="#facc15" strokeWidth={6} strokeLinecap="round" />
          <circle cx={graph(ep)[0]} cy={graph(ep)[1]} r={9} fill="#38bdf8" />
          <line x1={trackX0} y1={ballY} x2={trackX1} y2={ballY} stroke="#475569" strokeWidth={4} strokeLinecap="round" />
          <circle cx={ballX} cy={ballY} r={14} fill="#38bdf8" />
        </Panel>
        <text x={640} y={680} textAnchor="middle" fontSize={44} fontWeight={600} fill="#facc15" opacity={on(91, 111)}>
          Repeated midpoints → smooth curves
        </text>
      </svg>
    </AbsoluteFill>
  );
};
