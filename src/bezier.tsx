import React from 'react';
export type P = [number, number];
export const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
export const levels = (pts: P[], t: number): P[][] => {
  const out: P[][] = [pts];
  while (out[out.length - 1].length > 1) {
    const c = out[out.length - 1];
    out.push(c.slice(1).map((p, i) => lerp(c[i], p, t)));
  }
  return out;
};
export const point = (pts: P[], t: number): P => { const l = levels(pts, t); return l[l.length - 1][0]; };
const COL = ['#94a3b8', '#38bdf8', '#f472b6', '#facc15'];
export const Bezier: React.FC<{pts: P[]; t: number; showLevels?: boolean; labels?: boolean}> = ({pts, t, showLevels = true, labels = true}) => {
  const lv = levels(pts, t);
  const n = Math.max(2, Math.round(t * 80));
  const trail = Array.from({length: n + 1}, (_, i) => point(pts, (i / n) * t));
  return (
    <svg width={1280} height={720} style={{position: 'absolute'}}>
      <polyline points={trail.map((p) => p.join(',')).join(' ')} fill="none" stroke="#facc15" strokeWidth={6} strokeLinecap="round" />
      {showLevels && lv.slice(0, -1).map((L, li) => (
        <g key={li}>
          <polyline points={L.map((p) => p.join(',')).join(' ')} fill="none" stroke={COL[li]} strokeWidth={3} opacity={0.9} />
          {lv[li + 1].map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r={li === lv.length - 2 ? 12 : 8} fill={COL[li + 1]} />)}
        </g>
      ))}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r={11} fill="#e2e8f0" />
          {labels && <text x={p[0] + 16} y={p[1] - 14} fill="#e2e8f0" fontSize={28} fontFamily="sans-serif">P{i}</text>}
        </g>
      ))}
    </svg>
  );
};
