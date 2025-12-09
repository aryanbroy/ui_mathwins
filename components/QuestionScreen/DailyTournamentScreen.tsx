import { submitQuestion } from '@/lib/api/dailyTournament';
import { DailyQuestion, TournamentState } from '@/types/api/daily';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

type Options = {
  id: number;
  value: number;
};

const options: Options[] = [
  { id: 0, value: 0 },
  { id: 1, value: 1 },
  { id: 2, value: 2 },
  { id: 3, value: 3 },
  { id: 4, value: 4 },
  { id: 5, value: 5 },
  { id: 6, value: 6 },
  { id: 7, value: 7 },
  { id: 8, value: 8 },
  { id: 9, value: 9 },
];

const keypadLayout = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [null, null, 9, null, null],
];

type TournamentScreenProps = {
  question: DailyQuestion;
  sessionId: string;
  sessionDuration: number;
  setTourState: Dispatch<SetStateAction<TournamentState>>;
  setCurrentScore: Dispatch<SetStateAction<number>>;
};

export default function TournamentScreen({
  question,
  sessionId,
  sessionDuration,
  setTourState,
  setCurrentScore,
}: TournamentScreenProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [err, setErr] = useState(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(sessionDuration);
  const [displayQuestion, setDisplayQuestion] =
    useState<DailyQuestion>(question);

  const [timeTaken, setTimeTaken] = useState<number>(0);
  // const navigation = useNavigation<HomeScreenNavigationProp>();
  // const [questionExpression, setQuestionExpression] = useState<string | null>(
  //   null
  // );
  //
  // useEffect(() => {
  //   (async () => {
  //     setIsLoading(true);
  //     setErr(null);
  //     setErrMsg(null);
  //     try {
  //       const createSession = await createDailySession();
  //       console.log('Session created: ', createSession);
  //       const data = createSession.data;
  //       const { question } = data;
  //       setQuestionExpression(question.expression);
  //     } catch (err: any) {
  //       if (err instanceof AxiosError) {
  //         console.log('AxiosError: ', err);
  //         setErrMsg(err.response?.data.message);
  //       } else {
  //         console.log('Error: ', err);
  //       }
  //       setErr(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // }, []);
  //
  // if (isLoading) {
  //   return (
  //     <View style={styles.center}>
  //       <ActivityIndicator />
  //
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

  useEffect(() => {
    console.log('timer started');
    let timerInterval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime === 0) {
          return 0;
        } else if (isLoading) {
          return prevTime;
        } else {
          return prevTime - 1;
        }
      });
      setTimeTaken((prevTime) => prevTime + 1);
    }, 1000);
    return () => {
      clearInterval(timerInterval);
    };
  }, [isLoading]);

  useEffect(() => {
    if (timer === 0) {
      console.log('timer ended');
      console.log(
        'make db request now to submit all questions and mark the session status as complete'
      );
      setTourState(TournamentState.FINISHED);
    }
  }, [timer, setTourState]);

  const handleSelect = async (value: number) => {
    setIsLoading(true);
    try {
      const res = await submitQuestion({
        dailyTournamentSessionId: sessionId,
        questionId: question.id,
        answer: value,
        timeTaken,
      });
      const data = res.data;
      setDisplayQuestion(data.newQuestion);
      setCurrentScore(data.currentScore);
    } catch (err: any) {
      setErr(err);
      setErrMsg(err?.message ?? 'Failed to load next question');
    } finally {
      setIsLoading(false);
    }
  };

  if (err) {
    return (
      <View>
        <Text>{errMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {isLoading ? (
          <>
            <ActivityIndicator />
            <Text>Loading...</Text>
          </>
        ) : (
          <>
            <View style={styles.questionWrapper}>
              <View style={styles.timerCircle}>
                <Text style={styles.timerText}>{timer}</Text>
              </View>
              <Text style={styles.label}>
                Find the {question.kthDigit} digit from {question.side} after
                calculating:
              </Text>
              <Text style={styles.questionText}>
                {displayQuestion.expression} = __
              </Text>
            </View>

            <View style={styles.optionsContainer}>
              {keypadLayout.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                  {row.map((value, colIndex) => {
                    if (value === null) {
                      return (
                        <View key={colIndex} style={styles.optionPlaceholder} />
                      );
                    }

                    const option = options.find((o) => o.value === value);
                    if (!option) return null;

                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={styles.optionBtn}
                        onPress={() => handleSelect(option.value)}
                      >
                        <Text style={styles.optionText}>{option.value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },

  questionWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '400',
    color: '#111827',
    textAlign: 'center',
  },
  questionText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  optionsContainer: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },

  optionBtn: {
    width: 60,
    height: 60,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionPlaceholder: {
    width: 60,
    height: 60,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
  },

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
  timerCircle: {
    width: 50,
    height: 50,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: '#FFA500',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    lineHeight: 50,
    textAlign: 'center',
  },
});
