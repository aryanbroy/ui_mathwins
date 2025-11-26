import { View, Text, StyleSheet } from 'react-native';

export default function InstantCard() {
  return (
    <View style={styles.smallCard}>
      {/* Icon placeholder */}
      <View style={styles.smallIconPlaceholder} />
      <Text style={styles.smallTitle}>QUICK</Text>
      <Text style={styles.smallTitle}>TOURNAMENT</Text>
      <Text style={styles.smallReset}>Resets in: 20min 10 sec</Text>
    </View>
  );
}

const CARD_RADIUS = 16;
const styles = StyleSheet.create({
  smallCard: {
    flex: 1,
    backgroundColor: '#FFC6D3',
    borderRadius: CARD_RADIUS,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  smallIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#F46E8A',
    marginBottom: 10,
    // TODO: replace with your SVG or Image
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
