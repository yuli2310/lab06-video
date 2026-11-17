import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import durs from './durations.json';
import {Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7} from './scenes/Scenes';
const FPS = 30, PAD = 15;
const scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6, Scene7];
const lens = durs.map((d) => Math.ceil(d * FPS) + PAD * 2);
export const totalFrames = lens.reduce((a, b) => a + b, 0);
export const Explainer: React.FC = () => {
  let start = 0;
  return (
    <>
      {scenes.map((S, i) => {
        const from = start; start += lens[i];
        return (
          <Sequence key={i} from={from} durationInFrames={lens[i]}>
            <S />
            <Sequence from={PAD}><Audio src={staticFile(`narr/s${i + 1}.wav`)} /></Sequence>
          </Sequence>
        );
      })}
    </>
  );
};
