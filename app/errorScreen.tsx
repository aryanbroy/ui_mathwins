import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { HomeScreenNavigationProp } from '@/types/tabTypes';

export default function ErrorScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [statusCode, useStatusCode] = useState(400);
  const [message, useMessage] = useState(`The page you were looking for seems to\nhave gone missing.`);

  // export continueParams type
  // const {params} = route.params.params as continueParams;

  const handleReturnHome = () => {
    navigation.navigate('HomeMain');
  };

  return (
    <LinearGradient
      colors={colors.gradients.surface}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Confused Cat Image */}
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/cat_image.png')}
              style={styles.catImage}
              resizeMode="contain"
            />
            {/* <View style={styles.questionMarkContainer}>
              <Text style={styles.questionMark}>?</Text>
              <Text style={styles.exclamationMark}>!</Text>
            </View> */}
          </View>

          {/* Error Message */}
          <View>
            <Text style={styles.errorTitle}>Oh no..... Error {statusCode} :(</Text>
            <Text style={styles.errorMessage}>{message}</Text>
          </View>
          {/* Return Button */}
          <TouchableOpacity
            style={styles.returnButton}
            onPress={handleReturnHome}
            activeOpacity={0.8}
          >
            <Text style={styles.returnButtonText}>Return To Home Page</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
  container: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
    },
    content: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    imageContainer: {
      position: 'relative',
      marginBottom: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    catImage: {
      width: 280,
      height: 280,
    },
    questionMarkContainer: {
      position: 'absolute',
      top: 0,
      right: 40,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    questionMark: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.15)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    exclamationMark: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#FFFFFF',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.15)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    errorTitle: {
      fontSize: 32,
      fontWeight: 700,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 20,
    },
    errorMessage: {
      fontSize: 15,
      color: colors.text,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 60,
      opacity: 0.9,
    },
    returnButton: {
      backgroundColor: colors.primary,
      paddingVertical: 18,
      paddingHorizontal: 48,
      borderRadius: 16,
      width: '90%',
      maxWidth: 400,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    returnButtonText: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      textAlign: 'center',
    },
  });