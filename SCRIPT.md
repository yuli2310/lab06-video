# Bézier curves: how repeated midpoints draw every smooth curve

**What the viewer should understand:** a Bézier curve is traced by a dot that slides along lines between lines between control points. Every step is the same tiny formula, a weighted average of two points, `(1 − t)·A + t·B`, and `t` is just a number we slide from 0 to 1.

Hard limit: the full video must be at most 60 seconds (render-05 is 58.9s). 6 scenes, one file each in `src/scenes/`. All visuals drawn in code (SVG in Remotion). Narration: Kokoro, English (`tools/narrate_scenes.py` holds the exact text).

## Scene 1 – Motivation (~10s) `Scene1.tsx`
- **Screen:** a large letter S; zoom in on a bend to show it stays smooth at any size. It turns into a thin curve with four points P0–P3. The curve moves to the top and a line A—B with the formula appears.
- **Narration:** "Look at this letter. How does a computer draw a perfectly smooth curve, at any size? It stores just four points, and repeats one tiny formula: a weighted average of two points."

## Scene 2 – The formula and t (~12s) `Scene2.tsx`
- **Screen:** points A and B. First the plain average: a dot at the midpoint, "½·A + ½·B". Then the weighted average: the formula `point = (1 − t)·A + t·B` lights up piece by piece, with a bar showing the weight of A and of B, and the dot at t = 0.35. Finally t slides 0 → 1 and the dot and the bar follow.
- **Narration:** "Take two points. Their plain average is the midpoint: half of A, half of B. A weighted average lets us choose: one minus t of A, plus t of B. At t equals zero we are at A, at one, at B."

## Scene 3 – Three points (~8s) `Scene3.tsx`
- **Screen:** three points and two lines. Blue dots at the same t on each line, a pink line between them, a pink dot on it; as t slides the pink dot leaves a yellow trail.
- **Narration:** "Add a third point. Do it between each pair, at the same t, then once more between those two. As t slides, this last dot traces a curve."

## Scene 4 – Four points (~10s) `Scene4.tsx`
- **Screen:** four points, three levels of lines in different colors, the last dot draws a cubic curve; title "de Casteljau's algorithm".
- **Narration:** "With four points, repeat once more: lines between lines between lines, until one dot is left. That dot draws a cubic Bézier curve: de Casteljau's algorithm."

## Scene 5 – Handles and chains (~10s) `Scene5.tsx`
- **Screen:** handles move and the curve bends; rings on the end points; orange dashed lines from each end to its handle. Then the S appears as three curves of different colors joined at white dots.
- **Narration:** "Move a handle, and the curve bends smoothly. It starts and ends at the end points, pointing toward its handles. Complex shapes, like this S, join several such curves."

## Scene 6 – Where it lives (~6s) `Scene6.tsx`
- **Screen:** three panels: a font letter, a vector logo, an ease-in-out graph with a moving ball. Closing title.
- **Narration:** "Fonts, vector logos, animation easing: repeated midpoints is how smooth curves are drawn."

## Technical notes
- 1280×720, 30 fps. Scene length follows its narration audio; cue times were measured from the pauses in each audio file (`ffmpeg silencedetect`). Scenes overlap by 20 frames and cross-fade. New file name for every render (`out/render-NN.mp4`).
