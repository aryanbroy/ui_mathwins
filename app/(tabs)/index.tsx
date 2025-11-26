import BackgroundTexture from '@/components/Texture/BackgroundTexture';
import Header from '@/components/Header';
import HomeBtn from '@/components/Home/HomeBtn';
import LeaderboardCard from '@/components/Home/LeaderboardCard';
import TournamentCards from '@/components/TournamentCards/TournamentCards';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
];

export default function Index() {
  return (
    <ScrollView
      bounces={false}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.topGradient}>
          <BackgroundTexture />

          <Header />
          <Text style={{ paddingBottom: 20 }}>Progress bar</Text>
          <TournamentCards />
        </View>

        <LinearGradient
          colors={['#FEE1F3', '#DAB7FF', '#A88BFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.bottomGradient}
        >
          {dummyUsers.map(({ rank, name, medalColor, points }) => (
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#6A5AE0',
  },
  contentContainer: {
    backgroundColor: '#6A5AE0',
    padding: 0, 
    margin: 0,
  },
  topGradient: {
    width: '100%',
    // backgroundColor: "#6A5AE0",
    paddingHorizontal: 20,
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
