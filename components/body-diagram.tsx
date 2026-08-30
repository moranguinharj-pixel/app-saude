import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  BodySiteDetailId,
  BodySiteId,
  bodySiteDetailLabel,
} from "@/shared/records";
import { bodyPointToMap, mapPointToBody } from "@/shared/body-map-geometry";
import { nearestBodyPoint } from "@/shared/body-map-selection";
import anatomicalFront from "../assets/images/anatomical-front.png";
import anatomicalBack from "../assets/images/anatomical-back.png";
import anatomicalLeftProfile from "../assets/images/anatomical-left-profile.png";
import anatomicalRightProfile from "../assets/images/anatomical-right-profile.png";

type Point = { id: BodySiteDetailId; coarse: BodySiteId; x: number; y: number };
export type Side = "front" | "back" | "left" | "right";
type MapKind = "face" | "chest" | "hand" | "foot" | "region";

const FRONT_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.005 },
  { id: "forehead-left", coarse: "head", x: 0.55, y: 0.045 },
  { id: "forehead-right", coarse: "head", x: 0.45, y: 0.045 },
  { id: "above-eye-left", coarse: "face", x: 0.55, y: 0.065 },
  { id: "above-eye-right", coarse: "face", x: 0.45, y: 0.065 },
  { id: "below-eye-left", coarse: "face", x: 0.55, y: 0.09 },
  { id: "below-eye-right", coarse: "face", x: 0.45, y: 0.09 },
  { id: "ear-left-upper", coarse: "face", x: 0.59, y: 0.07 },
  { id: "ear-left-lower", coarse: "face", x: 0.59, y: 0.105 },
  { id: "ear-right-upper", coarse: "face", x: 0.41, y: 0.07 },
  { id: "ear-right-lower", coarse: "face", x: 0.41, y: 0.105 },
  { id: "temple-left", coarse: "face", x: 0.575, y: 0.075 },
  { id: "temple-right", coarse: "face", x: 0.425, y: 0.075 },
  { id: "cheek-left", coarse: "face", x: 0.55, y: 0.105 },
  { id: "cheek-right", coarse: "face", x: 0.45, y: 0.105 },
  { id: "jaw-left", coarse: "face", x: 0.54, y: 0.13 },
  { id: "jaw-right", coarse: "face", x: 0.46, y: 0.13 },
  { id: "neck-front", coarse: "neck", x: 0.5, y: 0.16 },
  { id: "right-shoulder-ac", coarse: "right-shoulder", x: 0.31, y: 0.19 },
  { id: "right-elbow-inner", coarse: "right-arm", x: 0.24, y: 0.32 },
  { id: "right-elbow-joint", coarse: "right-arm", x: 0.2, y: 0.345 },
  { id: "right-elbow-outer", coarse: "right-arm", x: 0.17, y: 0.36 },
  { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.69, y: 0.19 },
  { id: "left-elbow-inner", coarse: "left-arm", x: 0.76, y: 0.32 },
  { id: "left-elbow-joint", coarse: "left-arm", x: 0.8, y: 0.345 },
  { id: "left-elbow-outer", coarse: "left-arm", x: 0.83, y: 0.36 },
  { id: "hand-right-overview", coarse: "right-hand", x: 0.1, y: 0.45 },
  { id: "hand-left-overview", coarse: "left-hand", x: 0.9, y: 0.45 },
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
  { id: "knee-right", coarse: "right-knee", x: 0.43, y: 0.75 },
  { id: "shin-left", coarse: "left-leg", x: 0.58, y: 0.84 },
  { id: "shin-right", coarse: "right-leg", x: 0.42, y: 0.84 },
  { id: "ankle-left", coarse: "left-foot", x: 0.59, y: 0.92 },
  { id: "ankle-right", coarse: "right-foot", x: 0.41, y: 0.92 },
  { id: "foot-left", coarse: "left-foot", x: 0.62, y: 0.975 },
  { id: "foot-right", coarse: "right-foot", x: 0.38, y: 0.975 },
];

