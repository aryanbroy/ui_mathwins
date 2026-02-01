import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { getSoloAtempts, soloStart } from '@/lib/api/soloTournament';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/authContext';
// import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  createDailySession,
  getDailyAttempts,
} from '@/lib/api/dailyTournament';
import { ErrObject } from '@/lib/api/parseApiError';

export type SessionInfo = {
  userId: string;
  sessionId: string;
  sessionType: SessionType;
  sessionDuration: number;
};

export enum SessionType {
  SOLO = 'solo',
  DAILY = 'daily',
  INSTANT = 'instant',
}

type RouteParams = {
  userId: string;
  sessionId: string;
  sessionType: SessionType;
};

export default function SoloScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [totalAttempt, setTotalAttempt] = useState(0);
  const [remainingAttempt, setRemainingAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const route = useRoute<RouteProp<{ params: RouteParams }>>();

  const [err, setErr] = useState<ErrObject | null>(null);

  // const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
  // const bannerRef = useRef<BannerAd>(null);
  // useForeground(() => {
  //   Platform.OS === 'ios' && bannerRef.current?.load();
  // });

  useEffect(() => {
    const { sessionType } = route.params;
    console.log('Session type: ', route.params.sessionType);
    async function getRemainingAttemp(): Promise<any> {
      switch (sessionType) {
        case SessionType.DAILY:
          await getDailyAttempts().then((res) => {
            const attempts = res.data.dailyAttemptCount;
            console.log('Attempts: ', attempts);
            setTotalAttempt(300);
            setRemainingAttempt(300 - attempts);
          });
          break;
        case SessionType.SOLO:
          await getSoloAtempts().then((res) => {
            console.log(res);
            setTotalAttempt(res?.data?.totalDailyAttempts);
            setRemainingAttempt(res?.data?.remainingAttempts);
            setLoading(false);
          });
          break;
      }
    }
    getRemainingAttemp();
  }, [route.params]);
    
  async function getExtraAttempt(){
    console.log("Show ad for extra attempt");
    
    const params = {
      sessionType: 'lobby',
      userId: route.params.userId as string,
      sessionId: route.params.sessionId as string
    };
    navigation.navigate('ad',{params})
  }

  async function startDailyGame() {
    setLoading(true);
    setErr(null);
    try {
      const res = await createDailySession();
      console.log('Create daily session res: ', res);
      const data = res.data;
      const { firstQuestion, session } = data;
      const sanitizedAttempt: SessionInfo = {
        userId: session.userId,
        sessionId: session.id,
        sessionType: SessionType.DAILY,
        sessionDuration: 3000,
      };
      navigation.navigate('Question', {
        session: sanitizedAttempt,
        sanitizedQuestion: firstQuestion,
      });
    } catch (err: any) {
      console.log(err);
      const errObj: ErrObject = {
        status: 500,
        message: err?.message ?? 'Failed to start game',
      };
      console.log(errObj);
      setErr(errObj);
    } finally {
      setLoading(false);
    }
  }


  async function createSession() {
    setLoading(true);
    // await soloStart({ userId: user.userId }
    console.log('user :- ', user);
    await soloStart()
      .then((res) => {
        console.log('soloStart : ', res);
        const sanitizedAttempt: SessionInfo = {
          userId: res.data.sanitizedAttemp.userId,
          sessionId: res.data.sanitizedAttemp.id,
          sessionType: SessionType.SOLO,
          sessionDuration: 60000,
        };
        setLoading(false);
        navigation.navigate('Question', {
          session: sanitizedAttempt,
          sanitizedQuestion: res.data.sanitizedQuestion,
        });
      })
      .catch();
  }

  async function startGame() {
    const { sessionType } = route.params;
    console.log(`Start game for ${sessionType} tournament`);
    switch (sessionType) {
      case SessionType.DAILY:
        await startDailyGame();
        break;
      case SessionType.SOLO:
        await createSession();
        break;
      case SessionType.INSTANT:
        console.log('start instant game');
      default:
        break;
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={colors.gradients.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.grediantBg}
      >
        <View style={styles.adArea1}>
          <Text>ad here</Text>
        </View>
        <View style={styles.container}>
          <LinearGradient
            colors={colors.gradients.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.grediant}
          >
            <View style={styles.box}>
              <Image source={{ uri: user?.picture }} style={styles.avatar} />
              <Text style={styles.attemptsText}>
                Solo tournament attempts left : {remainingAttempt} /{' '}{totalAttempt}
              </Text>
              <TouchableOpacity
                disabled={loading}
                style={loading ? styles.startBtnDiabled :  styles.startBtn}
                onPress={remainingAttempt > 0 ? startGame : getExtraAttempt}
              >
                {
                  loading ? 
                  <Text style={styles.startBtnText}>. . .</Text> :
                  <Text style={styles.startBtnText}>Start game</Text>
                }
                {
                  remainingAttempt<=0 ? 
                  <Text style={styles.adText}>ad</Text> :
                  <></>
                }
              </TouchableOpacity>
            </View>
          </LinearGradient>
          {/* <View style={styles.bannerAd}>
          <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
          </View> */}
        </View>
        <View style={styles.adArea2}>
          <Text>ad here</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    safe: {
      width: '100%',
      height: '100%',
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
    container: {
    },
    grediant: {
      height: 500,
      margin: 20,
      borderRadius: 20,
    },
    grediantBg: {

      // flex: 1,
      // alignItems: "center",
      // justifyContent: "space-between"
    },
    box: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: 'center',
      paddingVertical: 20,
    },
    avatar: {
      width: 150,
      height: 150,
      borderWidth: 4,
      borderColor: colors.border,
      borderRadius: 100,
    },
    attemptsText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.textSecondary,
      marginTop: 12,
      marginBottom: 20,
    },
    bannerAd: {
      marginVertical: 20,
    },
    startBtn: {
      width: '100%',
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#FFFFFF"
    },
    startBtnDiabled: {
      width: '100%',
      backgroundColor: colors.textMuted,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: "#FFFFFF"
    },
    adText: {
      position: "absolute",
      right: 0,
      top: 0,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 10,
      color: colors.text,
      backgroundColor: colors.border,
    },
    startBtnText: {
      color: colors.textSecondary,
      fontSize: 20,
      fontWeight: 700,
    },
  });
