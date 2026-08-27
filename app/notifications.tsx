import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import { EmptyState } from "@/components/empty-state";
import { PrimaryButton } from "@/components/primary-button";
import { ScreenContainer } from "@/components/screen-container";
import { formatDateTime } from "@/lib/format";
import { clearReadNotifications, loadAppData, markAllNotificationsRead, markNotificationRead } from "@/lib/local-data";
import { AppData, InAppNotification } from "@/shared/records";

export default function NotificationsScreen() {
  const router = useRouter();
  const [data, setData] = useState<AppData | null>(null);
  const refresh = useCallback(() => { loadAppData().then(setData); }, []);
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));
  const notifications = data?.notifications ?? [];
  const unreadCount = notifications.filter((item) => !item.readAt).length;
  const openNotification = async (item: InAppNotification) => {
    const next = await markNotificationRead(item.id);
    setData(next);
    if (item.followUpId) router.push(`/follow-up?followUpId=${encodeURIComponent(item.followUpId)}` as never);
  };
  const markAll = async () => setData(await markAllNotificationsRead());
  const clearRead = async () => setData(await clearReadNotifications());

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><View style={styles.header}><View><Text style={styles.eyebrow}>CENTRAL LOCAL</Text><Text style={styles.title}>Notificações</Text></View>{unreadCount > 0 ? <View style={styles.badge}><Text style={styles.badgeText}>{unreadCount}</Text></View> : null}</View><Text style={styles.subtitle}>Lembretes e acompanhamentos ficam guardados somente neste aparelho.</Text><View style={styles.actions}>{unreadCount > 0 ? <PrimaryButton label="Marcar todas como lidas" variant="subtle" onPress={markAll} style={styles.actionButton} /> : null}{notifications.some((item) => item.readAt) ? <Pressable accessibilityRole="button" onPress={clearRead} style={styles.clearButton}><Text style={styles.clearText}>Limpar lidas</Text></Pressable> : null}</View><FlatList data={notifications} keyExtractor={(item) => item.id} contentContainerStyle={notifications.length ? styles.list : styles.emptyList} ListEmptyComponent={<EmptyState icon={<Text style={styles.emptyIcon}>♢</Text>} title="Nenhuma notificação" description="Quando um lembrete de acompanhamento for criado ou recebido, ele aparecerá aqui." />} renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityState={{ selected: !item.readAt }} onPress={() => openNotification(item)} style={({ pressed }) => [styles.item, !item.readAt && styles.itemUnread, pressed && styles.itemPressed]}><View style={styles.itemIcon}><Text style={styles.itemIconText}>{item.kind === "pain-follow-up" ? "◷" : "•"}</Text></View><View style={styles.itemBody}><View style={styles.itemHeading}><Text style={styles.itemTitle}>{item.title}</Text>{!item.readAt ? <View style={styles.dot} /> : null}</View><Text style={styles.itemText}>{item.body}</Text><Text style={styles.itemDate}>{formatDateTime(item.createdAt)}</Text></View></Pressable>} /></ScreenContainer>;
}

const styles = StyleSheet.create({
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", paddingTop: 12 },
  eyebrow: { color: "#3F8D72", fontSize: 11, fontWeight: "800", letterSpacing: 1.2 },
  title: { color: "#152A33", fontSize: 30, fontWeight: "800", marginTop: 3 },
  subtitle: { color: "#60747C", fontSize: 14, lineHeight: 20, marginTop: 7 },
  badge: { alignItems: "center", backgroundColor: "#E98B5A", borderRadius: 18, height: 36, justifyContent: "center", minWidth: 36, paddingHorizontal: 9 },
  badgeText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  actions: { alignItems: "center", flexDirection: "row", gap: 10, marginVertical: 16 },
  actionButton: { flex: 1 },
  clearButton: { borderColor: "#D9E3E7", borderRadius: 14, borderWidth: 1, minHeight: 44, justifyContent: "center", paddingHorizontal: 14 },
  clearText: { color: "#176B87", fontSize: 13, fontWeight: "800" },
  list: { gap: 10, paddingBottom: 28 },
  emptyList: { flexGrow: 1, paddingBottom: 28 },
  item: { alignItems: "flex-start", backgroundColor: "#FFFFFF", borderColor: "#E2E9EC", borderRadius: 18, borderWidth: 1, flexDirection: "row", padding: 15 },
  itemUnread: { borderColor: "#A8D5C3", borderLeftWidth: 4 },
  itemPressed: { opacity: 0.72 },
  itemIcon: { alignItems: "center", backgroundColor: "#EAF4F7", borderRadius: 14, height: 42, justifyContent: "center", marginRight: 12, width: 42 },
  itemIconText: { color: "#176B87", fontSize: 23, fontWeight: "800" },
  itemBody: { flex: 1 },
  itemHeading: { alignItems: "center", flexDirection: "row" },
  itemTitle: { color: "#152A33", flex: 1, fontSize: 16, fontWeight: "800", lineHeight: 21 },
  itemText: { color: "#60747C", fontSize: 13, lineHeight: 19, marginTop: 4 },
  itemDate: { color: "#8DA0A7", fontSize: 11, marginTop: 8 },
  dot: { backgroundColor: "#E98B5A", borderRadius: 5, height: 9, marginLeft: 8, width: 9 },
  emptyIcon: { color: "#176B87", fontSize: 30 },
});
