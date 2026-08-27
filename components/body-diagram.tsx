import { Pressable, StyleSheet, Text, View } from "react-native";

import { BODY_SITES, BodySiteId } from "@/shared/records";

const MARKERS: Record<BodySiteId, { left: number; top: number }> = {
  head: { left: 102, top: 8 },
  face: { left: 102, top: 49 },
  neck: { left: 102, top: 82 },
  "left-shoulder": { left: 60, top: 96 },
  "right-shoulder": { left: 144, top: 96 },
  "left-arm": { left: 25, top: 136 },
  "right-arm": { left: 179, top: 136 },
  chest: { left: 102, top: 117 },
  abdomen: { left: 102, top: 165 },
  "upper-back": { left: 102, top: 117 },
  "lower-back": { left: 102, top: 165 },
  "left-hip": { left: 76, top: 207 },
  "right-hip": { left: 128, top: 207 },
  "left-thigh": { left: 76, top: 244 },
  "right-thigh": { left: 128, top: 244 },
  "left-knee": { left: 76, top: 294 },
  "right-knee": { left: 128, top: 294 },
  "left-leg": { left: 76, top: 328 },
  "right-leg": { left: 128, top: 328 },
  "left-foot": { left: 67, top: 376 },
  "right-foot": { left: 137, top: 376 },
};

export function BodyDiagram({ selected = [], onSelect, multi = false, side, onSideChange }: { selected?: BodySiteId[]; onSelect: (site: BodySiteId) => void; multi?: boolean; side: "front" | "back"; onSideChange: (side: "front" | "back") => void }) {
  const visibleSites = side === "front" ? BODY_SITES.filter((site) => !["upper-back", "lower-back"].includes(site.id)) : BODY_SITES.filter((site) => ["head", "neck", "left-shoulder", "right-shoulder", "left-arm", "right-arm", "upper-back", "abdomen", "lower-back", "left-hip", "right-hip", "left-thigh", "right-thigh", "left-knee", "right-knee", "left-leg", "right-leg", "left-foot", "right-foot"].includes(site.id));
  return <View style={styles.root}><View style={styles.sideToggle}><Pressable accessibilityRole="button" accessibilityState={{ selected: side === "front" }} onPress={() => onSideChange("front")} style={[styles.sideButton, side === "front" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "front" && styles.sideTextActive]}>Frente</Text></Pressable><Pressable accessibilityRole="button" accessibilityState={{ selected: side === "back" }} onPress={() => onSideChange("back")} style={[styles.sideButton, side === "back" && styles.sideButtonActive]}><Text style={[styles.sideText, side === "back" && styles.sideTextActive]}>Costas</Text></Pressable></View><View style={styles.diagram}><BodyShape side={side} />{visibleSites.map((site) => { const position = MARKERS[site.id]; const active = selected.includes(site.id); return <Pressable key={site.id} accessibilityRole="button" accessibilityLabel={`${site.label}${active ? ", selecionado" : ""}`} accessibilityState={{ selected: active }} onPress={() => onSelect(site.id)} style={[styles.marker, { left: position.left, top: position.top }, active && styles.markerActive]}><Text style={[styles.markerText, active && styles.markerTextActive]}>{site.icon}</Text></Pressable>; })}</View><Text style={styles.helper}>{multi ? "Toque em uma ou mais regiões" : "Toque no ponto que representa a dor"}</Text></View>;
}

function BodyShape({ side }: { side: "front" | "back" }) { return <View pointerEvents="none" style={styles.shape}><View style={styles.headShape} /><View style={styles.neckShape} /><View style={[styles.torsoShape, side === "back" && styles.backTone]} /><View style={[styles.armShape, styles.leftArm]} /><View style={[styles.armShape, styles.rightArm]} /><View style={[styles.legShape, styles.leftLeg]} /><View style={[styles.legShape, styles.rightLeg]} /><View style={[styles.footShape, styles.leftFoot]} /><View style={[styles.footShape, styles.rightFoot]} /></View>; }

const styles = StyleSheet.create({ root: { alignItems: "center" }, sideToggle: { backgroundColor: "#EAF0F2", borderRadius: 14, flexDirection: "row", marginBottom: 8, padding: 4, width: 180 }, sideButton: { alignItems: "center", borderRadius: 10, flex: 1, minHeight: 38, justifyContent: "center" }, sideButtonActive: { backgroundColor: "#176B87" }, sideText: { color: "#60747C", fontSize: 13, fontWeight: "700" }, sideTextActive: { color: "#FFFFFF" }, diagram: { height: 425, position: "relative", width: 250 }, shape: { height: 425, left: 0, position: "absolute", top: 0, width: 250 }, headShape: { backgroundColor: "#DCE9ED", borderRadius: 36, height: 62, left: 94, position: "absolute", top: 4, width: 62 }, neckShape: { backgroundColor: "#DCE9ED", height: 34, left: 103, position: "absolute", top: 61, width: 44 }, torsoShape: { backgroundColor: "#DCE9ED", borderRadius: 46, height: 151, left: 69, position: "absolute", top: 80, width: 112 }, backTone: { backgroundColor: "#CFDFE4" }, armShape: { backgroundColor: "#DCE9ED", borderRadius: 18, height: 135, position: "absolute", top: 86, width: 32 }, leftArm: { left: 42, transform: [{ rotate: "8deg" }] }, rightArm: { right: 42, transform: [{ rotate: "-8deg" }] }, legShape: { backgroundColor: "#DCE9ED", borderRadius: 20, height: 165, position: "absolute", top: 218, width: 39 }, leftLeg: { left: 78 }, rightLeg: { right: 78 }, footShape: { backgroundColor: "#DCE9ED", borderRadius: 14, bottom: 1, height: 23, position: "absolute", width: 57 }, leftFoot: { left: 51 }, rightFoot: { right: 51 }, marker: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#AFC7CE", borderRadius: 24, borderWidth: 2, height: 48, justifyContent: "center", position: "absolute", width: 48, zIndex: 2 }, markerActive: { backgroundColor: "#E98B5A", borderColor: "#B55735", transform: [{ scale: 1.08 }] }, markerText: { color: "#176B87", fontSize: 18, fontWeight: "800" }, markerTextActive: { color: "#FFFFFF" }, helper: { color: "#60747C", fontSize: 13, fontWeight: "600", marginTop: -3, textAlign: "center" } });
