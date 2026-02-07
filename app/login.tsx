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
import CountryPicker, {CountryCode} from 'react-native-country-picker-modal';

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
  const { login } = useAuth();
  // const [referral, setReferral] = useState("");
  const { colors } = useAppTheme(); 
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [referralCode, setReferralCode] = useState('');

  const getPlaceholder = () => {
    const map: any = {
      IN: '10 digits',
      US: '10 digits',
      UK: '10–11 digits',
      AE: '9 digits',
    };

    return map[countryCode] || 'Phone number';
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID, 
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  })

  const handleGoogleSignIn = async () => {
    try {
      await promptAsync();
      // response will update asynchronously and trigger the effect above
    } catch (e) {
      console.log('Error starting Google login:', e);
    }
  };

  React.useEffect(() => {
    console.log("responce :- ",response);
    handleSignInWithGoogle();
  }, [response]);
  async function handleSignInWithGoogle() {
    console.log("googleCalled");
    
    if (response?.type === "success") {
      const token = response.authentication?.accessToken;
      if (token) {
        console.log("token :- ",token);
        
        const user = await getUserInfo(token);
        // user.referalCode = referal;
        if (user) {
          // Tell the authContext that we are logged in
          const newToken = {...user, referralCode: referralCode};
          console.log("login : ", token, " - - ", newToken);
          await login(newToken).then((res)=>{
            console.log("responceFromlogin :- ",res);
          }
          );
          
          // after this, app/_layout.tsx will see `user` and switch to (tabs)
        }
      }
    } else if (response?.type === 'error') {
      console.log('Google login error:', response.error);
    }
  }
  const getUserInfo = async (token: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await res.json();
      console.log("user given data :- ", user);
      // navigation.navigate('HomeMain');
      return user; // return to handleSignInWithGoogle
    } catch (error) {
      console.log('Error fetching user info', error);
      return null;
    }
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
          {/* <StatusBar/> */}

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
              <View style={styles.tabRow}>
                <Pressable
                  style={[
                    styles.tabButton,
                    styles.tabButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      styles.tabTextActive,
                    ]}
                  >
                    Log In
                  </Text>
                </Pressable>
                {/* <Pressable
                  style={[
                    styles.tabButton,
                    selectedTab === 'signup' && styles.tabButtonActive,
                  ]}
                  onPress={() => setSelectedTab('signup')}
                >
                  <Text
                    style={[
                      styles.tabText,
                      selectedTab === 'signup' && styles.tabTextActive,
                    ]}
                  >
                    Sign Up
                  </Text>
                </Pressable> */}
              </View>
              <View style={styles.referalBox}>
                <Text style={styles.label}>Enter Referal Code</Text>
                <ReferralCodeInput
                  onChange={(code) => {
                    setReferralCode(code);
                    console.log('Final code:', code);
                  }}
                />
              </View>
              <View 
                style={styles.fieldGroup}
                // pointerEvents={'none'} 
              >
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
                    onChangeText={(t) =>
                      setPhone(t.replace(/[^0-9]/g, ''))
                    }
                  />
                </View>
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={() => {
                    const fullPhone = `+${callingCode}${phone}`;

                    console.log('FULL PHONE →', fullPhone);

                    navigation.navigate('otpScreen', {
                      phone: fullPhone,
                    });
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

              <View>
                <TouchableOpacity
                  style={styles.googleButton}
                  onPress={handleGoogleSignIn}
                >
                  <View style={styles.googleIcon}>
                    <AntDesign name="google" size={24} color={`${colors.text}`} />
                  </View>
                  <Text style={styles.googleText}>Continue with Google</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const CARD_RADIUS = 20;
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
      paddingBottom: 40,
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
    themeToggleContainer: {
      position: 'absolute',
      top: 20,
      right: 24,
    },
    themeToggleLight: {
      width: 64,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingHorizontal: 5,
    },
    themeToggleDark: {
      width: 64,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingHorizontal: 5,
    },
    themeIcon: {
      fontSize: 20,
      shadowColor: colors.shadow,
      marginBottom: 2,
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
      fontSize: 16,
      fontWeight: '600',
      color: colors.textMuted,
    },
    tabTextActive: {
      color: colors.textOnPrimary,
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
    },
    label: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      backgroundColor: colors.backgrounds.input,
      color: colors.text,
      marginBottom: 20,
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
      color: colors.textMuted,
    },

    googleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderRadius: 10,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadow,
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
      marginBottom: 60,
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
      fontWeight: '500',
      color: colors.text,
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
