import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
  ScrollView,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useAuth } from '../context/authContext';
import useAppTheme from '@/context/useAppTheme';
import type { ColorScheme } from '@/context/useAppTheme';
import { useNavigation } from 'expo-router';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import BackgroundTextTexture from '@/components/Texture/BackgroundTextTexture';
import ReferralCodeInput from '@/components/ReferalCodeInput';
import NativeAdCard from '@/components/Ads/nativeAdCard';

type UserData = {
  name?: string;
  email?: string;
  picture?: string;
};
WebBrowser.maybeCompleteAuthSession();

const RESEND_SECONDS = 30;
const MAX_ATTEMPTS = 3;

export default function OtpScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [attempts, setAttempts] = useState(0);
  const isDisabled = timer > 0 || attempts >= MAX_ATTEMPTS;

  const { colors } = useAppTheme(); 
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  React.useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

    const handleResend = () => {
    if (isDisabled) return;

    console.log('OTP RESENT');

    setAttempts((prev) => prev + 1);
    setTimer(RESEND_SECONDS);
  };


  return (
      <LinearGradient
        colors={colors.gradients.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safe}>
          <BackgroundTextTexture></BackgroundTextTexture>

        <View style={styles.topSection}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Get Started now</Text>
            <Text style={styles.subtitle}>
              Create an account or log in to explore about our app
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <LinearGradient
            colors={colors.gradients.surface}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.gradient2}
          >
            <ScrollView
              style={styles.scroll}
              bounces={false}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.otpBox}>
                <Text style={styles.label}>Enter OTP</Text>
                <ReferralCodeInput
                length={6}
                  onChange={(userOtp) => {
                    setOtp(userOtp);
                    console.log('Final otp:', userOtp);
                  }}
                />
              </View>
              <View style={styles.resendBox}>
                <Text style={styles.msg}>Did not get any code ?</Text>
                <TouchableOpacity
                  style={[
                    styles.resendBtn,
                    isDisabled && { opacity: 0.5 },
                  ]}
                  disabled={isDisabled}
                  onPress={handleResend}
                >
                  <Text style={styles.resendBtnText}>
                    {attempts >= MAX_ATTEMPTS
                      ? 'Try later'
                      : timer > 0
                      ? `Resend in ${timer}s`
                      : 'Resend Code'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
              disabled={false} 
              style={styles.primaryButton}
              onPress={()=>{
                console.log("Verify OTP");
              }}>
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
              </TouchableOpacity>
              <NativeAdCard />
            </ScrollView>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gradient: {
      flex: 1,
    },
    safe: {
      flex: 1,
    },
    topSection: {
      height: '25%',
      justifyContent: 'center',
    },
    gradient2: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
    },
    scroll: {
      paddingVertical: 20,
    },
    headerTextContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: '800',
      textAlign: 'center',
      color: colors.textOnPrimary,
    },
    subtitle: {
      fontSize: 14,
      marginBottom: 20,
      textAlign: 'center',
      color: colors.textOnPrimary,
    },
    card: {
      flex: 1,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
      overflow: 'hidden',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    otpBox: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    resendBox: {
      marginVertical: 20,
    },
    msg: {
      color: colors.text,
      textAlign: 'center',
    },
    resendBtn: {

    },
    resendBtnText: {
      color: colors.primary,
      textAlign: 'center',
      marginVertical: 10,
      textDecorationLine: 'underline',
    },
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 24,
    },
    primaryButtonText: {
      color: colors.textOnPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
