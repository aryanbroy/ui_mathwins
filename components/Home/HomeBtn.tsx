import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

type BtnProps = {
  onPress: (event: GestureResponderEvent) => void;
};

export default function HomeBtn({ onPress }: BtnProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>VIEW FULL LEADERBOARD</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    wrapper: {
      width: '100%',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 8,
    },

    button: {
      backgroundColor: colors.bg,
      paddingVertical: 10,
      paddingHorizontal: 22,
      borderRadius: 10,

      // soft shadow like your screenshot
      elevation: 4, // Android
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },

    text: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary, // violet/purple like your UI
    },
  });
