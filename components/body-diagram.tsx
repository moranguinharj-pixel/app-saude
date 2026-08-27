import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Ellipse, G, Line, Path, Rect } from "react-native-svg";

import { BodySiteDetailId, BodySiteId } from "@/shared/records";

type Point = { id: BodySiteDetailId; coarse: BodySiteId; x: number; y: number };
type Side = "front" | "back";
type MapKind = "face" | "chest" | "hand" | "foot" | "region";

const FRONT_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.035 },
  { id: "forehead-left", coarse: "head", x: 0.58, y: 0.085 },
  { id: "forehead-right", coarse: "head", x: 0.42, y: 0.085 },
  { id: "above-eye-left", coarse: "face", x: 0.58, y: 0.12 },
  { id: "above-eye-right", coarse: "face", x: 0.42, y: 0.12 },
  { id: "below-eye-left", coarse: "face", x: 0.58, y: 0.145 },
  { id: "below-eye-right", coarse: "face", x: 0.42, y: 0.145 },
  { id: "ear-left-upper", coarse: "face", x: 0.69, y: 0.095 },
  { id: "ear-left-lower", coarse: "face", x: 0.69, y: 0.145 },
  { id: "ear-right-upper", coarse: "face", x: 0.31, y: 0.095 },
  { id: "ear-right-lower", coarse: "face", x: 0.31, y: 0.145 },
  { id: "temple-left", coarse: "face", x: 0.64, y: 0.13 },
  { id: "temple-right", coarse: "face", x: 0.36, y: 0.13 },
  { id: "cheek-left", coarse: "face", x: 0.58, y: 0.155 },
  { id: "cheek-right", coarse: "face", x: 0.42, y: 0.155 },
  { id: "jaw-left", coarse: "face", x: 0.56, y: 0.175 },
  { id: "jaw-right", coarse: "face", x: 0.44, y: 0.175 },
  { id: "neck-front", coarse: "neck", x: 0.5, y: 0.205 },
  { id: "hand-right-overview", coarse: "right-hand", x: 0.1, y: 0.49 },
  { id: "hand-left-overview", coarse: "left-hand", x: 0.9, y: 0.49 },
  { id: "chest-left", coarse: "chest", x: 0.59, y: 0.43 },
  { id: "chest-right", coarse: "chest", x: 0.41, y: 0.43 },
  { id: "chest-center", coarse: "chest", x: 0.5, y: 0.43 },
  { id: "rib-left-upper", coarse: "chest", x: 0.65, y: 0.42 },
  { id: "rib-right-upper", coarse: "chest", x: 0.35, y: 0.42 },
  { id: "rib-left-lower", coarse: "chest", x: 0.64, y: 0.49 },
  { id: "rib-right-lower", coarse: "chest", x: 0.36, y: 0.49 },
  { id: "abdomen-left-upper", coarse: "abdomen", x: 0.57, y: 0.52 },
  { id: "abdomen-right-upper", coarse: "abdomen", x: 0.43, y: 0.52 },
  { id: "abdomen-left-lower", coarse: "abdomen", x: 0.57, y: 0.59 },
  { id: "abdomen-right-lower", coarse: "abdomen", x: 0.43, y: 0.59 },
  { id: "lower-belly-left", coarse: "abdomen", x: 0.56, y: 0.64 },
  { id: "lower-belly-right", coarse: "abdomen", x: 0.44, y: 0.64 },
  { id: "flank-left", coarse: "abdomen", x: 0.66, y: 0.55 },
  { id: "flank-right", coarse: "abdomen", x: 0.34, y: 0.55 },
  { id: "pelvis-left", coarse: "left-hip", x: 0.58, y: 0.71 },
  { id: "pelvis-right", coarse: "right-hip", x: 0.42, y: 0.71 },
  { id: "ovary-left", coarse: "left-hip", x: 0.57, y: 0.75 },
  { id: "ovary-right", coarse: "right-hip", x: 0.43, y: 0.75 },
  { id: "groin-left", coarse: "left-hip", x: 0.56, y: 0.8 },
  { id: "groin-right", coarse: "right-hip", x: 0.44, y: 0.8 },
  { id: "thigh-left-front", coarse: "left-thigh", x: 0.57, y: 0.88 },
  { id: "thigh-right-front", coarse: "right-thigh", x: 0.43, y: 0.88 },
  { id: "knee-left", coarse: "left-knee", x: 0.57, y: 0.985 },
  { id: "knee-right", coarse: "right-knee", x: 0.43, y: 0.985 },
  { id: "foot-left", coarse: "left-foot", x: 0.62, y: 0.99 },
  { id: "foot-right", coarse: "right-foot", x: 0.38, y: 0.99 },
];

