import type { AtlasZone } from "./body-atlas";
import type { BodySiteDetailId } from "./records";

function internal(id: BodySiteDetailId, coarse: AtlasZone["coarse"], xMin: number, xMax: number, yMin: number, yMax: number): AtlasZone {
  return { id, coarse, layer: "internal", side: "front", bounds: { xMin, xMax, yMin, yMax } };
}

export const FRONT_INTERNAL_ATLAS: AtlasZone[] = [
  internal("neck-front", "neck", 0.43, 0.57, 0.18, 0.26),
  internal("lung-left", "chest", 0.52, 0.70, 0.25, 0.39),
  internal("lung-right", "chest", 0.30, 0.48, 0.25, 0.39),
  internal("heart", "chest", 0.47, 0.57, 0.33, 0.42),
  internal("diaphragm", "chest", 0.36, 0.64, 0.40, 0.435),
  internal("liver", "abdomen", 0.30, 0.48, 0.42, 0.51),
  internal("stomach", "abdomen", 0.52, 0.68, 0.43, 0.52),
  internal("bladder", "abdomen", 0.46, 0.56, 0.59, 0.65),
];
