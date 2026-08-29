import { useMemo, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import Svg, { Circle, Ellipse, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import { BodySiteDetailId, BodySiteId, bodySiteDetailLabel } from "@/shared/records";
import { assetXFromCanonical, assetYFromCanonical, canonicalBodyX, canonicalBodyY, lateralPointX } from "@/shared/body-map-geometry";
import anatomicalFront from "../assets/images/anatomical-front.png";
import anatomicalBack from "../assets/images/anatomical-back.png";
import anatomicalLeftProfile from "../assets/images/anatomical-left-profile.png";
import anatomicalRightProfile from "../assets/images/anatomical-right-profile.png";

type Point = { id: BodySiteDetailId; coarse: BodySiteId; x: number; y: number };
export type Side = "front" | "back" | "left" | "right";
type MapKind = "face" | "chest" | "hand" | "foot" | "region";

function bodyHandPoints(side: "left" | "right", centerX: number): Point[] {
  const prefix = side === "left" ? "left" : "right";
  const direction = side === "left" ? 1 : -1;
  const x = (offset: number) => centerX + direction * offset;
  return [
    detail(`${prefix}-wrist`, `${prefix}-hand`, centerX, 0.625),
    detail(`${prefix}-wrist-joint`, `${prefix}-hand`, centerX, 0.605),
    detail(`${prefix}-hand-back`, `${prefix}-hand`, centerX, 0.575),
    detail(`${prefix}-palm`, `${prefix}-hand`, centerX, 0.595),
    detail(`${prefix}-thenar`, `${prefix}-hand`, x(0.018), 0.595),
    detail(`${prefix}-hypothenar`, `${prefix}-hand`, x(0.018), 0.625),
    detail(`${prefix}-thumb-metacarpal`, `${prefix}-hand`, x(0.028), 0.575),
    detail(`${prefix}-thumb-cmc`, `${prefix}-hand`, x(0.038), 0.59),
    detail(`${prefix}-thumb-mcp`, `${prefix}-hand`, x(0.052), 0.565),
    detail(`${prefix}-thumb-ip`, `${prefix}-hand`, x(0.064), 0.54),
    detail(`${prefix}-index-metacarpal`, `${prefix}-hand`, x(0.008), 0.555),
    detail(`${prefix}-index-mcp`, `${prefix}-hand`, x(0.008), 0.535),
    detail(`${prefix}-index-pip`, `${prefix}-hand`, x(0.008), 0.505),
    detail(`${prefix}-index-dip`, `${prefix}-hand`, x(0.008), 0.48),
    detail(`${prefix}-middle-metacarpal`, `${prefix}-hand`, x(0.016), 0.545),
    detail(`${prefix}-middle-mcp`, `${prefix}-hand`, x(0.016), 0.52),
    detail(`${prefix}-middle-pip`, `${prefix}-hand`, x(0.016), 0.485),
    detail(`${prefix}-middle-dip`, `${prefix}-hand`, x(0.016), 0.455),
    detail(`${prefix}-ring-metacarpal`, `${prefix}-hand`, x(0.024), 0.555),
    detail(`${prefix}-ring-mcp`, `${prefix}-hand`, x(0.024), 0.535),
    detail(`${prefix}-ring-pip`, `${prefix}-hand`, x(0.024), 0.505),
    detail(`${prefix}-ring-dip`, `${prefix}-hand`, x(0.024), 0.48),
    detail(`${prefix}-little-metacarpal`, `${prefix}-hand`, x(0.032), 0.57),
    detail(`${prefix}-little-mcp`, `${prefix}-hand`, x(0.032), 0.55),
    detail(`${prefix}-little-pip`, `${prefix}-hand`, x(0.032), 0.52),
    detail(`${prefix}-little-dip`, `${prefix}-hand`, x(0.032), 0.495),
  ];
}

function bodyFootPoints(side: "left" | "right", centerX: number): Point[] {
  const prefix = side === "left" ? "left" : "right";
  const direction = side === "left" ? 1 : -1;
  const x = (offset: number) => centerX + direction * offset;
  return [
    detail(`${prefix}-ankle-inner`, `${prefix}-foot`, x(0.018), 0.90), detail(`${prefix}-ankle-outer`, `${prefix}-foot`, x(-0.018), 0.90),
    detail(`${prefix}-heel`, `${prefix}-foot`, centerX, 0.94), detail(`${prefix}-arch`, `${prefix}-foot`, x(0.006), 0.955), detail(`${prefix}-metatarsal`, `${prefix}-foot`, centerX, 0.97),
    detail(`${prefix}-big-toe-mtp`, `${prefix}-foot`, x(0.025), 0.985), detail(`${prefix}-big-toe-ip`, `${prefix}-foot`, x(0.038), 0.995),
    detail(`${prefix}-second-toe-mtp`, `${prefix}-foot`, x(0.008), 0.985), detail(`${prefix}-second-toe-pip`, `${prefix}-foot`, x(0.008), 0.995), detail(`${prefix}-second-toe-dip`, `${prefix}-foot`, x(0.008), 1),
    detail(`${prefix}-third-toe-mtp`, `${prefix}-foot`, x(-0.006), 0.985), detail(`${prefix}-third-toe-pip`, `${prefix}-foot`, x(-0.006), 0.995), detail(`${prefix}-third-toe-dip`, `${prefix}-foot`, x(-0.006), 1),
    detail(`${prefix}-fourth-toe-mtp`, `${prefix}-foot`, x(-0.02), 0.985), detail(`${prefix}-fourth-toe-pip`, `${prefix}-foot`, x(-0.02), 0.995), detail(`${prefix}-fourth-toe-dip`, `${prefix}-foot`, x(-0.02), 1),
    detail(`${prefix}-little-toe-mtp`, `${prefix}-foot`, x(-0.034), 0.985), detail(`${prefix}-little-toe-pip`, `${prefix}-foot`, x(-0.034), 0.995), detail(`${prefix}-little-toe-dip`, `${prefix}-foot`, x(-0.034), 1),
    detail(`${prefix}-second-toe`, `${prefix}-foot`, x(0.008), 0.992), detail(`${prefix}-third-toe`, `${prefix}-foot`, x(-0.006), 0.992), detail(`${prefix}-fourth-toe`, `${prefix}-foot`, x(-0.02), 0.992), detail(`${prefix}-little-toe`, `${prefix}-foot`, x(-0.034), 0.992),
  ];
}

const FRONT_INTERNAL_POINTS: Point[] = [
  { id: "lung-right", coarse: "chest", x: 0.42, y: 0.34 }, { id: "lung-left", coarse: "chest", x: 0.58, y: 0.34 },
  { id: "heart", coarse: "chest", x: 0.47, y: 0.38 }, { id: "diaphragm", coarse: "chest", x: 0.5, y: 0.43 },
  { id: "pectoralis-right", coarse: "chest", x: 0.42, y: 0.30 }, { id: "pectoralis-left", coarse: "chest", x: 0.58, y: 0.30 },
  { id: "liver", coarse: "abdomen", x: 0.62, y: 0.50 }, { id: "gallbladder", coarse: "abdomen", x: 0.66, y: 0.55 },
  { id: "stomach", coarse: "abdomen", x: 0.38, y: 0.50 }, { id: "spleen", coarse: "abdomen", x: 0.34, y: 0.54 },
  { id: "pancreas", coarse: "abdomen", x: 0.5, y: 0.55 }, { id: "bowel-left", coarse: "abdomen", x: 0.58, y: 0.64 },
  { id: "bowel-right", coarse: "abdomen", x: 0.42, y: 0.64 }, { id: "rectus-abdominis", coarse: "abdomen", x: 0.5, y: 0.60 },
  { id: "oblique-left", coarse: "abdomen", x: 0.64, y: 0.62 }, { id: "oblique-right", coarse: "abdomen", x: 0.36, y: 0.62 },
  { id: "uterus", coarse: "abdomen", x: 0.5, y: 0.74 }, { id: "ovary-left", coarse: "left-hip", x: 0.55, y: 0.75 },
  { id: "ovary-right", coarse: "right-hip", x: 0.45, y: 0.75 }, { id: "bladder", coarse: "abdomen", x: 0.5, y: 0.82 },
  { id: "pubic-symphysis", coarse: "abdomen", x: 0.5, y: 0.86 },
];

const FRONT_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.018 },
  { id: "forehead-left", coarse: "head", x: 0.58, y: 0.07 },
  { id: "forehead-right", coarse: "head", x: 0.42, y: 0.07 },
  { id: "above-eye-left", coarse: "face", x: 0.58, y: 0.105 },
  { id: "above-eye-right", coarse: "face", x: 0.42, y: 0.105 },
  { id: "below-eye-left", coarse: "face", x: 0.58, y: 0.14 },
  { id: "below-eye-right", coarse: "face", x: 0.42, y: 0.14 },
  { id: "ear-left-upper", coarse: "face", x: 0.624, y: 0.095 },
  { id: "ear-left-lower", coarse: "face", x: 0.624, y: 0.145 },
  { id: "ear-right-upper", coarse: "face", x: 0.376, y: 0.095 },
  { id: "ear-right-lower", coarse: "face", x: 0.376, y: 0.145 },
  { id: "temple-left", coarse: "face", x: 0.61, y: 0.12 },
  { id: "temple-right", coarse: "face", x: 0.39, y: 0.12 },
  { id: "cheek-left", coarse: "face", x: 0.58, y: 0.155 },
  { id: "cheek-right", coarse: "face", x: 0.42, y: 0.155 },
  { id: "jaw-left", coarse: "face", x: 0.56, y: 0.18 },
  { id: "jaw-right", coarse: "face", x: 0.44, y: 0.18 },
  { id: "neck-front", coarse: "neck", x: 0.5, y: 0.225 },
  { id: "breast-right-upper-inner", coarse: "chest", x: 0.46, y: 0.31 }, { id: "breast-right-upper-outer", coarse: "chest", x: 0.36, y: 0.31 },
  { id: "breast-right-lower-inner", coarse: "chest", x: 0.46, y: 0.39 }, { id: "breast-right-lower-outer", coarse: "chest", x: 0.36, y: 0.39 },
  { id: "breast-right-nipple", coarse: "chest", x: 0.41, y: 0.35 }, { id: "breast-right-axillary-tail", coarse: "chest", x: 0.31, y: 0.31 },
  { id: "breast-left-upper-inner", coarse: "chest", x: 0.54, y: 0.31 }, { id: "breast-left-upper-outer", coarse: "chest", x: 0.64, y: 0.31 },
  { id: "breast-left-lower-inner", coarse: "chest", x: 0.54, y: 0.39 }, { id: "breast-left-lower-outer", coarse: "chest", x: 0.64, y: 0.39 },
  { id: "breast-left-nipple", coarse: "chest", x: 0.59, y: 0.35 }, { id: "breast-left-axillary-tail", coarse: "chest", x: 0.69, y: 0.31 },
  { id: "axilla-right", coarse: "chest", x: 0.27, y: 0.30 }, { id: "axilla-left", coarse: "chest", x: 0.73, y: 0.30 },
  ...embeddedHandPoints("right", 0.28),
  ...embeddedHandPoints("left", 0.72),
  ...embeddedFootPoints("right", 0.42),
  ...embeddedFootPoints("left", 0.58),
  { id: "right-shoulder-ac", coarse: "right-shoulder", x: 0.29, y: 0.285 },
  { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.71, y: 0.285 },
  { id: "right-deltoid", coarse: "right-shoulder", x: 0.27, y: 0.335 },
  { id: "left-deltoid", coarse: "left-shoulder", x: 0.73, y: 0.335 },
  { id: "right-biceps", coarse: "right-arm", x: 0.25, y: 0.36 },
  { id: "left-biceps", coarse: "left-arm", x: 0.75, y: 0.36 },
  { id: "right-elbow-joint", coarse: "right-arm", x: 0.23, y: 0.445 },
  { id: "right-elbow-inner", coarse: "right-arm", x: 0.28, y: 0.445 },
  { id: "right-elbow-outer", coarse: "right-arm", x: 0.18, y: 0.445 },
  { id: "left-elbow-joint", coarse: "left-arm", x: 0.77, y: 0.445 },
  { id: "left-elbow-inner", coarse: "left-arm", x: 0.72, y: 0.445 },
  { id: "left-elbow-outer", coarse: "left-arm", x: 0.82, y: 0.445 },
  { id: "right-forearm-flexor", coarse: "right-arm", x: 0.205, y: 0.54 },
  { id: "right-forearm-extensor", coarse: "right-arm", x: 0.15, y: 0.54 },
  { id: "left-forearm-flexor", coarse: "left-arm", x: 0.795, y: 0.54 },
  { id: "left-forearm-extensor", coarse: "left-arm", x: 0.85, y: 0.54 },
  { id: "right-wrist-joint", coarse: "right-hand", x: 0.16, y: 0.625 },
  { id: "left-wrist-joint", coarse: "left-hand", x: 0.84, y: 0.625 },
  { id: "chest-left", coarse: "chest", x: 0.59, y: 0.29 },
  { id: "chest-right", coarse: "chest", x: 0.41, y: 0.29 },
  { id: "chest-center", coarse: "chest", x: 0.5, y: 0.31 },
  { id: "rib-left-upper", coarse: "chest", x: 0.65, y: 0.3 },
  { id: "rib-right-upper", coarse: "chest", x: 0.35, y: 0.3 },
  { id: "rib-left-lower", coarse: "chest", x: 0.64, y: 0.38 },
  { id: "rib-right-lower", coarse: "chest", x: 0.36, y: 0.38 },
  { id: "abdomen-left-upper", coarse: "abdomen", x: 0.57, y: 0.34 },
  { id: "abdomen-right-upper", coarse: "abdomen", x: 0.43, y: 0.34 },
  { id: "abdomen-left-lower", coarse: "abdomen", x: 0.57, y: 0.4 },
  { id: "abdomen-right-lower", coarse: "abdomen", x: 0.43, y: 0.4 },
  { id: "lower-belly-left", coarse: "abdomen", x: 0.56, y: 0.44 },
  { id: "lower-belly-right", coarse: "abdomen", x: 0.44, y: 0.44 },
  { id: "flank-left", coarse: "abdomen", x: 0.66, y: 0.38 },
  { id: "flank-right", coarse: "abdomen", x: 0.34, y: 0.38 },
  { id: "pelvis-left", coarse: "left-hip", x: 0.58, y: 0.47 },
  { id: "pelvis-right", coarse: "right-hip", x: 0.42, y: 0.47 },
  { id: "ovary-left", coarse: "left-hip", x: 0.57, y: 0.49 },
  { id: "ovary-right", coarse: "right-hip", x: 0.43, y: 0.49 },
  { id: "groin-left", coarse: "left-hip", x: 0.56, y: 0.52 },
  { id: "groin-right", coarse: "right-hip", x: 0.44, y: 0.52 },
  { id: "thigh-left-front", coarse: "left-thigh", x: 0.57, y: 0.64 },
  { id: "thigh-right-front", coarse: "right-thigh", x: 0.43, y: 0.64 },
  { id: "knee-left", coarse: "left-knee", x: 0.57, y: 0.75 },
  { id: "left-knee-inner", coarse: "left-knee", x: 0.53, y: 0.75 },
  { id: "left-knee-outer", coarse: "left-knee", x: 0.63, y: 0.75 },
  { id: "knee-right", coarse: "right-knee", x: 0.43, y: 0.75 },
  { id: "right-knee-inner", coarse: "right-knee", x: 0.47, y: 0.75 },
  { id: "right-knee-outer", coarse: "right-knee", x: 0.37, y: 0.75 },
  { id: "left-calf-muscle", coarse: "left-leg", x: 0.57, y: 0.84 },
  { id: "right-calf-muscle", coarse: "right-leg", x: 0.43, y: 0.84 },
  { id: "left-ankle-inner", coarse: "left-foot", x: 0.59, y: 0.91 },
  { id: "left-ankle-outer", coarse: "left-foot", x: 0.67, y: 0.91 },
  { id: "right-ankle-inner", coarse: "right-foot", x: 0.41, y: 0.91 },
  { id: "right-ankle-outer", coarse: "right-foot", x: 0.33, y: 0.91 },
  { id: "foot-left", coarse: "left-foot", x: 0.62, y: 0.94 },
  { id: "foot-right", coarse: "right-foot", x: 0.38, y: 0.94 },
  ...FRONT_INTERNAL_POINTS,
];