const LATERAL_POINTS: Record<"left" | "right", Point[]> = {
  left: [
    { id: "head-top", coarse: "head", x: 0.5, y: 0.005 },
    { id: "temple-left", coarse: "face", x: 0.28, y: 0.07 },
    { id: "cheek-left", coarse: "face", x: 0.22, y: 0.11 },
    { id: "jaw-left", coarse: "face", x: 0.28, y: 0.14 },
    { id: "neck-front", coarse: "neck", x: 0.36, y: 0.17 },
    { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.63, y: 0.2 },
    { id: "left-biceps", coarse: "left-arm", x: 0.62, y: 0.29 },
    { id: "left-elbow-joint", coarse: "left-arm", x: 0.61, y: 0.37 },
    { id: "left-forearm-extensor", coarse: "left-arm", x: 0.57, y: 0.44 },
    { id: "left-hand-back", coarse: "left-hand", x: 0.52, y: 0.51 },
    { id: "chest-left", coarse: "chest", x: 0.28, y: 0.26 },
    { id: "rib-left-upper", coarse: "chest", x: 0.3, y: 0.34 },
    { id: "abdomen-left-upper", coarse: "abdomen", x: 0.34, y: 0.4 },
    { id: "flank-left", coarse: "abdomen", x: 0.63, y: 0.4 },
    { id: "hip-left-side", coarse: "left-hip", x: 0.62, y: 0.5 },
    { id: "groin-left", coarse: "left-hip", x: 0.4, y: 0.54 },
    { id: "thigh-left-front", coarse: "left-thigh", x: 0.46, y: 0.63 },
    { id: "knee-left", coarse: "left-knee", x: 0.49, y: 0.74 },
    { id: "left-calf-muscle", coarse: "left-leg", x: 0.55, y: 0.84 },
    { id: "left-ankle-inner", coarse: "left-foot", x: 0.52, y: 0.92 },
    { id: "foot-left", coarse: "left-foot", x: 0.35, y: 0.975 },
  ],
  right: [
    { id: "head-top", coarse: "head", x: 0.5, y: 0.005 },
    { id: "temple-right", coarse: "face", x: 0.72, y: 0.07 },
    { id: "cheek-right", coarse: "face", x: 0.78, y: 0.11 },
    { id: "jaw-right", coarse: "face", x: 0.72, y: 0.14 },
    { id: "neck-front", coarse: "neck", x: 0.64, y: 0.17 },
    { id: "right-shoulder-ac", coarse: "right-shoulder", x: 0.37, y: 0.2 },
    { id: "right-biceps", coarse: "right-arm", x: 0.38, y: 0.29 },
    { id: "right-elbow-joint", coarse: "right-arm", x: 0.39, y: 0.37 },
    { id: "right-forearm-extensor", coarse: "right-arm", x: 0.43, y: 0.44 },
    { id: "right-hand-back", coarse: "right-hand", x: 0.48, y: 0.51 },
    { id: "chest-right", coarse: "chest", x: 0.72, y: 0.26 },
    { id: "rib-right-upper", coarse: "chest", x: 0.7, y: 0.34 },
    { id: "abdomen-right-upper", coarse: "abdomen", x: 0.66, y: 0.4 },
    { id: "flank-right", coarse: "abdomen", x: 0.37, y: 0.4 },
    { id: "hip-right-side", coarse: "right-hip", x: 0.38, y: 0.5 },
    { id: "groin-right", coarse: "right-hip", x: 0.6, y: 0.54 },
    { id: "thigh-right-front", coarse: "right-thigh", x: 0.54, y: 0.63 },
    { id: "knee-right", coarse: "right-knee", x: 0.51, y: 0.74 },
    { id: "right-calf-muscle", coarse: "right-leg", x: 0.45, y: 0.84 },
    { id: "right-ankle-outer", coarse: "right-foot", x: 0.48, y: 0.92 },
    { id: "foot-right", coarse: "right-foot", x: 0.65, y: 0.975 },
  ],
};

