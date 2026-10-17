import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ActivityIndicator, useColorScheme, View } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { authClient } from "@/lib/auth-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { data: session, isPending } = authClient.useSession();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        {isPending ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={Boolean(session)}>
              <Stack.Screen name="(tabs)" />
            </Stack.Protected>
            <Stack.Protected guard={!session}>
              <Stack.Screen name="login" />
            </Stack.Protected>
          </Stack>
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
