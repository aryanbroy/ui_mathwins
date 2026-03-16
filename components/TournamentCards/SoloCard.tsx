import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import CardTexture1 from '../Texture/CardTexture';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import { CardProps } from '@/types/cardProps.types';
import { Image } from 'expo-image';

export default function SoloCard({ onPress }: CardProps) {
  const {colors} = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const logoSource = require("@/assets/images/index/soloTournament_logo.png");
  
  return (
    <TouchableOpacity
    onPress={onPress}
    style={{
      overflow: "hidden",
      flex: 1,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.divider
    }}
    >
      <LinearGradient
        colors={colors.gradients.muted}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}
        style={styles.gredient}
      >
      <View style={styles.smallCard}>
        <CardTexture1></CardTexture1>
        {/* Icon placeholder */}
        {/* <FontAwesome5 name="user" size={30} color={colors.textHighlight} style={styles.smallIconPlaceholder}/> */}
        <Image 
        source={logoSource} 
        style={styles.avatarImage} 
        contentFit="contain"/>
        <Text style={styles.smallTitle}>SOLO</Text>
        <Text style={styles.smallTitle}>TOURNAMENT</Text>
        <Text style={styles.smallReset}>Resets every day at 12:00AM</Text>
      </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gredient: {
      flex: 1
    },
    smallCard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: "center",
      overflow: "hidden",
    },
    avatarImage: {
      marginHorizontal: 20,
      height: 40,
      width: 40,
      marginBottom: 10,
    },
    smallIconPlaceholder: {
      marginBottom: 5,
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
