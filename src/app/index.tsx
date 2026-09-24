import * as Device from "expo-device";
import { ActivityIndicator, Platform, Pressable, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";

import { AnimatedIcon } from "@/components/animated-icon";
import { HintRow } from "@/components/hint-row";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { WebBadge } from "@/components/web-badge";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { orpc } from "@/lib/client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

function getDevMenuHint() {
  if (Platform.OS === "web") {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === "android" ? "cmd+m (or ctrl+m)" : "cmd+d";
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const { data } = useQuery(orpc.whoAmI.queryOptions({}));
  const { data: session, isPending } = authClient.useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  async function handleSignIn() {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            email: email.trim(),
            password,
            name: email.trim().split("@")[0],
          })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) setAuthError(result.error.message ?? "Unable to sign in.");
    } catch {
      setAuthError("Unable to sign in. Check your connection and try again.");
    } finally {
      setIsSigningIn(false);
    }
  }

  async function handleSignOut() {
    setAuthError(null);
    try {
      const result = await authClient.signOut();
      if (result.error) setAuthError(result.error.message ?? "Unable to sign out.");
    } catch {
      setAuthError("Unable to sign out. Check your connection and try again.");
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>
        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>
        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        <ThemedText>Name: {data}</ThemedText>

        <ThemedView type="backgroundElement" style={styles.authSection}>
          <ThemedText type="subtitle" style={styles.authTitle}>
            {isPending
              ? "Checking account…"
              : session
                ? "Signed in"
                : isSignUp
                  ? "Sign up"
                  : "Log in"}
          </ThemedText>
          {isPending ? (
            <ActivityIndicator />
          ) : session ? (
            <>
              <ThemedText>{session.user.name || session.user.email}</ThemedText>
              {session.user.name ? (
                <ThemedText type="small" themeColor="textSecondary">
                  {session.user.email}
                </ThemedText>
              ) : null}
              <Pressable
                accessibilityRole="button"
                disabled={isSigningIn}
                onPress={handleSignOut}
                style={({ pressed }) => [styles.authButton, pressed && styles.pressed]}
              >
                <ThemedText style={styles.authButtonText}>Log out</ThemedText>
              </Pressable>
            </>
          ) : (
            <>
              <TextInput
                accessibilityLabel="Email"
                autoCapitalize="none"
                autoComplete="email"
                keyboardType="email-address"
                onChangeText={setEmail}
                placeholder="Email"
                style={styles.input}
                value={email}
              />
              <TextInput
                accessibilityLabel="Password"
                autoCapitalize="none"
                autoComplete="current-password"
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={styles.input}
                value={password}
              />
              {authError ? (
                <ThemedText accessibilityRole="alert" style={styles.error}>
                  {authError}
                </ThemedText>
              ) : null}
              <Pressable
                accessibilityRole="button"
                disabled={isSigningIn || !email.trim() || !password}
                onPress={handleSignIn}
                style={({ pressed }) => [
                  styles.authButton,
                  pressed && styles.pressed,
                  (isSigningIn || !email.trim() || !password) && styles.disabledButton,
                ]}
              >
                {isSigningIn ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText style={styles.authButtonText}>
                    {isSignUp ? "Sign up" : "Log in"}
                  </ThemedText>
                )}
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={isSigningIn}
                onPress={() => {
                  setIsSignUp(!isSignUp);
                  setAuthError(null);
                }}
              >
                <ThemedText type="small" style={styles.authToggle}>
                  {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
                </ThemedText>
              </Pressable>
            </>
          )}
          {authError && session ? (
            <ThemedText accessibilityRole="alert" style={styles.error}>
              {authError}
            </ThemedText>
          ) : null}
        </ThemedView>

        {Platform.OS === "web" && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: "center",
  },
  code: {
    textTransform: "uppercase",
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: "stretch",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  authSection: {
    alignSelf: "stretch",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.four,
  },
  authTitle: {
    fontSize: 22,
    lineHeight: 28,
    textAlign: "center",
  },
  input: {
    minHeight: 48,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: 16,
  },
  authButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.two,
    backgroundColor: "#3c87f7",
  },
  authButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.75,
  },
  disabledButton: {
    opacity: 0.5,
  },
  error: {
    color: "#c62828",
    textAlign: "center",
  },
  authToggle: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
