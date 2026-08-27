import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import { addInAppNotification } from "@/lib/local-data";

export function NotificationObserver() {
  const router = useRouter();
  useEffect(() => {
    if (Platform.OS === "web") return;
    const openNotification = (notification: Notifications.Notification) => {
      const content = notification.request.content;
      const data = content.data ?? {};
      const followUpId = typeof data.followUpId === "string" ? data.followUpId : undefined;
      const painEntryId = typeof data.painEntryId === "string" ? data.painEntryId : undefined;
      void addInAppNotification({ id: notification.request.identifier, kind: "pain-follow-up", title: content.title ?? "Notificação", body: content.body ?? "", createdAt: new Date().toISOString(), followUpId, painEntryId });
      const url = data.url;
      if (typeof url === "string") router.push(url as never);
    };
    const initial = Notifications.getLastNotificationResponse();
    if (initial?.notification) openNotification(initial.notification);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => openNotification(response.notification));
    return () => subscription.remove();
  }, [router]);
  return null;
}
