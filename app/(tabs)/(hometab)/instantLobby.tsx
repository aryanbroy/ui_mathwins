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
import { SessionInfo, SessionType } from './lobby';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';

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
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

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
      const sanitizedAttempt: SessionInfo = {
        userId: session.userId,
        sessionId: session.id,
        sessionType: SessionType.INSTANT,
        sessionDuration: 3000,
      };
      navigation.navigate('Question', {
        session: sanitizedAttempt,
        sanitizedQuestion: question,
      });
      // setTourState(TournamentState.PLAYING);
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

      navigation.navigate('homeMain');
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to load start game');
    } finally {
      setIsSubmittingSession(false);
    }
  };

  const handleRetry = () => load();

const renderPlayer = ({ item, index }: { item: Player; index: number }) => (
  <LinearGradient
    colors={colors.gradients.surface}
    style={styles.playerRow}
  >
    <View style={styles.avatarCircle}>
      <Text style={styles.avatarText}>
        {item.user.username.charAt(0).toUpperCase()}
      </Text>
    </View>

    <Text style={styles.playerName}>{item.user.username}</Text>

    <View style={styles.rankBubble}>
      <Text style={styles.rankText}>{index + 1}</Text>
    </View>
  </LinearGradient>
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
            sessionDuration={3}
            setTourState={setTourState}
            setCurrentScore={setCurrentScore}
          />
        );
      case 'ready':
        return (
          <SafeAreaView style={styles.safe}>
            <LinearGradient
              colors={colors.gradients.background}
              style={styles.bg}
            >
              {/* HEADER */}
              <View style={styles.header}>
                <Text style={styles.title}>Instant Tournament</Text>
                <Text style={styles.roomTag}>Room • {roomId}</Text>
              </View>

              {/* SUMMARY CARD */}
              <View
                style={styles.card}
              >
                <View style={styles.summaryRow}>
                  <View>
                    <Text style={styles.label}>Players</Text>
                    <Text style={styles.value}>
                      {joinedCount}/{roomCapacity}
                    </Text>
                  </View>

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.label}>Closes in</Text>
                    <Text style={styles.value}>
                      {formatTime(remainingSeconds)}
                    </Text>
                  </View>
                </View>

                {/* progress */}
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(joinedCount / roomCapacity) * 100}%` },
                    ]}
                  />
                </View>

                {/* buttons */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.secondaryBtn} onPress={onInvite}>
                    <Text style={styles.secondaryTxt}>Invite</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={disableStartBtn ? styles.disabledBtn : styles.primaryBtn}
                    disabled={disableStartBtn}
                    onPress={onStartGame}
                  >
                    <Text style={styles.primaryTxt}>Start</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* PLAYERS LIST */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Players</Text>
                <Text style={styles.sectionSub}>Live</Text>
              </View>

              <FlatList
                data={players}
                keyExtractor={(i) => i.userId}
                renderItem={renderPlayer}
                contentContainerStyle={{ paddingBottom: 30 }}
                showsVerticalScrollIndicator={false}
              />
            </LinearGradient>
          </SafeAreaView>
        );
    }
  };
  return renderContent();
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    safe: {
      flex: 1,
      backgroundColor: colors.primary,
    },

    bg: {
      flex: 1,
      padding: 16,
    },

    header: {
      marginBottom: 16,
    },

    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.textSecondary,
    },

    roomTag: {
      marginTop: 4,
      color: colors.textSecondary,
      fontSize: 13,
    },

    card: {
      borderRadius: 20,
      padding: 16,
      marginBottom: 18,
      backgroundColor: colors.bg,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 10,
      elevation: 6,
    },

    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    label: {
      color: colors.textMuted,
      fontSize: 13,
    },

    value: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },

    progressTrack: {
      height: 6,
      borderRadius: 6,
      backgroundColor: colors.text,
      overflow: 'hidden',
      marginVertical: 14,
    },

    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },

    actionsRow: {
      flexDirection: 'row',
      gap: 12,
    },

    primaryBtn: {
      flex: 1,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
    },

    disabledBtn: {
      flex: 1,
      backgroundColor: colors.textMuted,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
    },

    primaryTxt: {
      color: '#fff',
      fontWeight: '600',
    },

    secondaryBtn: {
      flex: 1,
      backgroundColor: colors.border,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
    },

    secondaryTxt: {
      color: colors.text,
      fontWeight: '600',
    },

    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },

    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },

    sectionSub: {
      fontSize: 13,
      color: colors.textMuted,
    },

    playerRow: {
      borderRadius: 16,
      padding: 14,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },

    avatarCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },

    avatarText: {
      fontWeight: '700',
      color: colors.text,
    },

    playerName: {
      flex: 1,
      color: colors.text,
      fontWeight: '600',
    },

    rankBubble: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },

    rankText: {
      color: '#fff',
      fontWeight: '700',
    },
  });
