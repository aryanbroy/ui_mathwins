import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  rank: number;
  name: string;
  points: number;
  medalColor: string;
};

const medalBg: Record<string, string> = {
  gold: '#FFC727',
  silver: '#BFC4CC',
  bronze: '#F29B3A',
};

export default function LeaderboardCard({
  rank,
  name,
  points,
  medalColor,
}: Props) {
  return (
    <View style={styles.card}>
      {/* Rank circle */}
      <View style={styles.rankCircle}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar} />
      </View>

      {/* Name + points */}
      <View style={styles.textWrapper}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.points}>{points} OVERALL POINTS</Text>
      </View>

      {/* Medal */}
      <View
        style={[styles.medalWrapper, { backgroundColor: medalBg[medalColor] }]}
      >
        <Text style={styles.medalIcon}>👑</Text>
      </View>
    </View>
  );
}

const CARD_RADIUS = 22;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: CARD_RADIUS,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

    // soft shadow (iOS + Android)
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },

  rankCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D0D4E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#707585',
  },

  avatarWrapper: {
    marginRight: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#C956FF', // placeholder; replace with Image
  },

  textWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#13152B',
  },
  points: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
    color: '#9BA0B3',
  },

  medalWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medalIcon: {
    fontSize: 22,
  },
});
