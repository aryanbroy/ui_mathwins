import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  onPress: () => void;
};

export default function DailyCard({ onPress }: Props) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={colors.gradients.muted}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.dailyCard}>
          {/* Icon */}
          <EvilIcons
            name="calendar"
            size={70}
            color={colors.textOnPrimary}
            style={styles.smallIcon}
          />

          {/* Right text block */}
          <View style={styles.dailyTextWrapper}>
            <Text style={styles.dailyTitle}>DAILY TOURNAMENT</Text>
            <Text style={styles.dailySubtitle}>Lorem Ipsum</Text>
            <Text style={styles.dailyReset}>Resets every day at 12:00AM</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const CARD_RADIUS = 20;
const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    dailyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      overflow: 'hidden',
    },
    gradient: {
      flex: 1,
      borderRadius: CARD_RADIUS,
      padding: 16,
      marginBottom: 16,
    },
    smallIcon: {
      marginRight: 20,
    },

    dailyTextWrapper: {
      flex: 1,
    },
    dailyTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.textOnPrimary,
    },
    dailySubtitle: {
      marginTop: 6,
      fontSize: 14,
      fontWeight: '500',
      color: colors.textOnPrimary,
    },
    dailyReset: {
      marginTop: 10,
      fontSize: 11,
      color: colors.textOnPrimary,
      opacity: 0.85,
    },
  });
