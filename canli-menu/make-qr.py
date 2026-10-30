#!/usr/bin/env python3
"""Canlı menü QR kodlarını üretir: python3 canli-menu/make-qr.py  (gerekir: pip install segno)
Adresler canli-menu/index.html içindeki demo bağlantılarıyla aynı olmalıdır."""
import pathlib
import segno

DEMOS = {
    "temel": "https://temel.qrmenuofficial.com/",
    "pro": "https://test.qrmenuofficial.com/",
    "plus": "https://full.qrmenuofficial.com/",
}
UTM = "?utm_source=qrmenuofficial&utm_medium=qr&utm_campaign=canli-menu&utm_content="

out = pathlib.Path(__file__).resolve().parent / "qr"
out.mkdir(exist_ok=True)
for pkg, url in DEMOS.items():
    qr = segno.make(url + UTM + pkg, error="m")
    size = qr.symbol_size(border=0)[0]
    target = out / f"{pkg}.svg"
    qr.save(str(target), kind="svg", scale=1, border=0, dark="#0D2B22", light=None, xmldecl=False, svgns=True)
    # <img> ile ölçeklenebilsin diye sabit boyut yerine viewBox
    svg = target.read_text().replace(f'width="{size}" height="{size}"', f'viewBox="0 0 {size} {size}" shape-rendering="crispEdges"', 1)
    target.write_text(svg)
    print(out / f"{pkg}.svg")
