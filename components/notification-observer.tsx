import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

export function NotificationObserver() {
  const router = useRouter();
  useEffect(() => {
    const openNotification = (notification: Notifications.Notification) => {
      const url = notification.request.content.data?.url;
      if (typeof url === "string") router.push(url as never);
    };
    const initial = Notifications.getLastNotificationResponse();
    if (initial?.notification) openNotification(initial.notification);
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => openNotification(response.notification));
    return () => subscription.remove();
  }, [router]);
  return null;
}
