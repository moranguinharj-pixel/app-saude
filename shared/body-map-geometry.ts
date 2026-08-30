export type AnatomicalSide = "front" | "back" | "left" | "right";

type BodyBounds = { top: number; bottom: number };

type BodyXBounds = { left: number; right: number };

// Limites observados nos próprios PNGs: o corpo ocupa quase toda a largura útil.
// Usar 31%..69% estreitava o corpo para o tronco e deslocava membros/órgãos.
export const ASSET_BODY_X_BOUNDS: Record<AnatomicalSide, BodyXBounds> = {
  front: { left: 0.069, right: 0.931 },
  back: { left: 0.068, right: 0.932 },
  left: { left: 0.067, right: 0.933 },
  right: { left: 0.065, right: 0.935 },
};

export const ASSET_BODY_BOUNDS: Record<AnatomicalSide, BodyBounds> = {
  front: { top: 0.045, bottom: 0.955 },
  back: { top: 0.045, bottom: 0.956 },
  left: { top: 0.045, bottom: 0.955 },
  right: { top: 0.045, bottom: 0.955 },
};

export function canonicalBodyX(side: AnatomicalSide, rawX: number): number {
  const bounds = ASSET_BODY_X_BOUNDS[side];
  return Math.max(0, Math.min(1, (rawX - bounds.left) / (bounds.right - bounds.left)));
}

export function assetXFromCanonical(side: AnatomicalSide, canonicalX: number): number {
  const bounds = ASSET_BODY_X_BOUNDS[side];
  return bounds.left + Math.max(0, Math.min(1, canonicalX)) * (bounds.right - bounds.left);
}

export function canonicalBodyY(side: AnatomicalSide, rawY: number): number {
  const bounds = ASSET_BODY_BOUNDS[side];
  return Math.max(0, Math.min(1, (rawY - bounds.top) / (bounds.bottom - bounds.top)));
}

export function assetYFromCanonical(side: AnatomicalSide, canonicalY: number): number {
  const bounds = ASSET_BODY_BOUNDS[side];
  return bounds.top + Math.max(0, Math.min(1, canonicalY)) * (bounds.bottom - bounds.top);
}

export function lateralPointX(_side: "left" | "right", x: number): number {
  // Os PNGs laterais já são canvases próprios; não deslocar os pontos para outra metade.
  return Math.max(0, Math.min(1, x));
}

export type NormalizedPoint = { x: number; y: number };
export type ContainedAssetRect = { left: number; top: number; width: number; height: number };

// Dimensão proporcional dos assets anatômicos usados pelo ZIP e pelo app ativo.
const ANATOMICAL_ASSET_ASPECT = 304 / 516;

export function containedAssetRect(_side: AnatomicalSide, mapAspectRatio: number): ContainedAssetRect {
  const safeAspect = mapAspectRatio > 0 ? mapAspectRatio : ANATOMICAL_ASSET_ASPECT;
  if (ANATOMICAL_ASSET_ASPECT <= safeAspect) {
    const width = ANATOMICAL_ASSET_ASPECT / safeAspect;
    return { left: (1 - width) / 2, top: 0, width, height: 1 };
  }
  const height = safeAspect / ANATOMICAL_ASSET_ASPECT;
  return { left: 0, top: (1 - height) / 2, width: 1, height };
}

export function bodyPointToMap(
  side: AnatomicalSide,
  canonicalX: number,
  canonicalY: number,
  mapAspectRatio: number,
): NormalizedPoint {
  const rect = containedAssetRect(side, mapAspectRatio);
  return {
    x: rect.left + assetXFromCanonical(side, canonicalX) * rect.width,
    y: rect.top + assetYFromCanonical(side, canonicalY) * rect.height,
  };
}

export function mapPointToBody(
  side: AnatomicalSide,
  mapX: number,
  mapY: number,
  mapAspectRatio: number,
): NormalizedPoint {
  const rect = containedAssetRect(side, mapAspectRatio);
  const assetX = (mapX - rect.left) / rect.width;
  const assetY = (mapY - rect.top) / rect.height;
  return {
    x: canonicalBodyX(side, assetX),
    y: canonicalBodyY(side, assetY),
  };
}
