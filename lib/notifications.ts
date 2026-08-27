import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function requestLocalNotificationPermission() {
  if (Platform.OS === "web") return false;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("pain-follow-up", {
      name: "Acompanhamento da dor",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 180],
      lightColor: "#176B87",
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.status === "granted") return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === "granted";
}

export async function schedulePainFollowUp(followUpId: string, medicationName?: string) {
  if (!(await requestLocalNotificationPermission())) return null;
  const title = medicationName ? `Sua dor melhorou com ${medicationName}?` : "Sua dor melhorou?";
  return Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: "Toque para registrar como você está agora.",
      data: { url: `/follow-up?followUpId=${encodeURIComponent(followUpId)}`, followUpId },
      ...(Platform.OS === "android" ? { channelId: "pain-follow-up" } : {}),
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(Date.now() + 2 * 60 * 60 * 1000) },
  });
}

export async function cancelPainFollowUp(notificationId?: string) {
  if (notificationId) await Notifications.cancelScheduledNotificationAsync(notificationId);
}
