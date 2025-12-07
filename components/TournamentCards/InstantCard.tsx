import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CardTexture1 from '../Texture/CardTexture';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import { CardProps } from '@/types/cardProps.types';

export default function InstantCard({ onPress }: CardProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardWrapper}>
      <LinearGradient
        colors={colors.gradients.muted}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.smallCard}>
          <CardTexture1></CardTexture1>
          {/* Icon placeholder */}
          <Ionicons
            name="sparkles-sharp"
            size={30}
            color={colors.textHighlight}
            style={styles.smallIconPlaceholder}
          />
          <Text style={styles.smallTitle}>QUICK</Text>
          <Text style={styles.smallTitle}>TOURNAMENT</Text>
          <Text style={styles.smallReset}>Resets in: 20min 10 sec</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const CARD_RADIUS = 16;
const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    cardWrapper: {
      flex: 1,
      borderRadius: CARD_RADIUS,
      overflow: 'hidden',
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallCard: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    smallIconPlaceholder: {
      marginBottom: 10,
    },
    smallTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.textOnPrimary,
      textAlign: 'center',
    },
    smallReset: {
      marginTop: 12,
      fontSize: 10,
      color: colors.textOnPrimary,
      opacity: 0.85,
      textAlign: 'center',
    },
  });
