import "@/global.css";

import { Component, type ErrorInfo, type ReactNode, useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import { NotificationObserver } from "@/components/notification-observer";
import { ThemeProvider } from "@/lib/theme-provider";
import "@/lib/_core/nativewind-pressable";

export const unstable_settings = {
  anchor: "(tabs)",
};

type StartupBoundaryState = { error: Error | null };

class StartupBoundary extends Component<{ children: ReactNode }, StartupBoundaryState> {
  state: StartupBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): StartupBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Startup] Falha ao renderizar o aplicativo", error, info.componentStack);
    void SplashScreen.hideAsync().catch(() => undefined);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorScreen}>
          <Text style={styles.errorTitle}>Não foi possível iniciar</Text>
          <Text style={styles.errorText}>
            Feche o Registro Pessoal e abra novamente. Seus dados permanecem salvos neste aparelho.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  useEffect(() => {
    // A compilação instalada deve sair do logo mesmo se algum serviço opcional falhar.
    void SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <StartupBoundary>
      <ThemeProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <GestureHandlerRootView style={styles.root}>
            <NotificationObserver />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="oauth/callback" />
            </Stack>
            <StatusBar style="auto" />
          </GestureHandlerRootView>
        </SafeAreaProvider>
      </ThemeProvider>
    </StartupBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  errorScreen: {
    alignItems: "center",
    backgroundColor: "#F7FAFC",
    flex: 1,
    justifyContent: "center",
    padding: 28,
  },
  errorTitle: {
    color: "#152A33",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  errorText: {
    color: "#60747C",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    textAlign: "center",
  },
});
