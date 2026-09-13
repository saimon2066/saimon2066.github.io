#!/usr/bin/env python3
"""Generate the 800px and 400px variants the gallery's srcset expects.

Usage:  python scripts/make-image-variants.py
Needs:  pip install pillow

Drop a full-size shot into public/images as name.webp (1600px wide is what the
existing ones use), run this, and it writes name-800.webp and name-400.webp
next to it. Files that already end in -800 or -400 are skipped, so it is safe
to run repeatedly.
"""

import glob
import os

from PIL import Image

FOLDER = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
WIDTHS = {800: 80, 400: 76}  # width -> webp quality


def main():
    for path in sorted(glob.glob(os.path.join(FOLDER, '*.webp'))):
        name = os.path.basename(path)
        if '-800' in name or '-400' in name:
            continue

        image = Image.open(path).convert('RGB')
        for width, quality in WIDTHS.items():
            out = path.replace('.webp', f'-{width}.webp')
            height = round(width * image.height / image.width)
            image.resize((width, height), Image.LANCZOS).save(
                out, 'WEBP', quality=quality, method=6
            )
            print(f'{os.path.basename(out)}  {os.path.getsize(out) // 1024} kB')


if __name__ == '__main__':
    main()
