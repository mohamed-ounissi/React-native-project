import { Text, View } from "react-native";

import { styles } from "./styles";

export function HeaderSection() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Flex Layout</Text>
      <Text style={styles.headerSubtitle}>Header / Content / Footer</Text>
    </View>
  );
}
