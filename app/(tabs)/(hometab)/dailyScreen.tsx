import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { TournamentState } from '@/types/api/daily';
import { generateQuestion, Question } from '@/lib/generateQuestion';
import TournamentScreen from './TournamentScreen';

// const maxAttempts = 200;

export default function DailyScreen() {
  // const [attemptsLeft, setAttemptsLeft] = useState<number>(0);
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [err, setErr] = useState<string | null>(null);
  // const [errMsg, setErrMsg] = useState<string | null>(null);
  // const [tournamentMsg, setTournamentMsg] = useState<string | null>(null);
  //
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [tourState, setTourState] = useState<TournamentState>(
    TournamentState.LOBBY
  );
  const [initialQuestion, setInitialQuestion] = useState<Question | null>(null);
  const [isSubmittingSession, setIsSubmittingSession] =
    useState<boolean>(false);

  // const load = useCallback(async () => {
  //   setIsLoading(true);
  //   setErr(null);
  //   setErrMsg(null);
  //   setTournamentMsg(null);
  //
  //   try {
  //     const attemptsData = await getDailyAttempts();
  //     const attempts = attemptsData.data.dailyAttemptCount;
  //     console.log('Attempts: ', attemptsData.data.dailyAttemptCount);
  //     setAttemptsLeft(attempts);
  //     try {
  //       const dailyTournamentDetails = await getDailyTournamentDetails();
  //       console.log('Tournament details: ', dailyTournamentDetails);
  //     } catch (tErr: any) {
  //       setTournamentMsg(tErr?.message ?? 'Tournament not available yet');
  //     }
  //   } catch (err: any) {
  //     setErrMsg(err?.message ?? 'Failed to load daily attempts');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);
  //
  // useEffect(() => {
  //   load();
  // }, [load]);
  //
  // const handleRetry = () => load();
  //
  // if (attemptsLeft >= maxAttempts) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.attemptsText}>Watch ad to unlock attempt</Text>
  //       <TouchableOpacity style={styles.startBtn}>
  //         <Text style={styles.startBtnText}>Watch ad</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }
  //
  // if (isLoading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator />
  //       <Text style={{ marginTop: 8 }}>Loading...</Text>
  //     </View>
  //   );
  // }
  //
  // if (err != null) {
  //   return (
  //     <View>
  //       <Text>Error fetching attempts: {errMsg}</Text>
  //     </View>
  //   );
  // }
  //
  // if (tournamentMsg) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.attemptsText}>
  //         Daily tournament attempts left: {maxAttempts - (attemptsLeft ?? 0)}
  //       </Text>
  //
  //       <View style={{ marginTop: 16 }}>
  //         <Text style={styles.infoTitle}>Tournament unavailable</Text>
  //         <Text style={styles.infoText}>{tournamentMsg}</Text>
  //
  //         <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
  //           <Text style={styles.retryBtnText}>Check again</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   );
  // }
  //
  //

  const handleStartGame = () => {
    const question = generateQuestion();
    setInitialQuestion(question);
    setTourState(TournamentState.PLAYING);
  };

  const handleSubmit = () => {
    setIsSubmittingSession(true);
    console.log('submitting session');
    setTimeout(() => {
      navigation.navigate('HomeMain');
    }, 2000);
  };

  if (tourState === TournamentState.PLAYING && initialQuestion != null) {
    return (
      <TournamentScreen
        question={initialQuestion}
        sessionId="sessionId"
        sessionDuration={300}
        setTourState={setTourState}
      />
    );
  }

  if (tourState === TournamentState.FINISHED) {
    return (
      <TouchableOpacity
        disabled={isSubmittingSession}
        // disabled
        style={
          isSubmittingSession ? styles.submitBtnDisabled : styles.submitBtn
        }
        onPress={handleSubmit}
      >
        <Text style={styles.submitBtnText}>Submit</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <>
        <Text style={styles.attemptsText}>
          {/* Daily tournament attempts left: {maxAttempts - attemptsLeft} */}
          Daily tournament attempts left : 1
        </Text>

        <TouchableOpacity style={styles.startBtn} onPress={handleStartGame}>
          <Text style={styles.startBtnText}>Start game</Text>
        </TouchableOpacity>
      </>
    </View>
  );
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
  submitBtnDisabled: {
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

  submitBtn: {
    marginTop: 20,
    backgroundColor: '#6A5AE0',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    alignSelf: 'center',
  },

  submitBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
