import { BodySiteDetailId, BodySiteId } from "./records";
import { FRONT_DIGIT_ATLAS } from "./body-atlas-fine";
import { FRONT_SURFACE_ATLAS } from "./body-atlas-surface";
import { FRONT_INTERNAL_ATLAS } from "./body-atlas-internal";
import { AnatomicalSide } from "./body-map-geometry";

export type AtlasLayer = "surface" | "musculoskeletal" | "internal";

export interface AtlasZone {
  id: BodySiteDetailId;
  coarse: BodySiteId;
  layer: AtlasLayer;
  side: AnatomicalSide;
  // Limites normalizados (0 a 1) no espaço canônico do corpo
  bounds: {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
  };
  // Zonas filhas têm precedência sobre a zona pai se o toque cair dentro delas
  children?: AtlasZone[];
}

// O atlas frontal conterá a definição hierárquica das zonas.
// A raiz representa o corpo inteiro, subdividido em cabeça, tronco e membros.
export const FRONT_ATLAS: AtlasZone[] = [
  {
    id: "head-top",
    coarse: "head",
    layer: "surface",
    side: "front",
    bounds: { xMin: 0.20, xMax: 0.80, yMin: 0.0, yMax: 0.22 },
    children: [
      // Face
      {
        id: "forehead-left",
        coarse: "head",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.5, xMax: 0.65, yMin: 0.05, yMax: 0.10 },
      },
      {
        id: "forehead-right",
        coarse: "head",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.35, xMax: 0.5, yMin: 0.05, yMax: 0.10 },
      },
      {
        id: "eye-left",
        coarse: "face",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.52, xMax: 0.62, yMin: 0.10, yMax: 0.13 },
      },
      {
        id: "eye-right",
        coarse: "face",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.38, xMax: 0.48, yMin: 0.10, yMax: 0.13 },
      },
      {
        id: "ear-left-upper",
        coarse: "face",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.62, xMax: 0.68, yMin: 0.10, yMax: 0.16 },
      },
      {
        id: "ear-right-upper",
        coarse: "face",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.32, xMax: 0.38, yMin: 0.10, yMax: 0.16 },
      },
      {
        id: "jaw-left",
        coarse: "face",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.5, xMax: 0.62, yMin: 0.16, yMax: 0.20 },
      },
      {
        id: "jaw-right",
        coarse: "face",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.38, xMax: 0.5, yMin: 0.16, yMax: 0.20 },
      },
    ],
  },
  {
    id: "chest-center",
    coarse: "chest",
    layer: "surface",
    side: "front",
    bounds: { xMin: 0.2, xMax: 0.8, yMin: 0.22, yMax: 0.44 },
    children: [
      // Mamas e axilas
      {
        id: "breast-left-upper-outer",
        coarse: "chest",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.6, xMax: 0.75, yMin: 0.28, yMax: 0.35 },
      },
      {
        id: "breast-right-upper-outer",
        coarse: "chest",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.25, xMax: 0.4, yMin: 0.28, yMax: 0.35 },
      },
      {
        id: "axilla-left",
        coarse: "chest",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.75, xMax: 0.85, yMin: 0.28, yMax: 0.35 },
      },
      {
        id: "axilla-right",
        coarse: "chest",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.15, xMax: 0.25, yMin: 0.28, yMax: 0.35 },
      },
      // Órgãos projetados
      {
        id: "heart",
        coarse: "chest",
        layer: "internal",
        side: "front",
        bounds: { xMin: 0.45, xMax: 0.55, yMin: 0.32, yMax: 0.40 },
      },
    ],
  },
  {
    id: "lower-belly-left",
    coarse: "abdomen",
    layer: "surface",
    side: "front",
    bounds: { xMin: 0.2, xMax: 0.8, yMin: 0.46, yMax: 0.60 },
    children: [
      {
        id: "ovary-left",
        coarse: "left-hip",
        layer: "internal",
        side: "front",
        bounds: { xMin: 0.55, xMax: 0.65, yMin: 0.52, yMax: 0.58 },
      },
      {
        id: "ovary-right",
        coarse: "right-hip",
        layer: "internal",
        side: "front",
        bounds: { xMin: 0.35, xMax: 0.45, yMin: 0.52, yMax: 0.58 },
      },
      {
        id: "uterus",
        coarse: "abdomen",
        layer: "internal",
        side: "front",
        bounds: { xMin: 0.45, xMax: 0.55, yMin: 0.52, yMax: 0.58 },
      },
    ],
  },
  {
    id: "left-biceps",
    coarse: "left-arm",
    layer: "musculoskeletal",
    side: "front",
    bounds: { xMin: 0.7, xMax: 0.9, yMin: 0.25, yMax: 0.45 },
    children: [
      {
        id: "left-elbow-inner",
        coarse: "left-arm",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.7, xMax: 0.8, yMin: 0.42, yMax: 0.48 },
      },
    ],
  },
  {
    id: "right-biceps",
    coarse: "right-arm",
    layer: "musculoskeletal",
    side: "front",
    bounds: { xMin: 0.1, xMax: 0.3, yMin: 0.25, yMax: 0.45 },
    children: [
      {
        id: "right-elbow-inner",
        coarse: "right-arm",
        layer: "surface",
        side: "front",
        bounds: { xMin: 0.2, xMax: 0.3, yMin: 0.42, yMax: 0.48 },
      },
    ],
  },
  {
    id: "left-wrist-joint",
    coarse: "left-hand",
    layer: "musculoskeletal",
    side: "front",
    bounds: { xMin: 0.75, xMax: 0.95, yMin: 0.55, yMax: 0.70 },
    children: [
      {
        id: "left-thumb-cmc",
        coarse: "left-hand",
        layer: "musculoskeletal",
        side: "front",
        bounds: { xMin: 0.75, xMax: 0.82, yMin: 0.60, yMax: 0.65 },
      },
    ],
  },
  {
    id: "right-wrist-joint",
    coarse: "right-hand",
    layer: "musculoskeletal",
    side: "front",
    bounds: { xMin: 0.05, xMax: 0.25, yMin: 0.55, yMax: 0.70 },
    children: [
      {
        id: "right-thumb-cmc",
        coarse: "right-hand",
        layer: "musculoskeletal",
        side: "front",
        bounds: { xMin: 0.18, xMax: 0.25, yMin: 0.60, yMax: 0.65 },
      },
    ],
  },
];

