import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';

type continueParams = {
  userId: string;
  sessionId: string;
  bankedPoint: number;
};

export default function adscreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [disableSkip, setDisableSkip] = useState(false);
  const route = useRoute<any>();
  const params = route.params.params as continueParams;
  // const sessionDetails = {
  //   userId: data.userId,
  //   sessionId: data.sessionId,
  //   bankedPoint: data.bankedPoint
  // }
  console.log("ad : ",params);

// ad implementation :-   
// npm i react-native-google-mobile-ads

// import React, { useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import { HomeScreenNavigationProp } from '@/types/tabTypes';
// import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { LinearGradient } from 'expo-linear-gradient';
//
// import { BannerAd, BannerAdSize, TestIds, useForeground } from 'react-native-google-mobile-ads';
//
// type continueParams = {
//   userId: string;
//   soloSessionId: string;
// };
//
// export default function adscreen() {
//   const navigation = useNavigation<HomeScreenNavigationProp>();
//   const { colors } = useAppTheme();
//   const styles = React.useMemo(() => makeStyles(colors), [colors]);
//   const [disableSkip, setDisableSkip] = useState(false);
//   const route = useRoute<any>();
//   const sessionDetails = route.params.sessionDetails as continueParams;
//   console.log("ad : ",sessionDetails);
//
// // ad implementation :-
// // npm i react-native-google-mobile-ads
//
// const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';
// const bannerRef = useRef<BannerAd>(null);
// useForeground(() => {
//   Platform.OS === 'ios' && bannerRef.current?.load();
// });

// add to app.json :-
// [
//   "react-native-google-mobile-ads",
//   {
//     "androidAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx",
//     "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
//   }
// ]

  
  function handleSkip(){
    navigation.navigate('roundOverview',{params})
  }

  return (
    <LinearGradient 
    colors={colors.gradients.background}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.container}>
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
          <View>
            <Text style={styles.message}>
              Google Ad Here
            </Text>
          </View>

          <TouchableOpacity
          disabled={disableSkip}
          // onPress={() => navigation.navigate('SoloQuestion')}
          onPress={handleSkip}
          style={styles.startBtn}
          >
            <Text style={styles.startBtnText}>Skip</Text>
          </TouchableOpacity>
          {/* <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} /> */}
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
      paddingHorizontal: 20,
      flex: 1,
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.bg,
    },
    message: {
      color:colors.text,
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
//
// // add to app.json :-
// // [
// //   "react-native-google-mobile-ads",
// //   {
// //     "androidAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx",
// //     "iosAppId": "ca-app-pub-xxxxxxxx~xxxxxxxx"
// //   }
// // ]
//
//
//   function handleSkip(){
//     navigation.navigate('roundOverview',{sessionDetails})
//   }
//
//   return (
//     <LinearGradient
//     colors={colors.gradients.background}
//     start={{ x: 0, y: 0 }}
//     end={{ x: 0, y: 1 }}
//     style={styles.container}>
//     <SafeAreaView style={styles.safe}>
//       <View style={styles.box}>
//         <>
//           <View>
//             <Text style={styles.message}>
//               Google Ad Here
//             </Text>
//           </View>
//
//           <TouchableOpacity
//           disabled={disableSkip}
//           // onPress={() => navigation.navigate('SoloQuestion')}
//           onPress={handleSkip}
//           style={styles.startBtn}
//           >
//             <Text style={styles.startBtnText}>Skip</Text>
//           </TouchableOpacity>
//           {/* <BannerAd ref={bannerRef} unitId={adUnitId} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} /> */}
//         </>
//       </View>
//     </SafeAreaView>
//     </LinearGradient>
//   );
// }
//
// const makeStyles = (colors: ColorScheme) =>
//     StyleSheet.create({
//     container: {
//       flex:1,
//       padding: 16,
//     },
//     safe: {
//       padding: 10,
//       width: "100%",
//       height: "100%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     box: {
//       width: "100%",
//       borderRadius: 10,
//       paddingVertical: 40,
//       paddingHorizontal: 20,
//       flex: 1,
//       alignItems: "center",
//       justifyContent: "space-between",
//       backgroundColor: colors.bg,
//     },
//     message: {
//       color:colors.text,
//     },
//     startBtn: {
//       marginTop: 20,
//       backgroundColor: colors.primary,
//       paddingVertical: 14,
//       paddingHorizontal: 32,
//       borderRadius: 12,
//       alignItems: 'center',
//       justifyContent: 'center',
//       width: '70%',
//       alignSelf: 'center',
//     },
//     startBtnText: {
//       color: colors.text,
//       fontSize: 20,
//       fontWeight: 700,
//     }
//     });