const BACK_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.005 },
  { id: "behind-head-left", coarse: "head", x: 0.43, y: 0.065 },
  { id: "behind-head-right", coarse: "head", x: 0.57, y: 0.065 },
  { id: "neck-back", coarse: "neck", x: 0.5, y: 0.16 },
  { id: "right-shoulder-ac", coarse: "right-shoulder", x: 0.69, y: 0.19 },
  { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.31, y: 0.19 },
  { id: "right-elbow-outer", coarse: "right-arm", x: 0.82, y: 0.345 },
  { id: "left-elbow-outer", coarse: "left-arm", x: 0.18, y: 0.345 },
  { id: "hand-right-overview", coarse: "right-hand", x: 0.9, y: 0.45 },
  { id: "hand-left-overview", coarse: "left-hand", x: 0.1, y: 0.45 },
  { id: "upper-back-left", coarse: "upper-back", x: 0.4, y: 0.27 },
  { id: "upper-back-right", coarse: "upper-back", x: 0.6, y: 0.27 },
  { id: "lower-back-left", coarse: "lower-back", x: 0.42, y: 0.42 },
  { id: "lower-back-right", coarse: "lower-back", x: 0.58, y: 0.42 },
  { id: "hip-left-side", coarse: "left-hip", x: 0.4, y: 0.51 },
  { id: "hip-right-side", coarse: "right-hip", x: 0.6, y: 0.51 },
  { id: "thigh-left-back", coarse: "left-thigh", x: 0.43, y: 0.64 },
  { id: "thigh-right-back", coarse: "right-thigh", x: 0.57, y: 0.64 },
  { id: "knee-left", coarse: "left-knee", x: 0.43, y: 0.75 },
  { id: "knee-right", coarse: "right-knee", x: 0.57, y: 0.75 },
  { id: "calf-left", coarse: "left-leg", x: 0.43, y: 0.84 },
  { id: "calf-right", coarse: "right-leg", x: 0.57, y: 0.84 },
  { id: "ankle-left", coarse: "left-foot", x: 0.43, y: 0.92 },
  { id: "ankle-right", coarse: "right-foot", x: 0.57, y: 0.92 },
  { id: "foot-left", coarse: "left-foot", x: 0.41, y: 0.975 },
  { id: "foot-right", coarse: "right-foot", x: 0.59, y: 0.975 },
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

function detail(
  id: BodySiteDetailId,
  coarse: BodySiteId,
  x: number,
  y: number,
): Point {
  return { id, coarse, x, y };
}

