import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import { View, StyleSheet } from 'react-native';
export default function CardTexture() {
  const {colors} = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return (
    <View style={styles.page}>
      <View style={styles.upCircles}>
          <View style={styles.outerCircle2}>
            <View style={styles.outerCircle1}>
              <View style={styles.centerCircle}></View>
            </View>
          </View>
      </View>
      <View style={styles.bottomCircles}>
        <View style={styles.outerCircle2}>
          <View style={styles.centerCircle}></View>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    page: {
      opacity: 0.5,
    },
    upCircles: {
      position: 'absolute',
      left: 5,
      top: -85,
    },
    centerCircle: {
      width: 50,
      height: 50,
      backgroundColor: colors.cardTexture.bg1,
      borderRadius: '100%',
      margin: 25,
    },
    outerCircle1: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardTexture.bg2,
      borderRadius: '100%',
      margin: 20,
    },
    outerCircle2: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.cardTexture.bg3,
      borderRadius: '100%',
    },
    bottomCircles: {
      position: "absolute",
      backgroundColor: "transparent",
      left: -130,
      top: 60,
    }
  });
