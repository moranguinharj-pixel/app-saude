import { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type AppCardProps = PropsWithChildren<{ title?: string; accessory?: ReactNode; tone?: "default" | "health" | "weather" | "calendar" }>;

export function AppCard({ children, title, accessory, tone = "default" }: AppCardProps) {
  return <View style={[styles.card, tone === "health" && styles.health, tone === "weather" && styles.weather, tone === "calendar" && styles.calendar]}>{(title || accessory) && <View style={styles.heading}>{title ? <Text style={styles.title}>{title}</Text> : <View />}{accessory}</View>}{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderRadius: 20, borderWidth: 1, elevation: 1, padding: 16, shadowColor: "#152A33", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12 },
  health: { borderLeftColor: "#3F8D72", borderLeftWidth: 4 }, weather: { borderLeftColor: "#D79127", borderLeftWidth: 4 }, calendar: { borderLeftColor: "#6966B3", borderLeftWidth: 4 },
  heading: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }, title: { color: "#152A33", fontSize: 15, fontWeight: "700" },
});
