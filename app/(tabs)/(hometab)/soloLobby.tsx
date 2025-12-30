import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { getSoloAtempts, soloStart } from '@/lib/api/soloTournament';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/authContext';
// import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SoloScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [totalAttempt, setTotalAttempt] = useState(0);
  const [remainingAttempt, setRemainingAttempt] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
  // const bannerRef = useRef<BannerAd>(null);
  // useForeground(() => {
  //   Platform.OS === 'ios' && bannerRef.current?.load();
  // });
  
  useEffect(()=>{
    async function getRemainingAttemp(): Promise<any> {
      //get Remaining Attempts
      await getSoloAtempts()
      .then((res)=>{
        console.log(res);
        setTotalAttempt(res?.data?.totalDailyAttempts);
        setRemainingAttempt(res?.data.remainingAttempts);
      })
    }
    getRemainingAttemp();
  },[])

  async function createSoloSession(){
    setLoading(true);
    // await soloStart({ userId: user.userId }
    console.log("user :- ",user);
    await soloStart()
      .then((res) => {
        console.log('soloStart : ', res);
        const sanitizedAttemp = {
          userId: res.sanitizedAttemp.userId,
          soloSessionId: res.sanitizedAttemp.id,
        }
        setLoading(false);
        navigation.navigate('Question', { session: sanitizedAttemp, sanitizedQuestion : res.sanitizedQuestion });
      }
    ).catch();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <LinearGradient 
        colors={colors.gradients.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}>
          <View style={styles.box}>
            <Image
              source={{ uri: user?.picture }}
              style={styles.avatar}
            />
            <Text style={styles.attemptsText}>
              Solo tournament attempts left : {remainingAttempt} / {totalAttempt}
            </Text>
            <TouchableOpacity
              disabled={loading}
              style={styles.startBtn} 
              onPress={createSoloSession}
            >
            {
              loading ? 
              <Text style={styles.startBtnText}>. . .</Text> :
              <Text style={styles.startBtnText}>Start game</Text>
            }
            </TouchableOpacity>
          </View>
        </LinearGradient>
      {/* <View style={styles.bannerAd}>
        <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />

      </View> */}
        
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    safe: {
      width: "100%",
      height: "100%",
    },
    container: {
      borderRadius: 20,
    },
    box: {
      flex: 1,
      paddingHorizontal: 20,
      alignItems: "center",
      paddingVertical: 30,
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
      marginVertical: 12,
    },
    bannerAd: {
      marginVertical: 20,
    },
    startBtn: {
      width: "100%",
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    startBtnText: {
      color: colors.textSecondary,
      fontSize: 20,
      fontWeight: 700,
    },
  });
