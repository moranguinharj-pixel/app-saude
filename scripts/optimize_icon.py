from pathlib import Path

from PIL import Image


PROJECT = Path("/home/ubuntu/registro-pessoal")
SOURCE = PROJECT / "assets/images/icon.png"
TARGETS = [
    PROJECT / "assets/images/icon.png",
    PROJECT / "assets/images/splash-icon.png",
    PROJECT / "assets/images/favicon.png",
    PROJECT / "assets/images/android-icon-foreground.png",
]


def optimize_icon() -> None:
    with Image.open(SOURCE) as source:
        image = source.convert("RGBA")
        optimized = image.resize((512, 512), Image.Resampling.LANCZOS)
        for target in TARGETS:
            optimized.save(target, format="PNG", optimize=True, compress_level=9)


if __name__ == "__main__":
    optimize_icon()
