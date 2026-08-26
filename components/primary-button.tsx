import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

export function PrimaryButton({ label, onPress, icon, disabled = false, loading = false, style, variant = "primary" }: { label: string; onPress: () => void; icon?: ReactNode; disabled?: boolean; loading?: boolean; style?: ViewStyle; variant?: "primary" | "health" | "weather" | "calendar" | "subtle" }) {
  const palette = variant === "health" ? styles.health : variant === "weather" ? styles.weather : variant === "calendar" ? styles.calendar : variant === "subtle" ? styles.subtle : styles.primary;
  return <TouchableOpacity disabled={disabled || loading} onPress={onPress} activeOpacity={0.82} style={[styles.button, palette, (disabled || loading) && styles.disabled, style]}>{loading ? <ActivityIndicator color={variant === "subtle" ? "#176B87" : "#FFFFFF"} /> : icon}<Text style={[styles.text, variant === "subtle" ? styles.subtleText : styles.lightText]}>{label}</Text></TouchableOpacity>;
}
const styles = StyleSheet.create({ button: { alignItems: "center", borderRadius: 15, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 50, paddingHorizontal: 18 }, primary: { backgroundColor: "#176B87" }, health: { backgroundColor: "#3F8D72" }, weather: { backgroundColor: "#D79127" }, calendar: { backgroundColor: "#6966B3" }, subtle: { backgroundColor: "#EAF4F7" }, disabled: { opacity: 0.55 }, text: { fontSize: 15, fontWeight: "700" }, lightText: { color: "#FFFFFF" }, subtleText: { color: "#176B87" } });
