import sys, soundfile as sf
from kokoro_onnx import Kokoro
text, out = sys.argv[1], sys.argv[2]
k = Kokoro("models/kokoro-v1.0.onnx", "models/voices-v1.0.bin")
samples, sr = k.create(text, voice="af_heart", speed=1.0, lang="en-us")
sf.write(out, samples, sr)
print(out, round(len(samples)/sr, 2), "sec")