const BACK_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.035 },
  { id: "behind-head-left", coarse: "head", x: 0.59, y: 0.115 },
  { id: "behind-head-right", coarse: "head", x: 0.41, y: 0.115 },
  { id: "neck-back", coarse: "neck", x: 0.5, y: 0.205 },
  { id: "hand-right-overview", coarse: "right-hand", x: 0.1, y: 0.49 },
  { id: "hand-left-overview", coarse: "left-hand", x: 0.9, y: 0.49 },
  { id: "upper-back-left", coarse: "upper-back", x: 0.59, y: 0.43 },
  { id: "upper-back-right", coarse: "upper-back", x: 0.41, y: 0.43 },
  { id: "lower-back-left", coarse: "lower-back", x: 0.58, y: 0.57 },
  { id: "lower-back-right", coarse: "lower-back", x: 0.42, y: 0.57 },
  { id: "hip-left-side", coarse: "left-hip", x: 0.58, y: 0.71 },
  { id: "hip-right-side", coarse: "right-hip", x: 0.42, y: 0.71 },
  { id: "thigh-left-back", coarse: "left-thigh", x: 0.57, y: 0.88 },
  { id: "thigh-right-back", coarse: "right-thigh", x: 0.43, y: 0.88 },
  { id: "calf-left", coarse: "left-leg", x: 0.57, y: 0.985 },
  { id: "calf-right", coarse: "right-leg", x: 0.43, y: 0.985 },
  { id: "foot-left", coarse: "left-foot", x: 0.62, y: 0.99 },
  { id: "foot-right", coarse: "right-foot", x: 0.38, y: 0.99 },
];

