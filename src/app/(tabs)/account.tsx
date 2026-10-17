import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";

export default function AccountScreen() {
  const { data: session } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    setIsSigningOut(true);
    setError(null);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setError(result.error.message ?? "Unable to sign out.");
      }
    } catch {
      setError("Unable to sign out. Check your connection and try again.");
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Account</ThemedText>
      <ThemedText type="subtitle">{session?.user.name || session?.user.email}</ThemedText>
      {session?.user.name ? <ThemedText>{session.user.email}</ThemedText> : null}
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <Pressable
        accessibilityRole="button"
        disabled={isSigningOut}
        onPress={handleSignOut}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        {isSigningOut ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <ThemedText style={styles.buttonText}>Log out</ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.four,
    gap: Spacing.three,
  },
  button: {
    minHeight: 48,
    minWidth: 160,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.two,
    backgroundColor: "#3c87f7",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  error: {
    color: "#c62828",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
});
