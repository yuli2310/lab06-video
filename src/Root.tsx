import {Composition} from 'remotion';
import {Explainer, totalFrames} from './Explainer';
import {Scene1, SCENE1_FRAMES} from './scenes/Scene1';
import {Scene2, SCENE2_FRAMES} from './scenes/Scene2';
import {Scene3, SCENE3_FRAMES} from './scenes/Scene3';
import {Scene4, SCENE4_FRAMES} from './scenes/Scene4';
import {Scene5, SCENE5_FRAMES} from './scenes/Scene5';
import {Scene6, SCENE6_FRAMES} from './scenes/Scene6';
export const Root = () => (
  <>
    <Composition id="Scene1" component={Scene1} durationInFrames={SCENE1_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="Scene2" component={Scene2} durationInFrames={SCENE2_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="Scene3" component={Scene3} durationInFrames={SCENE3_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="Scene4" component={Scene4} durationInFrames={SCENE4_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="Scene5" component={Scene5} durationInFrames={SCENE5_FRAMES} fps={30} width={1280} height={720} />
    <Composition id="Scene6" component={Scene6} durationInFrames={SCENE6_FRAMES} fps={30} width={1280} height={720} />
  <Composition id="Explainer" component={Explainer} durationInFrames={totalFrames} fps={30} width={1280} height={720} />
  </>
);
