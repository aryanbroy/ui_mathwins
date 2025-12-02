import React from 'react';
import BackgroundTexture from '@/components/Texture/BackgroundTexture';
import Header from '@/components/Header';
import HomeBtn from '@/components/Home/HomeBtn';
import LeaderboardCard from '@/components/Home/LeaderboardCard';
import TournamentCards from '@/components/TournamentCards/TournamentCards';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';

export const dummyUsers = [
  {
    rank: 1,
    name: 'UjwalXMathwins',
    points: 1850,
    medalColor: 'gold',
  },
  {
    rank: 2,
    name: 'AbhilashXMathwins',
    points: 1620,
    medalColor: 'silver',
  },
  {
    rank: 3,
    name: 'RahulXMathwins',
    points: 1510,
    medalColor: 'bronze',
  },
  {
    rank: 4,
    name: 'AdityaXMathwins',
    points: 1450,
    medalColor: null,
  },
  {
    rank: 5,
    name: 'SnehaXMathwins',
    points: 1380,
    medalColor: null,
  },
  {
    rank: 6,
    name: 'VikramXMathwins',
    points: 1290,
    medalColor: null,
  },
  {
    rank: 7,
    name: 'RiyaXMathwins',
    points: 1150,
    medalColor: null,
  },
  {
    rank: 8,
    name: 'KaranXMathwins',
    points: 1020,
    medalColor: null,
  },
  {
    rank: 9,
    name: 'AnjaliXMathwins',
    points: 950,
    medalColor: null,
  },
  {
    rank: 10,
    name: 'RohanXMathwins',
    points: 880,
    medalColor: null,
  },
];

export default function Index() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  return (
    <ScrollView
      style={styles.scroll}
      bounces={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.topSection}>
          <BackgroundTexture />
          <Header />
          <Text style={styles.progressText}>Progress bar</Text>
          <TournamentCards />
        </View>

        {/* Bottom rounded gradient panel */}
        <LinearGradient
          colors={colors.gradients.surface}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bottomGradient}
        >
          {dummyUsers.slice(0, 3).map(({ rank, name, medalColor, points }) => (
            <LeaderboardCard
              key={rank}
              rank={rank}
              name={name}
              medalColor={medalColor as any}
              points={points}
            />
          ))}
          <HomeBtn onPress={() => console.log('btn pressed')} />
        </LinearGradient>
      </SafeAreaView>
    </ScrollView>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    scroll: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    safe: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    contentContainer: {
      backgroundColor: colors.bg,
      padding: 0,
      margin: 0,
    },
    topSection: {
      width: '100%',
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    progressText: {
      paddingBottom: 20,
      color: colors.textOnPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
    bottomGradient: {
      width: '100%',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      overflow: 'hidden',
      paddingVertical: 20,
      paddingHorizontal: 16,
    },
  });

