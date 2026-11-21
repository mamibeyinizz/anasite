#!/usr/bin/env bash
# v2 kodlama. Kullanım: encode-v2.sh KARE_KLASORU [CIKIS.mp4]
# Video: 1080×1920, 30 fps, H.264 high, yuv420p, bt709 etiketli, ~6,5 Mbps, gradyanlarda hafif noise/dither, +faststart.
# Ses  : ses/anlatim.mp3 varsa anlatım + (anlatım altında bastırılmış) ambient bed; yoksa yalnız ambient bed.
#        Çıkış -14 LUFS (±1), tepe ≤ -1 dBTP (iki geçişli loudnorm + limiter).
set -euo pipefail
KARE="${1:?kare klasörü}"; CIKIS="${2:-out/coklu-dil-reels_v2.mp4}"
cd "$(dirname "$0")"; mkdir -p "$(dirname "$CIKIS")"
[ -f ses/ambient-bed.wav ] || python3 render/ses-uret.py
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
BED=ses/ambient-bed.wav; VOX=ses/anlatim.mp3
ON="acompressor=threshold=-26dB:ratio=3:attack=5:release=140:makeup=1,alimiter=limit=-4dB:level=disabled"
if [ -f "$VOX" ]; then
  GIRIS=(-i "$BED" -i "$VOX")
  MIX="[1:a]apad,atrim=0:28,aresample=48000,aformat=channel_layouts=stereo,asplit[v1][v2];[0:a]${ON},volume=0.55[bed];[bed][v2]sidechaincompress=threshold=0.03:ratio=8:attack=20:release=400[duck];[duck][v1]amix=inputs=2:normalize=0:duration=first[m]"
else
  GIRIS=(-i "$BED"); MIX="[0:a]${ON}[m]"
fi
ISTAT=$(ffmpeg -hide_banner "${GIRIS[@]}" -filter_complex "${MIX};[m]loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json[o]" -map "[o]" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$ISTAT" | grep "\"$1\"" | sed 's/[^0-9.-]//g'; }
NORM="loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=-1.6dB:level=disabled"
ffmpeg -hide_banner -loglevel error -y "${GIRIS[@]}" -filter_complex "${MIX};[m]${NORM},apad,atrim=0:28,aresample=48000[o]" -map "[o]" -ar 48000 -ac 2 "$TMP/ses.wav"
VF="scale=1080:1920:in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:flags=accurate_rnd+full_chroma_int,noise=c0s=3:c0f=t+u:c1s=0:c2s=0,format=yuv420p"
ffmpeg -hide_banner -y -framerate 30 -i "$KARE/kare-%05d.jpg" -i "$TMP/ses.wav" -vf "$VF" -frames:v 840 -t 28 \
  -c:v libx264 -profile:v high -preset slow -b:v 6500k -maxrate 8000k -bufsize 14000k -r 30 -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 160k -ar 48000 -ac 2 -movflags +faststart "$CIKIS" 2>&1 | tail -2
echo "yazıldı: $CIKIS"
