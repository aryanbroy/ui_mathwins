import BackgroundTexture from '@/components/BackgroundTexture';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';

export default function Rewards() {
  return (
    <LinearGradient
      colors={["#6315FF", "#FFCCD7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View>
        <BackgroundTexture></BackgroundTexture>
        <Text>Rewards Tab</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    gradient: {
      flex: 1,
    }
});
