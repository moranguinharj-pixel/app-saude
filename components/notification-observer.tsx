import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import type { Notification } from "expo-notifications";

import { addInAppNotification } from "@/lib/local-data";

export function NotificationObserver() {
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS === "web") return;

    let active = true;
    let removeListener: (() => void) | undefined;

    // Notificações são opcionais. Carregá-las após a primeira tela impede que
    // uma indisponibilidade do módulo nativo bloqueie toda a inicialização.
    const timer = setTimeout(() => {
      void import("expo-notifications")
        .then((Notifications) => {
          if (!active) return;

          const openNotification = (notification: Notification) => {
            const content = notification.request.content;
            const data = content.data ?? {};
            const followUpId = typeof data.followUpId === "string" ? data.followUpId : undefined;
            const painEntryId = typeof data.painEntryId === "string" ? data.painEntryId : undefined;

            void addInAppNotification({
              id: notification.request.identifier,
              kind: "pain-follow-up",
              title: content.title ?? "Notificação",
              body: content.body ?? "",
              createdAt: new Date().toISOString(),
              followUpId,
              painEntryId,
            });

            if (typeof data.url === "string") router.push(data.url as never);
          };

          try {
            const initial = Notifications.getLastNotificationResponse();
            if (initial?.notification) openNotification(initial.notification);

            const subscription = Notifications.addNotificationResponseReceivedListener((response) =>
              openNotification(response.notification),
            );
            removeListener = () => subscription.remove();
          } catch (error) {
            console.warn("[Notifications] Observador indisponível", error);
          }
        })
        .catch((error) => console.warn("[Notifications] Módulo indisponível", error));
    }, 800);

    return () => {
      active = false;
      clearTimeout(timer);
      removeListener?.();
    };
  }, [router]);

  return null;
}
