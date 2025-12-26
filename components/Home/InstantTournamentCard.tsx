import { TournamentStatus } from '@/types/api/instant';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type InstantTournamentCardProps = {
  // tournamentId: string;
  joinedCount: number;
  maxPlayers: number;
  expiresAt: Date;
  status: TournamentStatus;
  onPress: () => void;
};

export function InstantTournamentCard({
  joinedCount,
  maxPlayers,
  expiresAt,
  status,
  onPress,
}: InstantTournamentCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, status === 'CLOSED' && styles.closed]}
      onPress={onPress}
      disabled={status === 'CLOSED'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Instant Tournament</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      <Text style={styles.text}>
        Players: {joinedCount} / {maxPlayers}
      </Text>

      <Text style={styles.text}>
        Ends at: {new Date(expiresAt).toLocaleTimeString()}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.cta}>
          {status === 'OPEN' ? 'View Leaderboard →' : 'Tournament Closed'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  closed: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    color: '#aaa',
    fontSize: 12,
  },
  text: {
    color: '#ccc',
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
  },
  cta: {
    color: '#4da6ff',
    fontWeight: '600',
  },
});
