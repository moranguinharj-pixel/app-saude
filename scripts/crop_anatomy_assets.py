from pathlib import Path
from PIL import Image, ImageChops

assets = Path(__file__).resolve().parents[1] / "assets" / "images"
for path in sorted(assets.glob("anatomical-*.png")):
    with Image.open(path).convert("RGB") as image:
        background = Image.new("RGB", image.size, "white")
        diff = ImageChops.difference(image, background)
        mask = diff.convert("L").point(lambda value: 255 if value > 12 else 0)
        bbox = mask.getbbox()
        if bbox is None:
            continue
        left, top, right, bottom = bbox
        margin_x = max(12, int((right - left) * 0.08))
        margin_y = max(12, int((bottom - top) * 0.05))
        left = max(0, left - margin_x)
        top = max(0, top - margin_y)
        right = min(image.width, right + margin_x)
        bottom = min(image.height, bottom + margin_y)
        cropped = image.crop((left, top, right, bottom))
        cropped.save(path, format="PNG", optimize=True)
        print(f"cropped {path.name}: {cropped.size}")
