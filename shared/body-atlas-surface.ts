import type { AtlasZone } from "./body-atlas";
import type { BodySiteDetailId } from "./records";

function zone(id: BodySiteDetailId, coarse: AtlasZone["coarse"], xMin: number, xMax: number, yMin: number, yMax: number): AtlasZone {
  return { id, coarse, layer: "surface", side: "front", bounds: { xMin, xMax, yMin, yMax } };
}

export const FRONT_SURFACE_ATLAS: AtlasZone[] = [
  zone("above-eye-left", "face", 0.52, 0.62, 0.08, 0.105),
  zone("above-eye-right", "face", 0.38, 0.48, 0.08, 0.105),
  zone("below-eye-left", "face", 0.52, 0.62, 0.13, 0.16),
  zone("below-eye-right", "face", 0.38, 0.48, 0.13, 0.16),
  zone("nose-bridge", "face", 0.48, 0.52, 0.11, 0.16),
  zone("nose-tip", "face", 0.47, 0.53, 0.16, 0.185),
  zone("chin", "face", 0.44, 0.56, 0.18, 0.22),
  zone("breast-left-upper-inner", "chest", 0.50, 0.60, 0.28, 0.34),
  zone("breast-left-upper-outer", "chest", 0.60, 0.72, 0.28, 0.34),
  zone("breast-left-lower-inner", "chest", 0.50, 0.60, 0.34, 0.40),
  zone("breast-left-lower-outer", "chest", 0.60, 0.72, 0.34, 0.40),
  zone("breast-right-upper-inner", "chest", 0.40, 0.50, 0.28, 0.34),
  zone("breast-right-upper-outer", "chest", 0.28, 0.40, 0.28, 0.34),
  zone("breast-right-lower-inner", "chest", 0.40, 0.50, 0.34, 0.40),
  zone("breast-right-lower-outer", "chest", 0.28, 0.40, 0.34, 0.40),
  zone("rib-left-upper", "chest", 0.56, 0.72, 0.24, 0.31),
  zone("rib-right-upper", "chest", 0.28, 0.44, 0.24, 0.31),
  zone("rib-left-lower", "chest", 0.56, 0.72, 0.38, 0.46),
  zone("rib-right-lower", "chest", 0.28, 0.44, 0.38, 0.46),
  zone("abdomen-left-upper", "abdomen", 0.50, 0.64, 0.40, 0.49),
  zone("abdomen-right-upper", "abdomen", 0.36, 0.50, 0.40, 0.49),
  zone("abdomen-left-lower", "abdomen", 0.50, 0.64, 0.49, 0.56),
  zone("abdomen-right-lower", "abdomen", 0.36, 0.50, 0.49, 0.56),
  zone("hip-left-side", "left-hip", 0.58, 0.75, 0.52, 0.64),
  zone("hip-right-side", "right-hip", 0.25, 0.42, 0.52, 0.64),
  zone("thigh-left-front", "left-thigh", 0.50, 0.63, 0.64, 0.78),
  zone("thigh-right-front", "right-thigh", 0.37, 0.50, 0.64, 0.78),
  zone("knee-left", "left-knee", 0.52, 0.63, 0.77, 0.84),
  zone("knee-right", "right-knee", 0.37, 0.48, 0.77, 0.84),
  zone("shin-left", "left-leg", 0.52, 0.62, 0.84, 0.95),
  zone("shin-right", "right-leg", 0.38, 0.48, 0.84, 0.95),
];