const FACE_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.06 },
  { id: "brain-left", coarse: "head", x: 0.58, y: 0.12 },
  { id: "brain-right", coarse: "head", x: 0.42, y: 0.12 },
  { id: "scalp-left", coarse: "head", x: 0.78, y: 0.14 },
  { id: "scalp-right", coarse: "head", x: 0.22, y: 0.14 },
  { id: "forehead-left", coarse: "head", x: 0.62, y: 0.19 },
  { id: "forehead-right", coarse: "head", x: 0.38, y: 0.19 },
  { id: "brow-left", coarse: "face", x: 0.63, y: 0.29 },
  { id: "brow-right", coarse: "face", x: 0.37, y: 0.29 },
  { id: "above-eye-left", coarse: "face", x: 0.62, y: 0.32 },
  { id: "above-eye-right", coarse: "face", x: 0.38, y: 0.32 },
  { id: "eye-left", coarse: "face", x: 0.62, y: 0.37 },
  { id: "eye-right", coarse: "face", x: 0.38, y: 0.37 },
  { id: "below-eye-left", coarse: "face", x: 0.62, y: 0.43 },
  { id: "below-eye-right", coarse: "face", x: 0.38, y: 0.43 },
  { id: "ear-left-upper", coarse: "face", x: 0.83, y: 0.32 },
  { id: "ear-left-lower", coarse: "face", x: 0.83, y: 0.44 },
  { id: "ear-right-upper", coarse: "face", x: 0.17, y: 0.32 },
  { id: "ear-right-lower", coarse: "face", x: 0.17, y: 0.44 },
  { id: "temple-left", coarse: "face", x: 0.76, y: 0.37 },
  { id: "temple-right", coarse: "face", x: 0.24, y: 0.37 },
  { id: "cheek-left", coarse: "face", x: 0.64, y: 0.51 },
  { id: "cheek-right", coarse: "face", x: 0.36, y: 0.51 },
  { id: "jaw-left", coarse: "face", x: 0.63, y: 0.66 },
  { id: "jaw-right", coarse: "face", x: 0.37, y: 0.66 },
  { id: "nose-bridge", coarse: "face", x: 0.5, y: 0.45 },
  { id: "nose-tip", coarse: "face", x: 0.5, y: 0.53 },
  { id: "upper-lip", coarse: "face", x: 0.5, y: 0.59 },
  { id: "lower-lip", coarse: "face", x: 0.5, y: 0.63 },
  { id: "chin", coarse: "face", x: 0.5, y: 0.72 },
  { id: "behind-eye-left", coarse: "face", x: 0.7, y: 0.38 },
  { id: "behind-eye-right", coarse: "face", x: 0.3, y: 0.38 },
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
    detail(`${coarse === "left-hand" ? "left" : "right"}-wrist`, coarse, 0.5, 0.9),
    detail(`${coarse === "left-hand" ? "left" : "right"}-palm`, coarse, 0.5, 0.58),
    detail(`${coarse === "left-hand" ? "left" : "right"}-hand-back`, coarse, 0.5, 0.52),
    detail(`${coarse === "left-hand" ? "left" : "right"}-wrist-joint`, coarse, 0.5, 0.84),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thenar`, coarse, x(0.28), 0.68),
    detail(`${coarse === "left-hand" ? "left" : "right"}-hypothenar`, coarse, x(0.74), 0.68),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-metacarpal`, coarse, x(0.25), 0.56),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-metacarpal`, coarse, x(0.36), 0.43),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-metacarpal`, coarse, x(0.5), 0.4),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-metacarpal`, coarse, x(0.64), 0.43),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-metacarpal`, coarse, x(0.76), 0.49),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-cmc`, coarse, x(0.28), 0.62),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-mcp`, coarse, x(0.2), 0.5),
    detail(`${coarse === "left-hand" ? "left" : "right"}-thumb-ip`, coarse, x(0.15), 0.37),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-mcp`, coarse, x(0.36), 0.28),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-pip`, coarse, x(0.36), 0.17),
    detail(`${coarse === "left-hand" ? "left" : "right"}-index-dip`, coarse, x(0.36), 0.08),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-mcp`, coarse, x(0.5), 0.24),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-pip`, coarse, x(0.5), 0.13),
    detail(`${coarse === "left-hand" ? "left" : "right"}-middle-dip`, coarse, x(0.5), 0.04),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-mcp`, coarse, x(0.64), 0.28),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-pip`, coarse, x(0.64), 0.17),
    detail(`${coarse === "left-hand" ? "left" : "right"}-ring-dip`, coarse, x(0.64), 0.08),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-mcp`, coarse, x(0.78), 0.34),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-pip`, coarse, x(0.78), 0.24),
    detail(`${coarse === "left-hand" ? "left" : "right"}-little-dip`, coarse, x(0.78), 0.14),
  ];
}

