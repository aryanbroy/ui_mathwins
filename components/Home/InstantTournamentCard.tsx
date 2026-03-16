import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { TournamentStatus } from '@/types/api/instant';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
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
  function handleClick(){
    onPress();
  }
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  
  return (

    <TouchableOpacity
      style={[styles.card, status === 'CLOSED' && styles.closed]}
      onPress={handleClick}
      disabled={status === 'CLOSED'}
    >
      <LinearGradient
        colors={colors.gradients.muted}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
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
      </LinearGradient>

    </TouchableOpacity>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
  card: {
    // borderRadius: 12,
    // marginBottom: 12,
  },
  closed: {
    opacity: 0.6,
  },
  gradient: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  status: {
    color: colors.text,
    fontSize: 12,
    fontWeight: 600,
  },
  text: {
    color: colors.text,
    marginTop: 4,
  },
  footer: {
    marginTop: 12,
  },
  cta: {
    color: colors.primary,
    fontWeight: '600',
  },
});
