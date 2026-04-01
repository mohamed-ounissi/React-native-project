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
  registerLocalUser,
  validateEmail,
  validatePassword,
} from "./utils";
import { useRedirectIfAuthenticated } from "@/hooks/use-auth-session";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useRedirectIfAuthenticated();

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (
      fullName.trim().length === 0 ||
      normalizedEmail.length === 0 ||
      password.trim().length === 0 ||
      confirmPassword.trim().length === 0
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters and include letters and numbers."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const existingUser = await getRegisteredUser();

      if (existingUser?.email === normalizedEmail) {
        setError("This email is already registered.");
        return;
      }

      await registerLocalUser({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
      });

      setError("");
      router.replace("/(auth)/login");
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
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Register to get started</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={fullName}
              onChangeText={(value) => {
                setFullName(value);
                if (error) setError("");
              }}
              placeholder="Your full name"
              placeholderTextColor={COLORS.placeholder}
              style={styles.input}
            />
          </View>

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

          <View style={styles.formGroup}>
            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={(value) => {
                setConfirmPassword(value);
                if (error) setError("");
              }}
              placeholder="Re-enter password"
              placeholderTextColor={COLORS.placeholder}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            disabled={submitting}
            onPress={() => void handleRegister()}
            style={[styles.button, submitting && { opacity: 0.7 }]}
          >
            <Text style={styles.buttonText}>Register</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace("/(auth)/login")}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              Already have an account?{" "}
              <Text style={styles.switchTextStrong}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
