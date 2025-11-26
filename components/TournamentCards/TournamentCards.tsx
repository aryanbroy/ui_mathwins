import { StyleSheet, Text, View } from 'react-native';
import DailyCard from './DailyCard';
import SoloCard from './SoloCard';
import InstantCard from './InstantCard';

export default function TournamentCards() {
  return (
    <View style={styles.container}>
      <View style={styles.lifelineCard}>
        <Text style={styles.lifelineLabel}>
          Lifelines- <Text style={styles.lifelineValue}>10/10</Text>
        </Text>
        <Text style={styles.lifelineSubText}>Lorem Ipsum dolor sit</Text>
      </View>
      <DailyCard />
      <View style={styles.bottomRow}>
        <SoloCard />
        <InstantCard />
      </View>
    </View>
  );
}

const CARD_RADIUS = 10;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  lifelineCard: {
    backgroundColor: '#FF99B4', // light pink
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  lifelineLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A1B2F',
  },
  lifelineValue: {
    fontWeight: '600',
  },
  lifelineSubText: {
    marginLeft: 12,
    fontSize: 12,
    color: '#4A1B2F',
    opacity: 0.8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
