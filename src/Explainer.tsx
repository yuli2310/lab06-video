import React from 'react';
import {Sequence} from 'remotion';
import {Scene1, SCENE1_FRAMES} from './scenes/Scene1';
import {Scene2, SCENE2_FRAMES} from './scenes/Scene2';
import {Scene3, SCENE3_FRAMES} from './scenes/Scene3';
import {Scene4, SCENE4_FRAMES} from './scenes/Scene4';
import {Scene5, SCENE5_FRAMES} from './scenes/Scene5';
import {Scene6, SCENE6_FRAMES} from './scenes/Scene6';

// Each scene has 15 frames of silence at both ends; overlap neighbours by 20 frames to tighten the pacing.
const OVERLAP = 20;
const scenes: [React.FC, number][] = [
  [Scene1, SCENE1_FRAMES], [Scene2, SCENE2_FRAMES], [Scene3, SCENE3_FRAMES],
  [Scene4, SCENE4_FRAMES], [Scene5, SCENE5_FRAMES], [Scene6, SCENE6_FRAMES],
];
const starts = scenes.reduce<number[]>((acc, [, n], i) => (i === 0 ? [0] : [...acc, acc[i - 1] + scenes[i - 1][1] - OVERLAP]), []);
export const totalFrames = starts[starts.length - 1] + scenes[scenes.length - 1][1];

export const Explainer: React.FC = () => (
  <>
    {scenes.map(([S, n], i) => (
      <Sequence key={i} from={starts[i]} durationInFrames={n}>
        <S />
      </Sequence>
    ))}
  </>
);
