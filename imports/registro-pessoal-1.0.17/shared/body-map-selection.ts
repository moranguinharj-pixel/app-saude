import { bodyPointToMap, type AnatomicalSide } from "./body-map-geometry";

export type SelectableBodyPoint = {
  id: string;
  coarse: string;
  x: number;
  y: number;
};

export function nearestBodyPoint<T extends SelectableBodyPoint>(
  side: AnatomicalSide,
  candidates: readonly T[],
  mapX: number,
  mapY: number,
  mapAspectRatio: number,
): T | undefined {
  return candidates.reduce<{ point: T | undefined; distance: number }>(
    (best, point) => {
      const position = bodyPointToMap(side, point.x, point.y, mapAspectRatio);
      const distance = (position.x - mapX) ** 2 + (position.y - mapY) ** 2;
      return distance < best.distance ? { point, distance } : best;
    },
    { point: undefined, distance: Number.POSITIVE_INFINITY },
  ).point;
}
