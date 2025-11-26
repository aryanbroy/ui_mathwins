import { StyleSheet, Text, View } from 'react-native';
import DailyCard from './DailyCard';
import SoloCard from './SoloCard';
import InstantCard from './InstantCard';
import { LinearGradient } from 'expo-linear-gradient';

export default function TournamentCards() {
  return (
    <View style={styles.container}>
      <View style={styles.lifelineCard}>
        <LinearGradient
          colors={['#FFA3B7', '#FFC0C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.lifelineLabel}>
            Lifelines- <Text style={styles.lifelineValue}>10/10</Text>
            <Text style={styles.lifelineSubText}>Lorem Ipsum dolor sit</Text>
          </Text>
        </LinearGradient>
      </View>
      <DailyCard />
      <View style={styles.bottomRow}>
        <SoloCard />
        <InstantCard />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  gradient: {
    flex: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  lifelineCard: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  lifelineLabel: {
    flex: 1,
    alignItems: "center",
    fontSize: 16,
    fontWeight: '600',
    color: '#4A1B2F',
  },
  lifelineValue: {
    fontWeight: '600',
  },
  lifelineSubText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#4A1B2F',
    opacity: 0.8,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
});
