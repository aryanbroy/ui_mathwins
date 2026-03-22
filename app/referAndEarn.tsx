import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';

type Step = {
  number: number;
  title: string;
  description: string;
  align: 'left' | 'right';
};

const steps: Step[] = [
  {
    number: 1,
    title: 'Launch Application',
    description:
      'Open the application and sign in using your registered email credentials to access your account.',
    align: 'right',
  },
  {
    number: 2,
    title: 'Access User Profile',
    description:
      'Navigate to your Profile by selecting the icon in the navigation bar.',
    align: 'left',
  },
  {
    number: 3,
    title: 'Retrieve Referral Code',
    description:
      'Locate and copy your unique referral code found directly below your email address.',
    align: 'right',
  },
  {
    number: 4,
    title: 'Invite Your Network',
    description:
      'Share the code with a friend to enter during their initial account registration.',
    align: 'left',
  },
];

export default function ReferEarnScreen() {
  const { width, height } = useWindowDimensions();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  // Responsive sizing
  const isSmall = width < 360;
  const isLarge = width >= 428;

  const titleFontSize = isSmall ? 28 : isLarge ? 40 : 34;
  const stepTitleSize = isSmall ? 14 : isLarge ? 18 : 16;
  const stepDescSize = isSmall ? 12 : isLarge ? 15 : 13;
  const badgeSize = isSmall ? 44 : isLarge ? 60 : 52;
  const badgeFontSize = isSmall ? 20 : isLarge ? 28 : 24;
  const cardPadding = isSmall ? 14 : isLarge ? 22 : 18;
  const horizontalPadding = isSmall ? 16 : isLarge ? 28 : 20;
  const stepGap = isSmall ? 20 : isLarge ? 32 : 26;
  const badgeOverlap = badgeSize / 2;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingHorizontal: horizontalPadding, paddingBottom: 40 },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Title */}
          <Text style={[styles.title, { marginBottom: stepGap + 10 }]}>
            REFER & EARN
          </Text>

          {/* Steps */}
          {steps.map((step) => {
            const isRight = step.align === 'right';

            return (
              <View
                key={step.number}
                style={[
                  styles.stepWrapper,
                  { marginBottom: stepGap },
                ]}
              >
                {/* Badge — positioned on left or right edge */}
                <View
                  style={[
                    styles.badgeWrapper,
                    isRight
                    ? { left: -badgeOverlap / 2 + 4, top: -badgeOverlap / 2, zIndex: 10 }
                    : { right: -badgeOverlap / 2 + 4, top: -badgeOverlap / 2, zIndex: 10 },
                    {
                      width: badgeSize,
                      height: badgeSize,
                      borderRadius: badgeSize / 2,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.badge,
                      {
                        width: badgeSize,
                        height: badgeSize,
                        borderRadius: badgeSize / 2,
                      },
                    ]}
                  >
                    <Text style={[styles.badgeText, { fontSize: badgeFontSize }]}>
                      {step.number}
                    </Text>
                  </View>
                </View>

                {/* Card */}
                <LinearGradient
                  colors={[colors.bg, '#C240FF']}
                  start={{ x: isRight ? 0 : 1, y: 0 }}
                  end={{ x: isRight ? 1 : 0, y: 1 }}
                  style={[
                    styles.card,
                    {
                      padding: cardPadding,
                      paddingLeft: isRight ? cardPadding + badgeOverlap / 2 + 8 : cardPadding,
                      paddingRight: isRight ? cardPadding : cardPadding + badgeOverlap / 2 + 8,
                      alignItems: isRight ? 'flex-end' : 'flex-start',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        fontSize: stepTitleSize,
                        textAlign: isRight ? 'right' : 'left',
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.cardDesc,
                      {
                        fontSize: stepDescSize,
                        textAlign: isRight ? 'right' : 'left',
                      },
                    ]}
                  >
                    {step.description}
                  </Text>
                </LinearGradient>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 24,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: 900,
    fontFamily: 'Rubic-Bold',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  stepWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  badgeWrapper: {
    position: 'absolute',
    // top: '50%',
    // marginTop: -26, // half of max badge size to vertically center
    shadowColor: colors.bg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  badge: {
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  card: {
    width: '100%',
    borderRadius: 14,
  },
  cardTitle: {
    color: colors.text,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Medium',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  cardDesc: {
    color: colors.text,
    lineHeight: 20,
    fontWeight: '400',
  },
});