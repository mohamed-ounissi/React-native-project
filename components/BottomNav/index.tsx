import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { styles } from "./styles";

const tabs = ["Home", "Profile", "Settings"];

export function BottomNav() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;

        return (
          <TouchableOpacity
            key={tab}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
