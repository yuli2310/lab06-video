import json, soundfile as sf
from kokoro_onnx import Kokoro
S = [
 "Every smooth curve on your screen, from fonts to logos to animations, is built from one tiny trick. Let's see it.",
 "Start with two points. The simplest curve is a straight line. Slide a dot along it, with t going from zero to one.",
 "Add a third point. Now two dots slide along two lines. Connect them, and slide a third dot along that new line. The path of the last dot is a curve.",
 "With four points, repeat once more: lines between lines between lines. The last dot traces a cubic Bézier curve, the kind your design software uses.",
 "Move a control point, and the whole curve follows, smoothly. That is why designers can shape curves with just a few handles.",
 "Do all that interpolation at once, and you get this polynomial. Nothing more than repeated averaging.",
 "Repeated midpoints. That is how smooth curves are drawn.",
]
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
d = []
for i, t in enumerate(S, 1):
    s, sr = k.create(t, voice="af_heart", speed=1.0, lang="en-us")
    sf.write(f"public/narr/s{i}.wav", s, sr)
    d.append(round(len(s)/sr, 2))
json.dump(d, open("src/durations.json", "w"))
print(d, sum(d))
