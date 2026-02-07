import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Contactus(){
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safe}>
        <View>
            <Text style={styles.title}>Contact Us</Text>
            <View style={styles.field}>
                <Text style={styles.textMain}>Email : </Text>
                <Text style={styles.textNormal}>demoemail@gmail.com</Text>
            </View>
            <View style={styles.field}>
                <Text style={styles.textMain}>Phone : </Text>
                <Text style={styles.textNormal}>+91 1234567890</Text>
            </View>
            <View>
                <Text style={styles.textMain}>Address : </Text>
                <Text style={styles.textNormal}>Plot - 12, demoStreet</Text>
                <Text style={styles.textNormal}>Cityname, 0x0x0x</Text>
            </View>
            
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
    title: {
        fontSize: 20,
        fontWeight: 700,
        paddingBottom:20,
        color: colors.text,
    },
    textMain: {
        fontWeight: 700,
        color: colors.text,
    },
    textNormal: {
      color: colors.text,
    },
    field:{
        flexDirection:'row',
    }
  });