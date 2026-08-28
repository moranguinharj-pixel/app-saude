export type AnatomicalSide = "front" | "back" | "left" | "right";

type AssetDimensions = { width: number; height: number };
type BodyBounds = { top: number; bottom: number };
export type NormalizedRect = { left: number; top: number; width: number; height: number };

const ASSET_DIMENSIONS: Record<AnatomicalSide, AssetDimensions> = {
  front: { width: 435, height: 1190 },
  back: { width: 457, height: 1176 },
  left: { width: 211, height: 1152 },
  right: { width: 215, height: 1216 },
};

export const ASSET_BODY_BOUNDS: Record<AnatomicalSide, BodyBounds> = {
  front: { top: 0.045, bottom: 0.955 },
  back: { top: 0.045, bottom: 0.955 },
  left: { top: 0.045, bottom: 0.955 },
  right: { top: 0.045, bottom: 0.955 },
};

export function containedAssetRect(side: AnatomicalSide, containerAspectRatio: number): NormalizedRect {
  const asset = ASSET_DIMENSIONS[side];
  const assetAspectRatio = asset.width / asset.height;

  if (assetAspectRatio > containerAspectRatio) {
    const height = containerAspectRatio / assetAspectRatio;
    return { left: 0, top: (1 - height) / 2, width: 1, height };
  }

  const width = assetAspectRatio / containerAspectRatio;
  return { left: (1 - width) / 2, top: 0, width, height: 1 };
}

export function mapPointToBody(
  side: AnatomicalSide,
  mapX: number,
  mapY: number,
  containerAspectRatio: number,
): { x: number; y: number } {
  const rect = containedAssetRect(side, containerAspectRatio);
  const assetX = (mapX - rect.left) / rect.width;
  const assetY = (mapY - rect.top) / rect.height;

  return {
    x: Math.max(0, Math.min(1, assetX)),
    y: canonicalBodyY(side, assetY),
  };
}

export function bodyPointToMap(
  side: AnatomicalSide,
  bodyX: number,
  bodyY: number,
  containerAspectRatio: number,
): { x: number; y: number } {
  const rect = containedAssetRect(side, containerAspectRatio);
  return {
    x: rect.left + Math.max(0, Math.min(1, bodyX)) * rect.width,
    y: rect.top + assetYFromCanonical(side, bodyY) * rect.height,
  };
}

export function canonicalBodyY(side: AnatomicalSide, rawY: number): number {
  const bounds = ASSET_BODY_BOUNDS[side];
  return Math.max(0, Math.min(1, (rawY - bounds.top) / (bounds.bottom - bounds.top)));
}

export function assetYFromCanonical(side: AnatomicalSide, canonicalY: number): number {
  const bounds = ASSET_BODY_BOUNDS[side];
  return bounds.top + Math.max(0, Math.min(1, canonicalY)) * (bounds.bottom - bounds.top);
}
