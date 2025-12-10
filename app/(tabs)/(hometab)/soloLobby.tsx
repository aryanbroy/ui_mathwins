import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { soloStart } from '@/lib/api/soloTournament';

export default function SoloScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function createSoloSession(){
    // loading = true
    // soloStart();
    // on success : setData -> loading = false -> navigate to soloQuestion
    // on fail : show 'try again'
    setLoading(true);
    await soloStart({userId: "cmiuilr020006fj3zecq1hhal"}).then(
      (res)=>{
        console.log("soloStart : ",res);
        const sanitizedAttemp = {
          userId: res.sanitizedAttemp.userId,
          soloSessionId: res.sanitizedAttemp.id,
        }
        navigation.navigate('SoloQuestion', { session: sanitizedAttemp, sanitizedQuestion : res.sanitizedQuestion });
      }
    ).catch();
  }

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
        onPress={createSoloSession}
        // onPress={async () => {
        //   navigation.navigate('SoloQuestion');
        // }}
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
