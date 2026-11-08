# Seslendirme denemesi (API anahtarı yok)

`samples/tr_TR-dfki-medium.wav`: Piper TTS (`pip install piper-tts`), ses `rhasspy/piper-voices` → `tr/tr_TR/dfki/medium`.
Metin: `samples/ornek-metin.txt`. Model kartı: `samples/tr_TR-dfki-medium.MODEL_CARD.md`.

**Lisans:** Eğitim verisi (marytts/dfki-ot-data) **CC BY-NC-SA 4.0** — ticari kullanım serbest değil. Bu ses yalnızca deneme içindir; pazarlama videosunda kullanılmamalı.
`tr_TR-fahrettin-medium` ve `tr_TR-fettah-medium` rhasspy/piper-voices deposunda yok (404).

Yeniden üretmek için:
```sh
B=https://huggingface.co/rhasspy/piper-voices/resolve/main/tr/tr_TR/dfki/medium
curl -LO $B/tr_TR-dfki-medium.onnx -LO $B/tr_TR-dfki-medium.onnx.json   # model repoya eklenmez (63 MB)
python3 -m piper -m tr_TR-dfki-medium.onnx -f samples/tr_TR-dfki-medium.wav < samples/ornek-metin.txt
```
