import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {P, point} from '../bezier';

export const SCENE1_AUDIO_SEC = 7.17;
export const SCENE1_PAD = 15;
export const SCENE1_FRAMES = Math.ceil(SCENE1_AUDIO_SEC * 30) + SCENE1_PAD * 2;

// The four stored points of the "S" (one cubic Bézier).
export const S_PTS: P[] = [[420, 600], [960, 640], [320, 90], [860, 130]];
const COLORS = ['#38bdf8', '#f472b6', '#f472b6', '#38bdf8'];
const path = `M ${S_PTS[0]} C ${S_PTS[1]} ${S_PTS[2]} ${S_PTS[3]}`;
const FOCUS = point(S_PTS, 0.5);

export const Scene1: React.FC = () => {
  const f = useCurrentFrame() - SCENE1_PAD; // 0 = narration starts
  const {fps} = useVideoConfig();
  const ease = Easing.inOut(Easing.cubic);
  // zoom in while the question is asked, then back out
  const zoom = interpolate(f, [30, 100, 120, 150], [1, 4, 4, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  // letter -> thin curve once "four points" starts
  const thin = interpolate(f, [140, 165], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fadeIn = interpolate(f, [-10, 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const strokeW = 110 - 104 * thin;
  const pop = (start: number) => spring({frame: f - start, fps, config: {damping: 12}});
  const startAt = [165, 180, 195, 210];

  return (
    <AbsoluteFill style={{background: '#0f172a', fontFamily: 'sans-serif'}}>
      <Audio src={staticFile('narr/scene1.wav')} startFrom={0} />
      <svg width={1280} height={720} style={{opacity: fadeIn}}>
        <g transform={`translate(${FOCUS[0]} ${FOCUS[1]}) scale(${zoom}) translate(${-FOCUS[0]} ${-FOCUS[1]})`}>
          {/* handle lines */}
          <polyline points={S_PTS.map((p) => p.join(',')).join(' ')} fill="none" stroke="#94a3b8" strokeWidth={2 / zoom} strokeDasharray="10 8" opacity={thin} />
          {/* the curve: a fat white letter that becomes a thin yellow curve */}
          <path d={path} fill="none" strokeLinecap="round" strokeWidth={strokeW}
            stroke={thin > 0.5 ? '#facc15' : '#f8fafc'} />
          {S_PTS.map((p, i) => (
            <g key={i} transform={`translate(${p[0]} ${p[1]}) scale(${pop(startAt[i])})`}>
              <circle r={15} fill={COLORS[i]} />
              <text x={22} y={-20} fill="#e2e8f0" fontSize={34} fontWeight={600}>P{i}</text>
            </g>
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
