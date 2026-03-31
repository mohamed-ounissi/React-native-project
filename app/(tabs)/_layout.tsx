import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { Alert, Pressable, View, StyleSheet } from "react-native";
import { useState } from "react";
import { LayoutMode, LayoutModeContext } from "@/contexts/layout-mode-context";

export default function TabsLayout() {
  const [mode, setMode] = useState<LayoutMode>("cards");

  const handleDisconnect = () => {
    Alert.alert("Disconnect", "Are you sure you want to disconnect?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Disconnect",
        style: "destructive",
        onPress: () => router.replace("/(auth)/login"),
      },
    ]);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "cards" ? "grid" : "cards"));
  };

  return (
    <LayoutModeContext.Provider value={{ mode, toggleMode }}>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: "#111827",
          headerRight: () => (
            <View style={styles.headerActions}>
              <Pressable onPress={toggleMode} style={styles.iconButton}>
                <Ionicons
                  name={mode === "cards" ? "grid-outline" : "list-outline"}
                  size={18}
                  color="#475467"
                />
              </Pressable>
              <Pressable
                onPress={handleDisconnect}
                style={[styles.iconButton, styles.disconnectButton]}
              >
                <Ionicons name="log-out-outline" size={18} color="#B42318" />
              </Pressable>
            </View>
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </LayoutModeContext.Provider>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    marginRight: 12,
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F2F4F7",
  },
  disconnectButton: {
    backgroundColor: "#FEE4E2",
  },
});
