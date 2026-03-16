import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CardTexture1 from '../Texture/CardTexture';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import { CardProps } from '@/types/cardProps.types';
import { Image } from 'expo-image';

export default function InstantCard({ onPress }: CardProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const logoSource = require("@/assets/images/index/instantTournament_logo.png");

  return (
    <TouchableOpacity onPress={onPress} style={styles.cardWrapper}>
      <LinearGradient
        colors={colors.gradients.muted}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.smallCard}>
          <CardTexture1></CardTexture1>
          {/* Icon placeholder */}
          {/* <Ionicons
            name="sparkles-sharp"
            size={30}
            color={colors.textHighlight}
            style={styles.smallIconPlaceholder}
          /> */}
          <Image 
          source={logoSource} 
          style={styles.avatarImage} 
          contentFit="contain"/>
          <Text style={styles.smallTitle}>INSTANT</Text>
          <Text style={styles.smallTitle}>TOURNAMENT</Text>
          <Text style={styles.smallReset}>Resets every day at 12:00AM</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const CARD_RADIUS = 16;
const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    cardWrapper: {
      overflow: "hidden",
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.divider
    },
    gradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarImage: {
      marginHorizontal: 20,
      height: 40,
      width: 40,
      marginBottom: 10,
    },
    smallCard: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
    },
    smallIconPlaceholder: {
    },
    smallTitle: {
      fontSize: 14,
      // fontWeight: '800',
      marginTop: -5,
      fontFamily: 'Saira-SemiBold',
      color: colors.textOnPrimary,
      textAlign: 'center',
    },
    smallReset: {
      marginTop: 5,
      fontSize: 8,
      color: colors.textOnPrimary,
      fontFamily: 'Poppins-Medium',
      opacity: 0.85,
      textAlign: 'center',
    },
  });
