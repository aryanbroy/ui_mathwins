import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  applyFiftyfifty,
  LevelDown,
  nextQuestion,
} from '@/lib/api/soloTournament';
import { SessionInfo, SessionType } from './lobby';
import { finalSubmission, submitQuestion } from '@/lib/api/dailyTournament';
import {
  submitQuestion as submitInstantQuestion,
  finalSubmission as finalInstantSubmission,
} from '@/lib/api/instantTournament';
import ScoreSubmitScreen from '@/components/ScoreSubmitScreen';
import ResultPopup from '@/components/QuestionScreen/ResultPopup';
import { useFeedback } from '@/context/useFeedback';
import adscreen from './adScreen';
import Error404Screen from '@/app/errorScreen';
import { useRewardedAd } from '@/components/Ads/Rewarded';
import { useInterstitialAd } from '@/components/Ads/InterstitialAd';
import AdBanner from '@/components/Ads/Banner';
import { useConfig } from '@/context/useConfig';

type sanitizedQuestionType = {
  id: string;
  questionIndex: number;
  expression: string;
  kthDigit: number;
  level: number;
  side: string;
};

type continueParams = {
  sessionType: SessionType;
  userId: string;
  sessionId: string;
  bankedPoint: number;
};

const keypadLayout = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [0]];