const LATERAL_POINTS: Record<"left" | "right", Point[]> = {
  left: [
    { id: "head-top", coarse: "head", x: 0.5, y: 0.018 }, { id: "ear-left-upper", coarse: "face", x: 0.57, y: 0.13 }, { id: "ear-left-lower", coarse: "face", x: 0.57, y: 0.17 }, { id: "temple-left", coarse: "face", x: 0.52, y: 0.115 }, { id: "cheek-left", coarse: "face", x: 0.55, y: 0.16 }, { id: "jaw-left", coarse: "face", x: 0.52, y: 0.19 }, { id: "neck-front", coarse: "neck", x: 0.46, y: 0.225 },
    { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.44, y: 0.27 }, { id: "shoulder-left-joint", coarse: "left-shoulder", x: 0.42, y: 0.30 }, { id: "left-deltoid", coarse: "left-shoulder", x: 0.39, y: 0.33 }, { id: "left-biceps", coarse: "left-arm", x: 0.35, y: 0.37 }, { id: "left-triceps", coarse: "left-arm", x: 0.33, y: 0.40 }, { id: "left-forearm-flexor", coarse: "left-arm", x: 0.34, y: 0.45 }, { id: "left-elbow-joint", coarse: "left-arm", x: 0.29, y: 0.46 }, { id: "left-elbow-inner", coarse: "left-arm", x: 0.31, y: 0.47 }, { id: "left-elbow-outer", coarse: "left-arm", x: 0.27, y: 0.47 }, { id: "left-forearm-extensor", coarse: "left-arm", x: 0.25, y: 0.55 }, { id: "left-hand-back", coarse: "left-hand", x: 0.2, y: 0.63 }, ...bodyHandPoints("left", 0.2), ...bodyFootPoints("left", 0.55),
    { id: "chest-left", coarse: "chest", x: 0.43, y: 0.32 }, { id: "rib-left-upper", coarse: "chest", x: 0.44, y: 0.39 }, { id: "abdomen-left-upper", coarse: "abdomen", x: 0.47, y: 0.47 }, { id: "flank-left", coarse: "abdomen", x: 0.39, y: 0.46 }, { id: "hip-left-side", coarse: "left-hip", x: 0.43, y: 0.54 }, { id: "groin-left", coarse: "left-hip", x: 0.47, y: 0.59 },
    { id: "thigh-left-front", coarse: "left-thigh", x: 0.45, y: 0.68 }, { id: "knee-left", coarse: "left-knee", x: 0.46, y: 0.77 }, { id: "left-calf-muscle", coarse: "left-leg", x: 0.44, y: 0.86 }, { id: "left-ankle-inner", coarse: "left-foot", x: 0.43, y: 0.94 }, { id: "foot-left", coarse: "left-foot", x: 0.55, y: 0.95 },
  ],
  right: [
    { id: "head-top", coarse: "head", x: 0.5, y: 0.018 }, { id: "ear-right-upper", coarse: "face", x: 0.43, y: 0.13 }, { id: "ear-right-lower", coarse: "face", x: 0.43, y: 0.17 }, { id: "temple-right", coarse: "face", x: 0.48, y: 0.115 }, { id: "cheek-right", coarse: "face", x: 0.45, y: 0.16 }, { id: "jaw-right", coarse: "face", x: 0.48, y: 0.19 }, { id: "neck-front", coarse: "neck", x: 0.54, y: 0.225 },
    { id: "right-shoulder-ac", coarse: "right-shoulder", x: 0.56, y: 0.27 }, { id: "shoulder-right-joint", coarse: "right-shoulder", x: 0.58, y: 0.30 }, { id: "right-deltoid", coarse: "right-shoulder", x: 0.61, y: 0.33 }, { id: "right-biceps", coarse: "right-arm", x: 0.65, y: 0.37 }, { id: "right-triceps", coarse: "right-arm", x: 0.67, y: 0.40 }, { id: "right-forearm-flexor", coarse: "right-arm", x: 0.66, y: 0.45 }, { id: "right-elbow-joint", coarse: "right-arm", x: 0.71, y: 0.46 }, { id: "right-elbow-inner", coarse: "right-arm", x: 0.69, y: 0.47 }, { id: "right-elbow-outer", coarse: "right-arm", x: 0.73, y: 0.47 }, { id: "right-forearm-extensor", coarse: "right-arm", x: 0.75, y: 0.55 }, { id: "right-hand-back", coarse: "right-hand", x: 0.8, y: 0.63 }, ...bodyHandPoints("right", 0.8), ...bodyFootPoints("right", 0.45),
    { id: "chest-right", coarse: "chest", x: 0.57, y: 0.32 }, { id: "rib-right-upper", coarse: "chest", x: 0.56, y: 0.39 }, { id: "abdomen-right-upper", coarse: "abdomen", x: 0.53, y: 0.47 }, { id: "flank-right", coarse: "abdomen", x: 0.61, y: 0.46 }, { id: "hip-right-side", coarse: "right-hip", x: 0.57, y: 0.54 }, { id: "groin-right", coarse: "right-hip", x: 0.53, y: 0.59 },
    { id: "thigh-right-front", coarse: "right-thigh", x: 0.55, y: 0.68 }, { id: "knee-right", coarse: "right-knee", x: 0.54, y: 0.77 }, { id: "right-calf-muscle", coarse: "right-leg", x: 0.56, y: 0.86 }, { id: "right-ankle-outer", coarse: "right-foot", x: 0.57, y: 0.94 }, { id: "foot-right", coarse: "right-foot", x: 0.45, y: 0.95 },
  ],
};

