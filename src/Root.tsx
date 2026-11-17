import {Composition} from 'remotion';
import {Explainer, totalFrames} from './Explainer';
import {Scene1, SCENE1_FRAMES} from './scenes/Scene1';
export const Root = () => (
  <>
    <Composition id="Scene1" component={Scene1} durationInFrames={SCENE1_FRAMES} fps={30} width={1280} height={720} />
  <Composition id="Explainer" component={Explainer} durationInFrames={totalFrames} fps={30} width={1280} height={720} />
  </>
);
