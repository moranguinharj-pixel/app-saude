import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Ellipse, G, Path, Rect } from "react-native-svg";

import { BodySiteDetailId, BodySiteId } from "@/shared/records";

type Point = { id: BodySiteDetailId; coarse: BodySiteId; x: number; y: number };

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
  { id: "groin-left", coarse: "left-hip", x: 0.56, y: 0.80 },
  { id: "groin-right", coarse: "right-hip", x: 0.44, y: 0.80 },
  { id: "thigh-left-front", coarse: "left-thigh", x: 0.57, y: 0.88 },
  { id: "thigh-right-front", coarse: "right-thigh", x: 0.43, y: 0.88 },
  { id: "knee-left", coarse: "left-knee", x: 0.57, y: 0.985 },
  { id: "knee-right", coarse: "right-knee", x: 0.43, y: 0.985 },
];

const BACK_POINTS: Point[] = [
  { id: "head-top", coarse: "head", x: 0.5, y: 0.035 },
  { id: "behind-head-left", coarse: "head", x: 0.59, y: 0.115 },
  { id: "behind-head-right", coarse: "head", x: 0.41, y: 0.115 },
  { id: "neck-back", coarse: "neck", x: 0.5, y: 0.205 },
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
];

export function BodyDiagram({ selected = [], selectedDetails = [], onSelect, onSelectDetail, multi = false, side, onSideChange }: { selected?: BodySiteId[]; selectedDetails?: BodySiteDetailId[]; onSelect: (site: BodySiteId) => void; onSelectDetail?: (detail: BodySiteDetailId) => void; multi?: boolean; side: "front" | "back"; onSideChange: (side: "front" | "back") => void }) {
  const points = side === "front" ? FRONT_POINTS : BACK_POINTS;
  const selectedPoints = useMemo(() => { const exact = points.filter((point) => selectedDetails.includes(point.id)); if (exact.length) return exact; return points.filter((point, index) => selected.includes(point.coarse) && points.findIndex((candidate) => candidate.coarse === point.coarse) === index); }, [points, selected, selectedDetails]);
  const [zoom, setZoom] = useState(1);
  const zoomIn = () => setZoom((value) => Math.min(2.5, Number((value + 0.5).toFixed(1))));
  const zoomOut = () => setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(1))));
  const resetZoom = () => setZoom(1);
  const handleMapPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const nearest = resolveBodyPoint(side, locationX / (MAP_WIDTH * zoom), locationY / (MAP_HEIGHT * zoom));
    onSelect(nearest.coarse);
    onSelectDetail?.(nearest.id);
  };

  return <View style={styles.root}><View style={styles.sideToggle}><Pressable accessibilityRole="button" accessibilityLabel="Vista frontal" accessibilityState={{ selected: side === "front" }} onPress={() => onSideChange("front")} style={[styles.sideButton, side === "front" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "front" && styles.sideTextActive]}>Frente</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Vista posterior" accessibilityState={{ selected: side === "back" }} onPress={() => onSideChange("back")} style={[styles.sideButton, side === "back" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "back" && styles.sideTextActive]}>Costas</Text></Pressable></View><View style={styles.mapFrame}><View style={styles.zoomBar}><Pressable accessibilityRole="button" accessibilityLabel="Diminuir zoom" accessibilityState={{ disabled: zoom <= 1 }} disabled={zoom <= 1} onPress={zoomOut} style={[styles.zoomButton, zoom <= 1 && styles.zoomDisabled]}><Text style={styles.zoomText}>−</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Redefinir zoom" onPress={resetZoom} style={styles.zoomValue}><Text style={styles.zoomValueText}>{zoom.toFixed(1)}×</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Aumentar zoom" accessibilityState={{ disabled: zoom >= 2.5 }} disabled={zoom >= 2.5} onPress={zoomIn} style={[styles.zoomButton, zoom >= 2.5 && styles.zoomDisabled]}><Text style={styles.zoomText}>+</Text></Pressable></View><View style={styles.viewport}><ScrollView horizontal contentContainerStyle={styles.scrollContent} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}><ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}><Pressable accessibilityRole="imagebutton" accessibilityLabel={`Mapa corporal ${side === "front" ? "frontal" : "posterior"}. Toque diretamente no local da dor.`} onPress={handleMapPress} style={[styles.map, { width: MAP_WIDTH * zoom, height: MAP_HEIGHT * zoom }]}><Svg width={MAP_WIDTH * zoom} height={MAP_HEIGHT * zoom} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} pointerEvents="none"><BodyArt side={side} /><Rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="transparent" /></Svg>{selectedPoints.map((point) => <View key={point.id} pointerEvents="none" style={[styles.selection, { left: point.x * MAP_WIDTH * zoom - 14, top: point.y * MAP_HEIGHT * zoom - 14 }]}><Text style={styles.selectionText}>•</Text></View>)}</Pressable></ScrollView></ScrollView></View></View><Text style={styles.helper}>{multi ? "Toque diretamente no local ou em vários pontos" : "Toque diretamente no local; o app identifica a área"}</Text></View>;
}

