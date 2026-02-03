import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { ErrObject } from '@/lib/api/parseApiError';
import { claimDailyReward } from '@/lib/api/rewards';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '@/context/authContext';
import AdBanner from '../Ads/Banner';

export default function UserRewardScreen() {
  const [today, setToday] = useState(5);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [err, setErr] = useState<ErrObject | null>(null);
  const [isClaimBtnLoading, setIsClaimBtnLoading] = useState<boolean>(false);
  const {user} = useAuth();
  const [coins, setCoins] = useState(user?.coins || 0);
  const [maxCoins, setMaxCoins] = useState(2000);
  
  const claimBtnPress = async () => {
    console.log('claim btn pressed');
    setIsClaimBtnLoading(true);
    try {
      const response = await claimDailyReward();
      console.log('Daily reward: ', response);
    } catch (err: any) {
      const errObj: ErrObject = {
        status: err?.status ?? 500,
        message: err?.message ?? 'Failed to claim reward',
      };
      console.log(errObj);
      setErr(errObj);
    } finally {
      setIsClaimBtnLoading(false);
    }
  };

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
                    <Text style={styles.emoji}>🔥</Text>
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
                              day === today && styles.streakDayActive,
                              day === today + 1 && styles.streakDayNext,
                            ]}
                            >
                            <Text style={[styles.streakDayText]}>{day}</Text>
                          </View>
                          {day < 7 && <View style={styles.streakConnector} />}
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.dailyLoginCard}>
                <View style={styles.dailyLoginContent}>
                  <MaterialCommunityIcons name="calendar-clock-outline" size={30} color={colors.text} />
                  <Text style={styles.dailyLoginText}>DAILY LOGIN REWARD</Text>
                </View>
                <TouchableOpacity
                  style={styles.claimButton}
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
                <TouchableOpacity style={styles.redeemButton}>
                  <Text style={styles.redeemButtonText}>
                    REDEEM YOUR REWARDS
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.historyButton}>
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
      // width: '100%',
      width: '100%',
      flex: 1,
      borderTopEndRadius: 10,
      borderTopLeftRadius: 10,
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
      color: '#FFF',
      textAlign: 'center',
      marginTop: 40,
    },
    headerSubtitle: {
      fontSize: 12,
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
      paddingHorizontal: 10,
      paddingVertical: 20,
      borderRadius: 20,
      backgroundColor: colors.card,
      flex: 1,
      gap: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    emojiBox: {
      width: 50,
      // backgroundColor: "#cacaca",
    },
    emoji: {
      fontSize: 40,
    },
    streakTextContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    streakTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    streakProgressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      // justifyContent: 'space-between',
      gap: 1,
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
    },
    streakDayActive: {
      backgroundColor: '#FF6B9D',
    },
    streakDayNext: {
      backgroundColor: '#FFC0CB',
    },
    streakDayText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
    },
    streakDayTextActive: {
      color: '#FFF',
    },
    streakConnector: {
      width: 10,
      height: 3,
      backgroundColor: '#E5E7EB',
      marginHorizontal: 2,
    },
    dailyLoginCard: {
      borderRadius: 20,
      padding: 20,
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
      fontWeight: 'bold',
      color: colors.text,
      flexShrink: 1,
      lineHeight: 22,
      marginLeft: 10,
    },
    claimButton: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 22,
      // paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.bg,
      height: 44,
      minWidth: 90,
      alignItems: 'center',
      justifyContent: 'center',
      // paddingHorizontal: 20,
      // paddingVertical: 10,
      // borderRadius: 10,
    },
    claimButtonText: {
      fontSize: 15,
      fontWeight: 700,
      color: colors.textSecondary,
    },
    coinsCard: {
      backgroundColor: colors.card,
      borderRadius: 20,
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
      fontWeight: 700,
      color: colors.text,
    },
    redeemButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 10,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.bg,
    },
    redeemButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF',
    },
    historyButton: {
      backgroundColor: colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.bg,
      alignSelf: 'center',
      marginVertical: 20,
    },
    historyButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
    },
    adArea2: {
      backgroundColor: '#a1a1a1',
      width: '100%',
      height: 200,
    },
  });