export function resolveAtlasPoint(zones: AtlasZone[], x: number, y: number): AtlasZone | undefined {
  // Busca em profundidade: a zona filha mais específica que contém o ponto vence.
  for (const zone of zones) {
    if (x >= zone.bounds.xMin && x <= zone.bounds.xMax && y >= zone.bounds.yMin && y <= zone.bounds.yMax) {
      if (zone.children) {
        const childMatch = resolveAtlasPoint(zone.children, x, y);
        if (childMatch) return childMatch;
      }
      return zone;
    }
  }
  return undefined;
}


export const BACK_ATLAS: AtlasZone[] = [
  { id: "neck-back", coarse: "neck", layer: "surface", side: "back", bounds: { xMin: 0.35, xMax: 0.65, yMin: 0.0, yMax: 0.22 }, children: [
    { id: "behind-head-left", coarse: "head", layer: "surface", side: "back", bounds: { xMin: 0.5, xMax: 0.68, yMin: 0.02, yMax: 0.16 } },
    { id: "behind-head-right", coarse: "head", layer: "surface", side: "back", bounds: { xMin: 0.32, xMax: 0.5, yMin: 0.02, yMax: 0.16 } },
    { id: "cervical-spine", coarse: "neck", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.46, xMax: 0.54, yMin: 0.16, yMax: 0.25 } },
  ] },
  { id: "upper-back-left", coarse: "upper-back", layer: "surface", side: "back", bounds: { xMin: 0.2, xMax: 0.8, yMin: 0.22, yMax: 0.43 }, children: [
    { id: "trapezius-left", coarse: "upper-back", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.51, xMax: 0.72, yMin: 0.22, yMax: 0.34 } },
    { id: "trapezius-right", coarse: "upper-back", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.28, xMax: 0.49, yMin: 0.22, yMax: 0.34 } },
    { id: "thoracic-spine", coarse: "upper-back", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.46, xMax: 0.54, yMin: 0.25, yMax: 0.43 } },
  ] },
  { id: "lower-back-left", coarse: "lower-back", layer: "surface", side: "back", bounds: { xMin: 0.2, xMax: 0.8, yMin: 0.43, yMax: 0.62 }, children: [
    { id: "lumbar-spine", coarse: "lower-back", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.46, xMax: 0.54, yMin: 0.43, yMax: 0.58 } },
    { id: "kidney-left", coarse: "lower-back", layer: "internal", side: "back", bounds: { xMin: 0.52, xMax: 0.66, yMin: 0.40, yMax: 0.51 } },
    { id: "kidney-right", coarse: "lower-back", layer: "internal", side: "back", bounds: { xMin: 0.34, xMax: 0.48, yMin: 0.40, yMax: 0.51 } },
  ] },
  { id: "left-gluteus", coarse: "left-hip", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.5, xMax: 0.72, yMin: 0.58, yMax: 0.72 } },
  { id: "right-gluteus", coarse: "right-hip", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.28, xMax: 0.5, yMin: 0.58, yMax: 0.72 } },
  { id: "left-hamstring", coarse: "left-thigh", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.5, xMax: 0.67, yMin: 0.70, yMax: 0.84 } },
  { id: "right-hamstring", coarse: "right-thigh", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.33, xMax: 0.5, yMin: 0.70, yMax: 0.84 } },
  { id: "left-calf-muscle", coarse: "left-leg", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.5, xMax: 0.64, yMin: 0.84, yMax: 0.97 } },
  { id: "right-calf-muscle", coarse: "right-leg", layer: "musculoskeletal", side: "back", bounds: { xMin: 0.36, xMax: 0.5, yMin: 0.84, yMax: 0.97 } },
];

