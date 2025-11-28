import { View, Text, StyleSheet } from 'react-native';
import CardTexture1 from '../Texture/CardTexture';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';

export default function InstantCard() {
  const {colors} = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <LinearGradient
      colors={colors.gradients.muted}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gredient}
    >
      <View style={styles.smallCard}>
        <CardTexture1></CardTexture1>
        {/* Icon placeholder */}
        <Ionicons name="sparkles-sharp" size={30} color={colors.textHighlight} style={styles.smallIconPlaceholder}/>
        <Text style={styles.smallTitle}>QUICK</Text>
        <Text style={styles.smallTitle}>TOURNAMENT</Text>
        <Text style={styles.smallReset}>Resets in: 20min 10 sec</Text>
      </View>
    </LinearGradient>
  );
}

const CARD_RADIUS = 16;
const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gredient: {
      overflow: "hidden",
      flex: 1,
      borderRadius: CARD_RADIUS,
    },
    smallCard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: "center",
      overflow: "hidden",
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