function handPoints(coarse: "left-hand" | "right-hand"): Point[] {
  const mirror = coarse === "right-hand";
  const x = (value: number) => (mirror ? 1 - value : value);
  return [
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-wrist`,
      coarse,
      0.56,
      0.9,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-palm`,
      coarse,
      0.56,
      0.68,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-hand-back`,
      coarse,
      0.56,
      0.58,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-wrist-joint`,
      coarse,
      0.56,
      0.84,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-thenar`,
      coarse,
      x(0.42),
      0.72,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-hypothenar`,
      coarse,
      x(0.75),
      0.72,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-thumb-metacarpal`,
      coarse,
      x(0.38),
      0.62,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-index-metacarpal`,
      coarse,
      x(0.5),
      0.54,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-middle-metacarpal`,
      coarse,
      x(0.65),
      0.5,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-ring-metacarpal`,
      coarse,
      x(0.78),
      0.55,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-little-metacarpal`,
      coarse,
      x(0.91),
      0.62,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-thumb-cmc`,
      coarse,
      x(0.42),
      0.68,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-thumb-mcp`,
      coarse,
      x(0.32),
      0.55,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-thumb-ip`,
      coarse,
      x(0.28),
      0.43,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-index-mcp`,
      coarse,
      x(0.5),
      0.44,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-index-pip`,
      coarse,
      x(0.5),
      0.32,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-index-dip`,
      coarse,
      x(0.5),
      0.2,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-middle-mcp`,
      coarse,
      x(0.65),
      0.39,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-middle-pip`,
      coarse,
      x(0.65),
      0.26,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-middle-dip`,
      coarse,
      x(0.65),
      0.14,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-ring-mcp`,
      coarse,
      x(0.78),
      0.44,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-ring-pip`,
      coarse,
      x(0.78),
      0.32,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-ring-dip`,
      coarse,
      x(0.78),
      0.2,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-little-mcp`,
      coarse,
      x(0.91),
      0.5,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-little-pip`,
      coarse,
      x(0.91),
      0.38,
    ),
    detail(
      `${coarse === "left-hand" ? "left" : "right"}-little-dip`,
      coarse,
      x(0.91),
      0.27,
    ),
  ];
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
  const points: Record<string, [BodySiteDetailId, number, number][]> = {
    abdomen: [
      ["liver", 0.72, 0.2],
      ["gallbladder", 0.8, 0.28],
      ["stomach", 0.28, 0.28],
      ["spleen", 0.2, 0.32],
      ["pancreas", 0.5, 0.35],
      ["bowel-left", 0.3, 0.5],
      ["bowel-right", 0.7, 0.5],
      ["rectus-abdominis", 0.5, 0.47],
      ["oblique-left", 0.78, 0.55],
      ["oblique-right", 0.22, 0.55],
      ["uterus", 0.5, 0.72],
      ["ovary-left", 0.36, 0.72],
      ["ovary-right", 0.64, 0.72],
      ["bladder", 0.5, 0.86],
      ["pubic-symphysis", 0.5, 0.96],
    ],
    "left-arm": [
      ["left-biceps", 0.42, 0.28],
      ["left-triceps", 0.64, 0.28],
      ["left-forearm-flexor", 0.42, 0.58],
      ["left-forearm-extensor", 0.64, 0.58],
      ["left-elbow-joint", 0.5, 0.44],
      ["left-elbow-inner", 0.43, 0.44],
      ["left-elbow-outer", 0.62, 0.44],
    ],
    "right-arm": [
      ["right-biceps", 0.58, 0.28],
      ["right-triceps", 0.36, 0.28],
      ["right-forearm-flexor", 0.58, 0.58],
      ["right-forearm-extensor", 0.36, 0.58],
      ["right-elbow-joint", 0.5, 0.44],
      ["right-elbow-inner", 0.57, 0.44],
      ["right-elbow-outer", 0.38, 0.44],
    ],
    "left-shoulder": [
      ["shoulder-left-joint", 0.52, 0.35],
      ["left-shoulder-ac", 0.68, 0.2],
      ["left-deltoid", 0.7, 0.5],
    ],
    "right-shoulder": [
      ["shoulder-right-joint", 0.48, 0.35],
      ["right-shoulder-ac", 0.32, 0.2],
      ["right-deltoid", 0.3, 0.5],
    ],
    "left-thigh": [
      ["left-quad", 0.5, 0.3],
      ["left-hamstring", 0.5, 0.7],
    ],
    "right-thigh": [
      ["right-quad", 0.5, 0.3],
      ["right-hamstring", 0.5, 0.7],
    ],
    "left-knee": [
      ["left-knee-inner", 0.35, 0.5],
      ["left-knee-outer", 0.7, 0.5],
    ],
    "right-knee": [
      ["right-knee-inner", 0.65, 0.5],
      ["right-knee-outer", 0.3, 0.5],
    ],
    "left-leg": [["left-calf-muscle", 0.5, 0.65]],
    "right-leg": [["right-calf-muscle", 0.5, 0.65]],
    "left-hip": [
      ["left-hip-joint", 0.48, 0.33],
      ["left-gluteus", 0.52, 0.68],
      ["sacroiliac-left", 0.7, 0.55],
      ["pelvis-left", 0.38, 0.5],
    ],
    "right-hip": [
      ["right-hip-joint", 0.52, 0.33],
      ["right-gluteus", 0.48, 0.68],
      ["sacroiliac-right", 0.3, 0.55],
      ["pelvis-right", 0.62, 0.5],
    ],
    "lower-back": [
      ["kidney-left", 0.35, 0.32],
      ["kidney-right", 0.65, 0.32],
      ["lumbar-spine", 0.5, 0.5],
      ["sacrum", 0.5, 0.72],
      ["coccyx", 0.5, 0.88],
      ["lower-back-left", 0.3, 0.5],
      ["lower-back-right", 0.7, 0.5],
    ],
    "upper-back": [
      ["trapezius-left", 0.35, 0.2],
      ["trapezius-right", 0.65, 0.2],
      ["thoracic-spine", 0.5, 0.48],
      ["upper-back-left", 0.3, 0.6],
      ["upper-back-right", 0.7, 0.6],
    ],
    neck: [
      ["cervical-spine", 0.5, 0.26],
      ["neck-front", 0.5, 0.5],
      ["neck-back", 0.5, 0.74],
    ],
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
  return side === "front"
    ? FRONT_POINTS
    : side === "back"
      ? BACK_POINTS
      : LATERAL_POINTS[side];
}

function pointsForMap(kind: MapKind, site: BodySiteId): Point[] {
  if (kind === "face") return FACE_POINTS;
  if (kind === "chest") return CHEST_POINTS;
  if (kind === "hand") return handPoints(site as "left-hand" | "right-hand");
  if (kind === "foot") return footPoints(site as "left-foot" | "right-foot");
  return regionPoints(site);
}

type BodyDiagramProps = {
  selected?: BodySiteId[];
  selectedDetails?: BodySiteDetailId[];
  onSelect: (site: BodySiteId) => void;
  onSelectDetail?: (detail: BodySiteDetailId) => void;
  multi?: boolean;
  side: Side;
  onSideChange: (side: Side) => void;
  onInteractionChange?: (active: boolean) => void;
};

const clamp = (value: number, min: number, max: number) => {
  "worklet";
  return Math.max(min, Math.min(max, value));
};

export function resolveBodyPoint(
  side: Side,
  mapX: number,
  mapY: number,
  detailed = false,
): Point {
  const candidates = detailed
    ? expandSidePoints(side)
    : rootPointsForSide(side);
  return nearestBodyPoint(
    side,
    candidates,
    mapX,
    mapY,
    MAP_WIDTH / MAP_HEIGHT,
  )!;
}

export function BodyDiagram({
  selected = [],
  selectedDetails = [],
  onSelect,
  onSelectDetail,
  side,
  onSideChange,
  onInteractionChange,
}: BodyDiagramProps) {
  const [zoomLabel, setZoomLabel] = useState(1);
  const [lastSelectedPoint, setLastSelectedPoint] = useState<Point>();
  const points = useMemo(() => expandSidePoints(side), [side]);
  const rootPoints = useMemo(() => rootPointsForSide(side), [side]);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startScale = useSharedValue(1);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const resetZoom = useCallback(() => {
    scale.value = withTiming(1, { duration: 180 });
    translateX.value = withTiming(0, { duration: 180 });
    translateY.value = withTiming(0, { duration: 180 });
    setZoomLabel(1);
  }, [scale, translateX, translateY]);

  useEffect(() => {
    resetZoom();
    setLastSelectedPoint(undefined);
  }, [resetZoom, side]);

  const limitsFor = (nextScale: number) => {
    "worklet";
    return {
      x: (MAP_WIDTH * nextScale - MAP_WIDTH) / 2,
      y: (MAP_HEIGHT * nextScale - MAP_HEIGHT) / 2,
    };
  };

  const setZoom = (next: number) => {
    const nextScale = clamp(next, MIN_ZOOM, MAX_ZOOM);
    const limits = limitsFor(nextScale);
    scale.value = withTiming(nextScale, { duration: 180 });
    translateX.value = withTiming(
      clamp(translateX.value, -limits.x, limits.x),
      { duration: 180 },
    );
    translateY.value = withTiming(
      clamp(translateY.value, -limits.y, limits.y),
      { duration: 180 },
    );
    setZoomLabel(nextScale);
  };

  const selectAt = (mapX: number, mapY: number, currentScale: number) => {
    const normalized = mapPointToBody(
      side,
      clamp(mapX, 0, 1),
      clamp(mapY, 0, 1),
      MAP_WIDTH / MAP_HEIGHT,
    );
    const mapped = bodyPointToMap(
      side,
      normalized.x,
      normalized.y,
      MAP_WIDTH / MAP_HEIGHT,
    );
    const nearest = resolveBodyPoint(
      side,
      mapped.x,
      mapped.y,
      currentScale >= DETAIL_ZOOM,
    );

    if (!nearest) return;
    setLastSelectedPoint(nearest);
    onSelect(nearest.coarse);
    onSelectDetail?.(nearest.id);
  };

  const pinch = Gesture.Pinch()
    .onBegin((event) => {
      startScale.value = scale.value;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const nextScale = clamp(
        startScale.value * event.scale,
        MIN_ZOOM,
        MAX_ZOOM,
      );
      const contentX =
        (event.focalX - MAP_WIDTH / 2 - startX.value) / startScale.value;
      const contentY =
        (event.focalY - MAP_HEIGHT / 2 - startY.value) / startScale.value;
      const limits = limitsFor(nextScale);
      scale.value = nextScale;
      translateX.value = clamp(
        event.focalX - MAP_WIDTH / 2 - contentX * nextScale,
        -limits.x,
        limits.x,
      );
      translateY.value = clamp(
        event.focalY - MAP_HEIGHT / 2 - contentY * nextScale,
        -limits.y,
        limits.y,
      );
    })
    .onEnd(() => runOnJS(setZoomLabel)(Number(scale.value.toFixed(1))));

  const pan = Gesture.Pan()
    .maxPointers(1)
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      const limits = limitsFor(scale.value);
      translateX.value = clamp(
        startX.value + event.translationX,
        -limits.x,
        limits.x,
      );
      translateY.value = clamp(
        startY.value + event.translationY,
        -limits.y,
        limits.y,
      );
    });

  const tap = Gesture.Tap()
    .maxDistance(10)
    .onEnd((event, success) => {
      if (!success) return;
      const contentX =
        (event.x - MAP_WIDTH / 2 - translateX.value) / scale.value +
        MAP_WIDTH / 2;
      const contentY =
        (event.y - MAP_HEIGHT / 2 - translateY.value) / scale.value +
        MAP_HEIGHT / 2;
      runOnJS(selectAt)(
        contentX / MAP_WIDTH,
        contentY / MAP_HEIGHT,
        scale.value,
      );
    });

  const gesture = Gesture.Simultaneous(pinch, pan, tap);
  const animatedMapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const selectedPoint =
    lastSelectedPoint ??
    points.find((point) => selectedDetails.includes(point.id)) ??
    rootPoints.find((point) => selected.includes(point.coarse));
  const selectedPosition = selectedPoint
    ? bodyPointToMap(
        side,
        selectedPoint.x,
        selectedPoint.y,
        MAP_WIDTH / MAP_HEIGHT,
      )
    : undefined;
  const mapLabel = `Mapa corporal ${side === "front" ? "frontal" : side === "back" ? "posterior" : side === "left" ? "lateral esquerda" : "lateral direita"}`;

  const handleTouchStart = () => onInteractionChange?.(true);
  const handleTouchEnd = (event: any) => {
    if (!event.nativeEvent.touches.length) onInteractionChange?.(false);
  };

  return (
    <View style={styles.root}>
      <View style={styles.sideToggle}>
        {(["front", "back", "left", "right"] as Side[]).map((option) => {
          const labels: Record<Side, string> = {
            front: "Frente",
            back: "Costas",
            left: "Lateral E",
            right: "Lateral D",
          };
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: side === option }}
              onPress={() => onSideChange(option)}
              style={[
                styles.sideButton,
                side === option && styles.sideButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.sideText,
                  side === option && styles.sideTextActive,
                ]}
              >
                {labels[option]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.mapFrame}>
        <View style={styles.zoomBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Diminuir zoom"
            disabled={zoomLabel <= MIN_ZOOM}
            onPress={() => setZoom(zoomLabel - 0.5)}
            style={[
              styles.zoomButton,
              zoomLabel <= MIN_ZOOM && styles.zoomDisabled,
            ]}
          >
            <Text style={styles.zoomText}>−</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Redefinir zoom"
            onPress={resetZoom}
            style={styles.zoomValue}
          >
            <Text style={styles.zoomValueText}>{zoomLabel.toFixed(1)}×</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Aumentar zoom"
            disabled={zoomLabel >= MAX_ZOOM}
            onPress={() => setZoom(zoomLabel + 0.5)}
            style={[
              styles.zoomButton,
              zoomLabel >= MAX_ZOOM && styles.zoomDisabled,
            ]}
          >
            <Text style={styles.zoomText}>+</Text>
          </Pressable>
        </View>
        <View
          style={styles.viewport}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={() => onInteractionChange?.(false)}
        >
          <GestureDetector gesture={gesture}>
            <Animated.View
              accessibilityLabel={`${mapLabel}. Toque em qualquer área do corpo.`}
              style={[styles.map, animatedMapStyle]}
            >
              <Image
                source={ANATOMICAL_ASSETS[side]}
                contentFit="contain"
                style={styles.anatomicalAsset}
              />
              {selectedPosition ? (
                <View
                  pointerEvents="none"
                  style={[
                    styles.selection,
                    {
                      left: selectedPosition.x * MAP_WIDTH - 15,
                      top: selectedPosition.y * MAP_HEIGHT - 15,
                    },
                  ]}
                >
                  <View style={styles.selectionCore} />
                </View>
              ) : null}
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
      <Text selectable style={styles.selectedLabel}>
        {selectedPoint
          ? bodySiteDetailLabel(selectedPoint.id)
          : "Nenhum local selecionado"}
      </Text>
      <Text style={styles.helper}>
        {zoomLabel >= DETAIL_ZOOM
          ? "Arraste para navegar e toque no local exato da dor."
          : "Toque em qualquer área. Use a pinça ou os botões para ampliar mãos, pés e rosto."}
      </Text>
    </View>
  );
}

const ANATOMICAL_ASSETS: Record<Side, number> = {
  front: anatomicalFront,
  back: anatomicalBack,
  left: anatomicalLeftProfile,
  right: anatomicalRightProfile,
};

type BBox = { x0: number; x1: number; y0: number; y1: number };

// Deriva uma "caixa" aproximada para a região a partir dos próprios pontos
// grosseiros já calibrados sobre a foto (rootPointsForSide). Regiões com
// poucos pontos (ex.: um joelho, marcado por 1 ponto) recebem uma caixa
// mínima para que os pontos finos (interno/externo etc.) não colapsem todos
// na mesma coordenada.
function regionBounds(points: Point[], site?: BodySiteId): BBox {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const hand = site === "left-hand" || site === "right-hand";
  const foot = site === "left-foot" || site === "right-foot";
  const padX = Math.max(
    hand ? 0.065 : foot ? 0.08 : 0.035,
    (maxX - minX) * 0.35,
  );
  const padY = Math.max(
    hand ? 0.075 : foot ? 0.05 : 0.035,
    (maxY - minY) * 0.35,
  );
  return {
    x0: Math.max(0, minX - padX),
    x1: Math.min(1, maxX + padX),
    y0: Math.max(0, minY - padY),
    y1: Math.min(1, maxY + padY),
  };
}

function placeWithin(detail: Point, bounds: BBox): Point {
  return {
    id: detail.id,
    coarse: detail.coarse,
    x: bounds.x0 + detail.x * (bounds.x1 - bounds.x0),
    y: bounds.y0 + detail.y * (bounds.y1 - bounds.y0),
  };
}

// Substitui, para cada região desta vista, o(s) ponto(s) grosseiro(s) pelo
// conjunto completo de pontos finos daquela região (órgão/músculo/
// articulação), posicionado dentro da área real que a região ocupa na foto.
// Assim tudo fica clicável direto sobre o corpo, sem abrir outra tela.
// A expansão para pontos finos (órgão/músculo/articulação) só faz sentido nas
// vistas onde o tronco aparece de corpo inteiro (frente/costas). No perfil
// (lateral), a silhueta é estreita e esses pontos ficariam espremidos numa
// faixa vertical apertada — por isso mantém-se o conjunto simples ali.
function expandSidePoints(side: Side): Point[] {
  const points = rootPointsForSide(side);
  if (side === "left" || side === "right") return points;
  const bySite = new Map<BodySiteId, Point[]>();
  for (const point of points) {
    if (!bySite.has(point.coarse)) bySite.set(point.coarse, []);
    bySite.get(point.coarse)!.push(point);
  }

  const expanded: Point[] = [];
  let facePlaced = false;

  for (const [site, sitePoints] of bySite) {
    const kind = mapKindForSite(site);

    // Não há como ver o rosto de costas — mantém só os pontos grosseiros da
    // parte de trás da cabeça nessa vista.
    if (kind === "face" && side === "back") {
      expanded.push(...sitePoints);
      continue;
    }

    // "head" e "face" compartilham o mesmo mapa de feições faciais: só
    // posiciona o conjunto uma vez, usando a área combinada das duas.
    if (kind === "face") {
      if (facePlaced) continue;
      facePlaced = true;
      const combined = points.filter(
        (point) => point.coarse === "head" || point.coarse === "face",
      );
      const bounds = regionBounds(combined);
      for (const detail of FACE_POINTS)
        expanded.push(placeWithin(detail, bounds));
      continue;
    }

    if (!kind) {
      expanded.push(...sitePoints);
      continue;
    }

    const detailPoints = pointsForMap(kind, site);
    if (!detailPoints.length) {
      expanded.push(...sitePoints);
      continue;
    }

    const bounds = regionBounds(sitePoints, site);
    for (const detail of detailPoints)
      expanded.push(placeWithin(detail, bounds));
  }

  return expanded;
}

const MAP_WIDTH = 304;
const MAP_HEIGHT = 516;
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const DETAIL_ZOOM = 2;
const styles = StyleSheet.create({
  root: { alignItems: "center" },
  detailHeader: {
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8,
    maxWidth: 304,
    width: "100%",
  },
  backButton: {
    alignItems: "center",
    backgroundColor: "#EAF4F7",
    borderRadius: 14,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  backText: {
    color: "#176B87",
    fontSize: 31,
    fontWeight: "700",
    lineHeight: 34,
  },
  detailTitleWrap: { flex: 1, paddingLeft: 10 },
  detailTitle: { color: "#17313A", fontSize: 14, fontWeight: "800" },
  detailHint: { color: "#60747C", fontSize: 12, marginTop: 2 },
  zoomBar: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    marginBottom: 10,
  },
  zoomButton: {
    alignItems: "center",
    backgroundColor: "#176B87",
    borderRadius: 14,
    height: 48,
    justifyContent: "center",
    width: 52,
  },
  zoomDisabled: { opacity: 0.35 },
  zoomText: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "700",
    lineHeight: 32,
  },
  zoomValue: {
    alignItems: "center",
    backgroundColor: "#EAF4F7",
    borderColor: "#BCD0D6",
    borderRadius: 14,
    borderWidth: 1,
    height: 48,
    justifyContent: "center",
    minWidth: 76,
    paddingHorizontal: 12,
  },
  zoomValueText: { color: "#176B87", fontSize: 15, fontWeight: "800" },
  selectedLabel: {
    color: "#17313A",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 8,
    textAlign: "center",
  },
  viewport: {
    backgroundColor: "#F7FAFC",
    borderRadius: 16,
    height: MAP_HEIGHT,
    overflow: "hidden",
    width: MAP_WIDTH,
  },
  sideToggle: {
    backgroundColor: "#EAF0F2",
    borderRadius: 14,
    flexDirection: "row",
    marginBottom: 8,
    maxWidth: 304,
    padding: 4,
    width: "100%",
  },
  sideButton: {
    alignItems: "center",
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    minHeight: 38,
    minWidth: 0,
    paddingHorizontal: 2,
  },
  sideButtonActive: { backgroundColor: "#176B87" },
  sideText: {
    color: "#60747C",
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  sideTextActive: { color: "#FFFFFF" },
  mapFrame: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9E3E7",
    borderRadius: 24,
    borderWidth: 1,
    padding: 12,
  },
  map: {
    backgroundColor: "#FFFFFF",
    height: MAP_HEIGHT,
    overflow: "hidden",
    position: "relative",
    width: MAP_WIDTH,
  },
  anatomicalAsset: {
    height: MAP_HEIGHT,
    left: 0,
    position: "absolute",
    top: 0,
    width: MAP_WIDTH,
  },
  selection: {
    alignItems: "center",
    backgroundColor: "rgba(233,139,90,0.22)",
    borderColor: "#B55735",
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    justifyContent: "center",
    position: "absolute",
    width: 30,
  },
  selectionCore: {
    backgroundColor: "#E98B5A",
    borderColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1.5,
    height: 10,
    width: 10,
  },
  helper: {
    color: "#60747C",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
  },
});