const BACK_INTERNAL_POINTS: Point[] = [
  { id: "cervical-spine", coarse: "neck", x: 0.5, y: 0.23 }, { id: "thoracic-spine", coarse: "upper-back", x: 0.5, y: 0.34 },
  { id: "lumbar-spine", coarse: "lower-back", x: 0.5, y: 0.50 }, { id: "sacrum", coarse: "lower-back", x: 0.5, y: 0.63 },
  { id: "coccyx", coarse: "lower-back", x: 0.5, y: 0.70 }, { id: "trapezius-left", coarse: "upper-back", x: 0.59, y: 0.28 },
  { id: "trapezius-right", coarse: "upper-back", x: 0.41, y: 0.28 }, { id: "left-gluteus", coarse: "left-hip", x: 0.57, y: 0.56 },
  { id: "right-gluteus", coarse: "right-hip", x: 0.43, y: 0.56 }, { id: "left-hamstring", coarse: "left-thigh", x: 0.57, y: 0.65 },
  { id: "right-hamstring", coarse: "right-thigh", x: 0.43, y: 0.65 }, { id: "left-calf-muscle", coarse: "left-leg", x: 0.57, y: 0.82 },
  { id: "right-calf-muscle", coarse: "right-leg", x: 0.43, y: 0.82 }, { id: "sacroiliac-left", coarse: "left-hip", x: 0.57, y: 0.48 },
  { id: "sacroiliac-right", coarse: "right-hip", x: 0.43, y: 0.48 }, { id: "kidney-left", coarse: "lower-back", x: 0.58, y: 0.44 },
  { id: "kidney-right", coarse: "lower-back", x: 0.42, y: 0.44 },
];

