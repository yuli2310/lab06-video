# Bézier curves: how repeated midpoints draw every smooth curve

**What the viewer should understand:** a Bézier curve is traced by a dot that slides along lines between lines between control points. That same simple step, repeated, gives the curves of fonts, logos and animation.

Target: about 60–70 seconds, 6 scenes, one file each in `src/scenes/`. All visuals drawn in code (SVG in Remotion). Narration: Kokoro, English.

## Scene 1 – Motivation and the formula (~15s) `Scene1.tsx`
- **Screen:** a large letter S; zoom in on a bend to show it stays smooth at any size. It turns into a thin curve with four points P0–P3. The curve shrinks to the top; below it, a line A—B with a dot t of the way along it, and the formula `point = (1 − t)·A + t·B` whose parts light up as they are spoken.
- **Narration:** "Look at this letter. How does a computer draw a perfectly smooth curve, at any size? It stores just four points and one tiny formula: a weighted average. The point t of the way from A to B is one minus t, times A, plus t times B."

## Scene 2 – Two points (~10s) `Scene2.tsx`
- **Screen:** P0 and P1 with the line between them. A blue dot moves along it as t runs 0.00 → 1.00, with a counter.
- **Narration:** "Start with two points. Pick a number t between zero and one, and put a dot that fraction of the way along the line. Slide t, and the dot slides."

## Scene 3 – Three points (~12s) `Scene3.tsx`
- **Screen:** three points and two lines. A blue dot on each line, a pink line between them, and a pink dot on it that leaves a yellow trail.
- **Narration:** "Add a third point. Put a dot on each line at the same t, connect them, and put one more dot on that new line. As t grows, this last dot traces a curve."

## Scene 4 – Four points (~11s) `Scene4.tsx`
- **Screen:** same idea with four points and three levels of lines in different colors. The last dot draws a cubic curve; label "de Casteljau".
- **Narration:** "With four points, repeat once more: lines between lines between lines, until one dot is left. That dot draws a cubic Bézier curve. This is called de Casteljau's algorithm."

## Scene 5 – Handles and chains (~11s) `Scene5.tsx`
- **Screen:** handles move slowly and the curve bends; dashed lines from each end to its handle. Then the S returns, split into three curves of different colors.
- **Narration:** "Move a handle and the curve bends smoothly. It always starts and ends at the end points, and leaves each one pointing toward its handle. Complex shapes, like this S, are several of these curves joined end to end."

## Scene 6 – Where it lives (~8s) `Scene6.tsx`
- **Screen:** three panels: a font letter, a vector logo, an ease-in-out graph with a moving circle. Closing title.
- **Narration:** "You find these curves in fonts, vector logos, and animation easing. Repeated midpoints: that is how smooth curves are drawn."

## Technical notes
- 1280×720, 30 fps. Scene length follows its narration audio. New file name for every render (`out/render-NN.mp4`).
