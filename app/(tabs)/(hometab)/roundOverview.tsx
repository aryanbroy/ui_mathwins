import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { continueSolo } from '@/lib/api/soloTournament';
import { quitSolo } from '@/lib/api/soloTournament';
import LeaderboardCard from '@/components/Home/LeaderboardCard';
import { parseApiError } from '@/lib/api/parseApiError';

export enum SessionType {
  SOLO = 'solo',
  DAILY = 'daily',
}

type continueParams = {
  userId: string;
  sessionId: string;
  bankedPoint: number;
};

export default function roundOverview() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [ showScore, setShowScore ] = useState(false);
  const [showGif, setShowGif] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

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
  const sessionDetails = route.params.params as continueParams;
  // const [ sessionDetails, setSessionDetails ] = useState({
  //   bankedPoint: 4,
  //   userId: "787878787878",
  //   soloSessionId: "4545454545",
  // });
  console.log("roundOverview : ",sessionDetails);
  // setInterval(()=>{
  //   setShowGif(false);
  // },2000)
  useEffect(() => {
    // Show GIF for 2.5 seconds
    const gifTimer = setTimeout(() => {
      setShowGif(false);
      setShowScore(true);
      
      // Animate score reveal
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2500);

    return () => clearTimeout(gifTimer);
  }, []);

  function handleQuit(){
    console.log("Quit Clicked");
    // navigation.navigate('HomeMain');
    const payload = {
      sessionId: sessionDetails.sessionId,
      sessionType: SessionType.SOLO,
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
      sessionType: SessionType.SOLO,
      sessionId: sessionDetails.sessionId,
    }
    console.log("continue : ",payload);
    
    continueSolo(payload)
      .then((response)=>{
        console.log("response continue : ",response);
        navigation.navigate('Question',{ session: sessionDetails, sanitizedQuestion : response.data.questions })
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
        <View style={styles.scoreContainer}>
          {
            showGif ? 
            <View style={styles.gifContainer}>
              <Image
                source={require('@/assets/images/icons8-coin.gif')}
                // source={require('https://tenor.com/view/oytothe-world-coin-happy-hanukkah-raining-falling-gif-14463297')}
                style={styles.gifImage}
                resizeMode="contain"
              />
              <Text style={styles.loadingText}>Calculating your score...</Text>
            </View> :
            <Animated.View 
                style={[
                  styles.scoreBox,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  }
                ]}
              >
                <Text style={styles.scoreMessage}>Your Current Score</Text>
                <Text style={styles.score}>{sessionDetails.bankedPoint}</Text>
                <Text style={styles.continueText}>
                  Continue for +{Math.floor(sessionDetails.bankedPoint * 0.3)} points
                </Text>
              </Animated.View>
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
      // paddingHorizontal: 20,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
    },
    box: {
      // width: "100%",
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 20,
      marginHorizontal: 10,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.bg,
    },
    leaderBoardBox: {
      paddingVertical: 20,
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
    },
    scoreContainer: {
      minHeight: 150,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 20,
    },
    gifContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    gifImage: {
      width: 120,
      height: 120,
      borderRadius: "100%",
      marginBottom: 16,
    },
    loadingText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      opacity: 0.7,
    },
    scoreBox: {
      alignItems: "center",
      width: "100%",
    },
    scoreMessage: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },
    score: {
      fontSize: 56,
      fontWeight: '900',
      color: colors.secondary,
      marginBottom: 8,
    },
    continueText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      opacity: 0.8,
    },
    });
