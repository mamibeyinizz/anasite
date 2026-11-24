#!/usr/bin/env bash
# v9 kodlama (CUE_DOSYA / VOX_DOSYA ile kısa sürümü de kodlar). Kullanım: encode-v9.sh KARE_KLASORU [CIKIS.mp4]
# Video: 1080×1920, 30 fps, H.264 high yuv420p, bt709, ~6,5 Mbps, noise/dither, +faststart. Süre = konuşma bitişi + 0,8 sn ($CUEF).
# Ses  : ses/anlatim-v4.mp3 (mono 44,1 → stereo 48 kHz) + ambient bed (konuşmaya göre ≈ -20 dB, sidechain ducking ≈ -6 dB → konuşma altında ≈ -26 dB);
#        toplam -14 LUFS (iki geçişli loudnorm), tepe ≤ -1,5 dBTP, 48 kHz stereo AAC. Konuşma hızı DEĞİŞTİRİLMEZ; duraklar ≤ 0,45 sn olduğu için kırpma yok.
set -euo pipefail
KARE="${1:?kare klasörü}"; CIKIS="${2:-out/coklu-dil-reels_v9.mp4}"; CUEF="${CUE_DOSYA:-ses/cue-v4.json}"; VOX="${VOX_DOSYA:-ses/anlatim-v4.mp3}"
cd "$(dirname "$0")"; mkdir -p "$(dirname "$CIKIS")"
read -r SURE NKARE < <(python3 -c "import json;c=json.load(open('$CUEF'));print(round(c['konusmaBitis']+0.8,3), round((c['konusmaBitis']+0.8)*30))")
DUR=$(python3 -c "print($NKARE/30)")
[ -f ses/ambient-bed.wav ] || python3 render/ses-uret.py
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
BED=ses/ambient-bed.wav
VLUFS=$(ffmpeg -hide_banner -i "$VOX" -af ebur128 -f null - 2>&1 | grep -A8 Summary | grep "I:" | sed 's/[^0-9.-]//g')
BLUFS=$(ffmpeg -hide_banner -i "$BED" -af ebur128 -f null - 2>&1 | grep -A8 Summary | grep "I:" | sed 's/[^0-9.-]//g')
BGAIN=$(python3 -c "print(round(($VLUFS-20)-($BLUFS),2))")          # bed ≈ konuşmanın 20 dB altına
VOXF="aresample=48000,aformat=channel_layouts=stereo,apad,atrim=0:${DUR}"
BEDF="aloop=loop=-1:size=2147483647,atrim=0:${DUR},asetpts=N/SR/TB,volume=${BGAIN}dB"
MIX="[1:a]${VOXF},asplit[v1][v2];[0:a]${BEDF}[bed];[bed][v2]sidechaincompress=threshold=0.02:ratio=3:attack=20:release=300:makeup=1[duck];[duck][v1]amix=inputs=2:normalize=0:duration=first[m]"
GIRIS=(-i "$BED" -i "$VOX")
ISTAT=$(ffmpeg -hide_banner "${GIRIS[@]}" -filter_complex "${MIX};[m]loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json[o]" -map "[o]" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$ISTAT" | grep "\"$1\"" | sed 's/[^0-9.-]//g'; }
NORM="loudnorm=I=-14:TP=-1.5:LRA=7:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true,alimiter=limit=-2.0dB:level=disabled"
ffmpeg -hide_banner -loglevel error -y "${GIRIS[@]}" -filter_complex "${MIX};[m]${NORM},apad,atrim=0:${DUR},aresample=48000[o]" -map "[o]" -ar 48000 -ac 2 "$TMP/ses.wav"
VF="scale=1080:1920:in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709:flags=accurate_rnd+full_chroma_int,noise=c0s=3:c0f=t+u:c1s=0:c2s=0,format=yuv420p"
ffmpeg -hide_banner -y -framerate 30 -i "$KARE/kare-%05d.jpg" -i "$TMP/ses.wav" -vf "$VF" -frames:v "$NKARE" -t "$DUR" \
  -c:v libx264 -profile:v high -preset slow -b:v 6500k -maxrate 8000k -bufsize 14000k -r 30 -pix_fmt yuv420p \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 160k -ar 48000 -ac 2 -movflags +faststart "$CIKIS" 2>&1 | tail -2
echo "yazıldı: $CIKIS (süre $DUR sn, $NKARE kare, bed kazancı ${BGAIN} dB)"