const BACK_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.018 },
  { id: "behind-head-left", coarse: "head", x: 0.59, y: 0.07 },
  { id: "behind-head-right", coarse: "head", x: 0.41, y: 0.07 },
  { id: "neck-back", coarse: "neck", x: 0.5, y: 0.225 },
  { id: "shoulder-right-joint", coarse: "right-shoulder", x: 0.41, y: 0.28 }, { id: "shoulder-left-joint", coarse: "left-shoulder", x: 0.59, y: 0.28 },
  { id: "right-deltoid", coarse: "right-shoulder", x: 0.35, y: 0.32 }, { id: "left-deltoid", coarse: "left-shoulder", x: 0.65, y: 0.32 },
  { id: "right-triceps", coarse: "right-arm", x: 0.30, y: 0.39 }, { id: "left-triceps", coarse: "left-arm", x: 0.70, y: 0.39 },
  { id: "right-elbow-joint", coarse: "right-arm", x: 0.27, y: 0.47 }, { id: "left-elbow-joint", coarse: "left-arm", x: 0.73, y: 0.47 },
  { id: "right-elbow-inner", coarse: "right-arm", x: 0.30, y: 0.47 }, { id: "left-elbow-inner", coarse: "left-arm", x: 0.70, y: 0.47 },
  { id: "right-elbow-outer", coarse: "right-arm", x: 0.24, y: 0.47 }, { id: "left-elbow-outer", coarse: "left-arm", x: 0.76, y: 0.47 },
  { id: "right-forearm-extensor", coarse: "right-arm", x: 0.23, y: 0.56 }, { id: "left-forearm-extensor", coarse: "left-arm", x: 0.77, y: 0.56 },
  { id: "right-knee-inner", coarse: "right-knee", x: 0.47, y: 0.76 }, { id: "left-knee-inner", coarse: "left-knee", x: 0.53, y: 0.76 },
  { id: "right-knee-outer", coarse: "right-knee", x: 0.39, y: 0.76 }, { id: "left-knee-outer", coarse: "left-knee", x: 0.61, y: 0.76 },
  ...embeddedHandPoints("right", 0.28),
  ...embeddedHandPoints("left", 0.72),
  ...embeddedFootPoints("right", 0.42),
  ...embeddedFootPoints("left", 0.58),
  { id: "upper-back-left", coarse: "upper-back", x: 0.59, y: 0.29 },
  { id: "upper-back-right", coarse: "upper-back", x: 0.41, y: 0.29 },
  { id: "lower-back-left", coarse: "lower-back", x: 0.58, y: 0.42 },
  { id: "lower-back-right", coarse: "lower-back", x: 0.42, y: 0.42 },
  { id: "hip-left-side", coarse: "left-hip", x: 0.58, y: 0.49 },
  { id: "hip-right-side", coarse: "right-hip", x: 0.42, y: 0.49 },
  { id: "thigh-left-back", coarse: "left-thigh", x: 0.57, y: 0.64 },
  { id: "thigh-right-back", coarse: "right-thigh", x: 0.43, y: 0.64 },
  { id: "calf-left", coarse: "left-leg", x: 0.57, y: 0.8 },
  { id: "calf-right", coarse: "right-leg", x: 0.43, y: 0.8 },
  { id: "foot-left", coarse: "left-foot", x: 0.62, y: 0.94 },
  { id: "foot-right", coarse: "right-foot", x: 0.38, y: 0.94 },
  ...BACK_INTERNAL_POINTS,
];

const FACE_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.15 },
  { id: "brain-left", coarse: "head", x: 0.58, y: 0.23 },
  { id: "brain-right", coarse: "head", x: 0.42, y: 0.23 },
  { id: "scalp-left", coarse: "head", x: 0.78, y: 0.25 },
  { id: "scalp-right", coarse: "head", x: 0.22, y: 0.25 },
  { id: "forehead-left", coarse: "head", x: 0.62, y: 0.32 },
  { id: "forehead-right", coarse: "head", x: 0.38, y: 0.32 },
  { id: "brow-left", coarse: "face", x: 0.63, y: 0.39 },
  { id: "brow-right", coarse: "face", x: 0.37, y: 0.39 },
  { id: "above-eye-left", coarse: "face", x: 0.62, y: 0.42 },
  { id: "above-eye-right", coarse: "face", x: 0.38, y: 0.42 },
  { id: "eye-left", coarse: "face", x: 0.62, y: 0.485 },
  { id: "eye-right", coarse: "face", x: 0.38, y: 0.485 },
  { id: "below-eye-left", coarse: "face", x: 0.62, y: 0.54 },
  { id: "below-eye-right", coarse: "face", x: 0.38, y: 0.54 },
  { id: "ear-left-upper", coarse: "face", x: 0.83, y: 0.42 },
  { id: "ear-left-lower", coarse: "face", x: 0.83, y: 0.55 },
  { id: "ear-right-upper", coarse: "face", x: 0.17, y: 0.42 },
  { id: "ear-right-lower", coarse: "face", x: 0.17, y: 0.55 },
  { id: "temple-left", coarse: "face", x: 0.76, y: 0.47 },
  { id: "temple-right", coarse: "face", x: 0.24, y: 0.47 },
  { id: "cheek-left", coarse: "face", x: 0.64, y: 0.58 },
  { id: "cheek-right", coarse: "face", x: 0.36, y: 0.58 },
  { id: "jaw-left", coarse: "face", x: 0.63, y: 0.68 },
  { id: "jaw-right", coarse: "face", x: 0.37, y: 0.68 },
  { id: "nose-bridge", coarse: "face", x: 0.5, y: 0.54 },
  { id: "nose-tip", coarse: "face", x: 0.5, y: 0.62 },
  { id: "upper-lip", coarse: "face", x: 0.5, y: 0.68 },
  { id: "lower-lip", coarse: "face", x: 0.5, y: 0.72 },
  { id: "chin", coarse: "face", x: 0.5, y: 0.8 },
  { id: "behind-eye-left", coarse: "face", x: 0.7, y: 0.485 },
  { id: "behind-eye-right", coarse: "face", x: 0.3, y: 0.485 },
];

const CHEST_POINTS: Point[] = [
  { id: "breast-right-upper-inner", coarse: "chest", x: 0.36, y: 0.27 },
  { id: "breast-right-upper-outer", coarse: "chest", x: 0.2, y: 0.27 },
  { id: "breast-right-lower-inner", coarse: "chest", x: 0.36, y: 0.46 },
  { id: "breast-right-lower-outer", coarse: "chest", x: 0.2, y: 0.46 },
  { id: "breast-right-nipple", coarse: "chest", x: 0.29, y: 0.37 },
  { id: "breast-right-axillary-tail", coarse: "chest", x: 0.11, y: 0.31 },
  { id: "breast-left-upper-inner", coarse: "chest", x: 0.64, y: 0.27 },
  { id: "breast-left-upper-outer", coarse: "chest", x: 0.8, y: 0.27 },
  { id: "breast-left-lower-inner", coarse: "chest", x: 0.64, y: 0.46 },
  { id: "breast-left-lower-outer", coarse: "chest", x: 0.8, y: 0.46 },
  { id: "breast-left-nipple", coarse: "chest", x: 0.71, y: 0.37 },
  { id: "breast-left-axillary-tail", coarse: "chest", x: 0.89, y: 0.31 },
  { id: "axilla-right", coarse: "chest", x: 0.08, y: 0.2 },
  { id: "axilla-left", coarse: "chest", x: 0.92, y: 0.2 },
  { id: "pectoralis-right", coarse: "chest", x: 0.35, y: 0.58 },
  { id: "pectoralis-left", coarse: "chest", x: 0.65, y: 0.58 },
  { id: "lung-right", coarse: "chest", x: 0.38, y: 0.7 },
  { id: "lung-left", coarse: "chest", x: 0.62, y: 0.7 },
  { id: "heart", coarse: "chest", x: 0.46, y: 0.68 },
  { id: "diaphragm", coarse: "chest", x: 0.5, y: 0.86 },
  { id: "chest-center", coarse: "chest", x: 0.5, y: 0.52 },
  { id: "rib-right-upper", coarse: "chest", x: 0.24, y: 0.62 },
  { id: "rib-left-upper", coarse: "chest", x: 0.76, y: 0.62 },
  { id: "rib-right-lower", coarse: "chest", x: 0.27, y: 0.76 },
  { id: "rib-left-lower", coarse: "chest", x: 0.73, y: 0.76 },
];

function detail(id: BodySiteDetailId, coarse: BodySiteId, x: number, y: number): Point {
  return { id, coarse, x, y };
}

