import { ScrollView, Text, View } from "react-native";

import { styles } from "./styles";

const staticItems = [
  "Item 1: Learn View and Text",
  "Item 2: Build a card layout",
  "Item 3: Style with StyleSheet",
  "Item 4: Use props for dynamic data",
  "Item 5: Add button interactions",
  "Item 6: Practice Flexbox sections",
  "Item 7: Test on mobile and web",
  "Item 8: Refactor into components",
];

export function StaticItemList() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {staticItems.map((item) => (
          <View key={item} style={styles.item}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
