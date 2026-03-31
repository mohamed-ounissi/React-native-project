import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { Alert, Pressable, Text, StyleSheet } from "react-native";

export default function TabsLayout() {
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

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#111827",
        headerRight: () => (
          <Pressable onPress={handleDisconnect} style={styles.disconnectButton}>
            <Text style={styles.disconnectText}>Disconnect</Text>
          </Pressable>
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
  );
}

const styles = StyleSheet.create({
  disconnectButton: {
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FEE4E2",
  },
  disconnectText: {
    color: "#B42318",
    fontWeight: "700",
    fontSize: 12,
  },
});
