import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsAndCondition(){
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe}>
        <View>
            <Text style={styles.textMain}>Terms And Condition</Text>
            <Text style={styles.textNormal}>By accessing or using this application, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the application.</Text>
            <Text style={styles.textMain}>Use of the Application</Text>
            <Text style={styles.textNormal}>You agree to use the application only for lawful purposes and in a way that does not violate any applicable laws or regulations. You must not misuse the application or attempt to gain unauthorized access to any part of the service.</Text>
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