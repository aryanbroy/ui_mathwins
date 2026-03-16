import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React, { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { CardProps } from '@/types/cardProps.types';
import { Image } from 'expo-image';
import { useConfig } from '@/context/useConfig';

export default function DailyCard({ onPress }: CardProps) {
  const { colors, isDarkMode } = useAppTheme();
  const config = useConfig();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  console.log("isdailyactive :::::::: ",config.isDailyActive);
  
  const [ isOpen , setIsOpen ] = useState(config?.isDailyActive || false);
  const logoSource = require("@/assets/images/index/dailyTournament_logo.png");

  return (
    <TouchableOpacity onPress={onPress}>
      {/* <View
        style={styles.gradient}
      > */}
        <View style={[
          styles.dailyCard,
          isDarkMode ? 
          {backgroundColor: '#000000'} :
          {backgroundColor: '#FFB9DC'}
          ]}>
          <Image 
          source={logoSource} 
          style={styles.avatarImage} 
          contentFit="contain"/>

          {/* Right text block */}
          <View style={styles.dailyTextWrapper}>
            <Text 
            style={styles.dailyTitle}
            numberOfLines={1}
            ellipsizeMode="tail">DAILY TOURNAMENT</Text>
            {
              isOpen ? 
              <View style={{
                // flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,

              }}>
                <Text style={[styles.dailySubtitleIcon,{
                }]}>🟢</Text>
                <Text style={[
                  styles.dailySubtitle, 
                  {
                    color: '#4ac814',
                    // top: -2,
                  }
                ]}>OPEN</Text>
              </View> :
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,

              }}>
                <Text style={[styles.dailySubtitleIcon,{
                }]}>🔴</Text>
                <Text style={[
                  styles.dailySubtitle, 
                  {
                    color: '#e3001e',
                    // top: -2,
                  }
                ]}>CLOSE</Text>
              </View>

            }
            <Text style={styles.dailyReset}>Resets every day at 12:00AM</Text>
          </View>
        </View>
      {/* </View> */}
    </TouchableOpacity>
  );
}

const CARD_RADIUS = 20;
const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    dailyCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      padding: 16,
      marginBottom: 5,
      borderWidth: 1,
      borderColor: colors.divider,
    },
    smallIcon: {
      marginRight: 20,
    },  
    avatarImage: {
      marginHorizontal: 20,
      height: 80,
      width: 90,
    },
    dailyTextWrapper: {
      flex: 1,
    },
    dailyTitle: {
      fontSize: 18,
      // fontWeight: '700',
      fontFamily: 'Saira-SemiBold',
      color: colors.textOnPrimary,
    },
    dailySubtitleIcon: {
      marginTop: 6,
      fontSize: 10,
      fontFamily: 'Rubik-Medium',
      color: colors.textOnPrimary,
    },
    dailySubtitle: {
      marginTop: 6,
      fontSize: 14,
      fontFamily: 'Rubik-Medium',
      color: colors.textOnPrimary,
    },
    dailyReset: {
      marginTop:  6,
      fontSize: 11,
      fontFamily: 'Poppins-Medium',
      color: colors.textOnPrimary,
      opacity: 0.85,
    },
  });
