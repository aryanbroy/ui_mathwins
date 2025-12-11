import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { DailyQuestion, TournamentState } from '@/types/api/daily';
import ScoreSubmitScreen from '@/components/ScoreSubmitScreen';
import {
  createDailySession,
  finalSubmission,
  getDailyAttempts,
  getDailyTournamentDetails,
} from '@/lib/api/dailyTournament';
import TournamentScreen from '@/components/QuestionScreen/DailyTournamentScreen';

const maxAttempts = 300;

export default function DailyScreen() {
  const [attemptsLeft, setAttemptsLeft] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [disableStartBtn, setDisableStartBtn] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [tournamentMsg, setTournamentMsg] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // const [finalScore, setFinalScore] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<number>(0);

  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [tourState, setTourState] = useState<TournamentState>(
    TournamentState.LOBBY
  );
  const [initialQuestion, setInitialQuestion] = useState<DailyQuestion | null>(
    null
  );
  const [isSubmittingSession, setIsSubmittingSession] =
    useState<boolean>(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setErr(null);
    setErrMsg(null);
    setTournamentMsg(null);

    try {
      const attemptsData = await getDailyAttempts();
      const attempts = attemptsData.data.dailyAttemptCount;
      console.log('Attempts: ', attemptsData.data.dailyAttemptCount);
      setAttemptsLeft(attempts);
      try {
        const dailyTournamentDetails = await getDailyTournamentDetails();
        console.log('Tournament details: ', dailyTournamentDetails);
      } catch (tErr: any) {
        setTournamentMsg(tErr?.message ?? 'Tournament not available yet');
      }
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to load daily attempts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleRetry = () => load();

  const handleStartGame = async () => {
    setDisableStartBtn(true);
    setErr(null);
    setErrMsg(null);
    setTournamentMsg(null);

    try {
      const res = await createDailySession();
      console.log('Create daily session res: ', res);
      const data = res.data;
      const { firstQuestion, session } = data;
      setInitialQuestion(firstQuestion);
      setSessionId(session.id);
      setTourState(TournamentState.PLAYING);
    } catch (err: any) {
      setErr(err);
      setErrMsg(err?.message ?? 'Failed to load start game');
    } finally {
      setDisableStartBtn(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmittingSession(true);
    setErr(null);
    setErrMsg(null);
    setTournamentMsg(null);
    console.log('submitting session');
    try {
      if (!sessionId) {
        setErr('invalid session not available');
        setErrMsg('invalid session not available');
        setIsSubmittingSession(false);
        return;
      }
      const res = await finalSubmission({ sessionId });
      const data = res.data;
      navigation.navigate('HomeMain');
      console.log(data);
    } catch (err: any) {
      setErr(err);
      setErrMsg(err?.message ?? 'Failed to load start game');
    } finally {
      setIsSubmittingSession(false);
    }
  };

  const getScreenState = () => {
    if (attemptsLeft >= maxAttempts) return 'watchAd';
    if (isLoading) return 'loading';
    if (err != null) return 'err';
    if (tournamentMsg) return 'unavailable';
    if (tourState === TournamentState.PLAYING) return 'playing';
    if (tourState === TournamentState.FINISHED) return 'finished';
    return 'ready';
  };

  const DisplayAttempts = () => {
    return (
      <Text style={styles.attemptsText}>
        Daily tournament attempts left: {maxAttempts - (attemptsLeft ?? 0)}
      </Text>
    );
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
      case 'watchAd':
        return (
          <View style={styles.container}>
            <Text style={styles.attemptsText}>Watch ad to unlock attempt</Text>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.startBtnText}>Watch ad</Text>
            </TouchableOpacity>
          </View>
        );
      case 'err':
        return (
          <View>
            <Text>Error fetching attempts: {errMsg}</Text>
          </View>
        );
      case 'unavailable':
        return (
          <View style={styles.container}>
            <Text style={styles.attemptsText}>
              Daily tournament attempts left:{' '}
              {maxAttempts - (attemptsLeft ?? 0)}
            </Text>

            <View style={{ marginTop: 16 }}>
              <Text style={styles.infoTitle}>Tournament unavailable</Text>
              <Text style={styles.infoText}>{tournamentMsg}</Text>

              <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
                <Text style={styles.retryBtnText}>Check again</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 'playing':
        if (!initialQuestion || !sessionId) {
          console.log('empty values: initialQuestion, sessionid');
          return (
            <View>
              <Text>Loading session...</Text>
            </View>
          );
        }
        return (
          <TournamentScreen
            question={initialQuestion}
            sessionId={sessionId}
            sessionDuration={300}
            setTourState={setTourState}
            setCurrentScore={setCurrentScore}
          />
        );
      case 'ready':
      default:
        return (
          <View style={styles.container}>
            <DisplayAttempts />
            <TouchableOpacity
              style={
                disableStartBtn ? styles.startBtnDisabled : styles.startBtn
              }
              onPress={handleStartGame}
              disabled={disableStartBtn}
            >
              <Text style={styles.startBtnText}>Start game</Text>
            </TouchableOpacity>
          </View>
        );
      case 'finished':
        return (
          <>
            <ScoreSubmitScreen
              isSubmittingSession={isSubmittingSession}
              handleSubmit={handleSubmit}
              finalScore={currentScore}
            />
          </>
        );
    }
  };

  return renderContent();
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  attemptsText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  startBtn: {
    backgroundColor: '#6A5AE0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoTitle: { fontWeight: '600', marginBottom: 8 },
  infoText: { marginBottom: 12 },
  retryBtn: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  startBtnDisabled: {
    backgroundColor: 'grey',
    opacity: 0.6,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    alignSelf: 'center',
  },
});
