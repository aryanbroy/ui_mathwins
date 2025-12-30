// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
// import { useNavigation } from '@react-navigation/native';
// import { HomeScreenNavigationProp } from '@/types/tabTypes';
// import { getSoloAtempts, soloStart } from '@/lib/api/soloTournament';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useAuth } from '@/context/authContext';
// import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
// import { SafeAreaView } from 'react-native-safe-area-context';
//
// export default function SoloScreen() {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const { colors } = useAppTheme();
//   const styles = React.useMemo(() => makeStyles(colors), [colors]);
//   const [totalAttempt, setTotalAttempt] = useState(0);
//   const [remainingAttempt, setRemainingAttempt] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();
//
//   const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
//   const bannerRef = useRef<BannerAd>(null);
//   useForeground(() => {
//     Platform.OS === 'ios' && bannerRef.current?.load();
//   });
//
//   // useEffect(()=>{
//   //   async function getRemainingAttemp(): Promise<any> {
//   //     //get Remaining Attempts
//   //     await getSoloAtempts()
//   //     .then((res)=>{
//   //       console.log(res);
//   //       setTotalAttempt(res?.data?.totalDailyAttempts);
//   //       setRemainingAttempt(res?.data.remainingAttempts);
//   //     })
//   //   }
//   //   getRemainingAttemp();
//   // },[])
//
//   async function createSoloSession(){
//     setLoading(true);
//     // await soloStart({ userId: user.userId }
//     console.log("user :- ",user);
//     await soloStart()
//       .then((res) => {
//         console.log('soloStart : ', res);
//         const sanitizedAttemp = {
//           userId: res.sanitizedAttemp.userId,
//           soloSessionId: res.sanitizedAttemp.id,
//         }
//         setLoading(false);
//         navigation.navigate('Question', { session: sanitizedAttemp, sanitizedQuestion : res.sanitizedQuestion });
//       }
//     ).catch();
//   }
//
//   return (
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.container}>
//       <Text style={styles.attemptsText}>
//         Solo tournament attempts left : {remainingAttempt} / {totalAttempt}
//       </Text>
//       <View style={styles.bannerAd}>
//         <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
//
//       </View>
//         <TouchableOpacity
//         disabled={loading}
//         style={styles.startBtn}
//         onPress={createSoloSession}
//         >
//         {
//           loading ?
//           <Text style={styles.startBtnText}>. . .</Text> :
//           <Text style={styles.startBtnText}>Start game</Text>
//         }
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }
//
// const makeStyles = (colors: ColorScheme) =>
//   StyleSheet.create({
//     safe: {
//       // padding: 10,
//       width: "100%",
//       height: "100%",
//     },
//     container: {
//       // padding: 16,
//     },
//     attemptsText: {
//       fontSize: 16,
//       fontWeight: '500',
//       marginBottom: 12,
//     },
//     bannerAd: {
//       marginVertical: 20,
//     },
//     startBtn: {
//       backgroundColor: colors.primary,
//       paddingVertical: 12,
//       borderRadius: 8,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//     startBtnText: {
//       color: colors.text,
//       fontSize: 20,
//       fontWeight: 700,
//     },
//   });
