import Tab from '@/components/Leaderboard/StatusbarTabs';
import { LinearGradient } from 'expo-linear-gradient';
import { View, StyleSheet, StatusBar, ScrollView, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dummyUsers } from './(hometab)';
import LeaderboardCard from '@/components/Home/LeaderboardCard';
import { useEffect, useState } from 'react';
import { soloLeaderboard } from '@/lib/api/soloTournament';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';

type TabKey = 'allTime' | 'daily' | 'instant' | 'solo';
type userType = {
  userId: string;
  score: number;
  rank: number;
  percentile: number;
  coinPoints: number;
};

export default function LeaderBoard() {
  const [activeTab, setActiveTab] = useState<TabKey>('allTime');
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [soloLeaderBoard, setSololearderBoard] = useState<[userType]>();
  const [page, setPage] = useState(1);

  function handleNextSolo(){
       setPage(page+1);
  }

  useEffect(() => {
    if (activeTab !== "solo") return;

    const payload = {
      todayDate: "2025-12-06",
      start: (page - 1) * 10 + 1,
      end: page * 10,
    };

    soloLeaderboard(payload)
      .then((res) => {
        setSololearderBoard(res.results);
      })
      .catch(console.error);
  }, [activeTab, page]); 
    
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
          console.log("hgybj-jbhbhj-hyg");
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
          return (
          <>
            {soloLeaderBoard?.map((u, i) => (
              <View 
              key={i}
              style={styles.card}>
                <Text>{u.rank}</Text>
                <Text>{u.userId}</Text>
                <Text>{u.score}</Text>
                <TouchableOpacity 
                onPress={handleNextSolo}>
                  <Text>Next</Text>
                </TouchableOpacity>
              </View>
            ))}
          </>
        );
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

const makeStyles = (colors: ColorScheme) => StyleSheet.create({
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
    card: {
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: 10,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 8,
      elevation: 3,
    },
  });
