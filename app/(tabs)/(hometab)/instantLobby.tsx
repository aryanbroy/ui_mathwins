import { TournamentState } from '@/types/api/daily';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScoreSubmitScreen from '@/components/ScoreSubmitScreen';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { useNavigation } from '@react-navigation/native';
import InstantTournamentScreen from '@/components/QuestionScreen/InstantTournamentScreen';
import {
  fetchTournamentPlayers,
  finalSubmission,
  joinOrCreateTournament,
  startInstantSession,
} from '@/lib/api/instantTournament';
import { InstantQuestion, Player } from '@/types/api/instant';

export default function InstantTournamentLobby() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const roomCapacity = 100;
  const [tourState, setTourState] = useState<TournamentState>(
    TournamentState.LOBBY
  );
  const [initialQuestion, setInitialQuestion] =
    useState<InstantQuestion | null>(null);
  const [isSubmittingSession, setIsSubmittingSession] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [joinedCount, setJoinedCount] = useState<number>(0);
  const [players, setPlayers] = useState<Player[] | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [disableStartBtn, setDisableStartBtn] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);

  const load = useCallback(async () => {
    setIsLoading(false);
    setErrMsg(null);

    try {
      const tournamentData = await joinOrCreateTournament();
      const tournamentId = tournamentData.id;

      console.log('Tournament id: ', tournamentId);
      setRoomId(tournamentId);

      const expire = new Date(tournamentData.expiresAt);
      const now = new Date();
      const secondsLeft = (expire.getTime() - now.getTime()) / 1000;
      setRemainingSeconds(Math.floor(secondsLeft));

      const { playersCount, firstFivePlayers } =
        await fetchTournamentPlayers(tournamentId);
      setJoinedCount(playersCount.playersCount);
      setPlayers(firstFivePlayers);
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to load daily attempts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let interval = setInterval(() => {
      setRemainingSeconds((prevTime) => {
        if (prevTime === 0) {
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  });

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const onStartGame = async () => {
    setDisableStartBtn(true);
    setErrMsg(null);
    if (!roomId) {
      return;
    }

    try {
      const { question, session } = await startInstantSession(roomId);
      console.log('FirstQuestion: ', question);
      setInitialQuestion(question);
      console.log('Session info: ', session);
      setSessionId(session.id);
      setTourState(TournamentState.PLAYING);
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to start game');
    } finally {
      setDisableStartBtn(false);
    }
    console.log('starting game now');
  };
  const onInvite = () => alert('Invite (dummy)');

  const handleSubmit = async () => {
    setIsSubmittingSession(true);
    console.log('submitting session');
    try {
      if (!sessionId) {
        setErrMsg('invalid session: not available');
        return;
      }
      const submissionRes = await finalSubmission(sessionId);
      console.log('Final score: ', submissionRes.finalScore);
      console.log('Status: ', submissionRes.status);

      navigation.navigate('HomeMain');
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to load start game');
    } finally {
      setIsSubmittingSession(false);
    }
  };

  const handleRetry = () => load();

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => (
    <View style={styles.playerRow}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{item.user.username.charAt(0)}</Text>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.user.username}</Text>
        {/* <Text style={styles.playerScore}>{item.score ?? 0} pts</Text> */}
      </View>

      <Text style={styles.rankBubble}>{index + 1}</Text>
    </View>
  );

  const getScreenState = () => {
    if (tourState === TournamentState.FINISHED) return 'finished';
    if (tourState === TournamentState.PLAYING) return 'playing';
    if (isLoading) return 'loading';
    if (errMsg != null) return 'err';
    return 'ready';
  };

  const renderContent = () => {
    const screenState = getScreenState();

    switch (screenState) {
      case 'loading':
        return (
          <View style={styles.center}>
            <ActivityIndicator />
            <Text style={{ marginTop: 8 }}>Loading...</Text>
          </View>
        );
      case 'err':
        return (
          <View>
            <Text>Error fetching tournament details: {errMsg}</Text>
          </View>
        );

      case 'finished':
        return (
          <ScoreSubmitScreen
            isSubmittingSession={isSubmittingSession}
            handleSubmit={handleSubmit}
            finalScore={currentScore}
          />
        );
      case 'playing':
        if (!initialQuestion || !sessionId) {
          return (
            <>
              <Text>Failed to generate question</Text>
              <TouchableOpacity onPress={handleRetry}>Retry</TouchableOpacity>
            </>
          );
        }
        return (
          <InstantTournamentScreen
            question={initialQuestion}
            sessionId={sessionId}
            sessionDuration={15}
            setTourState={setTourState}
            setCurrentScore={setCurrentScore}
          />
        );
      case 'ready':
        return (
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.topRow}>
              <Text style={styles.title}>Instant Tournament</Text>
              <Text style={styles.roomTag}>Room • {roomId}</Text>
            </View>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryLabel}>Players</Text>
                  <Text style={styles.summaryValue}>
                    {joinedCount}/{roomCapacity}
                  </Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.summaryLabel}>Closes in</Text>
                  <Text style={styles.summaryValue}>
                    {formatTime(remainingSeconds)}
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(joinedCount / roomCapacity) * 100}%` },
                  ]}
                />
              </View>

              <View style={styles.actionsRow}>
                <TouchableOpacity style={styles.ghostButton} onPress={onInvite}>
                  <Text style={styles.ghostText}>Invite</Text>
                </TouchableOpacity>

                {!roomId ? (
                  <TouchableOpacity style={styles.loadingBtn} disabled>
                    <Text style={styles.primaryText}>Loading</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={
                      disableStartBtn ? styles.loadingBtn : styles.primaryButton
                    }
                    disabled={disableStartBtn}
                    onPress={onStartGame}
                  >
                    <Text style={styles.primaryText}>Start</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Players</Text>
              <Text style={styles.sectionSub}>Live</Text>
            </View>

            <FlatList
              data={players}
              keyExtractor={(i) => i.userId}
              renderItem={renderPlayer}
              style={styles.list}
              contentContainerStyle={{ paddingBottom: 24 }}
            />

            {/* <View style={styles.footer}> */}
            {/*   <Text style={styles.footerText}> */}
            {/*     3 min per player · Early submit allowed (ad-gated) */}
            {/*   </Text> */}
            {/*   <TouchableOpacity */}
            {/*     style={styles.linkBtn} */}
            {/*     onPress={() => alert('Leaderboard (dummy)')} */}
            {/*   > */}
            {/*     <Text style={styles.linkText}>Leaderboard</Text> */}
            {/*   </TouchableOpacity> */}
            {/* </View> */}
          </SafeAreaView>
        );
    }
  };
  return renderContent();
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, backgroundColor: '#FAFAFB', padding: 16 },
  topRow: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  roomTag: { color: '#8B8F98', marginTop: 4 },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { color: '#8B8F98', fontSize: 12 },
  summaryValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },

  progressBarContainer: {
    height: 6,
    backgroundColor: '#F1F3F8',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: { height: 6, backgroundColor: '#6A5AE0' },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  ghostButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F6F7FB',
  },
  ghostText: { color: '#4A4A4A', fontWeight: '600' },
  primaryButton: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#6A5AE0',
    marginLeft: 10,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  loadingBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'grey',
    opacity: 0.6,
    marginLeft: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontWeight: '700', fontSize: 16 },
  sectionSub: { color: '#9AA0A6' },

  list: { flex: 1 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', color: '#565656' },
  playerInfo: { flex: 1, marginLeft: 12 },
  playerName: { fontWeight: '700', color: '#111' },
  playerScore: { color: '#8B8F98', marginTop: 4, fontSize: 12 },
  rankBubble: {
    backgroundColor: '#F6F7FB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: '#6A5AE0',
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: { color: '#8B8F98', fontSize: 13 },
  linkBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  linkText: { color: '#6A5AE0', fontWeight: '700' },
});
