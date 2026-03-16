import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  StatusBar,
  ScrollView,
  ActivityIndicator
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
import CountryPicker, {CountryCode} from 'react-native-country-picker-modal';
import AdBanner from '@/components/Ads/Banner';

type UserData = {
  name?: string;
  email?: string;
  picture?: string;
};
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [countryCode, setCountryCode] = useState<CountryCode>('IN');
  const [callingCode, setCallingCode] = useState('91');
  const [phone, setPhone] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (!response) return;
    handleSignInWithGoogle();
  }, [response]);

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      await promptAsync();
    } catch (e) {
      console.log('Error starting Google login:', e);
      setError('Failed to open Google login. Please try again.');
    }
  };

  const handleSignInWithGoogle = async () => {
    if (response?.type === 'success') {
      const token = response.authentication?.accessToken;
      if (!token) {
        setError('Google login failed: no access token received.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 1) Fetch Google user info
        const user = await getUserInfo(token);
        if (!user) throw new Error('Could not fetch user info from Google.');

        // 2) Login with your backend
        await login({ ...user, referralCode });


      } catch (err: any) {
        console.log('Login error:', err);
        setError(err?.message ?? 'Login failed. Please try again.');
      } finally {
        setLoading(false);
      }

    } else if (response?.type === 'error') {
      setError('Google sign-in was unsuccessful. Please try again.');

    }
  };

  const getUserInfo = async (token: string) => {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch Google user info.');
    return res.json();
  };

  const getPlaceholder = () => {
    const map: any = { IN: '10 digits', US: '10 digits', UK: '10–11 digits', AE: '9 digits' };
    return map[countryCode] || 'Phone number';
  };

  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <BackgroundTextTexture />

        <View style={styles.topSection}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Get Started now</Text>
            <Text style={styles.subtitle}>
              Create an account or log in to explore about our app
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.gradient2}>
            <ScrollView
              style={styles.scroll}
              bounces={false}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.tabText}>Login Now</Text>

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              <View style={styles.referalBox}>
                <Text style={styles.label}>Enter Referal Code</Text>
                <ReferralCodeInput
                  onChange={(code) => {
                    setReferralCode(code);
                  }}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Enter phone number</Text>
                <View style={[styles.phoneRow, { borderColor: colors.border }]}>
                  <CountryPicker
                    countryCode={countryCode}
                    withCallingCode
                    withFlag
                    withFilter
                    withModal
                    onSelect={(country) => {
                      setCountryCode(country.cca2);
                      setCallingCode(country.callingCode[0]);
                    }}
                  />
                  <View style={styles.divider} />
                  <TextInput
                    style={styles.phoneInput}
                    keyboardType="phone-pad"
                    placeholder={getPlaceholder()}
                    placeholderTextColor={colors.textMuted}
                    value={phone}
                    maxLength={12}
                    onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ''))}
                  />
                </View>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    const fullPhone = `+${callingCode}${phone}`;
                    navigation.navigate('otpScreen', { phone: fullPhone });
                  }}
                >
                  <Text style={styles.primaryButtonText}>Send OTP</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={[styles.googleButton, loading && { opacity: 0.6 }]}
                onPress={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.textSecondary}
                    style={{ marginRight: 12 }}
                  />
                ) : (
                  <View style={styles.googleIcon}>
                    <AntDesign name="google" size={24} color={`${colors.textSecondary}`} />
                  </View>
                )}
                <Text style={styles.googleText}>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>

            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    gradient: {
      backgroundColor: colors.bgPrimary,
      flex: 1,
    },
    safe: {
      flex: 1,
      marginBottom: -30,
    },
    topSection: {
      height: '25%',
      justifyContent: 'center',
    },
    gradient2: {
      flex: 1,
      backgroundColor: colors.surface,
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 32,
    },
    scroll: {
      paddingBottom: 40,
    },
    headerTextContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 900,
      fontFamily: 'Rubic-Bold',
      textAlign: 'center',
      color: colors.textSecondary,
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      marginBottom: 20,
      fontFamily: 'Rubic-Medium',
      textAlign: 'center',
      color: colors.textSecondary,
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
    tabRow: {
      flexDirection: 'row',
      marginBottom: 40,
      // backgroundColor: "#1a1a1a"
    },
    tabButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    tabButtonActive: {
      backgroundColor: colors.primary,
    },
    tabText: {
      fontSize: 24,
      color: colors.text,
      fontWeight: 'bold',
      fontFamily: 'Rubic-Medium',
      textAlign: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 10,
      marginBottom: 20
    },
    errorBox: {
      backgroundColor: '#ff000020',
      borderWidth: 1,
      borderColor: '#ff4444',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    errorText: {
      color: '#ff4444',
      fontSize: 14,
      fontFamily: 'Rubic-Medium',
      textAlign: 'center',
    },
    referalBox: {
      marginBottom: 20,
    },
    fieldGroup: {
      marginVertical: 10,
      // opacity: 0.5,
    },
    phoneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 10,
      height: 52,
      marginBottom: 16,
    },
    divider: {
      width: 1,
      height: '60%',
      backgroundColor: '#ccc',
      marginHorizontal: 10,
    },
    phoneInput: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Rubic-Medium',
      color: colors.text
    },
    label: {
      fontSize: 14,
      color: colors.text,
      fontFamily: 'Rubic-Medium',
      marginBottom: 8,
    },
    // input: {
    //   borderWidth: 1,
    //   borderColor: colors.border,
    //   borderRadius: 10,
    //   paddingVertical: 12,
    //   paddingHorizontal: 16,
    //   fontSize: 16,
    //   fontFamily: 'Rubic-Medium',
    //   backgroundColor: colors.backgrounds.input,
    //   color: colors.text,
    //   marginBottom: 20,
    // },
    
    primaryButton: {
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: 'center',
      marginBottom: 24,
    },
    primaryButtonText: {
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Rubic-Medium',
    },
    
    dividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    dividerLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.textMuted,
    },
    dividerText: {
      marginHorizontal: 12,
      fontSize: 14,
      fontFamily: 'Rubic-Medium',
      color: colors.textMuted,
    },
    
    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      backgroundColor: colors.primary,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      marginBottom: 20,
    },
    googleIcon: {
      width: 26,
      height: 26,
      borderRadius: 13,
      // backgroundColor: "#FFFFFF",
      // borderWidth: 1,
      // borderColor: "#E0E0E0",
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    googleText: {
      fontSize: 15,
      fontWeight: 'bold',
      fontFamily: 'Rubic-Medium',
      color: colors.textSecondary,
    },
    secondaryButton: {
      borderRadius: 24,
      paddingVertical: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    secondaryButtonText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
  });