export const LATERAL_ATLAS: Record<"left" | "right", AtlasZone[]> = {
  left: [
    { id: "head-top", coarse: "head", layer: "surface", side: "left", bounds: { xMin: 0.28, xMax: 0.72, yMin: 0, yMax: 0.22 }, children: [
      { id: "ear-left-upper", coarse: "face", layer: "surface", side: "left", bounds: { xMin: 0.48, xMax: 0.66, yMin: 0.08, yMax: 0.17 } },
      { id: "cheek-left", coarse: "face", layer: "surface", side: "left", bounds: { xMin: 0.42, xMax: 0.60, yMin: 0.12, yMax: 0.19 } },
    ] },
    { id: "left-shoulder-ac", coarse: "left-shoulder", layer: "musculoskeletal", side: "left", bounds: { xMin: 0.28, xMax: 0.58, yMin: 0.22, yMax: 0.34 } },
    { id: "left-biceps", coarse: "left-arm", layer: "musculoskeletal", side: "left", bounds: { xMin: 0.20, xMax: 0.48, yMin: 0.30, yMax: 0.50 }, children: [
      { id: "left-elbow-inner", coarse: "left-arm", layer: "surface", side: "left", bounds: { xMin: 0.22, xMax: 0.38, yMin: 0.42, yMax: 0.50 } },
    ] },
    { id: "left-forearm-flexor", coarse: "left-arm", layer: "musculoskeletal", side: "left", bounds: { xMin: 0.12, xMax: 0.36, yMin: 0.48, yMax: 0.64 } },
    { id: "left-hip-joint", coarse: "left-hip", layer: "surface", side: "left", bounds: { xMin: 0.30, xMax: 0.62, yMin: 0.48, yMax: 0.62 } },
    { id: "left-quad", coarse: "left-thigh", layer: "surface", side: "left", bounds: { xMin: 0.30, xMax: 0.58, yMin: 0.60, yMax: 0.78 } },
    { id: "knee-left", coarse: "left-knee", layer: "musculoskeletal", side: "left", bounds: { xMin: 0.32, xMax: 0.58, yMin: 0.76, yMax: 0.84 } },
    { id: "left-calf-muscle", coarse: "left-leg", layer: "musculoskeletal", side: "left", bounds: { xMin: 0.30, xMax: 0.56, yMin: 0.84, yMax: 0.95 } },
  ],
  right: [
    { id: "head-top", coarse: "head", layer: "surface", side: "right", bounds: { xMin: 0.28, xMax: 0.72, yMin: 0, yMax: 0.22 }, children: [
      { id: "ear-right-upper", coarse: "face", layer: "surface", side: "right", bounds: { xMin: 0.34, xMax: 0.52, yMin: 0.08, yMax: 0.17 } },
      { id: "cheek-right", coarse: "face", layer: "surface", side: "right", bounds: { xMin: 0.40, xMax: 0.58, yMin: 0.12, yMax: 0.19 } },
    ] },
    { id: "right-shoulder-ac", coarse: "right-shoulder", layer: "musculoskeletal", side: "right", bounds: { xMin: 0.42, xMax: 0.72, yMin: 0.22, yMax: 0.34 } },
    { id: "right-biceps", coarse: "right-arm", layer: "musculoskeletal", side: "right", bounds: { xMin: 0.52, xMax: 0.80, yMin: 0.30, yMax: 0.50 }, children: [
      { id: "right-elbow-inner", coarse: "right-arm", layer: "surface", side: "right", bounds: { xMin: 0.62, xMax: 0.78, yMin: 0.42, yMax: 0.50 } },
    ] },
    { id: "right-forearm-flexor", coarse: "right-arm", layer: "musculoskeletal", side: "right", bounds: { xMin: 0.64, xMax: 0.88, yMin: 0.48, yMax: 0.64 } },
    { id: "right-hip-joint", coarse: "right-hip", layer: "surface", side: "right", bounds: { xMin: 0.38, xMax: 0.70, yMin: 0.48, yMax: 0.62 } },
    { id: "right-quad", coarse: "right-thigh", layer: "surface", side: "right", bounds: { xMin: 0.42, xMax: 0.70, yMin: 0.60, yMax: 0.78 } },
    { id: "knee-right", coarse: "right-knee", layer: "musculoskeletal", side: "right", bounds: { xMin: 0.42, xMax: 0.68, yMin: 0.76, yMax: 0.84 } },
    { id: "right-calf-muscle", coarse: "right-leg", layer: "musculoskeletal", side: "right", bounds: { xMin: 0.44, xMax: 0.70, yMin: 0.84, yMax: 0.95 } },
  ],
};

