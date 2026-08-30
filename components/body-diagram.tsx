import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";

import { BodySiteDetailId, BodySiteId, bodySiteDetailLabel } from "@/shared/records";

type Point = { id: BodySiteDetailId; coarse: BodySiteId; x: number; y: number };
export type Side = "front" | "back" | "left" | "right";
type MapKind = "face" | "chest" | "hand" | "foot" | "region";

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
  { id: "neck-front", coarse: "neck", x: 0.5, y: 0.17 },
  { id: "right-shoulder-ac", coarse: "right-shoulder", x: 0.34, y: 0.22 },
  { id: "right-elbow-inner", coarse: "right-arm", x: 0.2, y: 0.41 },
  { id: "right-elbow-joint", coarse: "right-arm", x: 0.15, y: 0.43 },
  { id: "right-elbow-outer", coarse: "right-arm", x: 0.11, y: 0.44 },
  { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.66, y: 0.22 },
  { id: "left-elbow-inner", coarse: "left-arm", x: 0.8, y: 0.41 },
  { id: "left-elbow-joint", coarse: "left-arm", x: 0.85, y: 0.43 },
  { id: "left-elbow-outer", coarse: "left-arm", x: 0.89, y: 0.44 },
  { id: "hand-right-overview", coarse: "right-hand", x: 0.07, y: 0.5 },
  { id: "hand-left-overview", coarse: "left-hand", x: 0.93, y: 0.5 },
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
  { id: "foot-left", coarse: "left-foot", x: 0.62, y: 0.94 },
  { id: "foot-right", coarse: "right-foot", x: 0.38, y: 0.94 },
];

const LATERAL_POINTS: Record<"left" | "right", Point[]> = {
  left: [
    { id: "head-top", coarse: "head", x: 0.5, y: 0.06 }, { id: "temple-left", coarse: "face", x: 0.52, y: 0.115 }, { id: "cheek-left", coarse: "face", x: 0.55, y: 0.16 }, { id: "jaw-left", coarse: "face", x: 0.52, y: 0.19 }, { id: "neck-front", coarse: "neck", x: 0.46, y: 0.225 },
    { id: "left-shoulder-ac", coarse: "left-shoulder", x: 0.44, y: 0.2 }, { id: "left-forearm-flexor", coarse: "left-arm", x: 0.34, y: 0.36 }, { id: "left-elbow-joint", coarse: "left-arm", x: 0.29, y: 0.44 }, { id: "left-forearm-extensor", coarse: "left-arm", x: 0.25, y: 0.48 }, { id: "left-hand-back", coarse: "left-hand", x: 0.21, y: 0.51 },
    { id: "chest-left", coarse: "chest", x: 0.43, y: 0.32 }, { id: "rib-left-upper", coarse: "chest", x: 0.44, y: 0.39 }, { id: "abdomen-left-upper", coarse: "abdomen", x: 0.47, y: 0.47 }, { id: "flank-left", coarse: "abdomen", x: 0.39, y: 0.46 }, { id: "hip-left-side", coarse: "left-hip", x: 0.43, y: 0.54 }, { id: "groin-left", coarse: "left-hip", x: 0.47, y: 0.59 },
    { id: "thigh-left-front", coarse: "left-thigh", x: 0.45, y: 0.68 }, { id: "knee-left", coarse: "left-knee", x: 0.46, y: 0.77 }, { id: "left-calf-muscle", coarse: "left-leg", x: 0.44, y: 0.86 }, { id: "left-ankle-inner", coarse: "left-foot", x: 0.43, y: 0.94 }, { id: "foot-left", coarse: "left-foot", x: 0.55, y: 0.95 },
  ],
  right: [
    { id: "head-top", coarse: "head", x: 0.5, y: 0.06 }, { id: "temple-right", coarse: "face", x: 0.48, y: 0.115 }, { id: "cheek-right", coarse: "face", x: 0.45, y: 0.16 }, { id: "jaw-right", coarse: "face", x: 0.48, y: 0.19 }, { id: "neck-front", coarse: "neck", x: 0.54, y: 0.225 },
    { id: "right-shoulder-ac", coarse: "right-shoulder", x: 0.56, y: 0.2 }, { id: "right-forearm-flexor", coarse: "right-arm", x: 0.66, y: 0.36 }, { id: "right-elbow-joint", coarse: "right-arm", x: 0.71, y: 0.44 }, { id: "right-forearm-extensor", coarse: "right-arm", x: 0.75, y: 0.48 }, { id: "right-hand-back", coarse: "right-hand", x: 0.79, y: 0.51 },
    { id: "chest-right", coarse: "chest", x: 0.57, y: 0.32 }, { id: "rib-right-upper", coarse: "chest", x: 0.56, y: 0.39 }, { id: "abdomen-right-upper", coarse: "abdomen", x: 0.53, y: 0.47 }, { id: "flank-right", coarse: "abdomen", x: 0.61, y: 0.46 }, { id: "hip-right-side", coarse: "right-hip", x: 0.57, y: 0.54 }, { id: "groin-right", coarse: "right-hip", x: 0.53, y: 0.59 },
    { id: "thigh-right-front", coarse: "right-thigh", x: 0.55, y: 0.68 }, { id: "knee-right", coarse: "right-knee", x: 0.54, y: 0.77 }, { id: "right-calf-muscle", coarse: "right-leg", x: 0.56, y: 0.86 }, { id: "right-ankle-outer", coarse: "right-foot", x: 0.57, y: 0.94 }, { id: "foot-right", coarse: "right-foot", x: 0.45, y: 0.95 },
  ],
};

const BACK_POINTS: Point[] = [
