"""Studio-clean Tiffany's own photos.
Usage: /workspace/.rawenv/bin/python scripts/own_photo_studio.py <book_original.jpg> <mode> [out_basename]
mode: studio = remove background (rembg) -> soft neutral gradient + soft shadow, tight crop
      crop   = keep the real background, crop tighter around the subject (for hand-held shots)
      keep   = no change (natural scene)
Writes: book original kept as <name>-orig.jpg (once), cleaned full-res to the book folder,
        1600px web copy + 480px thumb to src/assets/own/ (originals kept as *-orig.jpg). EXIF is always stripped."""
import sys, os, shutil
from PIL import Image, ImageFilter, ImageOps, ImageDraw
BOOK = "/workspace/crystopedia-book/own-photos"; WEB = os.path.join(os.path.dirname(__file__), "..", "src/assets/own")
def clean(im): c = Image.new("RGB", im.size); c.paste(im.convert("RGB")); return c
def mask_of(im):
    from rembg import remove, new_session
    s = new_session("isnet-general-use")
    return remove(im, session=s, only_mask=True, post_process_mask=True)
def bbox_pad(box, size, pad, square=False):
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0; p = int(max(w, h) * pad)
    x0, y0, x1, y1 = x0 - p, y0 - p, x1 + p, y1 + p
    if square or True:  # aim for 4:5 portrait / 5:4 landscape gallery framing
        W, H = x1 - x0, y1 - y0; tr = 4 / 5 if H >= W else 5 / 4
        if W / H < tr: d = int(H * tr - W); x0 -= d // 2; x1 += d - d // 2
        else: d = int(W / tr - H); y0 -= d // 2; y1 += d - d // 2
    return (x0, y0, x1, y1)
def gradient(size, top=(246, 245, 243), bottom=(214, 211, 206)):
    W, H = size; g = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / max(H - 1, 1); g.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    g = g.resize((W, H))
    v = Image.new("L", (W, H), 0); ImageDraw.Draw(v).ellipse((-W * .25, -H * .2, W * 1.25, H * 1.1), fill=255)
    v = v.filter(ImageFilter.GaussianBlur(min(W, H) * .15))
    return Image.composite(g, Image.blend(g, Image.new("RGB", (W, H), (190, 186, 180)), .5), v)
def largest(m):
    # keep only the biggest connected subject (drops coins, cables and other stray objects)
    import numpy as np
    from scipy import ndimage
    a = np.array(m); lab, n = ndimage.label(a > 60)
    if n <= 1: return m
    sizes = ndimage.sum(np.ones_like(a), lab, range(1, n + 1)); keep = 1 + int(np.argmax(sizes))
    a = np.where(ndimage.binary_dilation(lab == keep, iterations=3), a, 0).astype("uint8")
    return Image.fromarray(a)
def studio(im):
    m = mask_of(im).point(lambda v: 255 if v > 128 else (0 if v < 20 else v))
    m = largest(m).filter(ImageFilter.GaussianBlur(1.2))
    box = m.point(lambda v: 255 if v > 60 else 0).getbbox()
    bg = gradient(im.size)
    sh = Image.new("L", im.size, 0); x0, y0, x1, y1 = box; w = x1 - x0
    ImageDraw.Draw(sh).ellipse((x0 + w * .05, y1 - w * .06, x1 - w * .05, y1 + w * .06), fill=120)
    sh = sh.filter(ImageFilter.GaussianBlur(w * .05))
    bg = Image.composite(Image.new("RGB", im.size, (120, 114, 106)), bg, sh)
    soft = m.filter(ImageFilter.GaussianBlur(14)).point(lambda v: int(v * .35))  # contact shadow hugging the stone
    soft = ImageOps.expand(soft, 0).transform(im.size, Image.AFFINE, (1, 0, -6, 0, 1, -10))
    bg = Image.composite(Image.new("RGB", im.size, (110, 104, 98)), bg, soft)
    out = Image.composite(im, bg, m)
    c = bbox_pad(box, im.size, .12)
    canvas = gradient((c[2] - c[0], c[3] - c[1]))
    big = out.crop((max(c[0], 0), max(c[1], 0), min(c[2], im.width), min(c[3], im.height)))
    canvas.paste(big, (max(-c[0], 0), max(-c[1], 0)))
    return canvas
def tight(im, frac):
    W, H = im.size; l, t, r, b = frac
    return im.crop((int(W * l), int(H * t), int(W * r), int(H * b)))
if __name__ == "__main__":
    src, mode = sys.argv[1], sys.argv[2]
    name = os.path.splitext(os.path.basename(src))[0].removesuffix("-orig")
    orig = os.path.join(BOOK, name + "-orig.jpg")
    if not os.path.exists(orig): shutil.copy(src, orig)
    for suf in ["", "-sm"]:
        w = os.path.join(WEB, name + suf + ".jpg"); wo = os.path.join(WEB, name + suf + "-orig.jpg")
        if os.path.exists(w) and not os.path.exists(wo): shutil.copy(w, wo)
    im = clean(ImageOps.exif_transpose(Image.open(orig)))
    if mode == "studio": out = studio(im)
    elif mode == "crop": out = tight(im, [float(x) for x in sys.argv[3].split(",")])
    else: out = im
    out = clean(out); out.save(os.path.join(BOOK, name + ".jpg"), quality=95)
    w = out.copy(); w.thumbnail((1600, 1600)); w.save(os.path.join(WEB, name + ".jpg"), quality=84, optimize=True, progressive=True)
    t = out.copy(); t.thumbnail((480, 480)); t.save(os.path.join(WEB, name + "-sm.jpg"), quality=80, optimize=True)
    print(name, mode, out.size)
