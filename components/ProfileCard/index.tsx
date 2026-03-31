import { Image } from "expo-image";
import { Alert, Platform, Pressable, Text, View } from "react-native";

import { styles } from "./styles";

type ProfileCardProps = {
  name: string;
};

export function ProfileCard({ name }: ProfileCardProps) {
  const handlePress = () => {
    if (Platform.OS === "web") {
      window.alert("Hello world");
      return;
    }

    Alert.alert("Hello", "Hello world");
  };

  return (
    <View style={styles.card}>
      <View style={styles.avatarPlaceholder}>
        <Image
          source={require("../../assets/images/profile.jpg")}
          style={styles.avatarImage}
        />
      </View>

      <Text style={styles.name}>{name}</Text>

      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>View Profile</Text>
      </Pressable>
    </View>
  );
}
