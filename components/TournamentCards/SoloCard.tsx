import { View, Text, StyleSheet } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CardTexture1 from '../Texture/CardTexture1';

export default function SoloCard() {
  return (
    <View style={styles.smallCard}>
      <CardTexture1></CardTexture1>
      {/* Icon placeholder */}
      <FontAwesome5 name="user" size={30} color="#FFF" style={styles.smallIconPlaceholder}/>
      <Text style={styles.smallTitle}>SOLO</Text>
      <Text style={styles.smallTitle}>TOURNAMENT</Text>
      <Text style={styles.smallReset}>Resets in: 20min 10 sec</Text>
    </View>
  );
}

const CARD_RADIUS = 16;
const styles = StyleSheet.create({
  smallCard: {
    flex: 1,
    paddingVertical: 20,
    backgroundColor: '#FFD6DD',
    borderRadius: CARD_RADIUS,
    alignItems: 'center',
    justifyContent: "center",
    overflow: "hidden"
  },
  smallIconPlaceholder: {
    marginBottom: 10,
  },
  smallTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5B2130',
    textAlign: 'center',
  },
  smallReset: {
    marginTop: 12,
    fontSize: 10,
    color: '#5B2130',
    opacity: 0.85,
    textAlign: 'center',
  },
});
