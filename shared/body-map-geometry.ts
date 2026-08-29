export type AnatomicalSide = "front" | "back" | "left" | "right";

type BodyBounds = { top: number; bottom: number };

type BodyXBounds = { left: number; right: number };

export const ASSET_BODY_X_BOUNDS: Record<AnatomicalSide, BodyXBounds> = {
  front: { left: 0.31, right: 0.69 },
  back: { left: 0.31, right: 0.69 },
  left: { left: 0.34, right: 0.66 },
  right: { left: 0.34, right: 0.66 },
};

export const ASSET_BODY_BOUNDS: Record<AnatomicalSide, BodyBounds> = {
  front: { top: 0.12, bottom: 0.88 },
  back: { top: 0.11, bottom: 0.88 },
  left: { top: 0.10, bottom: 0.90 },
  right: { top: 0.10, bottom: 0.90 },
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

export function lateralPointX(side: "left" | "right", x: number): number {
  const offset = side === "left" ? 0.31 : -0.31;
  return Math.max(0.04, Math.min(0.96, x + offset));
}
