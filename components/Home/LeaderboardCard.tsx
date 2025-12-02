import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';

type Props = {
  rank: number;
  name: string;
  points: number;
  medalColor: string | null;
};

const medalBg: Record<string, string> = {
  gold: '#ffc115',
  silver: '#BFC4CC',
  bronze: '#c16700',
};

export default function LeaderboardCard({
  rank,
  name,
  points,
  medalColor,
}: Props) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.card}>
      {/* Rank Circle */}
      <View style={styles.rankCircle}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar} />
      </View>

      {/* Name + Points */}
      <View style={styles.textWrapper}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.points}>{points} OVERALL POINTS</Text>
      </View>

      {/* Medal */}
      <View
        style={[
          styles.medalWrapper,
          { backgroundColor: medalColor ? medalBg[medalColor] : '' },
        ]}
      >
        <MaterialCommunityIcons name="crown" size={32} color="#FFF" />
      </View>
    </View>
  );
}

const CARD_RADIUS = 22;
const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: CARD_RADIUS,
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 3,
    },

    rankCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    rankText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.textMuted,
    },

    avatarWrapper: {
      marginRight: 12,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },

    textWrapper: {
      flex: 1,
    },
    name: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    points: {
      marginTop: 4,
      fontSize: 11,
      fontWeight: '500',
      color: colors.textMuted,
    },

    medalWrapper: {
      width: 48,
      height: 48,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

