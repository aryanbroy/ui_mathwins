import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicy(){
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe}>
        <View>
            <Text style={styles.textMain}>privacyPolicy</Text>
            <Text style={styles.textNormal}>Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your information when you use our application.</Text>
            <Text style={styles.textMain}>Information We Collect</Text>
            <Text style={styles.textNormal}>We may collect basic information such as your name, email address, profile details, and usage data to provide a better user experience. This information is collected only when necessary and with your consent.</Text>
            <Text style={styles.textNormal}>...</Text>
        </View>
    </SafeAreaView>
  )
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.bg,
      color: colors.text,
      padding: 10,
    },
    textMain: {
      fontSize: 20,
      paddingVertical: 10,
      fontWeight: 700,
      color: colors.text,
    },
    textNormal: {
      paddingVertical: 10,
      color: colors.text,
    }
  });