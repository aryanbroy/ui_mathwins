import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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

type sanitizedQuestionType = {
  id: string;
  expression: string;
  kthDigit: number;
  level: number;
  side: string;
};

type sanitizedSessionType = {
  soloSessionId: string;
  userId: string;
};

const keypadLayout = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]];

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

export default function QuestionScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const route = useRoute<any>();

  // Question and Session State
  const [sanitizedQuestion, setSanitizedQuestion] = useState(
    route.params.sanitizedQuestion as sanitizedQuestionType
  );
  const [session, setSession] = useState(
    route.params.session as sanitizedSessionType
  );
  const [answer, setAnswer] = useState<number | null>(null);
  const [round, setRound] = useState(1);

  // UI State
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Timer State
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Lifeline State
  const [isFiftyFiftyAvailable, setIsFiftyFiftyAvailable] = useState(true);
  const [isThirtySecAvailable, setIsThirtySecAvailable] = useState(true);
  const [isLevelDownAvailable, setIsLevelDownAvailable] = useState(true);
  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  const [extraTime, setExtraTime] = useState(0);

  // Animation
  const blinkAnim = useRef(new Animated.Value(1)).current;

  const n = sanitizedQuestion.kthDigit;
  const ordinal = n + getOrdinalSuffix(n);
  const QuestionString = `what is the ${ordinal} digit from ${sanitizedQuestion.side} for the expression ${sanitizedQuestion.expression}`;

  const sessionDetails = {
    userId: session.userId,
    soloSessionId: session.soloSessionId,
  };

  // Timer Functions
  useEffect(() => {
    startTimer();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sanitizedQuestion.id]);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    startTimeRef.current = Date.now();
    setElapsedTime(0);

    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current + extraTime;
      setElapsedTime(elapsed);
    }, 10) as unknown as number;
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getTimeTaken = (): number => {
    return Date.now() - startTimeRef.current + extraTime;
  };

  const addExtraTime = (milliseconds: number) => {
    setExtraTime((prev) => prev + milliseconds);
  };

  // Animation Functions
  const startBlinking = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopBlinking = () => {
    blinkAnim.stopAnimation();
    blinkAnim.setValue(1);
  };

  // Answer Selection
  const handleSelect = (value: number) => {
    if (!isChecking && !showResult && !disabledOptions.includes(value)) {
      setAnswer(value);
      console.log('Selected answer:', value);
    }
  };

  // Submit Answer
  // handleSubmitSolo
  // handleSubmitDaily
  // handleSubmitInsatnt
  // if (params) {
    //   handleSubmitSolo || handleSubmitDaily || handleSubmitInsatnt
  // }
    
  // handleSubmitSolo
  const handleSubmit = () => {
    if (answer === null) {
      alert('Please select an answer');
      return;
    }

    stopTimer();
    setIsChecking(true);
    setShowResult(false);
    startBlinking();

    const timeTaken = getTimeTaken();
    console.log('Time taken (ms):', timeTaken);

    setLoading(true);

    const payload = {
      soloSessionId: session.soloSessionId,
      questionId: sanitizedQuestion.id,
      userAnswer: answer,
      time: timeTaken,
    };

    nextQuestion(payload)
      .then((response) => {
        stopBlinking();
        setIsChecking(false);
        setCorrectAnswer(response.correctAnswer);
        setShowResult(true);
        console.log('nextQuestion response:', response);

        if (response.success) {
          setTimeout(() => {
            if (response.isRoundCompleted) {
              setRound(response.roundNumber + 1);
              navigation.navigate('ad', { sessionDetails });
            } else {
              resetQuestion();
              setSanitizedQuestion(response.nextQuestion);
            }
          }, 3000);
        } else {
          setTimeout(() => {
            navigation.navigate('HomeMain');
          }, 3000);
        }
      })
      .catch((err) => {
        console.error('nextQuestion error:', err);
        stopBlinking();
        setIsChecking(false);
        alert('Error submitting answer. Please try again.');
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
    setExtraTime(0);
  };

  // Lifeline: 50-50
  const handleFiftyfiftySubmit = () => {
    if (!isFiftyFiftyAvailable || isChecking || showResult) return;

    setLoading(true);
    const payload = {
      soloSessionId: session.soloSessionId,
      questionId: sanitizedQuestion.id,
    };

    applyFiftyfifty(payload)
      .then((res) => {
        console.log('50-50 response:', res);
        if (res.success && res.disabledOptions) {
          setDisabledOptions(res.disabledOptions);
          setIsFiftyFiftyAvailable(false);
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

  // Lifeline: +30 Seconds
  const handleThirtyPlusSubmit = () => {
    if (!isThirtySecAvailable || isChecking || showResult) return;

    // Subtract 30 seconds (30000 ms) from elapsed time
    addExtraTime(-30000);
    setIsThirtySecAvailable(false);
    console.log('Added 30 seconds');
  };

  // Lifeline: Level Down
  const handleLevelDownSubmit = () => {
    if (!isLevelDownAvailable || isChecking || showResult) return;

    setLoading(true);
    const payload = {
      soloSessionId: session.soloSessionId,
      questionId: sanitizedQuestion.id,
    };

    LevelDown(payload)
      .then((res) => {
        console.log('Level Down response:', res);
        if (res.success && res.data?.newQuestion) {
          resetQuestion();
          setSanitizedQuestion(res.data.newQuestion);
          setIsLevelDownAvailable(false);
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

  return (
    <LinearGradient
      colors={colors.gradients.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.detailsBox}>
          <View style={styles.questionMeta}>
            <Text style={styles.questionNumber}>
              Q : <Text>{round}</Text>
            </Text>
            <Text style={styles.questionLevel}>
              Level : <Text>{sanitizedQuestion.level}</Text>
            </Text>
          </View>
          <Text style={styles.question}>{QuestionString}</Text>
        </View>

        <View style={styles.answerMeta}>
          <View style={styles.timer}>
            <AntDesign name="clock-circle" size={20} color={colors.text} />
            <Text style={styles.time}>{formatTime(elapsedTime)}</Text>
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
                {row.map((value, colIndex) => {
                  const isDisabled = disabledOptions.includes(value);
                  const isSelected = answer === value;
                  const isCorrect = showResult && value === correctAnswer;
                  const isWrong =
                    showResult && value === answer && value !== correctAnswer;

                  return (
                    <Animated.View
                      key={colIndex}
                      style={{
                        opacity: isChecking ? blinkAnim : isDisabled ? 0.3 : 1,
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
                            isSelected &&
                              !showResult &&
                              styles.optionTextSelected,
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

        <View style={styles.lifelineBox}>
          <TouchableOpacity
            style={
              isFiftyFiftyAvailable
                ? styles.lifelineBtn
                : styles.disabledLifelineBtn
            }
            disabled={!isFiftyFiftyAvailable || isChecking || showResult}
            onPress={handleFiftyfiftySubmit}
          >
            <Text style={styles.lifelineBtnText}>50-50</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              isThirtySecAvailable
                ? styles.lifelineBtn
                : styles.disabledLifelineBtn
            }
            disabled={!isThirtySecAvailable || isChecking || showResult}
            onPress={handleThirtyPlusSubmit}
          >
            <Text style={styles.lifelineBtnText}>+30 Sec</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              isLevelDownAvailable
                ? styles.lifelineBtn
                : styles.disabledLifelineBtn
            }
            disabled={!isLevelDownAvailable || isChecking || showResult}
            onPress={handleLevelDownSubmit}
          >
            <Text style={styles.lifelineBtnText}>Level Down</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.nextBtn,
            (loading || isChecking || showResult || answer === null) &&
              styles.nextBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || isChecking || showResult || answer === null}
        >
          <Text style={styles.startBtnText}>
            {loading || isChecking
              ? 'Loading...'
              : showResult
                ? 'Next Question...'
                : 'Submit Answer'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    safe: {
      padding: 16,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailsBox: {
      width: '100%',
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 10,
      borderWidth: 3,
    },
    questionMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    questionNumber: {
      fontWeight: '900',
      fontSize: 20,
      color: colors.text,
    },
    questionLevel: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      fontWeight: '800',
      color: '#FFF',
    },
    question: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '500',
    },
    answerMeta: {
      width: '100%',
      gap: 10,
      alignItems: 'center',
      paddingVertical: 20,
    },
    timer: {
      width: 160,
      backgroundColor: colors.shadow,
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
    },
    time: {
      fontWeight: '700',
      fontSize: 18,
      color: colors.text,
      fontFamily: 'monospace',
    },
    hintBox: {
      width: '100%',
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: colors.secondary,
    },
    hintText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.secondary,
    },
    questionArea: {
      paddingHorizontal: 10,
      marginVertical: 20,
    },
    optionsContainer: {},
    row: {
      paddingVertical: 15,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 50,
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
      fontWeight: '900',
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
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    disabledLifelineBtn: {
      backgroundColor: colors.shadow,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.5,
    },
    lifelineBtnText: {
      fontSize: 16,
      fontWeight: '700',
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
  });

