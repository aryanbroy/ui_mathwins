import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';

export default function SoloScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const attempLeft = 3;
  return (
    <View style={styles.container}>
      <>
        <Text style={styles.attemptsText}>
          {/* Daily tournament attempts left: {maxAttempts - attemptsLeft} */}
          Solo tournament attempts left : {attempLeft}
        </Text>
        <View>
          {/* Keypad */}
        </View>
        <TouchableOpacity 
        style={styles.startBtn} 
        onPress={() => navigation.navigate('SoloQuestion')}
        >
          <Text style={styles.startBtnText}>Start game</Text>
        </TouchableOpacity>
      </>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
    },
    attemptsText: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 12,
    },
    startBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    startBtnText: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 700,
    }
  });
