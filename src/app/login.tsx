import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { authClient } from "@/lib/auth-client";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = isSignUp
        ? await authClient.signUp.email({
            email: email.trim(),
            password,
            name: email.trim().split("@")[0],
          })
        : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError(result.error.message ?? "Unable to sign in.");
      }
    } catch {
      setError("Unable to sign in. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.content}>
        <ThemedText type="title">Wildlog</ThemedText>
        <ThemedText type="subtitle" style={styles.heading}>
          {isSignUp ? "Create your account" : "Log in"}
        </ThemedText>
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
          autoComplete={isSignUp ? "new-password" : "current-password"}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
          value={password}
        />
        {error ? <ThemedText accessibilityRole="alert" style={styles.error}>{error}</ThemedText> : null}
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting || !email.trim() || !password}
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.button,
            pressed && styles.pressed,
            (isSubmitting || !email.trim() || !password) && styles.disabled,
          ]}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <ThemedText style={styles.buttonText}>{isSignUp ? "Sign up" : "Log in"}</ThemedText>
          )}
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isSubmitting}
          onPress={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
        >
          <ThemedText type="small" style={styles.toggle}>
            {isSignUp ? "Already have an account? Log in" : "Need an account? Sign up"}
          </ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    justifyContent: "center",
    padding: Spacing.four,
    gap: Spacing.three,
  },
  heading: {
    fontSize: 24,
    lineHeight: 32,
  },
  input: {
    minHeight: 48,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    backgroundColor: "#ffffff",
    color: "#000000",
    fontSize: 16,
  },
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Spacing.two,
    backgroundColor: "#3c87f7",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  toggle: {
    textAlign: "center",
    textDecorationLine: "underline",
  },
  error: {
    color: "#c62828",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.5,
  },
});
