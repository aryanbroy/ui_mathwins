import { submitQuestion } from '@/lib/api/instantTournament';
import { TournamentState } from '@/types/api/daily';
import { InstantQuestion } from '@/types/api/instant';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import QuestionScreen from './QuestionScreen';

type TournamentScreenProps = {
  question: InstantQuestion;
  sessionId: string;
  sessionDuration: number;
  setTourState: Dispatch<SetStateAction<TournamentState>>;
  setCurrentScore: Dispatch<SetStateAction<number>>;
};

export default function InstantTournamentScreen({
  question,
  sessionId,
  sessionDuration,
  setTourState,
  setCurrentScore,
}: TournamentScreenProps) {
  const [timer, setTimer] = useState<number>(sessionDuration);
  const [displayQuestion, setDisplayQuestion] =
    useState<InstantQuestion>(question);
  const [bannerTimer, setBannerTimer] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [timeTaken, setTimeTaken] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);
  const timeTakenRef = useRef<number | null>(null);

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
      }
      setBannerTimer((prevTime) => {
        if (prevTime === 0) {
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000);
    timeTakenRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setTimeTaken((prevtime) => prevtime + 1);
      }
    }, 100);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeTakenRef.current) {
        clearInterval(timeTakenRef.current);
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
    console.log(timeTaken);
    isPausedRef.current = true;
    setIsLoading(true);
    setErrMsg(null);

    try {
      const { question: newQuestion, session } = await submitQuestion(
        sessionId,
        question.id,
        value,
        30
      );
      setDisplayQuestion(newQuestion);
      setCurrentScore(session.score);
    } catch (err: any) {
      setErrMsg(err?.message ?? 'Failed to load next question');
    } finally {
      setIsLoading(false);
      isPausedRef.current = false;
      setTimeTaken(0);
    }
  };

  if (errMsg != null) {
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
      tournament="instant"
      bannerTimer={bannerTimer}
    />
  );
}