function getOrdinalSuffix(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

type QuestionRouteParams = {
  session: SessionInfo;
  sanitizedQuestion: any;
};

export default function QuestionScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const route = useRoute<RouteProp<{ params: QuestionRouteParams }>>();
  const { playFeedback } = useFeedback();
  const config = useConfig();
  const dailyTimer = config.daily_tournament.duration_sec * 1000;
  const INITIAL_TIME = config.single_player.round_timeout_sec * 1000;

  // ─── Question and Session State ───────────────────────────────────────────
  const [sanitizedQuestion, setSanitizedQuestion] = useState(
    route.params.sanitizedQuestion as sanitizedQuestionType
  );
  const [session, setSession] = useState<SessionInfo>(route.params.session);
  const [answer, setAnswer] = useState<number | null>(null);
  const [round, setRound] = useState(1);

  // ─── UI State ─────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // ─── Timer State ──────────────────────────────────────────────────────────
  const [elapsedTime, setElapsedTime] = useState(0);
  const [remainingMs, setRemainingMs] = useState(dailyTimer);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRemainingRef = useRef(remainingMs);

  // ─── Per-minute ad tracking ───────────────────────────────────────────────
  // Tracks which elapsed minute we last showed an ad for, so we fire once per minute.
  const lastAdMinuteRef = useRef<number>(0);

  const shouldShowAd = (): boolean => {
    if (session.sessionType !== SessionType.DAILY) return false;

    const elapsedMs = dailyTimer - pausedRemainingRef.current;
    const currentMinute = Math.floor(elapsedMs / 60000);

    // Never fire at minute 0 (first question), and only fire once per minute mark
    if (currentMinute <= 0) return false;
    if (currentMinute > lastAdMinuteRef.current) {
      lastAdMinuteRef.current = currentMinute;
      return true;
    }
    return false;
  };

  // ─── Ad moment state ──────────────────────────────────────────────────────
  // When true: ResultPopup shows leaderboard + Continue triggers the ad
  const [isAdMoment, setIsAdMoment] = useState(false);

  // Holds the next question data so handlePopupContinue can access it
  // after the async .then() closure has resolved
  const nextQuestionRef = useRef<sanitizedQuestionType | null>(null);

  // ─── Lifeline State ───────────────────────────────────────────────────────
  const maxLifeline = 5;
  const freeLifeline = 2;

  const [isFiftyFiftyAvailable, setIsFiftyFiftyAvailable] = useState(
    config.lifelines.max_per_session.fifty_fifty || maxLifeline
  );
  const [isThirtySecAvailable, setIsThirtySecAvailable] = useState(
    config.lifelines.max_per_session.plus_30s || maxLifeline
  );
  const [isLevelDownAvailable, setIsLevelDownAvailable] = useState(
    config.lifelines.max_per_session.level_down || maxLifeline
  );

  const [isFreeFiftyFiftyAvailable, setIsFreeFiftyFiftyAvailable] = useState(
    config.lifelines.free_daily.fifty_fifty || freeLifeline
  );
  const [isFreeThirtySecAvailable, setIsFreeThirtySecAvailable] = useState(
    config.lifelines.free_daily.plus_30s || freeLifeline
  );
  const [isFreeLevelDownAvailable, setIsFreeLevelDownAvailable] = useState(
    config.lifelines.free_daily.level_down || freeLifeline
  );

  const [lifelineBlock, setLifelineBlock] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [extraTime, setExtraTime] = useState(0);

  const [screenState, setScreenState] = useState('playing');
  const [currentScore, setCurrentScore] = useState<number>(0);

  const [showPopup, setShowPopup] = useState(false);

  // ─── Solo timer variables ─────────────────────────────────────────────────
  const [remainingTime, setRemainingTime] = useState(INITIAL_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(INITIAL_TIME);

  const [isSubmittingSession, setIsSubmittingSession] = useState<boolean>(false);
  const questionStartRemainingRef = useRef<number>(0);

  // ─── Session submission ───────────────────────────────────────────────────
  const handleDailySessionSubmit = async () => {
    setIsSubmittingSession(true);
    console.log('submitting session');
    try {
      const res = await finalSubmission({ sessionId: session.sessionId });
      const data = res.data;
      console.log(data);
      navigation.navigate('homeMain');
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsSubmittingSession(false);
    }
  };

  const handleInstantSessionSubmit = async () => {
    setIsSubmittingSession(true);
    console.log('submitting session');
    try {
      const submissionRes = await finalInstantSubmission(session.sessionId);
      console.log('Submitted instant session: ', submissionRes);
      navigation.navigate('homeMain');
    } catch (err: any) {
      console.log(err);
    } finally {
      setIsSubmittingSession(false);
    }
  };

  if (!sanitizedQuestion) {
    const payload = {
      errorCode: 500,
      errorMessage: "Couldn't found Questions to Display",
    };
    navigation.navigate('errorScreen', { params: payload });
  }

  const n = sanitizedQuestion.kthDigit;
  const ordinal = n + getOrdinalSuffix(n);
  const QuestionString = `what is the ${ordinal} digit from ${sanitizedQuestion.side} for the expression ${sanitizedQuestion.expression}`;

  const sessionDetails = {
    userId: session.userId,
    sessionId: session.sessionId,
  };

  const { stopFeedback } = useFeedback();

  useEffect(() => {
    if (session.sessionType === SessionType.SOLO) {
      startTimer();
    } else if (
      session.sessionType === SessionType.DAILY ||
      session.sessionType === SessionType.INSTANT
    ) {
      startCountdownTimer();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Timer: DAILY & INSTANT ───────────────────────────────────────────────
  const handleDailyEnd = async () => {
    console.log('Daily timer finished');
    setAnswer(null);
    setCorrectAnswer(null);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigation.navigate('homeMain');
    }, 1500);
  };

  const pauseDailyTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
    pausedRemainingRef.current = remainingMs;
  };

  const resumeDailyTimer = () => {
    if (!isPaused && intervalRef.current) return;
    setIsPaused(false);

    const resumeStart = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - resumeStart;
      const newRemaining = pausedRemainingRef.current - elapsed;
      setRemainingMs(Math.max(newRemaining, 0));

      if (newRemaining <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        handleDailyEnd();
      }
    }, 10) as unknown as number;
  };

  const startCountdownTimer = () => {
    if (intervalRef.current) return;
    pausedRemainingRef.current = dailyTimer;
    setRemainingMs(pausedRemainingRef.current);
    questionStartRemainingRef.current = pausedRemainingRef.current;
    resumeDailyTimer();
  };

  // ─── Timer: SOLO ──────────────────────────────────────────────────────────
  const startTimer = (initialTime: number = INITIAL_TIME) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(true);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = initialTime;
    setRemainingTime(initialTime);

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      const remaining = pausedTimeRef.current - elapsed;

      if (remaining <= 0) {
        setRemainingTime(0);
        stopTimer();
        onTimerFinish();
      } else {
        setRemainingTime(remaining);
      }
    }, 10) as unknown as number;
  };

  const stopTimer = () => {
    console.log('Timer stopped');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    pausedTimeRef.current = remainingTime;
    setIsRunning(false);
    console.log('Timer paused at:', remainingTime);
  };

  const resumeTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(true);
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      const remaining = pausedTimeRef.current - elapsed;

      if (remaining <= 0) {
        setRemainingTime(0);
        stopTimer();
        onTimerFinish();
      } else {
        setRemainingTime(remaining);
      }
    }, 10) as unknown as number;
  };

  const addTime = (extraMs: number) => {
    const newTime = remainingTime + extraMs;
    pausedTimeRef.current = newTime;
    setRemainingTime(newTime);
    if (isRunning) {
      startTimeRef.current = Date.now();
    }
    console.log(`Added ${extraMs}ms. New time: ${newTime}ms`);
  };

  const resetTimer = () => {
    stopTimer();
    setRemainingTime(INITIAL_TIME);
    pausedTimeRef.current = INITIAL_TIME;
  };

  const onTimerFinish = () => {
    console.log('Timer finished!');
    setAnswer(null);
    setCorrectAnswer(null);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigation.navigate('homeMain');
    }, 1500);
  };

  const formattedTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getTimeTaken = (): number => {
    if (
      session.sessionType === SessionType.DAILY ||
      session.sessionType === SessionType.INSTANT
    ) {
      return questionStartRemainingRef.current - remainingMs;
    }
    return INITIAL_TIME - remainingTime;
  };

  // ─── Animation ────────────────────────────────────────────────────────────
  const blinkAnims = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(1))
  ).current;

  const scaleAnims = useRef(
    Array.from({ length: 10 }, () => new Animated.Value(1))
  ).current;

  const startPulseWave = () => {
    blinkAnims.forEach((anim) => anim.stopAnimation());
    scaleAnims.forEach((anim) => anim.stopAnimation());

    blinkAnims.forEach((opacityAnim, index) => {
      const scaleAnim = scaleAnims[index];
      const delay = Math.random() * 1000;

      setTimeout(() => {
        Animated.loop(
          Animated.parallel([
            Animated.sequence([
              Animated.timing(opacityAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
              Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
            Animated.sequence([
              Animated.timing(scaleAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
              Animated.timing(scaleAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
          ])
        ).start();
      }, delay);
    });
  };

  const stopBlinking = () => {
    blinkAnims.forEach((anim) => {
      anim.stopAnimation();
      anim.setValue(1);
    });
  };

  // ─── Answer selection ─────────────────────────────────────────────────────
  const handleSelect = (value: number) => {
    console.log('Value: ', value);
    if (!isChecking && !showResult && !disabledOptions.includes(value)) {
      setAnswer(value);
      console.log('Selected answer:', value, ' - answer : ', answer);
      setTimeout(() => {
        handleSubmit(value);
      }, 300);
    } else {
      console.log('noo');
    }
  };

  const getApiFns = (selectedAnswer: number) => {
    const timeTaken = getTimeTaken();

    switch (session.sessionType) {
      case SessionType.DAILY:
        return {
          nextQuestionFn: () =>
            submitQuestion({
              dailyTournamentSessionId: session.sessionId,
              questionId: sanitizedQuestion.id,
              answer: selectedAnswer!,
              timeTaken,
            }),
        };

      case SessionType.INSTANT:
        return {
          nextQuestionFn: () =>
            submitInstantQuestion(
              session.sessionId,
              sanitizedQuestion.id,
              selectedAnswer!,
              timeTaken
            ),
        };

      case SessionType.SOLO:
      default:
        return {
          nextQuestionFn: () =>
            nextQuestion({
              soloSessionId: session.sessionId,
              questionId: sanitizedQuestion.id,
              userAnswer: selectedAnswer!,
              sessionType: SessionType.SOLO,
              time: timeTaken,
            }),
        };
    }
  };

  // ─── ResultPopup Continue handler ─────────────────────────────────────────
  // This fires when the user taps "Continue" on the ResultPopup.
  // For DAILY: if it's an ad moment, show the ad first, then load next question.
  // Timer stays paused throughout — it only resumes after everything is done.
  const handlePopupContinue = async () => {
    setShowPopup(false);

    if (isAdMoment) {
      setIsAdMoment(false);
      await showAd(); // ad plays here, after user explicitly tapped Continue
    }

    // Load next question and resume timer
    resetQuestion();
    if (nextQuestionRef.current) {
      setSanitizedQuestion(nextQuestionRef.current);
      nextQuestionRef.current = null;
    }
    setLifelineBlock(false);
    questionStartRemainingRef.current = remainingMs;
    resumeDailyTimer();
  };

  // ─── Submit answer ────────────────────────────────────────────────────────
  const handleSubmit = async (selectedAnswer: number) => {
    await playFeedback('submit');

    if (
      session.sessionType === SessionType.DAILY ||
      session.sessionType === SessionType.INSTANT
    ) {
      pauseDailyTimer();
    } else {
      stopTimer();
    }

    setIsChecking(true);
    setShowResult(false);
    startPulseWave();

    const timeTaken = getTimeTaken();
    console.log('Time taken (ms):', timeTaken);

    setLoading(true);

    const { nextQuestionFn } = getApiFns(selectedAnswer);
    console.log('submitting a question');

    nextQuestionFn()
      .then(async (response: any) => {
        stopBlinking();
        setIsChecking(false);

        const responseCorrectAnswer = response.data.correctAnswer;
        setCorrectAnswer(responseCorrectAnswer);
        setShowResult(true);

        console.log('Response: ', response);
        console.log('answer: ', answer);

        // Determine success depending on session type
        const check =
          session.sessionType === SessionType.SOLO
            ? response.data.success
            : response.success;

        if (check) {
          await playFeedback('correct');
        } else {
          await playFeedback('wrong');
        }

        if (check) {
          if (
            session.sessionType === SessionType.DAILY ||
            session.sessionType === SessionType.INSTANT
          ) {
            setCurrentScore(response.data.currentScore);
            setCorrectAnswer(response.data.correctAnswer);

            // ── KEY CHANGE ──────────────────────────────────────────────────
            // Store the next question so handlePopupContinue can access it.
            nextQuestionRef.current = response.data.nextQuestion;

            // Decide now (while elapsed time is accurate) whether this answer
            // crossed a 1-minute mark. The flag drives ResultPopup to show
            // the leaderboard, and handlePopupContinue to fire the ad.
            const adMoment =
              session.sessionType === SessionType.DAILY && shouldShowAd();
            setIsAdMoment(adMoment);
            // ────────────────────────────────────────────────────────────────

            // Show the popup. Timer stays paused — it only resumes inside
            // handlePopupContinue after the user taps Continue (and the ad
            // plays if adMoment is true).
            setShowPopup(true);

          } else if (session.sessionType === SessionType.SOLO) {
            setShowPopup(true);
            setTimeout(() => {
              setShowPopup(false);
              if (response.data.isRoundCompleted) {
                setRound(response.data.roundNumber + 1);
                console.log('response :- ', response);
                const params: continueParams = {
                  sessionType: session.sessionType,
                  userId: sessionDetails?.userId as string,
                  sessionId: sessionDetails?.sessionId as string,
                  bankedPoint: response?.data.bankedPoint as number,
                };
                navigation.navigate('ad', { params });
              } else {
                resetQuestion();
                setSanitizedQuestion(response.data.nextQuestion);
                setLifelineBlock(false);
                startTimer();
              }
            }, 1500);
          }
        } else {
          // Wrong answer — show popup briefly then navigate home
          setShowPopup(true);
          setTimeout(async () => {
            setShowPopup(false);
            navigation.navigate('homeMain');
          }, 1500);
        }
      })
      .catch((err) => {
        console.error('nextQuestion error:', err);
        stopBlinking();
        setIsChecking(false);
        const payload = {
          errorCode: 500,
          errorMessage: 'Error submitting answer. Please try again.',
        };
        navigation.navigate('errorScreen', { params: payload });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetQuestion = () => {
    setAnswer(null);
    setCorrectAnswer(null);
    setShowResult(false);
    setDisabledOptions([]);
    if (session.sessionType === SessionType.SOLO) {
      setExtraTime(0);
    }
  };

  const { showAd } = useInterstitialAd();

  // ─── Lifeline: 50-50 ──────────────────────────────────────────────────────
  const handleFiftyfiftySubmitWithAd = () => {
    showAd();
    handleFiftyfiftySubmit();
  };

  const handleFiftyfiftySubmit = () => {
    if (
      session.sessionType === SessionType.DAILY ||
      session.sessionType === SessionType.INSTANT
    ) {
      pauseDailyTimer();
    } else {
      pauseTimer();
    }
    setLoading(true);
    const payload = {
      sessionType: session.sessionType,
      sessionId: session.sessionId,
      questionId: sanitizedQuestion.id,
    };

    applyFiftyfifty(payload)
      .then((res) => {
        console.log('50-50 response:', res);
        if (res.success && res.disabledOptions) {
          setDisabledOptions(res.disabledOptions);
          if (
            session.sessionType === SessionType.DAILY ||
            session.sessionType === SessionType.INSTANT
          ) {
            console.log('🟢 resumeDailyTimer');
            resumeDailyTimer();
          } else {
            startTimer();
          }
          const remainingFiftyFifty = isFiftyFiftyAvailable - 1;
          setIsFiftyFiftyAvailable(remainingFiftyFifty < 0 ? 0 : remainingFiftyFifty);
          if (remainingFiftyFifty <= maxLifeline - freeLifeline) {
            console.log('🔴 LIMIT REACHED.');
            setIsFreeFiftyFiftyAvailable(false);
          }
          setLifelineBlock(true);
        }
      })
      .catch((err) => {
        console.error('50-50 error:', err);
        alert('Error applying 50-50. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ─── Lifeline: +30 Seconds ────────────────────────────────────────────────
  const handleThirtyPlusSubmitWithAd = () => {
    showAd();
    handleThirtyPlusSubmit();
  };

  const handleThirtyPlusSubmit = () => {
    if (
      session.sessionType === SessionType.DAILY ||
      session.sessionType === SessionType.INSTANT
    ) {
      pauseDailyTimer();
    } else {
      pauseTimer();
    }

    if (session.sessionType === SessionType.SOLO) {
      addTime(30000);
      resumeTimer();
    } else if (
      session.sessionType === SessionType.DAILY ||
      session.sessionType === SessionType.INSTANT
    ) {
      pausedRemainingRef.current += 30000;
      setRemainingMs((prev) => prev + 30000);
      resumeDailyTimer();
    }

    const remainingThirtySec = isThirtySecAvailable - 1;
    setIsThirtySecAvailable(remainingThirtySec < 0 ? 0 : remainingThirtySec);
    if (remainingThirtySec <= maxLifeline - freeLifeline) {
      setIsFreeThirtySecAvailable(false);
    }
    setLifelineBlock(true);
  };

  // ─── Lifeline: Level Down ─────────────────────────────────────────────────
  const handleLevelDownWithAd = () => {
    showAd();
    handleLevelDownSubmit();
  };

  const handleLevelDownSubmit = () => {
    console.log(
      ':::::::::::: Level Down CALLED ',
      isChecking,
      showResult,
      isLevelDownAvailable,
      lifelineBlock
    );
    if (
      session.sessionType === SessionType.DAILY ||
      session.sessionType === SessionType.INSTANT
    ) {
      pauseDailyTimer();
    } else {
      pauseTimer();
    }
    setLoading(true);
    const payload = {
      sessionType: session.sessionType,
      sessionId: session.sessionId,
      questionId: sanitizedQuestion.id,
    };

    LevelDown(payload)
      .then((res) => {
        console.log('Level Down response:', res);

        if (res.success && res.data?.newQuestion) {
          resetQuestion();
          setSanitizedQuestion(res.data.newQuestion);

          const remainingLevelDown = isLevelDownAvailable - 1;
          setIsLevelDownAvailable(remainingLevelDown < 0 ? 0 : remainingLevelDown);

          if (remainingLevelDown <= maxLifeline - freeLifeline) {
            setIsFreeLevelDownAvailable(false);
          }
          if (
            session.sessionType === SessionType.DAILY ||
            session.sessionType === SessionType.INSTANT
          ) {
            console.log('🟢 resumeDailyTimer');
            resumeDailyTimer();
          } else {
            startTimer();
          }
          setLifelineBlock(true);
        }
      })
      .catch((err) => {
        console.error('Level Down error:', err);
        alert('Error applying Level Down. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  const renderContent = () => {
    switch (screenState) {
      case 'playing':
      default:
        return (
          <View style={styles.container}>
            <ScrollView
              bounces={false}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              <SafeAreaView style={styles.safe}>
                <AdBanner />
                <View style={styles.detailsBox}>
                  <View style={styles.questionMeta}>
                    <Text style={styles.questionNumber}>
                      Q : <Text>{sanitizedQuestion.questionIndex}</Text>
                    </Text>
                    <Text style={styles.questionLevel}>
                      Level : <Text>{sanitizedQuestion.level}</Text>
                    </Text>
                  </View>
                  <Text style={styles.question}>{QuestionString}</Text>
                </View>

                <View style={styles.answerMeta}>
                  <View style={styles.timer}>
                    <AntDesign
                      name="clock-circle"
                      size={20}
                      color={colors.textSecondary}
                    />
                    {session.sessionType === SessionType.SOLO ? (
                      <Text style={styles.time}>
                        {formattedTime(remainingTime)}
                      </Text>
                    ) : (
                      <Text style={styles.time}>{formatTime(remainingMs)}</Text>
                    )}
                  </View>
                  <View style={styles.hintBox}>
                    <Text style={styles.hintText}>
                      {isChecking
                        ? 'Checking... 🤔'
                        : showResult
                          ? answer === correctAnswer
                            ? 'Correct! 🎉'
                            : 'Wrong! 😢'
                          : 'Are you sure 💭 ?'}
                    </Text>
                  </View>
                </View>

                <View style={styles.questionArea}>
                  <View style={styles.optionsContainer}>
                    {keypadLayout.map((row, rowIndex) => (
                      <View key={rowIndex} style={styles.row}>
                        {row.map((value) => {
                          const isDisabled = disabledOptions.includes(value);
                          const isSelected = answer === value;
                          const isCorrect = showResult && value === correctAnswer;
                          const isWrong =
                            showResult &&
                            value === answer &&
                            value !== correctAnswer;

                          return (
                            <Animated.View
                              key={value}
                              style={{
                                opacity: isChecking
                                  ? blinkAnims[value]
                                  : isDisabled
                                    ? 0.3
                                    : 1,
                                transform: [
                                  { scale: isChecking ? scaleAnims[value] : 1 },
                                ],
                              }}
                            >
                              <TouchableOpacity
                                disabled={isChecking || showResult || isDisabled}
                                style={[
                                  styles.optionBtn,
                                  isSelected && !showResult && styles.optionBtnSelected,
                                  isCorrect && styles.optionBtnCorrect,
                                  isWrong && styles.optionBtnWrong,
                                  isDisabled && styles.optionBtnDisabled,
                                ]}
                                onPress={() => handleSelect(value)}
                              >
                                <Text
                                  style={[
                                    styles.optionText,
                                    isSelected && !showResult && styles.optionTextSelected,
                                    (isCorrect || isWrong) && styles.optionTextResult,
                                  ]}
                                >
                                  {value}
                                </Text>
                              </TouchableOpacity>
                            </Animated.View>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                </View>

                <View style={[styles.lifelineBox, lifelineBlock && { opacity: 0.6 }]}>
                  <TouchableOpacity
                    style={styles.lifelineBtn}
                    disabled={isChecking || showResult || lifelineBlock}
                    onPress={
                      isFreeFiftyFiftyAvailable
                        ? handleFiftyfiftySubmit
                        : handleFiftyfiftySubmitWithAd
                    }
                  >
                    <Text style={styles.lifelineBtnText}>50-50</Text>
                    {!isFreeFiftyFiftyAvailable && (
                      <Text style={styles.adText}>Ad</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.lifelineBtn}
                    disabled={isChecking || showResult || lifelineBlock}
                    onPress={
                      isFreeThirtySecAvailable
                        ? handleThirtyPlusSubmit
                        : handleThirtyPlusSubmitWithAd
                    }
                  >
                    <Text style={styles.lifelineBtnText}>+30 Sec</Text>
                    {!isFreeThirtySecAvailable && (
                      <Text style={styles.adText}>Ad</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.lifelineBtn}
                    disabled={isChecking || showResult || lifelineBlock}
                    onPress={
                      isFreeLevelDownAvailable
                        ? handleLevelDownSubmit
                        : handleLevelDownWithAd
                    }
                  >
                    <Text style={styles.lifelineBtnText}>Level Down</Text>
                    {!isFreeLevelDownAvailable && (
                      <Text style={styles.adText}>Ad</Text>
                    )}
                  </TouchableOpacity>
                </View>

                {/*
                  ResultPopup is now driven entirely by handlePopupContinue.
                  - onClose fires when user taps "Continue"
                  - currentScore shows "Your Score: N" badge in the popup
                  - showLeaderboard shows TOP 3 section only on per-minute ad moments
                  - leaderboard is fetched live inside ResultPopup using sessionId
                */}
                <ResultPopup
                  key={sanitizedQuestion.id}
                  visible={showPopup}
                  isCorrect={answer !== null && answer === correctAnswer}
                  correctAnswer={correctAnswer ?? 0}
                  userAnswer={answer}
                  onClose={handlePopupContinue}
                  colors={colors}
                  currentScore={currentScore}
                  showLeaderboard={isAdMoment}
                  sessionId={session.sessionId}
                />
              </SafeAreaView>
            </ScrollView>
          </View>
        );

      case 'finished':
        return (
          <>
            <ScoreSubmitScreen
              isSubmittingSession={isSubmittingSession}
              finalScore={currentScore}
              handleSubmit={
                session.sessionType === SessionType.DAILY
                  ? handleDailySessionSubmit
                  : handleInstantSessionSubmit
              }
            />
          </>
        );
    }
  };

  return renderContent();
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    safe: {
      padding: 16,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flex: 1,
      backgroundColor: colors.bgPrimary,
    },
    detailsBox: {
      width: '100%',
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 3,
      marginTop: 10,
    },
    questionMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    questionNumber: {
      fontWeight: 'bold',
      fontFamily: 'Saira-Medium',
      fontSize: 18,
      textDecorationLine: 'underline',
      color: colors.text,
    },
    questionLevel: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      fontWeight: 'bold',
      fontFamily: 'Saira-Medium',
      color: '#FFF',
    },
    question: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
      fontFamily: 'Saira-Medium',
    },
    answerMeta: {
      width: '100%',
      gap: 10,
      alignItems: 'center',
      paddingVertical: 10,
    },
    timer: {
      width: 160,
      backgroundColor: colors.textHighlight,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    time: {
      // fontWeight: '700',
      fontSize: 18,
      color: colors.textSecondary,
      fontFamily: 'Saira-Medium',
    },
    hintBox: {
      width: '100%',
      backgroundColor: '#FFF',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 5,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: colors.secondary,
    },
    hintText: {
      fontSize: 20,
      // fontWeight: '700',
      fontFamily: 'Saira-Medium',
      color: colors.secondary,
    },
    questionArea: {
      padding: 10,
    },
    optionsContainer: {},
    row: {
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 30,
      // justifyContent: "space-between"
    },
    optionBtn: {
      width: 60,
      height: 60,
      borderRadius: 999,
      borderWidth: 2,
      backgroundColor: colors.bg,
      borderColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionBtnSelected: {
      backgroundColor: colors.secondary,
      borderWidth: 3,
      transform: [{ scale: 1.1 }],
    },
    optionBtnCorrect: {
      backgroundColor: '#2ecc71',
      borderColor: '#27ae60',
    },
    optionBtnWrong: {
      backgroundColor: '#e74c3c',
      borderColor: '#c0392b',
    },
    optionBtnDisabled: {
      backgroundColor: colors.shadow,
      borderColor: colors.shadow,
    },
    optionText: {
      fontSize: 20,
      // fontWeight: '900',
      fontFamily: 'Saira-Medium',
      color: colors.secondary,
    },
    optionTextSelected: {
      color: colors.bg,
    },
    optionTextResult: {
      color: '#FFF',
    },
    lifelineBox: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 10,
    },
    lifelineBtn: {
      backgroundColor: colors.secondary,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    adText: {
      position: 'absolute',
      right: 0,
      top: 0,
      paddingHorizontal: 5,
      paddingVertical: 3,
      borderRadius: 5,
      fontSize: 8,
      color: colors.text,
      fontFamily: 'Poppins-Medium',
      // backgroundColor: colors.border,
      opacity: 0.8,
    },
    // adScreen: {
    //   position: 'absolute',
    //   width: '100%',
    //   height: '100%',
    //   backgroundColor: 'rgba(0, 0, 0, 0.8)',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   color: '#fff',
    //   opacity: 50,
    // },
    lifelineBtnText: {
      fontSize: 16,
      fontWeight: 'bold',
      fontFamily: 'Rubic-Medium',
      color: colors.textSecondary,
    },
    nextBtn: {
      marginTop: 20,
      backgroundColor: colors.secondary,
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      width: '70%',
      alignSelf: 'center',
    },
    nextBtnDisabled: {
      opacity: 0.5,
    },
    startBtnText: {
      color: colors.textSecondary,
      fontSize: 20,
      fontWeight: '700',
    },
    adScreen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      elevation: 9999,
    },

    adTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: 'white',
    },

    adSubtitle: {
      marginTop: 10,
      fontSize: 18,
      color: 'white',
    },
  });
