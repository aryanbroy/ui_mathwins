import { submitQuestion } from '@/lib/api/dailyTournament';
import { DailyQuestion, TournamentState } from '@/types/api/daily';
import { Ionicons } from '@expo/vector-icons';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuestionScreen from './QuestionScreen';

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
  const intervalRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);

  useEffect(() => {
    console.log('timer started');
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setTimer((prevTime) => {
          if (prevTime === 0) {
            return 0;
          } else {
            return prevTime - 1;
          }
        });
        setTimeTaken((prevTime) => prevTime + 1);
      }
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
    isPausedRef.current = true;
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
      setTimeTaken(0);
      setIsLoading(false);
      isPausedRef.current = false;
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
    <QuestionScreen
      question={question}
      displayQuestion={displayQuestion}
      handleSelect={handleSelect}
      isLoading={isLoading}
      timer={timer}
    />
  );
}
