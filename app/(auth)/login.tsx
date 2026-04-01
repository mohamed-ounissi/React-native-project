import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

import { styles } from "./auth.styles";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import {
  getRegisteredUser,
  loginLocalSession,
  validateEmail,
} from "./utils";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth-session";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useRedirectIfAuthenticated();

  const handleLogin = async () => {
    if (email.trim().length === 0 || password.trim().length === 0) {
      setError("Please fill in both email and password.");
      return;
    }

    if (!validateEmail(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);
      const user = await getRegisteredUser();

      if (!user) {
        setError("No account found. Please register first.");
        return;
      }

      if (user.email !== email.trim() || user.password !== password) {
        setError("Invalid email or password.");
        return;
      }

      setError("");
      await loginLocalSession();
      router.replace("/(tabs)");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                if (error) setError("");
              }}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                if (error) setError("");
              }}
              placeholder="Enter password"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            disabled={submitting}
            onPress={() => void handleLogin()}
            style={[styles.button, submitting && { opacity: 0.7 }]}
          >
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/(auth)/register")}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              No account? <Text style={styles.switchTextStrong}>Register</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
