import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  getRegisteredUser,
  registerLocalUser,
  validateEmail,
  StoredUser,
} from "../(auth)/utils";

export default function ProfileTabScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fullNameDraft, setFullNameDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const existingUser = await getRegisteredUser();
        setUser(existingUser);
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    void loadUser();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!isEditing) return;

    setFullNameDraft(user.fullName);
    setEmailDraft(user.email);
  }, [isEditing, user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.helperText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error ?? "No local user found."}</Text>
        <Pressable
          style={styles.retryButton}
          onPress={() => router.replace("/(auth)/login")}
        >
          <Text style={styles.retryButtonText}>Go to login</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const initial = user.fullName?.trim()?.[0]?.toUpperCase() ?? "U";

  const startEdit = () => {
    setSaveError(null);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setSaveError(null);
    setIsEditing(false);
  };

  const applyChanges = async () => {
    if (!user) return;

    const nextFullName = fullNameDraft.trim();
    const normalizedEmail = emailDraft.trim().toLowerCase();

    if (nextFullName.length === 0) {
      setSaveError("Full name is required.");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setSaveError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);
      setSaveError(null);

      await registerLocalUser({
        fullName: nextFullName,
        email: normalizedEmail,
        password: user.password,
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              fullName: nextFullName,
              email: normalizedEmail,
            }
          : prev,
      );

      setIsEditing(false);
    } catch {
      setSaveError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>

          <View style={styles.heroText}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Account Details</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Full name</Text>
              <Text style={styles.rowValue}>{user.fullName}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Email</Text>
              <Text style={styles.rowValue}>{user.email}</Text>
            </View>

            {!isEditing ? (
              <Pressable style={styles.primaryButton} onPress={startEdit}>
                <Text style={styles.primaryButtonText}>Edit</Text>
              </Pressable>
            ) : (
              <View style={styles.editBlock}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Full name</Text>
                  <TextInput
                    value={fullNameDraft}
                    onChangeText={setFullNameDraft}
                    style={styles.input}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Email</Text>
                  <TextInput
                    value={emailDraft}
                    onChangeText={setEmailDraft}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                {saveError ? (
                  <Text style={styles.saveErrorText}>{saveError}</Text>
                ) : null}

                <View style={styles.editButtonsRow}>
                  <Pressable
                    style={[styles.secondaryButton, saving && { opacity: 0.7 }]}
                    onPress={cancelEdit}
                    disabled={saving}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </Pressable>

                  <Pressable
                    style={[styles.primaryButton, saving && { opacity: 0.7 }]}
                    onPress={() => void applyChanges()}
                    disabled={saving}
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.primaryButtonText}>Save</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  helperText: {
    marginTop: 10,
    fontSize: 14,
    color: "#475467",
  },
  errorText: {
    fontSize: 16,
    color: "#B42318",
    marginBottom: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#111827",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  heroCard: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAECF0",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3538CD",
  },
  heroText: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#475467",
  },
  card: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EAECF0",
    padding: 18,
    gap: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 10,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#344054",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
  },
  rowLabel: {
    flex: 1,
    color: "#475467",
    fontSize: 13,
    fontWeight: "600",
  },
  rowValue: {
    flex: 1,
    color: "#101828",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "right",
  },
  editBlock: {
    marginTop: 10,
  },
  field: {
    marginTop: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475467",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#EAECF0",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#101828",
  },
  saveErrorText: {
    marginTop: 10,
    color: "#B42318",
    fontSize: 13,
    fontWeight: "600",
  },
  editButtonsRow: {
    marginTop: 14,
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  primaryButton: {
    backgroundColor: "#111827",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
  },
  secondaryButtonText: {
    color: "#344054",
    fontWeight: "800",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
});