export function resolveBodyPoint(side: "front" | "back", rawX: number, rawY: number): Point {
  const points = side === "front" ? FRONT_POINTS : BACK_POINTS;
  const x = Math.max(0, Math.min(1, rawX));
  const y = Math.max(0, Math.min(1, rawY));
  return points.reduce((best, point) => {
    const distance = (point.x - x) ** 2 + (point.y - y) ** 2;
    return distance < best.distance ? { point, distance } : best;
  }, { point: points[0], distance: Number.POSITIVE_INFINITY }).point;
}

function BodyArt({ side }: { side: "front" | "back" }) { return <G><Ellipse cx="94" cy="48" rx="8" ry="14" fill="#C8DDE2" /><Ellipse cx="156" cy="48" rx="8" ry="14" fill="#C8DDE2" /><Ellipse cx="125" cy="43" rx="31" ry="36" fill="#DCE9ED" /><Path d="M108 73 C108 80 103 84 96 90 L76 112 C69 128 72 174 85 205 L96 226 L154 226 L165 205 C178 174 181 128 174 112 L154 90 C147 84 142 80 142 73 Z" fill={side === "back" ? "#CFDFE4" : "#DCE9ED"} /><Rect x="110" y="74" width="30" height="35" rx="14" fill="#DCE9ED" /><Path d="M80 99 C65 100 51 117 42 145 L28 208 C27 219 34 226 43 226 C51 226 56 220 58 210 L73 161 L89 133 Z" fill="#DCE9ED" /><Path d="M170 99 C185 100 199 117 208 145 L222 208 C223 219 216 226 207 226 C199 226 194 220 192 210 L177 161 L161 133 Z" fill="#DCE9ED" /><Path d="M94 214 L122 214 L120 341 C117 362 105 389 99 418 L75 418 C77 386 83 359 84 337 Z" fill="#DCE9ED" /><Path d="M128 214 L156 214 L166 337 C167 359 173 386 175 418 L151 418 C145 389 133 362 130 341 Z" fill="#DCE9ED" /><Path d="M74 411 L101 411 L94 438 L58 438 C55 429 61 417 74 411 Z" fill="#DCE9ED" /><Path d="M150 411 L177 411 C190 417 195 429 192 438 L156 438 Z" fill="#DCE9ED" /><Path d="M102 117 Q125 134 148 117" stroke="#B9D0D6" strokeWidth="2" fill="none" /><Path d={side === "back" ? "M92 145 Q125 160 158 145 M91 183 Q125 199 159 183" : "M88 145 Q125 157 162 145 M90 179 Q125 190 160 179"} stroke="#B9D0D6" strokeWidth="2" fill="none" /></G>; }

const MAP_WIDTH = 250;
const MAP_HEIGHT = 455;
const styles = StyleSheet.create({ root: { alignItems: "center" }, zoomBar: { alignItems: "center", flexDirection: "row", gap: 10, justifyContent: "center", marginBottom: 10 }, zoomButton: { alignItems: "center", backgroundColor: "#176B87", borderRadius: 14, height: 48, justifyContent: "center", width: 52 }, zoomDisabled: { opacity: 0.35 }, zoomText: { color: "#FFFFFF", fontSize: 30, fontWeight: "700", lineHeight: 32 }, zoomValue: { alignItems: "center", backgroundColor: "#EAF4F7", borderColor: "#BCD0D6", borderRadius: 14, borderWidth: 1, height: 48, justifyContent: "center", minWidth: 76, paddingHorizontal: 12 }, zoomValueText: { color: "#176B87", fontSize: 15, fontWeight: "800" }, viewport: { backgroundColor: "#F7FAFC", borderRadius: 16, height: 516, overflow: "hidden", width: 304 }, scrollContent: { alignItems: "center", flexGrow: 1, justifyContent: "center", minWidth: 304, minHeight: 516 }, sideToggle: { backgroundColor: "#EAF0F2", borderRadius: 14, flexDirection: "row", marginBottom: 8, padding: 4, width: 180 }, sideButton: { alignItems: "center", borderRadius: 10, flex: 1, justifyContent: "center", minHeight: 38 }, sideButtonActive: { backgroundColor: "#176B87" }, sideText: { color: "#60747C", fontSize: 13, fontWeight: "700" }, sideTextActive: { color: "#FFFFFF" }, mapFrame: { backgroundColor: "#FFFFFF", borderColor: "#D9E3E7", borderRadius: 24, borderWidth: 1, padding: 12 }, map: { backgroundColor: "#F7FAFC", borderRadius: 16, height: MAP_HEIGHT, overflow: "hidden", position: "relative", width: MAP_WIDTH }, selection: { alignItems: "center", backgroundColor: "#E98B5A", borderColor: "#B55735", borderRadius: 14, borderWidth: 2, height: 28, justifyContent: "center", position: "absolute", width: 28 }, selectionText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900", lineHeight: 20 }, helper: { color: "#60747C", fontSize: 13, fontWeight: "600", marginTop: 8, textAlign: "center" } });
