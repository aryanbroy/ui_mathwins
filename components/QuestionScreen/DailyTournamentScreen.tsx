import { submitQuestion } from '@/lib/api/dailyTournament';
import { DailyQuestion, TournamentState } from '@/types/api/daily';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import QuestionScreen from './QuestionScreen';

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
