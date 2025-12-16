import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { continueSolo } from '@/lib/api/soloTournament';
import { quitSolo } from '@/lib/api/soloTournament';

type continueParams = {
  userId: string;
  soloSessionId: string;
};

export default function roundOverview() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [disableSkip, setDisableSkip] = useState(false);
  const route = useRoute<any>();
  const sessionDetails = route.params.sessionDetails as continueParams;
  console.log("roundOverview : ",sessionDetails);

  function handleQuit(){
    console.log("Quit Clicked");
    // navigation.navigate('HomeMain');
      const payload = {
      userId: sessionDetails.userId,
      soloSessionId: sessionDetails.soloSessionId,
    }
    quitSolo(payload)
      .then((response)=>{
        console.log("response continue : ",response);
        navigation.navigate('HomeMain');
      }).catch((err)=>{
        console.log(err);
      });
  }
  function handleContinue(){
    console.log("Continue Clicked");
    const payload = {
      userId: sessionDetails.userId,
      soloSessionId: sessionDetails.soloSessionId,
    }
    continueSolo(payload)
      .then((response)=>{
        console.log("response continue : ",response);
        navigation.navigate('SoloQuestion',{ session: sessionDetails, sanitizedQuestion : response.questions })
      }).catch((err)=>{
        console.log(err);
      });
  }

  return (
    <LinearGradient 
    colors={colors.gradients.background}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.container}>
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
        <>
          <View>
            <Text style={styles.message}>
              Your Score
            </Text>
            <Text style={styles.messageHighlight}>
              7.9
            </Text>
            <Text style={styles.messageSecondary}>
              This will be converted to coins when leaderboard gets generated.
            </Text>
          </View>

          <View style={styles.buttonBox}>
            <TouchableOpacity
            // disabled={disableSkip}
            onPress={handleQuit}
            style={styles.startBtn}
            >
                <Text style={styles.startBtnText}>Quit</Text>
            </TouchableOpacity>
            <TouchableOpacity
            onPress={handleContinue}
            style={styles.startBtn}
            >
                <Text style={styles.startBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </>
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
    StyleSheet.create({
    container: {
      flex:1,
      padding: 16,
    },
    safe: {
      padding: 10,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    box: {
      width: "100%",
      borderRadius: 10,
      paddingVertical: 40,
      paddingHorizontal: 40,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg,
    },
    message: {
      color:colors.text,
      fontSize: 20,
      textAlign: "center",
    },
    messageHighlight: {
      textAlign: "center",
      color:colors.warning,
      fontSize: 40,
      fontWeight: 700,
    },
    messageSecondary: {
      fontSize: 10,
      color:colors.textMuted,
      textAlign: "center",
    },
    buttonBox: {
      width: "100%",
      marginTop: 40,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    startBtn: {
      backgroundColor: colors.border,
      paddingVertical: 14,
      paddingHorizontal: 20 ,
      borderRadius: 12,
    },
    startBtnText: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 700,
    }
    });