function footPoints(coarse: "left-foot" | "right-foot"): Point[] {
  const side = coarse === "left-foot" ? "left" : "right";
  return [
    detail(`${side}-ankle-inner`, coarse, 0.35, 0.15),
    detail(`${side}-ankle-outer`, coarse, 0.65, 0.15),
    detail(`${side}-heel`, coarse, 0.5, 0.88),
    detail(`${side}-arch`, coarse, 0.42, 0.66),
    detail(`${side}-metatarsal`, coarse, 0.5, 0.48),
    detail(`${side}-second-toe-mtp`, coarse, 0.39, 0.29),
    detail(`${side}-second-toe-pip`, coarse, 0.39, 0.19),
    detail(`${side}-second-toe-dip`, coarse, 0.39, 0.1),
    detail(`${side}-third-toe-mtp`, coarse, 0.51, 0.27),
    detail(`${side}-third-toe-pip`, coarse, 0.51, 0.17),
    detail(`${side}-third-toe-dip`, coarse, 0.51, 0.08),
    detail(`${side}-fourth-toe-mtp`, coarse, 0.63, 0.3),
    detail(`${side}-fourth-toe-pip`, coarse, 0.63, 0.2),
    detail(`${side}-fourth-toe-dip`, coarse, 0.63, 0.11),
    detail(`${side}-little-toe-mtp`, coarse, 0.77, 0.34),
    detail(`${side}-little-toe-pip`, coarse, 0.77, 0.25),
    detail(`${side}-little-toe-dip`, coarse, 0.77, 0.16),
    detail(`${side}-big-toe-mtp`, coarse, 0.28, 0.24),
    detail(`${side}-big-toe-ip`, coarse, 0.2, 0.1),
    detail(`${side}-second-toe`, coarse, 0.39, 0.13),
    detail(`${side}-third-toe`, coarse, 0.51, 0.1),
    detail(`${side}-fourth-toe`, coarse, 0.63, 0.13),
    detail(`${side}-little-toe`, coarse, 0.78, 0.2),
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

function pointsForMap(kind: MapKind, site: BodySiteId): Point[] {
  if (kind === "face") return FACE_POINTS;
  if (kind === "chest") return CHEST_POINTS;
  if (kind === "hand") return handPoints(site as "left-hand" | "right-hand");
  if (kind === "foot") return footPoints(site as "left-foot" | "right-foot");
  return regionPoints(site);
}

export function BodyDiagram({ selected = [], selectedDetails = [], onSelect, onSelectDetail, multi = false, side, onSideChange }: { selected?: BodySiteId[]; selectedDetails?: BodySiteDetailId[]; onSelect: (site: BodySiteId) => void; onSelectDetail?: (detail: BodySiteDetailId) => void; multi?: boolean; side: Side; onSideChange: (side: Side) => void }) {
  const [zoom, setZoom] = useState(1);
  const [activeMap, setActiveMap] = useState<{ kind: MapKind; site: BodySiteId }>();
  const rootPoints = side === "front" ? FRONT_POINTS : BACK_POINTS;
  const points = activeMap ? pointsForMap(activeMap.kind, activeMap.site) : rootPoints;
  const mapWidth = activeMap ? 300 : MAP_WIDTH;
  const mapHeight = activeMap ? 430 : MAP_HEIGHT;
  const selectedPoints = useMemo(() => {
    const exact = points.filter((point) => selectedDetails.includes(point.id));
    if (exact.length) return exact;
    return points.filter((point, index) => selected.includes(point.coarse) && points.findIndex((candidate) => candidate.coarse === point.coarse) === index);
  }, [points, selected, selectedDetails]);

  const zoomIn = () => setZoom((value) => Math.min(activeMap ? 3 : 2.5, Number((value + 0.5).toFixed(1))));
  const zoomOut = () => setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(1))));
  const resetZoom = () => setZoom(1);

  const handleMapPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const normalizedX = locationX / (mapWidth * zoom);
    const normalizedY = locationY / (mapHeight * zoom);
    if (!activeMap) {
      const nearest = resolveBodyPoint(side, normalizedX, normalizedY);
      const kind = mapKindForSite(nearest.coarse);
      if (kind) {
        setActiveMap({ kind, site: nearest.coarse });
        setZoom(1);
        return;
      }
      onSelect(nearest.coarse);
      onSelectDetail?.(nearest.id);
      return;
    }
    const nearest = resolveDetailPoint(points, normalizedX, normalizedY);
    onSelect(nearest.coarse);
    onSelectDetail?.(nearest.id);
  };

  const closeMap = () => { setActiveMap(undefined); setZoom(1); };
  const mapLabel = activeMap ? activeMap.kind === "face" ? "Mapa ampliado da cabeça e face" : activeMap.kind === "chest" ? "Mapa ampliado do peito, mamas e axilas" : activeMap.kind === "hand" ? "Mapa ampliado da mão" : activeMap.kind === "foot" ? "Mapa ampliado do pé" : "Mapa ampliado da região" : `Mapa corporal ${side === "front" ? "frontal" : "posterior"}`;

  return <View style={styles.root}>
    {activeMap ? <View style={styles.detailHeader}><Pressable accessibilityRole="button" accessibilityLabel="Voltar ao corpo inteiro" onPress={closeMap} style={styles.backButton}><Text style={styles.backText}>‹</Text></Pressable><View style={styles.detailTitleWrap}><Text style={styles.detailTitle}>{mapLabel}</Text><Text style={styles.detailHint}>Toque no ponto exato da dor</Text></View></View> : <View style={styles.sideToggle}><Pressable accessibilityRole="button" accessibilityLabel="Vista frontal" accessibilityState={{ selected: side === "front" }} onPress={() => onSideChange("front")} style={[styles.sideButton, side === "front" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "front" && styles.sideTextActive]}>Frente</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Vista posterior" accessibilityState={{ selected: side === "back" }} onPress={() => onSideChange("back")} style={[styles.sideButton, side === "back" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "back" && styles.sideTextActive]}>Costas</Text></Pressable></View>}
    <View style={styles.mapFrame}><View style={styles.zoomBar}><Pressable accessibilityRole="button" accessibilityLabel="Diminuir zoom" accessibilityState={{ disabled: zoom <= 1 }} disabled={zoom <= 1} onPress={zoomOut} style={[styles.zoomButton, zoom <= 1 && styles.zoomDisabled]}><Text style={styles.zoomText}>−</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Redefinir zoom" onPress={resetZoom} style={styles.zoomValue}><Text style={styles.zoomValueText}>{zoom.toFixed(1)}×</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Aumentar zoom" accessibilityState={{ disabled: zoom >= (activeMap ? 3 : 2.5) }} disabled={zoom >= (activeMap ? 3 : 2.5)} onPress={zoomIn} style={[styles.zoomButton, zoom >= (activeMap ? 3 : 2.5) && styles.zoomDisabled]}><Text style={styles.zoomText}>+</Text></Pressable></View><View style={styles.viewport}><ScrollView horizontal contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}><ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}><Pressable accessibilityRole="imagebutton" accessibilityLabel={`${mapLabel}. Toque diretamente no local da dor.`} onPress={handleMapPress} style={[styles.map, { width: mapWidth * zoom, height: mapHeight * zoom }]}><Svg width={mapWidth * zoom} height={mapHeight * zoom} viewBox={`0 0 ${mapWidth} ${mapHeight}`} pointerEvents="none">{activeMap ? <DetailArt kind={activeMap.kind} site={activeMap.site} /> : <BodyArt side={side} />}<Rect x="0" y="0" width={mapWidth} height={mapHeight} fill="transparent" />{activeMap && points.map((point) => <Circle key={`target-${point.id}`} cx={point.x * mapWidth} cy={point.y * mapHeight} r={selectedDetails.includes(point.id) ? 9 : 5} fill={selectedDetails.includes(point.id) ? "#E98B5A" : "#8FB7C1"} opacity={selectedDetails.includes(point.id) ? 1 : 0.65} />)}</Svg>{selectedPoints.map((point) => <View key={point.id} pointerEvents="none" style={[styles.selection, { left: point.x * mapWidth * zoom - 14, top: point.y * mapHeight * zoom - 14 }]}><Text style={styles.selectionText}>•</Text></View>)}</Pressable></ScrollView></ScrollView></View></View><Text style={styles.helper}>{activeMap ? "Aproxime mais se necessário; cada ponto representa uma sub-região anatômica." : multi ? "Toque em uma região para abrir seu submapa detalhado." : "Toque em uma região; o app abrirá o submapa mais preciso."}</Text>
  </View>;
}

