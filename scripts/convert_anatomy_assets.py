from pathlib import Path
from PIL import Image

assets = Path(__file__).resolve().parents[1] / "assets" / "images"
for path in sorted(assets.glob("anatomical-*.png")):
    with Image.open(path) as image:
        rgb = image.convert("RGB")
        temporary = path.with_suffix(".converted.png")
        rgb.save(temporary, format="PNG", optimize=True)
    temporary.replace(path)
    print(f"converted {path.name}")
