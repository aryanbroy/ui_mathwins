import BackgroundTextTexture from '@/components/Texture/BackgroundTextTexture';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';

export default function Rewards() {
  return (
    <LinearGradient
      colors={["#6315FF", "#FFCCD7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <View>
        <BackgroundTextTexture></BackgroundTextTexture>
        <Text></Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    }
});