export function resolveBodyPoint(side: Side, rawX: number, rawY: number): Point {
  const points = side === "front" ? FRONT_POINTS : BACK_POINTS;
  return resolveDetailPoint(points, rawX, rawY);
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

function FootArt() { return <G><Path d="M95 35 Q75 55 83 110 L92 190 Q97 245 80 305 Q69 345 83 385 Q99 415 155 414 L222 410 Q255 405 264 382 Q270 360 242 345 L190 322 Q171 310 165 275 L164 120 Q164 35 135 24 Q110 20 95 35 Z" fill="#DCE9ED" stroke="#8FB7C1" strokeWidth="4" /><Path d="M93 205 Q135 220 176 204 M84 300 Q135 315 199 293" fill="none" stroke="#8FB7C1" strokeWidth="4" /></G>; }

function RegionArt({ site }: { site: BodySiteId }) { return <G><Rect x="62" y="30" width="176" height="370" rx="52" fill="#DCE9ED" stroke="#8FB7C1" strokeWidth="4" /><Path d={site.includes("back") ? "M85 140 Q150 175 215 140 M82 230 Q150 260 218 230" : "M92 145 Q150 175 208 145 M92 245 Q150 275 208 245"} fill="none" stroke="#8FB7C1" strokeWidth="5" /><Line x1="150" y1="50" x2="150" y2="380" stroke="#B9D0D6" strokeWidth="3" /></G>; }

function BodyArt({ side }: { side: Side }) { return <G><Ellipse cx="94" cy="48" rx="8" ry="14" fill="#C8DDE2" /><Ellipse cx="156" cy="48" rx="8" ry="14" fill="#C8DDE2" /><Ellipse cx="125" cy="43" rx="31" ry="36" fill="#DCE9ED" /><Path d="M108 73 C108 80 103 84 96 90 L76 112 C69 128 72 174 85 205 L96 226 L154 226 L165 205 C178 174 181 128 174 112 L154 90 C147 84 142 80 142 73 Z" fill={side === "back" ? "#CFDFE4" : "#DCE9ED"} /><Rect x="110" y="74" width="30" height="35" rx="14" fill="#DCE9ED" /><Path d="M80 99 C65 100 51 117 42 145 L28 208 C27 219 34 226 43 226 C51 226 56 220 58 210 L73 161 L89 133 Z" fill="#DCE9ED" /><Path d="M170 99 C185 100 199 117 208 145 L222 208 C223 219 216 226 207 226 C199 226 194 220 192 210 L177 161 L161 133 Z" fill="#DCE9ED" /><Path d="M94 214 L122 214 L120 341 C117 362 105 389 99 418 L75 418 C77 386 83 359 84 337 Z" fill="#DCE9ED" /><Path d="M128 214 L156 214 L166 337 C167 359 173 386 175 418 L151 418 C145 389 133 362 130 341 Z" fill="#DCE9ED" /><Path d="M74 411 L101 411 L94 438 L58 438 C55 429 61 417 74 411 Z" fill="#DCE9ED" /><Path d="M150 411 L177 411 C190 417 195 429 192 438 L156 438 Z" fill="#DCE9ED" /><Path d="M102 117 Q125 134 148 117" stroke="#B9D0D6" strokeWidth="2" fill="none" /><Path d={side === "back" ? "M92 145 Q125 160 158 145 M91 183 Q125 199 159 183" : "M88 145 Q125 157 162 145 M90 179 Q125 190 160 179"} stroke="#B9D0D6" strokeWidth="2" fill="none" /><Path d="M23 208 Q15 214 18 226 M227 208 Q235 214 232 226" stroke="#C8DDE2" strokeWidth="8" strokeLinecap="round" /></G>; }

const MAP_WIDTH = 250;
const MAP_HEIGHT = 455;
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
  viewport: { backgroundColor: "#F7FAFC", borderRadius: 16, height: 516, overflow: "hidden", width: 304 },
  scrollContent: { alignItems: "center", flexGrow: 1, justifyContent: "center", minHeight: 516, minWidth: 304 },
  sideToggle: { backgroundColor: "#EAF0F2", borderRadius: 14, flexDirection: "row", marginBottom: 8, padding: 4, width: 180 },
  sideButton: { alignItems: "center", borderRadius: 10, flex: 1, justifyContent: "center", minHeight: 38 },
  sideButtonActive: { backgroundColor: "#176B87" },
  sideText: { color: "#60747C", fontSize: 13, fontWeight: "700" },
  sideTextActive: { color: "#FFFFFF" },
  mapFrame: { backgroundColor: "#FFFFFF", borderColor: "#D9E3E7", borderRadius: 24, borderWidth: 1, padding: 12 },
  map: { backgroundColor: "#F7FAFC", borderRadius: 16, overflow: "hidden", position: "relative" },
  selection: { alignItems: "center", backgroundColor: "#E98B5A", borderColor: "#B55735", borderRadius: 14, borderWidth: 2, height: 28, justifyContent: "center", position: "absolute", width: 28 },
  selectionText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", lineHeight: 20 },
  helper: { color: "#60747C", fontSize: 13, fontWeight: "600", marginTop: 8, textAlign: "center" },
});