function handPoints(coarse: "left-hand" | "right-hand"): Point[] {
  const mirror = coarse === "right-hand";
  const x = (value: number) => (mirror ? 1 - value : value);
  return [
    detail(`${coarse === "left-hand" ? "left" : "right"}-wrist`, coarse, 0.56, 0.9),
    detail(`${coarse === "left-hand" ? "left" : "right"}-palm`, coarse, 0.56, 0.68),
    detail(`${coarse === "left-hand" ? "left" : "right"}-hand-back`, coarse, 0.56, 0.58),
    detail(`${coarse === "left-hand" ? "left" : "right"}-wrist-joint`, coarse, 0.56, 0.84),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thenar`, coarse, x(0.42), 0.72),
    detail(`${coarse === "left-hand" ? "left" : "right"}-hypothenar`, coarse, x(0.75), 0.72),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-metacarpal`, coarse, x(0.38), 0.62),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-metacarpal`, coarse, x(0.5), 0.54),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-metacarpal`, coarse, x(0.65), 0.5),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-metacarpal`, coarse, x(0.78), 0.55),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-metacarpal`, coarse, x(0.91), 0.62),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-cmc`, coarse, x(0.42), 0.68),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-mcp`, coarse, x(0.32), 0.55),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-ip`, coarse, x(0.28), 0.43),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-mcp`, coarse, x(0.5), 0.44),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-pip`, coarse, x(0.5), 0.32),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-dip`, coarse, x(0.5), 0.2),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-mcp`, coarse, x(0.65), 0.39),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-pip`, coarse, x(0.65), 0.26),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-dip`, coarse, x(0.65), 0.14),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-mcp`, coarse, x(0.78), 0.44),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-pip`, coarse, x(0.78), 0.32),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-dip`, coarse, x(0.78), 0.2),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-mcp`, coarse, x(0.91), 0.5),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-pip`, coarse, x(0.91), 0.38),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-dip`, coarse, x(0.91), 0.27),
  ];
}

function embeddedHandPoints(side: "left" | "right", centerX: number): Point[] {
  return bodyHandPoints(side, centerX).map((point) => ({
    ...point,
    x: centerX + (point.x - centerX) * 0.14,
    y: 0.535 + point.y * 0.24,
  }));
}

function embeddedFootPoints(side: "left" | "right", centerX: number): Point[] {
  const coarse = `${side}-foot` as "left-foot" | "right-foot";
  return footPoints(coarse).map((point) => ({
    ...point,
    x: centerX + (point.x - 0.5) * 0.13,
    y: 0.835 + point.y * 0.12,
  }));
}

function footPoints(coarse: "left-foot" | "right-foot"): Point[] {
  const side = coarse === "left-foot" ? "left" : "right";
  return [
    detail(`${side}-ankle-inner`, coarse, 0.38, 0.88),
    detail(`${side}-ankle-outer`, coarse, 0.62, 0.88),
    detail(`${side}-heel`, coarse, 0.5, 0.82),
    detail(`${side}-arch`, coarse, 0.44, 0.64),
    detail(`${side}-metatarsal`, coarse, 0.5, 0.45),
    detail(`${side}-second-toe-mtp`, coarse, 0.46, 0.32),
    detail(`${side}-second-toe-pip`, coarse, 0.46, 0.22),
    detail(`${side}-second-toe-dip`, coarse, 0.46, 0.13),
    detail(`${side}-third-toe-mtp`, coarse, 0.57, 0.31),
    detail(`${side}-third-toe-pip`, coarse, 0.57, 0.2),
    detail(`${side}-third-toe-dip`, coarse, 0.57, 0.12),
    detail(`${side}-fourth-toe-mtp`, coarse, 0.68, 0.33),
    detail(`${side}-fourth-toe-pip`, coarse, 0.68, 0.23),
    detail(`${side}-fourth-toe-dip`, coarse, 0.68, 0.15),
    detail(`${side}-little-toe-mtp`, coarse, 0.79, 0.36),
    detail(`${side}-little-toe-pip`, coarse, 0.79, 0.26),
    detail(`${side}-little-toe-dip`, coarse, 0.79, 0.17),
    detail(`${side}-big-toe-mtp`, coarse, 0.34, 0.34),
    detail(`${side}-big-toe-ip`, coarse, 0.3, 0.21),
    detail(`${side}-second-toe`, coarse, 0.46, 0.16),
    detail(`${side}-third-toe`, coarse, 0.57, 0.15),
    detail(`${side}-fourth-toe`, coarse, 0.68, 0.17),
    detail(`${side}-little-toe`, coarse, 0.79, 0.22),
  ];
}

function regionPoints(site: BodySiteId): Point[] {
  const points: Record<string, Array<[BodySiteDetailId, number, number]>> = {
    abdomen: [
      ["liver", 0.72, 0.2], ["gallbladder", 0.8, 0.28], ["stomach", 0.28, 0.28], ["spleen", 0.2, 0.32],
      ["pancreas", 0.5, 0.35], ["bowel-left", 0.3, 0.5], ["bowel-right", 0.7, 0.5],
      ["rectus-abdominis", 0.5, 0.47], ["oblique-left", 0.78, 0.55], ["oblique-right", 0.22, 0.55],
      ["uterus", 0.5, 0.72], ["ovary-left", 0.36, 0.72], ["ovary-right", 0.64, 0.72], ["bladder", 0.5, 0.86], ["pubic-symphysis", 0.5, 0.96],
    ],
    "left-arm": [["left-biceps", 0.42, 0.28], ["left-triceps", 0.64, 0.28], ["left-forearm-flexor", 0.42, 0.58], ["left-forearm-extensor", 0.64, 0.58], ["left-elbow-joint", 0.5, 0.44], ["left-elbow-inner", 0.43, 0.44], ["left-elbow-outer", 0.62, 0.44]],
    "right-arm": [["right-biceps", 0.58, 0.28], ["right-triceps", 0.36, 0.28], ["right-forearm-flexor", 0.58, 0.58], ["right-forearm-extensor", 0.36, 0.58], ["right-elbow-joint", 0.5, 0.44], ["right-elbow-inner", 0.57, 0.44], ["right-elbow-outer", 0.38, 0.44]],
    "left-shoulder": [["shoulder-left-joint", 0.52, 0.35], ["left-shoulder-ac", 0.68, 0.2], ["left-deltoid", 0.7, 0.5]],
    "right-shoulder": [["shoulder-right-joint", 0.48, 0.35], ["right-shoulder-ac", 0.32, 0.2], ["right-deltoid", 0.3, 0.5]],
    "left-thigh": [["left-quad", 0.5, 0.3], ["left-hamstring", 0.5, 0.7]],
    "right-thigh": [["right-quad", 0.5, 0.3], ["right-hamstring", 0.5, 0.7]],
    "left-knee": [["left-knee-inner", 0.35, 0.5], ["left-knee-outer", 0.7, 0.5]],
    "right-knee": [["right-knee-inner", 0.65, 0.5], ["right-knee-outer", 0.3, 0.5]],
    "left-leg": [["left-calf-muscle", 0.5, 0.65]],
    "right-leg": [["right-calf-muscle", 0.5, 0.65]],
    "left-hip": [["left-hip-joint", 0.48, 0.33], ["left-gluteus", 0.52, 0.68], ["sacroiliac-left", 0.7, 0.55], ["pelvis-left", 0.38, 0.5]],
    "right-hip": [["right-hip-joint", 0.52, 0.33], ["right-gluteus", 0.48, 0.68], ["sacroiliac-right", 0.3, 0.55], ["pelvis-right", 0.62, 0.5]],
    "lower-back": [["kidney-left", 0.35, 0.32], ["kidney-right", 0.65, 0.32], ["lumbar-spine", 0.5, 0.5], ["sacrum", 0.5, 0.72], ["coccyx", 0.5, 0.88], ["lower-back-left", 0.3, 0.5], ["lower-back-right", 0.7, 0.5]],
    "upper-back": [["trapezius-left", 0.35, 0.2], ["trapezius-right", 0.65, 0.2], ["thoracic-spine", 0.5, 0.48], ["upper-back-left", 0.3, 0.6], ["upper-back-right", 0.7, 0.6]],
    neck: [["cervical-spine", 0.5, 0.26], ["neck-front", 0.5, 0.5], ["neck-back", 0.5, 0.74]],
  };
  return (points[site] ?? []).map(([id, x, y]) => detail(id, site, x, y));
}

function mapKindForSite(site: BodySiteId): MapKind | undefined {
  if (site === "head" || site === "face") return "face";
  if (site === "chest") return "chest";
  if (site === "left-hand" || site === "right-hand") return "hand";
  if (site === "left-foot" || site === "right-foot") return "foot";
  if (regionPoints(site).length) return "region";
  return undefined;
}

function rootPointsForSide(side: Side): Point[] {
  if (side === "front") return FRONT_POINTS;
  if (side === "back") return BACK_POINTS;
  // As ilustrações laterais ocupam a metade externa da tela; os pontos
  // precisam acompanhar essa composição, não o centro geométrico do canvas.
  return LATERAL_POINTS[side].map((point) => ({
    ...point,
    x: lateralPointX(side, point.x),
  }));
}

function pointsForMap(kind: MapKind, site: BodySiteId): Point[] {
  if (kind === "face") return FACE_POINTS;
  if (kind === "chest") return CHEST_POINTS;
  if (kind === "hand") return handPoints(site as "left-hand" | "right-hand");
  if (kind === "foot") return footPoints(site as "left-foot" | "right-foot");
  return regionPoints(site);
}

export function BodyDiagram({ selected = [], selectedDetails = [], onSelect, onSelectDetail, multi = false, side, onSideChange }: { selected?: BodySiteId[]; selectedDetails?: BodySiteDetailId[]; onSelect: (site: BodySiteId) => void; onSelectDetail?: (detail: BodySiteDetailId) => void; multi?: boolean; side: Side; onSideChange: (side: Side) => void }) {
  const [zoom, setZoom] = useState(1);
  const [pinchStartZoom, setPinchStartZoom] = useState(1);
  const [lastSelectedPoint, setLastSelectedPoint] = useState<Point>();
  const rootPoints = rootPointsForSide(side);
  const points = rootPoints;
  const mapWidth = MAP_WIDTH;
  const mapHeight = MAP_HEIGHT;
  const renderedWidth = mapWidth * zoom;
  const renderedHeight = mapHeight * zoom;
  const selectedPoints = useMemo(() => {
    const exact = points.filter((point) => selectedDetails.includes(point.id));
    if (exact.length) return exact;
    return points.filter((point, index) => selected.includes(point.coarse) && points.findIndex((candidate) => candidate.coarse === point.coarse) === index);
  }, [points, selected, selectedDetails]);

  const zoomIn = () => setZoom((value) => Math.min(9, Number((value + 0.5).toFixed(1))));
  const zoomOut = () => setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(1))));
  const resetZoom = () => setZoom(1);
  const handlePinchStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) setPinchStartZoom(zoom);
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      setZoom((value) => Math.max(1, Math.min(9, Number(value.toFixed(2)))));
    }
  };
  const handlePinch = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setZoom(Math.max(1, Math.min(9, Number((pinchStartZoom * event.nativeEvent.scale).toFixed(2)))));
    }
  };

  const handleMapPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const normalizedX = canonicalBodyX(side, locationX / renderedWidth);
    const normalizedY = canonicalBodyY(side, locationY / renderedHeight);
    const nearest = resolveBodyPoint(side, normalizedX, normalizedY);
    setLastSelectedPoint(nearest);
    onSelect(nearest.coarse);
    onSelectDetail?.(nearest.id);
  };

  const mapLabel = `Mapa corporal ${side === "front" ? "frontal" : side === "back" ? "posterior" : side === "left" ? "lateral esquerda" : "lateral direita"}`;

  return <View style={styles.root}>
    <View style={styles.sideToggle}><Pressable accessibilityRole="button" accessibilityLabel="Vista frontal" accessibilityState={{ selected: side === "front" }} onPress={() => onSideChange("front")} style={[styles.sideButton, side === "front" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "front" && styles.sideTextActive]}>Frente</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Vista posterior" accessibilityState={{ selected: side === "back" }} onPress={() => onSideChange("back")} style={[styles.sideButton, side === "back" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "back" && styles.sideTextActive]}>Costas</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Vista lateral esquerda" accessibilityState={{ selected: side === "left" }} onPress={() => onSideChange("left")} style={[styles.sideButton, side === "left" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "left" && styles.sideTextActive]}>Lateral E</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Vista lateral direita" accessibilityState={{ selected: side === "right" }} onPress={() => onSideChange("right")} style={[styles.sideButton, side === "right" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "right" && styles.sideTextActive]}>Lateral D</Text></Pressable></View>
    <View style={styles.mapFrame}><View style={styles.zoomBar}><Pressable accessibilityRole="button" accessibilityLabel="Redefinir zoom" onPress={resetZoom} style={styles.zoomValue}><Text style={styles.zoomValueText}>Pinça · {zoom.toFixed(1)}×</Text></Pressable></View><View style={styles.viewport}><ScrollView horizontal contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}><ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}><PinchGestureHandler onGestureEvent={handlePinch} onHandlerStateChange={handlePinchStateChange}><Pressable accessibilityRole="imagebutton" accessibilityLabel={`${mapLabel}. Toque diretamente no local da dor.`} onPress={handleMapPress} style={[styles.map, { width: renderedWidth, height: renderedHeight }]}><AnatomicalAsset side={side} width={renderedWidth} height={renderedHeight} /><Svg width={renderedWidth} height={renderedHeight} viewBox={`0 0 ${mapWidth} ${mapHeight}`} style={StyleSheet.absoluteFillObject} pointerEvents="none"><Rect x="0" y="0" width={mapWidth} height={mapHeight} fill="transparent" />{points.map((point) => { const x = assetXFromCanonical(side, point.x) * mapWidth; const y = assetYFromCanonical(side, point.y) * mapHeight; const selected = selectedDetails.includes(point.id); const showLabel = zoom >= 1.8 || selected; const label = zoom >= 1.8 ? bodySiteDetailLabel(point.id) : compactAnatomicalLabel(point.id); const labelX = x < mapWidth / 2 ? x + 8 : x - 8; return <G key={`target-${point.id}`}><Circle cx={x} cy={y} r={selected ? 12 : 8} fill={selected ? "#E98B5A" : "#176B87"} stroke="#FFFFFF" strokeWidth={2} opacity={selected ? 1 : 0.96} />{showLabel && <SvgText x={labelX} y={y + 3} fill={selected ? "#9A4B26" : "#174B5A"} fontSize={zoom >= 1.8 ? 7 : 6} fontWeight={selected ? "700" : "500"} textAnchor={x < mapWidth / 2 ? "start" : "end"}>{label}</SvgText>}</G>; })}</Svg>{selectedPoints.map((point) => { const markerX = assetXFromCanonical(side, point.x); const markerY = assetYFromCanonical(side, point.y); return <View key={point.id} pointerEvents="none" style={[styles.selection, { left: markerX * mapWidth * zoom - 14, top: markerY * mapHeight * zoom - 14 }]}><Text style={styles.selectionText}>•</Text></View>; })}</Pressable></PinchGestureHandler></ScrollView></ScrollView></View></View>{lastSelectedPoint && <Text style={styles.selectedLabel}>{bodySiteDetailLabel(lastSelectedPoint.id)}</Text>}<Text style={styles.helper}>{zoom > 1.15 ? "A malha de pontos acompanha o corpo ampliado; toque diretamente na área da dor." : "Aproxime com dois dedos para revelar os pontos anatômicos sem sair desta tela."}</Text>
  </View>;
}

function compactAnatomicalLabel(id: BodySiteDetailId): string {
  const label = bodySiteDetailLabel(id);
  return label.length > 22 ? `${label.slice(0, 21)}…` : label;
}

export function resolveBodyPoint(side: Side, rawX: number, rawY: number): Point {
  const points = rootPointsForSide(side);
  const x = Math.max(0, Math.min(1, rawX));
  const y = canonicalBodyY(side, rawY);
  const band = y < 0.22 ? points.filter((point) => point.coarse === "head" || point.coarse === "face" || point.coarse === "neck")
    : y < 0.32 ? points.filter((point) => ["neck", "chest", "left-shoulder", "right-shoulder", "left-arm", "right-arm", "left-hand", "right-hand", "upper-back"].includes(point.coarse))
    : y < 0.47 ? points.filter((point) => ["chest", "left-shoulder", "right-shoulder", "left-arm", "right-arm", "abdomen", "lower-back", "upper-back"].includes(point.coarse))
    : y < 0.58 ? points.filter((point) => ["left-hip", "right-hip", "abdomen", "lower-back", "left-arm", "right-arm", "left-hand", "right-hand"].includes(point.coarse))
    : points.filter((point) => ["left-thigh", "right-thigh", "left-knee", "right-knee", "left-leg", "right-leg", "left-foot", "right-foot", "left-arm", "right-arm", "left-hand", "right-hand", "abdomen", "lower-back"].includes(point.coarse));
  return resolveDetailPoint(band.length ? band : points, x, y);
}

export function resolveSubmapPoint(site: BodySiteId, rawX: number, rawY: number): Point | undefined {
  const kind = mapKindForSite(site);
  if (!kind) return undefined;
  return resolveDetailPoint(pointsForMap(kind, site), rawX, rawY);
}

function resolveDetailPoint(points: Point[], rawX: number, rawY: number): Point {
  const x = Math.max(0, Math.min(1, rawX));
  const y = Math.max(0, Math.min(1, rawY));
  return points.reduce((best, point) => {
    const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
    return distance < best.distance ? { point, distance } : best;
  }, { point: points[0], distance: Number.POSITIVE_INFINITY }).point;
}

const ANATOMICAL_ASSETS: Record<Side, any> = { front: anatomicalFront, back: anatomicalBack, left: anatomicalLeftProfile, right: anatomicalRightProfile };
const WEB_ANATOMICAL_ASSETS: Record<Side, string> = { front: "/anatomical-front.png", back: "/anatomical-back.png", left: "/anatomical-left-profile.png", right: "/anatomical-right-profile.png" };

function AnatomicalAsset({ side, width, height }: { side: Side; width: number; height: number }) {
  const source = Platform.OS === "web" ? { uri: WEB_ANATOMICAL_ASSETS[side] } : ANATOMICAL_ASSETS[side];
  return <View pointerEvents="none" style={[styles.anatomicalAsset, { width, height }]}><Image source={source} resizeMode="contain" style={StyleSheet.absoluteFillObject} /></View>;
}

function DetailArt({ kind, site }: { kind: MapKind; site: BodySiteId }) {
  if (kind === "face") return <FaceArt />;
  if (kind === "chest") return <ChestArt />;
  if (kind === "hand") return <HandArt />;
  if (kind === "foot") return <FootArt />;
  return <RegionArt site={site} />;
}

function FaceArt() { return <G><Ellipse cx="150" cy="210" rx="105" ry="145" fill="#DCE9ED" /><Ellipse cx="42" cy="215" rx="18" ry="35" fill="#C8DDE2" /><Ellipse cx="258" cy="215" rx="18" ry="35" fill="#C8DDE2" /><Path d="M80 170 Q110 150 135 170 M165 170 Q190 150 220 170 M95 240 Q120 225 138 240 M162 240 Q180 225 205 240 M105 290 Q150 325 195 290" fill="none" stroke="#8FB7C1" strokeWidth="5" strokeLinecap="round" /><Circle cx="112" cy="208" r="12" fill="#F7FAFC" stroke="#8FB7C1" strokeWidth="4" /><Circle cx="188" cy="208" r="12" fill="#F7FAFC" stroke="#8FB7C1" strokeWidth="4" /><Path d="M150 220 L140 260 L160 260" fill="none" stroke="#8FB7C1" strokeWidth="4" /></G>; }

function ChestArt() { return <G><Path d="M92 35 Q150 15 208 35 L245 120 L225 385 L75 385 L55 120 Z" fill="#DCE9ED" /><Ellipse cx="88" cy="170" rx="58" ry="75" fill="#C8DDE2" stroke="#8FB7C1" strokeWidth="4" /><Ellipse cx="212" cy="170" rx="58" ry="75" fill="#C8DDE2" stroke="#8FB7C1" strokeWidth="4" /><Line x1="150" y1="75" x2="150" y2="280" stroke="#8FB7C1" strokeWidth="3" /><Path d="M30 105 Q55 120 58 175 M270 105 Q245 120 242 175" fill="none" stroke="#8FB7C1" strokeWidth="15" strokeLinecap="round" /></G>; }

function HandArt() { return <G><Path d="M105 390 Q85 350 92 300 L100 170 Q102 150 118 150 Q132 150 132 170 L132 245 L139 75 Q140 55 156 55 Q172 55 172 75 L172 235 L180 45 Q181 25 197 25 Q213 25 214 47 L211 240 L220 75 Q221 55 237 58 Q252 61 251 83 L244 260 L255 145 Q258 125 273 128 Q288 131 286 153 L278 300 Q274 360 235 400 Z" fill="#DCE9ED" stroke="#8FB7C1" strokeWidth="4" /><Path d="M111 300 Q170 330 240 295 M102 350 Q170 375 245 345" fill="none" stroke="#8FB7C1" strokeWidth="4" /><Line x1="140" y1="110" x2="165" y2="110" stroke="#8FB7C1" strokeWidth="3" /><Line x1="184" y1="100" x2="210" y2="100" stroke="#8FB7C1" strokeWidth="3" /><Line x1="224" y1="120" x2="247" y2="120" stroke="#8FB7C1" strokeWidth="3" /></G>; }

function FootArt() { return <G><Path d="M112 390 C90 380 82 350 86 315 C90 280 96 245 92 210 C88 177 79 143 86 112 C91 91 106 84 119 96 C124 69 138 54 153 64 C158 37 176 25 191 38 C199 18 218 16 228 34 C241 55 239 92 235 120 C231 155 226 187 224 218 C222 256 234 293 238 325 C243 362 224 392 197 400 C171 408 137 403 112 390 Z" fill="#DCE9ED" stroke="#8FB7C1" strokeWidth="4" /><Path d="M94 205 Q155 228 224 202 M90 276 Q155 300 231 273" fill="none" stroke="#8FB7C1" strokeWidth="4" /><Line x1="118" y1="105" x2="118" y2="174" stroke="#8FB7C1" strokeWidth="3" /><Line x1="147" y1="72" x2="147" y2="166" stroke="#8FB7C1" strokeWidth="3" /><Line x1="178" y1="44" x2="178" y2="163" stroke="#8FB7C1" strokeWidth="3" /><Line x1="209" y1="40" x2="209" y2="168" stroke="#8FB7C1" strokeWidth="3" /><Line x1="228" y1="59" x2="228" y2="174" stroke="#8FB7C1" strokeWidth="3" /></G>; }

function RegionArt({ site }: { site: BodySiteId }) {
  if (site === "abdomen") return <G><Path d="M82 35 Q150 15 218 35 L230 365 Q150 405 70 365 Z" fill="#DCE9ED" stroke="#8FB7C1" strokeWidth="4" /><Line x1="150" y1="40" x2="150" y2="365" stroke="#B9D0D6" strokeWidth="3" /><Ellipse cx="102" cy="112" rx="29" ry="38" fill="#C8DDE2" /><Ellipse cx="198" cy="112" rx="29" ry="38" fill="#C8DDE2" /><Ellipse cx="150" cy="155" rx="34" ry="17" fill="#C8DDE2" /><Path d="M92 210 Q150 232 208 210 M86 286 Q150 310 214 286" fill="none" stroke="#8FB7C1" strokeWidth="5" /></G>;
  if (site === "left-hip" || site === "right-hip") return <G><Path d="M62 60 Q150 20 238 60 L218 260 Q202 350 150 390 Q98 350 82 260 Z" fill="#DCE9ED" stroke="#8FB7C1" strokeWidth="4" /><Path d="M150 60 L150 350 M84 205 Q150 230 216 205" fill="none" stroke="#B9D0D6" strokeWidth="3" /><Ellipse cx={site === "left-hip" ? 112 : 188} cy="238" rx="24" ry="34" fill="#C8DDE2" stroke="#8FB7C1" strokeWidth="3" /><Ellipse cx={site === "left-hip" ? 92 : 208} cy="250" rx="14" ry="22" fill="#C8DDE2" /><Path d="M95 300 Q150 335 205 300" fill="none" stroke="#8FB7C1" strokeWidth="5" /></G>;
  if (site === "lower-back" || site === "upper-back" || site === "neck") return <G><Path d="M76 35 Q150 18 224 35 L230 365 Q150 405 70 365 Z" fill="#CFDFE4" stroke="#8FB7C1" strokeWidth="4" /><Line x1="150" y1="35" x2="150" y2="370" stroke="#8FB7C1" strokeWidth="4" /><Path d="M88 120 Q150 150 212 120 M84 220 Q150 250 216 220 M82 315 Q150 345 218 315" fill="none" stroke="#B9D0D6" strokeWidth="4" /></G>;
  return <G><Rect x="62" y="30" width="176" height="370" rx="52" fill="#DCE9ED" stroke="#8FB7C1" strokeWidth="4" /><Path d={site.includes("back") ? "M85 140 Q150 175 215 140 M82 230 Q150 260 218 230" : "M92 145 Q150 175 208 145 M92 245 Q150 275 208 245"} fill="none" stroke="#8FB7C1" strokeWidth="5" /><Line x1="150" y1="50" x2="150" y2="380" stroke="#B9D0D6" strokeWidth="3" /></G>;
}

function LateralBodyArt({ side }: { side: "left" | "right" }) {
  const mirror = side === "right";
  return <G transform={mirror ? "translate(250 0) scale(-1 1)" : undefined}>
    <Path d="M108 17 C94 25 91 45 99 61 C104 70 106 76 101 82 L86 96 C71 108 64 132 68 161 L80 215 L101 228 L143 228 L157 201 C166 173 168 132 157 109 L141 91 C136 85 136 77 140 69 C147 52 142 28 128 20 Z" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <Path d="M101 81 Q83 89 72 107 L58 142 L43 207 Q41 222 52 226 L68 217 L79 164 L99 128" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <Path d="M103 222 L141 222 L151 338 C153 365 160 391 168 418 L143 418 C136 390 126 360 122 338 Z" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <Path d="M141 411 L168 411 C182 417 187 429 184 438 L150 438 Z" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <G stroke="#83AEB8" strokeWidth="2" fill="none"><Path d="M93 112 Q122 128 151 111" /><Path d="M83 142 Q119 157 158 143" /><Path d="M86 174 Q119 187 158 174" /><Path d="M93 204 Q121 215 153 204" /><Path d="M105 252 Q122 263 143 253" /><Path d="M108 319 Q127 329 150 320" /><Ellipse cx="126" cy="345" rx="11" ry="8" /></G>
  </G>;
}

function BodyArt({ side }: { side: "front" | "back" }) {
  const back = side === "back";
  return <G>
    <Ellipse cx="94" cy="48" rx="8" ry="14" fill="#BFD8DE" /><Ellipse cx="156" cy="48" rx="8" ry="14" fill="#BFD8DE" />
    <Ellipse cx="125" cy="43" rx="31" ry="36" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="1.5" />
    <Path d="M110 73 C108 82 101 86 95 91 L78 108 C68 127 72 175 84 204 L96 226 L154 226 L166 204 C178 175 182 127 172 108 L155 91 C149 86 142 82 140 73 Z" fill={back ? "#CFDFE4" : "#DCE9ED"} stroke="#9CBFC7" strokeWidth="2" />
    <Path d="M80 103 C63 106 52 123 43 149 L29 207 C27 218 34 225 43 225 C52 225 57 219 59 209 L74 160 L91 130" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <Path d="M170 103 C187 106 198 123 207 149 L221 207 C223 218 216 225 207 225 C198 225 193 219 191 209 L176 160 L159 130" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    {!back && <G stroke="#83AEB8" strokeWidth="2" fill="none"><Path d="M92 117 Q108 104 125 117 Q142 104 158 117" /><Path d="M88 135 Q105 147 123 137 Q142 147 162 135" /><Path d="M90 157 Q108 168 125 159 Q142 168 160 157" /><Path d="M94 181 Q109 190 125 182 Q141 190 156 181" /><Line x1="125" y1="116" x2="125" y2="211" /></G>}
    {back && <G stroke="#83AEB8" strokeWidth="2" fill="none"><Line x1="125" y1="107" x2="125" y2="216" /><Path d="M91 124 Q106 111 124 128 Q143 111 159 124" /><Path d="M84 150 Q102 167 124 153 Q148 167 166 150" /><Path d="M88 184 Q105 196 125 184 Q145 196 162 184" /></G>}
    <Path d="M94 214 L122 214 L120 337 C117 361 105 389 99 418 L75 418 C77 386 83 359 84 337 Z" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <Path d="M128 214 L156 214 L166 337 C167 359 173 386 175 418 L151 418 C145 389 133 361 130 337 Z" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <G stroke="#83AEB8" strokeWidth="2" fill="none"><Path d="M88 250 Q106 260 119 250" /><Path d="M131 250 Q145 260 163 250" /><Path d="M85 320 Q103 330 119 320" /><Path d="M131 320 Q147 330 165 320" /><Ellipse cx="103" cy="346" rx="12" ry="8" /><Ellipse cx="147" cy="346" rx="12" ry="8" /></G>
    <Path d="M74 411 L101 411 L94 438 L58 438 C55 429 61 417 74 411 Z" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" /><Path d="M150 411 L177 411 C190 417 195 429 192 438 L156 438 Z" fill="#DCE9ED" stroke="#9CBFC7" strokeWidth="2" />
    <Path d="M23 208 Q15 214 18 226 M227 208 Q235 214 232 226" stroke="#BFD8DE" strokeWidth="8" strokeLinecap="round" />
  </G>;
}

const MAP_WIDTH = 250;
const MAP_HEIGHT = 420;
const styles = StyleSheet.create({
  root: { alignItems: "center" },
  detailHeader: { alignItems: "center", flexDirection: "row", marginBottom: 8, maxWidth: 304, width: "100%" },
  backButton: { alignItems: "center", backgroundColor: "#EAF4F7", borderRadius: 14, height: 44, justifyContent: "center", width: 44 },
  backText: { color: "#176B87", fontSize: 31, fontWeight: "700", lineHeight: 34 },
  detailTitleWrap: { flex: 1, paddingLeft: 10 },
  detailTitle: { color: "#17313A", fontSize: 14, fontWeight: "800" },
  detailHint: { color: "#60747C", fontSize: 12, marginTop: 2 },
  zoomBar: { alignItems: "center", flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 10 },
  zoomButton: { alignItems: "center", backgroundColor: "#176B87", borderRadius: 14, height: 48, justifyContent: "center", width: 52 },
  zoomDisabled: { opacity: 0.35 },
  zoomText: { color: "#FFFFFF", fontSize: 30, fontWeight: "700", lineHeight: 32 },
  zoomValue: { alignItems: "center", backgroundColor: "#EAF4F7", borderColor: "#BCD0D6", borderRadius: 14, borderWidth: 1, height: 48, justifyContent: "center", minWidth: 76, paddingHorizontal: 12 },
  zoomValueText: { color: "#176B87", fontSize: 15, fontWeight: "800" },
  selectedLabel: { color: "#17313A", fontSize: 16, fontWeight: "800", marginTop: 8, textAlign: "center" },
  viewport: { backgroundColor: "#F7FAFC", borderRadius: 16, height: 516, overflow: "hidden", width: 304 },
  scrollContent: { alignItems: "center", flexGrow: 1, justifyContent: "center", minHeight: 516, minWidth: 304 },
  sideToggle: { backgroundColor: "#EAF0F2", borderRadius: 14, flexDirection: "row", marginBottom: 8, maxWidth: 304, padding: 4, width: "100%" },
  sideButton: { alignItems: "center", borderRadius: 10, flex: 1, justifyContent: "center", minHeight: 38, minWidth: 0, paddingHorizontal: 2 },
  sideButtonActive: { backgroundColor: "#176B87" },
  sideText: { color: "#60747C", fontSize: 11, fontWeight: "700", textAlign: "center" },
  sideTextActive: { color: "#FFFFFF" },
  mapFrame: { backgroundColor: "#FFFFFF", borderColor: "#D9E3E7", borderRadius: 24, borderWidth: 1, padding: 12 },
  map: { backgroundColor: "#F7FAFC", borderRadius: 16, overflow: "hidden", position: "relative" },
  anatomicalAsset: { left: 0, opacity: 0.98, position: "absolute", top: 0 },
  selection: { alignItems: "center", backgroundColor: "#E98B5A", borderColor: "#B55735", borderRadius: 14, borderWidth: 2, height: 28, justifyContent: "center", position: "absolute", width: 28 },
  selectionText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", lineHeight: 20 },
  helper: { color: "#60747C", fontSize: 13, fontWeight: "600", marginTop: 8, textAlign: "center" },
});