export function atlasForSide(side: AnatomicalSide): AtlasZone[] {
  if (side === "front") return [...FRONT_DIGIT_ATLAS, ...FRONT_FINE_ATLAS, ...FRONT_INTERNAL_ATLAS, ...FRONT_SURFACE_ATLAS, ...FRONT_ATLAS];
  if (side === "back") return BACK_ATLAS;
  return LATERAL_ATLAS[side];
}


export const FRONT_FINE_ATLAS: AtlasZone[] = [
  { id: "right-hand-back", coarse: "right-hand", layer: "surface", side: "front", bounds: { xMin: 0.10, xMax: 0.24, yMin: 0.48, yMax: 0.61 }, children: [
    { id: "right-thumb-metacarpal", coarse: "right-hand", layer: "musculoskeletal", side: "front", bounds: { xMin: 0.16, xMax: 0.21, yMin: 0.50, yMax: 0.55 } },
    { id: "right-little-metacarpal", coarse: "right-hand", layer: "musculoskeletal", side: "front", bounds: { xMin: 0.10, xMax: 0.16, yMin: 0.51, yMax: 0.57 } },
  ] },
  { id: "left-hand-back", coarse: "left-hand", layer: "surface", side: "front", bounds: { xMin: 0.76, xMax: 0.90, yMin: 0.48, yMax: 0.61 }, children: [
    { id: "left-thumb-metacarpal", coarse: "left-hand", layer: "musculoskeletal", side: "front", bounds: { xMin: 0.79, xMax: 0.84, yMin: 0.50, yMax: 0.55 } },
    { id: "left-little-metacarpal", coarse: "left-hand", layer: "musculoskeletal", side: "front", bounds: { xMin: 0.84, xMax: 0.90, yMin: 0.51, yMax: 0.57 } },
  ] },
  { id: "right-ankle-inner", coarse: "right-foot", layer: "musculoskeletal", side: "front", bounds: { xMin: 0.36, xMax: 0.43, yMin: 0.88, yMax: 0.93 } },
  { id: "left-ankle-inner", coarse: "left-foot", layer: "musculoskeletal", side: "front", bounds: { xMin: 0.57, xMax: 0.64, yMin: 0.88, yMax: 0.93 } },
  { id: "right-heel", coarse: "right-foot", layer: "surface", side: "front", bounds: { xMin: 0.34, xMax: 0.44, yMin: 0.94, yMax: 0.99 } },
  { id: "left-heel", coarse: "left-foot", layer: "surface", side: "front", bounds: { xMin: 0.56, xMax: 0.61, yMin: 0.94, yMax: 0.99 } },
  { id: "right-little-toe", coarse: "right-foot", layer: "surface", side: "front", bounds: { xMin: 0.32, xMax: 0.38, yMin: 0.96, yMax: 1.0 } },
  { id: "left-little-toe", coarse: "left-foot", layer: "surface", side: "front", bounds: { xMin: 0.62, xMax: 0.68, yMin: 0.96, yMax: 1.0 } },
];
