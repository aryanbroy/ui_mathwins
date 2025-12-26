import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { continueSolo } from '@/lib/api/soloTournament';
import { quitSolo } from '@/lib/api/soloTournament';
import LeaderboardCard from '@/components/Home/LeaderboardCard';

type continueParams = {
  userId: string;
  soloSessionId: string;
};

export default function roundOverview() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [ showScore, setShowScore ] = useState(false);
  const route = useRoute<any>();
  const dummyUsers = [
  {
    rank: 1,
    name: 'UjwalXMathwins',
    points: 1850,
    medalColor: 'gold',
  },
  {
    rank: 2,
    name: 'AbhilXMathwins',
    points: 1620,
    medalColor: 'silver',
  },
  {
    rank: 3,
    name: 'RahulXMathwins',
    points: 1510,
    medalColor: 'bronze',
  },
  {
    rank: 4,
    name: 'AdityaXMathwins',
    points: 1450,
    medalColor: null,
  },
  {
    rank: 5,
    name: 'SnehaXMathwins',
    points: 1380,
    medalColor: null,
  }];
  const sessionDetails = route.params.sessionDetails as continueParams;
  // const [ sessionDetails, setSessionDetails ] = useState({
  //   userId: "787878787878",
  //   soloSessionId: "4545454545",
  // });
  console.log("roundOverview : ",sessionDetails);

  function handleQuit(){
    console.log("Quit Clicked");
    // navigation.navigate('HomeMain');
    const payload = {
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
      soloSessionId: sessionDetails.soloSessionId,
    }
    continueSolo(payload)
      .then((response)=>{
        console.log("response continue : ",response);
        navigation.navigate('Question',{ session: sessionDetails, sanitizedQuestion : response.questions })
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
      <View style={styles.adArea1}>
        ad here
      </View>
      <View style={styles.box}>
        <View style={styles.leaderBoardBox}>
          {dummyUsers.map((u) => (
            <LeaderboardCard key={`all-${u.rank}`} {...u} />
          ))}
        </View>

        <View>
          {
            showScore ? 
            <View>

            </View> :
            <View style={styles.scoreBox}>
              <Text style={styles.scoreMessage}>Your Current Score</Text>
              <Text style={styles.score}>7.85</Text>
            </View>
          }
        </View>
        <View style={styles.buttonBox}>
          <TouchableOpacity
          // disabled={disableSkip}
          onPress={handleQuit}
          style={styles.btn}
          >
              <Text style={styles.btnText}>Quit</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={handleContinue}
          style={styles.btn}
          >
              <Text style={styles.btnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.adArea2}>
        ad here
      </View>
    </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
    StyleSheet.create({
    container: {
      flex:1,
    },
    safe: {
      paddingVertical: 20,
      paddingHorizontal: 20,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
    },
    box: {
      width: "100%",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg,
    },
    leaderBoardBox: {
      paddingVertical: 20,
    },
    scoreBox: {
      flex: 1,
      alignItems: "center",
    },
    scoreMessage: {
      fontSize: 20,
      fontWeight: 700,
      color: colors.text,
    },
    score: {
      fontSize: 40,
      fontWeight: 900,
      color: colors.secondary,
    },
    buttonBox: {
      width: "100%",
      marginTop: 20,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 20,
    },
    btn: {
      backgroundColor: colors.secondary,
      paddingVertical: 14,
      paddingHorizontal: 20 ,
      borderRadius: 12,
    },
    btnText: {
      color: colors.surface,
      fontSize: 20,
      fontWeight: 700,
    },
    adArea1: {
      marginBottom: 10,
      backgroundColor: "#a1a1a1",
      width: "100%",
      height: 50,
    },
    adArea2: {
      marginTop: 10,
      backgroundColor: "#a1a1a1",
      width: "100%",
      height: 200,
    }
    });
