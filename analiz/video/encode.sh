#!/usr/bin/env bash
# Kullanım: encode.sh KARE_KLASORU [CIKIS.mp4]
# Girdi: kare-00000.jpg … kare-00839.jpg (1080×1920, 30 fps). Ses: ses/anlatim.mp3 varsa -14 LUFS'a normalize edilip eklenir, yoksa sessiz AAC kanalı.
set -euo pipefail
KARE="${1:?kare klasörü}"; CIKIS="${2:-out/coklu-dil-reels.mp4}"
cd "$(dirname "$0")"; mkdir -p "$(dirname "$CIKIS")"
SES=ses/anlatim.mp3
VF="scale=1080:1920:in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:flags=accurate_rnd+full_chroma_int,format=yuv420p"
if [ -f "$SES" ]; then
  # iki geçişli loudnorm: -14 LUFS, -1.5 dBTP
  ISTAT=$(ffmpeg -hide_banner -i "$SES" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  MI=$(echo "$ISTAT" | grep input_i | sed 's/[^0-9.-]//g'); MT=$(echo "$ISTAT" | grep input_tp | sed 's/[^0-9.-]//g'); ML=$(echo "$ISTAT" | grep input_lra | sed 's/[^0-9.-]//g'); MO=$(echo "$ISTAT" | grep input_thresh | sed 's/[^0-9.-]//g')
  AF="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$MI:measured_TP=$MT:measured_LRA=$ML:measured_thresh=$MO:linear=true,apad,atrim=0:28,aresample=48000,aformat=channel_layouts=stereo"
  AIN=(-i "$SES")
else
  AF="anull"; AIN=(-f lavfi -t 28 -i anullsrc=r=48000:cl=stereo)
fi
ffmpeg -hide_banner -y -framerate 30 -i "$KARE/kare-%05d.jpg" "${AIN[@]}" \
  -vf "$VF" -af "$AF" -frames:v 840 -t 28 \
  -c:v libx264 -profile:v high -preset slow -crf 17 -maxrate 14M -bufsize 28M -r 30 -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 160k -ar 48000 -ac 2 -movflags +faststart "$CIKIS"
echo "yazıldı: $CIKIS"
