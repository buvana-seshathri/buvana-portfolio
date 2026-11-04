"""Renders the original "silk" wallpapers for the Projects desktop into src/assets/desktop/wallpapers/.
python3 tools/make-wallpapers.py
Each wallpaper is a few translucent silk sheets folding across a dark background, lit along their edges.
Drop your own images into that folder instead if you like (any jpg/png/webp, sorted by name).
"""
import os
import numpy as np
from PIL import Image, ImageFilter

W, H = 2560, 1440
OUT = os.path.join(os.path.dirname(__file__), '..', 'src', 'assets', 'desktop', 'wallpapers')

def hex3(h):
    h = h.lstrip('#')
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])

def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)

def render(name, bg_top, bg_bot, sheets, glow, seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    u, v = x / W, y / H
    img = (hex3(bg_top)[None, None] * (1 - v[..., None]) + hex3(bg_bot)[None, None] * v[..., None])
    # a soft glow behind the folds
    gx, gy, gr, gc = glow
    d = np.sqrt(((u - gx) * 1.6) ** 2 + (v - gy) ** 2)
    img += hex3(gc)[None, None] * (np.exp(-(d / gr) ** 2) * 0.55)[..., None]

    for s in sheets:
        base, amp, freq, phase, tilt, soft, c_edge, c_body, alpha = s
        curve = base + tilt * (u - 0.5) + amp * np.sin(freq * u * np.pi * 2 + phase) \
            + amp * 0.35 * np.sin(freq * 2.3 * u * np.pi * 2 + phase * 1.7)
        dist = v - curve                         # > 0 below the sheet's top edge
        cover = smooth(-soft, soft, dist)        # inside the sheet
        edge = np.exp(-(dist / (soft * 2.2)) ** 2)         # bright lit rim along the fold
        depth = np.exp(-np.clip(dist, 0, None) / 0.22)     # light falls off into the sheet
        col = hex3(c_body)[None, None] * (0.35 + 0.65 * depth[..., None]) + hex3(c_edge)[None, None] * edge[..., None] * 0.9
        a = (cover * alpha)[..., None]
        img = img * (1 - a) + col * a
        img += hex3(c_edge)[None, None] * (edge * (1 - cover) * 0.25)[..., None]  # a little bloom above the rim

    # vignette + fine grain so gradients don't band
    vig = 1 - 0.38 * (((u - 0.5) * 1.4) ** 2 + ((v - 0.55) * 1.2) ** 2)
    img *= vig[..., None]
    img += rng.normal(0, 0.012, img.shape)
    img = np.clip(img, 0, 1)
    out = Image.fromarray((img * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    os.makedirs(OUT, exist_ok=True)
    path = os.path.join(OUT, name)
    out.save(path, quality=86, optimize=True, progressive=True)
    print('wrote', path, os.path.getsize(path) // 1024, 'KB')

# sheet: (base y, amplitude, frequency, phase, tilt, edge softness, edge color, body color, opacity)
render('1-dusk-silk.jpg', '#07061A', '#120E33',
       [(0.62, 0.08, 0.55, 0.4, -0.25, 0.012, '#C6D5FF', '#3B2C9A', 0.92),
        (0.70, 0.07, 0.75, 2.2, -0.15, 0.010, '#E2DCFB', '#5A3FCC', 0.9),
        (0.80, 0.06, 0.6, 4.1, -0.05, 0.010, '#9AB0FF', '#2B3FC9', 0.92),
        (0.90, 0.05, 0.9, 1.3, 0.10, 0.008, '#F4B8D4', '#6D4AE0', 0.85)],
       (0.62, 0.55, 0.42, '#3B4EE6'), 1)

render('2-midnight-bloom.jpg', '#04050F', '#0B0E2A',
       [(0.48, 0.10, 0.45, 1.0, 0.30, 0.012, '#9EF0FF', '#1E3A9A', 0.88),
        (0.60, 0.09, 0.6, 3.0, 0.22, 0.010, '#C6D5FF', '#3048C8', 0.9),
        (0.74, 0.07, 0.8, 5.0, 0.12, 0.010, '#E2DCFB', '#4B35B0', 0.9),
        (0.86, 0.05, 0.7, 2.6, 0.04, 0.008, '#819BFF', '#21307F', 0.9)],
       (0.35, 0.5, 0.45, '#2A6BE0'), 2)

render('3-rose-hour.jpg', '#0E0718', '#1E0F2E',
       [(0.58, 0.09, 0.5, 2.0, -0.18, 0.012, '#FFD1E6', '#8A3F9E', 0.9),
        (0.68, 0.08, 0.7, 0.6, -0.10, 0.010, '#F4B8D4', '#B04E8E', 0.88),
        (0.79, 0.06, 0.65, 3.6, 0.0, 0.010, '#E2DCFB', '#6D4AE0', 0.9),
        (0.90, 0.05, 0.85, 5.2, 0.08, 0.008, '#FFE3C2', '#9A3E78', 0.85)],
       (0.66, 0.52, 0.42, '#C04FA0'), 3)
