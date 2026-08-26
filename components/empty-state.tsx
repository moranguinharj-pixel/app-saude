import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return <View style={styles.root}><View style={styles.icon}>{icon}</View><Text style={styles.title}>{title}</Text><Text style={styles.description}>{description}</Text></View>;
}

const styles = StyleSheet.create({ root: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderRadius: 20, borderStyle: "dashed", borderWidth: 1, paddingHorizontal: 30, paddingVertical: 30 }, icon: { backgroundColor: "#EAF4F7", borderRadius: 18, marginBottom: 14, padding: 12 }, title: { color: "#152A33", fontSize: 16, fontWeight: "700", textAlign: "center" }, description: { color: "#60747C", fontSize: 14, lineHeight: 20, marginTop: 6, textAlign: "center" } });
