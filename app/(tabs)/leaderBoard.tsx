import Tab from '@/components/Leaderboard/StatusbarTabs';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, StatusBar, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dummyUsers } from './(hometab)';
import LeaderboardCard from '@/components/Home/LeaderboardCard';
import { useCallback, useEffect, useState } from 'react';
import { fetchDailyLeaderboard } from '@/lib/api/dailyTournament';
import { InstantTournamentCard } from '@/components/Home/InstantTournamentCard';
import { fetchPastTournaments } from '@/lib/api/instantTournament';
import { InstantParticipant } from '@/types/api/instant';
import TopThreePodium from '@/components/Leaderboard/TopThreePodium';

type TabKey = 'allTime' | 'daily' | 'instant' | 'solo';
type RankedLeaderboard = {
  userId: string;
  bestScore: number;
  user: { username: string };
  rank: number;
};

export default function LeaderBoard() {
  const [activeTab, setActiveTab] = useState<TabKey>('daily');
  const [page, setPage] = useState<number>(1);
  const [dailyLeaderBoard, setDailyLeaderboard] = useState<RankedLeaderboard[]>(
    []
  );
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [instantTournamentsPlayed, setInstantTournamentsPlayed] = useState<
    InstantParticipant[] | null
  >(null);

  const getDailyLeaderboard = useCallback(async () => {
    console.log('fetching daily leaderboard');
    const leaderboard = await fetchDailyLeaderboard(page);
    const rankedLeaderboard: RankedLeaderboard[] = leaderboard.map(
      (entry, index) => ({
        ...entry,
        rank: index + 1,
      })
    );
    setDailyLeaderboard(rankedLeaderboard);
  }, [page]);

  const getInstantTournaments = useCallback(async () => {
    setErrMsg(null);
    console.log('fetching instant tournaments');
    try {
      const tournaments: InstantParticipant[] = await fetchPastTournaments();
      setInstantTournamentsPlayed(tournaments);
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to load daily attempts');
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'daily') {
      getDailyLeaderboard();
    } else if (activeTab === 'instant') {
      getInstantTournaments();
    }
  }, [getDailyLeaderboard, activeTab, getInstantTournaments]);

  const onClick = (value: number) => {
    setPage(value);
  };

  const renderContent = () => {
    console.log('active tab: ', activeTab);
    switch (activeTab) {
      case 'allTime':
        return (
          <>
            <TopThreePodium />
            {dummyUsers.slice(3).map((u) => (
              <LeaderboardCard key={`all-${u.rank}`} {...u} />
            ))}
          </>
        );
      case 'daily':
        return (
          <>
            {dailyLeaderBoard.map((user) => (
              <LeaderboardCard
                rank={user.rank}
                key={user.userId}
                name={user.user.username}
                points={user.bestScore}
              />
            ))}
          </>
        );
      case 'instant':
        return (
          <>
            {instantTournamentsPlayed?.map((tournament) => (
              <InstantTournamentCard
                key={tournament.tournamentId}
                joinedCount={tournament.tournament.playersCount}
                maxPlayers={tournament.tournament.maxPlayers}
                expiresAt={tournament.tournament.expiresAt}
                status={tournament.tournament.status}
                onPress={() => console.log('display leaderboard')}
              />
            ))}
          </>
        );
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

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <LinearGradient
            colors={['#FEE1F3', '#DAB7FF', '#A88BFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.bottomGradient}
          >
            {errMsg != null ? (
              <Text style={styles.placeholder}>
                Error fetching leaderboard! Try again later
              </Text>
            ) : (
              renderContent()
            )}
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
  scrollContent: {
    flexGrow: 1,
  },
  bottomGradient: {
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    overflow: 'hidden',
    paddingVertical: 20,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  placeholder: {
    textAlign: 'center',
    paddingVertical: 40,
    color: '#555',
    fontWeight: '600',
  },
});
