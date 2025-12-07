import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';

export default function SoloScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  
  const exp = "2345 + 2345";
  const question = `2nd integer from left for expresion ${exp}`;
  return (
    <View style={styles.container}>
      <>
        <View style={styles.questionBox}>
          {/* Daily tournament attempts left: {maxAttempts - attemptsLeft} */}
          <Text style={styles.question}>
            Google Ad Here
          </Text>
        </View>

        <TouchableOpacity
        onPress={() => navigation.navigate('SoloQuestion')}
        style={styles.startBtn}
        >
          <Text style={styles.startBtnText}>Skip</Text>
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
    questionBox: {

    },
    question: {

    },
    startBtn: {
            marginTop: 20,
            backgroundColor: colors.primary,
            paddingVertical: 14,
            paddingHorizontal: 32,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            alignSelf: 'center',
        },
        startBtnText: {
            color: colors.text,
            fontSize: 20,
            fontWeight: 700,
        }
    });
