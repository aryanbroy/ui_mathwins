import Tab from '@/components/Leaderboard/StatusbarTabs';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, StatusBar, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dummyUsers } from './(hometab)';
import LeaderboardCard from '@/components/Home/LeaderboardCard';
import { useState } from 'react';

type TabKey = 'allTime' | 'daily' | 'instant' | 'solo';

export default function LeaderBoard() {
  const [activeTab, setActiveTab] = useState<TabKey>('daily');

  const renderContent = () => {
    console.log('active tab: ', activeTab);
    switch (activeTab) {
      case 'allTime':
        return (
          <>
            {dummyUsers.map((u) => (
              <LeaderboardCard key={`all-${u.rank}`} {...u} />
            ))}
          </>
        );
      case 'daily':
        return (
          <>
            {dummyUsers.map((u) => (
              <LeaderboardCard key={`daily-${u.rank}`} {...u} />
            ))}
          </>
        );
      case 'instant':
        return <Text style={styles.placeholder}>No instant games yet</Text>;
      case 'solo':
        return <Text style={styles.placeholder}>Play a solo match!</Text>;
    }
  };
  return (
    <LinearGradient
      colors={['#6315FF', '#FFCCD7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.gradient}
    >
      <StatusBar barStyle={'light-content'} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.tabsRow}>
          <Tab
            label="All Time"
            onPress={() => setActiveTab('allTime')}
            active={activeTab === 'allTime'}
          />
          <Tab
            label="Daily Mode"
            onPress={() => setActiveTab('daily')}
            active={activeTab === 'daily'}
          />
          <Tab
            label="Instant"
            onPress={() => setActiveTab('instant')}
            active={activeTab === 'instant'}
          />
          <Tab
            label="Solo"
            onPress={() => setActiveTab('solo')}
            active={activeTab === 'solo'}
          />
        </View>

        <ScrollView>
          <LinearGradient
            colors={['#FEE1F3', '#DAB7FF', '#A88BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.bottomGradient}
          >
            {renderContent()}
            {/* {dummyUsers.map(({ rank, name, medalColor, points }) => ( */}
            {/*   <LeaderboardCard */}
            {/*     key={rank} */}
            {/*     rank={rank} */}
            {/*     name={name} */}
            {/*     medalColor={medalColor as any} */}
            {/*     points={points} */}
            {/*   /> */}
            {/* ))} */}
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  bottomGradient: {
    width: '100%',
    height: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  placeholder: {
    textAlign: 'center',
    paddingVertical: 40,
    color: '#555',
    fontWeight: '600',
  },
});
