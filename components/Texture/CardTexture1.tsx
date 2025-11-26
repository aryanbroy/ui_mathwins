import React from 'react';
import { View, StyleSheet } from 'react-native';
export default function CardTexture1() {

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

const styles = StyleSheet.create({
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
    backgroundColor: '#ffb3b3ff',
    borderRadius: '100%',
    margin: 25,
  },
  outerCircle1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD6DD',
    borderRadius: '100%',
    margin: 20,
  },
  outerCircle2: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: '100%',
  },
  bottomCircles: {
    position: "absolute",
    backgroundColor: "transparent",
    left: -130,
    top: 60,
  }
});
