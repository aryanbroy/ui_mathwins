import { View, Text, StyleSheet } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function DailyCard() {
  return (
    <View style={styles.dailyCard}>
      <EvilIcons name="calendar" size={70} color="#FFF" style={styles.smallIconPlaceholder}/>

      {/* Right text block */}
      <View style={styles.dailyTextWrapper}>
        <Text style={styles.dailyTitle}>DAILY TOURNAMENT</Text>
        <Text style={styles.dailySubtitle}>Lorem Ipsum</Text>
        <Text style={styles.dailyReset}>Resets every day at 12:00AM</Text>
      </View>
    </View>
  );
}

const CARD_RADIUS = 18;

const styles = StyleSheet.create({
  dailyCard: {
    backgroundColor: '#FFB8CA', // softer pink
    borderRadius: CARD_RADIUS,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyIconPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#F46E8A',
    marginRight: 16,
    // TODO: replace with your SVG or Image
  },
  smallIconPlaceholder: {
    marginRight: 20,
  },
  dailyTextWrapper: {
    flex: 1,
  },
  dailyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5B2130',
  },
  dailySubtitle: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#5B2130',
  },
  dailyReset: {
    marginTop: 10,
    fontSize: 11,
    color: '#5B2130',
    opacity: 0.8,
  },
});
