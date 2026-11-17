import json, soundfile as sf
from kokoro_onnx import Kokoro
# Narration of the final 6-scene video (one wav per scene). Edit the text here and re-run.
TEXT = [
 "Look at this letter. How does a computer draw a perfectly smooth curve, at any size? It stores just four points, and repeats one tiny formula: a weighted average of two points.",
 "Take two points. Their plain average is the midpoint: half of A, half of B. A weighted average lets us choose: one minus t of A, plus t of B. At t equals zero we are at A, at one, at B.",
 "Add a third point. Do it between each pair, at the same t, then once more between those two. As t slides, this last dot traces a curve.",
 "With four points, repeat once more: lines between lines between lines, until one dot is left. That dot draws a cubic Bézier curve: de Casteljau's algorithm.",
 "Move a handle, and the curve bends smoothly. It starts and ends at the end points, pointing toward its handles. Complex shapes, like this S, join several such curves.",
 "Fonts, vector logos, animation easing: repeated midpoints is how smooth curves are drawn.",
]
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
durs = []
for i, t in enumerate(TEXT, 1):
    s, sr = k.create(t, voice="af_heart", speed=1.1, lang="en-us")
    sf.write(f"public/narr/scene{i}.wav", s, sr)
    durs.append(round(len(s) / sr, 2))
print(durs, round(sum(durs), 1))
