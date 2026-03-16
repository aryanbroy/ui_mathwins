import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { ErrObject } from '@/lib/api/parseApiError';
import { claimDailyReward, getStreak, redeemReward } from '@/lib/api/rewards';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/context/authContext';
import AdBanner from '../Ads/Banner';
import { navigate } from 'expo-router/build/global-state/routing';

export default function UserRewardScreen() {
  function reloadRewardScreen(){
    getStreak().then((res)=>{
      console.log('getStreak ',res);
      setToday(res.data.streak as number);
    }).catch((err)=>{
      console.log('getStreak err ',err);
      
    });
  }
  React.useEffect(()=>{
    reloadRewardScreen();
  },[])
  const [today, setToday] = useState(1);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [canRedeem, setCanRedeem] = useState<ErrObject | null>(null);
  const [isClaimBtnLoading, setIsClaimBtnLoading] = useState<boolean>(false);
  const [canClaim, setCanClaim] = useState<boolean>(false);
  const {user} = useAuth();
  const [coins, setCoins] = useState(user?.coins || 0);
  const [maxCoins, setMaxCoins] = useState(2000);
  const logoSource = require("@/assets/images/Fire.gif");

  const claimBtnPress = async () => {
    console.log('claim btn pressed');
    setIsClaimBtnLoading(true);
    try {
      const response = await claimDailyReward();
      console.log('Daily reward: ', response);
    } catch (err: any) {
      setCanClaim(false);
      Alert.alert(`${err}. Try Again Tomorrow !!`);
    } finally {
      setIsClaimBtnLoading(false);
    }
  };

  const handleRedeemButton = async ()=>{
    console.log("handleRedeemButton : ", 'HELLO');
    redeemReward().then((res)=>{
      // console.log(res);
      setCoins(res?.data.newUser?.coins)
      Alert.alert(`${res.message}`);
    }).catch((err)=>{
      console.log(err);
      Alert.alert(`${err}`);
    })
  }

  return (
      <ScrollView
        bounces={false}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <SafeAreaView style={styles.safe}>
          <AdBanner/>
          <View style={styles.screen}>
            <Text style={styles.headerTitle}>YOUR REWARDS</Text>
            <Text style={styles.headerSubtitle}>
              Guess what you have earned !!
            </Text>
          </View>
          <LinearGradient
            colors={colors.gradients.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient2}
            >
            <View style={styles.box}>
              <View style={styles.streakCard}>
                <View style={styles.streakContent}>
                  <View style={styles.emojiBox}>
                    <Image 
                    source={logoSource} 
                    style={styles.avatarImage}/>
                  </View>
                  <View style={styles.streakTextContainer}>
                    <Text style={styles.streakTitle}>
                      No Breaks, Just Progress. Keep The Streak Alive
                    </Text>
                    <View style={styles.streakProgressContainer}>
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <View key={day} style={styles.streakDayWrapper}>
                          <View
                            style={[
                              styles.streakDay,
                              day <= today && styles.streakDayActive,
                              day === today + 1 && styles.streakDayNext,
                            ]}
                            >
                            <Text style={[styles.streakDayText]}>{day}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.dailyLoginCard}>
                <View style={styles.dailyLoginContent}>
                  <MaterialCommunityIcons name="calendar-clock-outline" size={30} color={colors.text} />
                  <Text 
                  style={styles.dailyLoginText}
                  numberOfLines={1}
                  ellipsizeMode="tail">DAILY LOGIN REWARD</Text>
                </View>
                <TouchableOpacity
                  style={styles.claimButton}
                  disabled={canClaim}
                  onPress={claimBtnPress}
                  >
                  {isClaimBtnLoading ? (
                    <ActivityIndicator />
                  ) : (
                    <Text style={styles.claimButtonText}>CLAIM</Text>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.coinsCard}>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${(coins / maxCoins) * 100}%` },
                    ]}
                    />
                </View>
                <View style={styles.coinsInfo}>
                  <Text style={styles.coinIcon}>🪙</Text>
                  <Text style={styles.coinsText}>
                    {coins} / {maxCoins} COINS
                  </Text>
                </View>
                <TouchableOpacity 
                style={[
                  styles.claimButton, 
                  coins<maxCoins && { opacity: 0.5 }
                ]}
                disabled={coins < maxCoins}
                onPress={handleRedeemButton}>
                  <Text style={styles.redeemButtonText}>
                    REDEEM YOUR REWARDS
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
              style={styles.historyButton}
              onPress={()=>{
                console.log(navigation.getState());
                router.navigate('/rewardHistory');
              }}>
                <Text style={styles.historyButtonText}>
                  View Reward history
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
          <AdBanner/>
        </SafeAreaView>
      </ScrollView>
    // </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gradient: {
      width: '100%',
      flex: 1,
    },
    gradient2: {
      width: '100%',
      flex: 1,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    safe: {
      width: '100%',
    },
    screen: {
      width: '100%',
    },
    adArea1: {
      marginBottom: 10,
      backgroundColor: '#a1a1a1',
      width: '100%',
      height: 50,
    },
    headerTitle: {
      fontSize: 30,
      fontWeight: 900,
      fontFamily: 'Rubik-Medium',
      color: '#FFF',
      textAlign: 'center',
      marginTop: 40,
    },
    headerSubtitle: {
      fontSize: 12,
      fontFamily: 'Rubik-Medium',
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 40,
    },
    box: {
      width: '100%',
      overflow: 'hidden',
      borderRadius: 20,
    },
    streakCard: {
      // backgroundColor: '#FFF',
      maxWidth: '100%',
      minWidth: '100%',
      marginBottom: 16,
    },
    streakContent: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      // backgroundColor: colors.card,
      // flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    emojiBox: {
      // backgroundColor: "#cacaca",
    },
    avatarImage: {
      marginBottom: -20,
      // backgroundColor: "#FF0000"
    },
    streakTextContainer: {
      // backgroundColor: '#ff0000'
    },
    streakTitle: {
      textAlign: 'center',
      fontSize: 14,
      fontFamily: 'Rubik-Medium',
      fontWeight: '600',
      color: colors.text,
      marginVertical: 10,
    },
    streakProgressContainer: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    streakDayWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    streakDay: {
      width: 30,
      height: 30,
      borderRadius: '100%',
      backgroundColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: '#FFF',
    },
    streakDayActive: {
      backgroundColor: '#FF6B9D',
      color: '#FFF'
    },
    streakDayNext: {
      backgroundColor: '#FFC0CB',
    },
    streakDayText: {
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: 'Ribik-Medium',
      color: '#000',
    },
    streakDayTextActive: {
      color: '#FFF',
    },
    streakConnector: {
      width: '100%',
      height: 3,
      backgroundColor: '#ffffff',
      position: 'relative',
      borderRadius: "100%"
      // marginHorizontal: 2,
    },
    dailyLoginCard: {
      borderRadius: 5,
      paddingHorizontal: 20,
      paddingVertical: 5,
      marginBottom: 16,
      minHeight: 80,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      backgroundColor: colors.card,
    },
    dailyLoginContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexShrink: 1,
    },
    calendarIcon: {
      fontSize: 30,
      marginRight: 12,
    },
    dailyLoginText: {
      fontSize: 16,
      fontFamily: 'Saira-SemiBold',
      color: colors.text,
      flexShrink: 1,
      lineHeight: 22,
      marginLeft: 10,
    },
    claimButton: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 22,
      borderRadius: 12,
      height: 44,
      minWidth: 90,
      alignItems: 'center',
      justifyContent: 'center',
    },
    claimButtonText: {
      fontSize: 15,
      fontWeight: 'bold',
      fontFamily: 'Rubik-Medium',
      color: colors.textSecondary,
    },
    coinsCard: {
      backgroundColor: colors.card,
      borderRadius: 5,
      padding: 20,
      marginBottom: 24,
    },
    progressBarContainer: {
      height: 14,
      backgroundColor: '#E5E7EB',
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 10,
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: "#DC2626",
      borderRadius: 100,
    },
    coinsInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    coinIcon: {
      fontSize: 20,
      marginRight: 8,
    },
    coinsText: {
      fontSize: 14,
      // fontWeight: 700,
      fontFamily: 'Saira-Medium',
      color: colors.text,
    },
    redeemButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
    },
    redeemButtonDis: {
      backgroundColor: colors.textMuted,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.bg,
      opacity: 0.5,
    },
    redeemButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Rubik-Medium',
      color: '#FFF',
    },
    historyButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
      alignSelf: 'center',
    },
    historyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Rubik-Medium',
      color: '#FFF',
    },
    adArea2: {
      backgroundColor: '#a1a1a1',
      width: '100%',
      height: 200,
    },
  });
