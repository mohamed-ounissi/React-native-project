import { Text, View } from "react-native";

import { styles } from "./styles";

export function FooterSection() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Footer ©</Text>
    </View>
  );
}
