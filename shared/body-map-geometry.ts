export type AnatomicalSide = "front" | "back" | "left" | "right";

type BodyBounds = { top: number; bottom: number };

export const ASSET_BODY_BOUNDS: Record<AnatomicalSide, BodyBounds> = {
  front: { top: 0.12, bottom: 0.88 },
  back: { top: 0.11, bottom: 0.88 },
  left: { top: 0.10, bottom: 0.90 },
  right: { top: 0.10, bottom: 0.90 },
};

export function canonicalBodyY(side: AnatomicalSide, rawY: number): number {
  const bounds = ASSET_BODY_BOUNDS[side];
  return Math.max(0, Math.min(1, (rawY - bounds.top) / (bounds.bottom - bounds.top)));
}

export function assetYFromCanonical(side: AnatomicalSide, canonicalY: number): number {
  const bounds = ASSET_BODY_BOUNDS[side];
  return bounds.top + Math.max(0, Math.min(1, canonicalY)) * (bounds.bottom - bounds.top);
}
