import { Platform } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.tint, tabBarButton: HapticTab, tabBarInactiveTintColor: "#789098", tabBarLabelStyle: { fontSize: 11, fontWeight: "600" }, tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border, borderTopWidth: 0.5, height: tabBarHeight, paddingBottom: bottomPadding, paddingTop: 8 } }}><Tabs.Screen name="index" options={{ title: "Início", tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={24} color={color} /> }} /><Tabs.Screen name="records" options={{ title: "Registros", tabBarIcon: ({ color }) => <IconSymbol name="heart.fill" size={24} color={color} /> }} /><Tabs.Screen name="calendar" options={{ title: "Calendário", tabBarIcon: ({ color }) => <IconSymbol name="calendar" size={24} color={color} /> }} /><Tabs.Screen name="reports" options={{ title: "Relatórios", tabBarIcon: ({ color }) => <IconSymbol name="chart.bar.fill" size={24} color={color} /> }} /></Tabs>;
}
