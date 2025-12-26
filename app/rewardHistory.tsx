import { ScrollView, Text, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import RewardCard from "../components/RewardCard"

export default function rewardHistory(){
    const { colors } = useAppTheme();
    const styles = React.useMemo(() => makeStyles(colors), [colors]);
    return (
        <LinearGradient
            colors={[colors.gradients.surface[1], colors.gradients.surface[0]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient}
        >
          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <SafeAreaView style={styles.safe}>
            <View>
              <Text>rewardHistory</Text>
              <View>
                {[1,2,3,4,5].map((i)=>(
                  <View style={{marginVertical: 10}}>
                      <RewardCard key={i}/>
                  </View>
                ))}
              </View>
            </View>
          </SafeAreaView>
          </ScrollView>
        </LinearGradient>
    )
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gradient: {
      width: "100%",
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    safe: {
      width: "100%",
      padding: 10,
      color: colors.text,
    },
  });