import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { finalsubmission, nextQuestion } from '@/lib/api/soloTournament';
import QuestionScreen from '@/components/QuestionScreen/QuestionScreen';

type sanitizedQuestionType = {
  id: string,
  expression: string,
  kthDigit: number,
  level: number,
  side: string
}
type sanitizedSessionType = {
  soloSessionId: string,
  userId: string,
}
type SoloScreenProps = {
  sanitizedQuestion: sanitizedQuestionType;
};
const keypadLayout = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [9],
];

function getOrdinalSuffix(n:number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10); // Get centiseconds (2 digits)
  
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}

export default function questionScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [answer, setAnswer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const route = useRoute<any>();
  const [ sanitizedQuestion, setSanitizedQuestion ] = useState(route.params.sanitizedQuestion as sanitizedQuestionType);
  const [ session, setSession ] = useState(route.params.session as sanitizedSessionType);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  
  console.log("param question : ",sanitizedQuestion);
  console.log("param sesison : ",session);
  
  const n = sanitizedQuestion.kthDigit;
  const ordinal = n + getOrdinalSuffix(n);

  const QuestionString = `what is the ${ordinal} digit from ${sanitizedQuestion.side} for the expression ${sanitizedQuestion.expression}`;

  const sessionDetails = {
    userId: session.userId,
    soloSessionId: session.soloSessionId,
  }
  useEffect(() => {
    startTimer();
    
    return () => {
      // Cleanup timer on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sanitizedQuestion.id]);
  const startTimer = () => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set start time
    startTimeRef.current = Date.now();
    setElapsedTime(0);
    
    // Update timer every 10ms for smooth display
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTimeRef.current;
      setElapsedTime(elapsed);
    }, 10);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getTimeTaken = (): number => {
    return Date.now() - startTimeRef.current;
  };
  
  const handleSelect = (value: number) => {
    setAnswer(value);
    console.log("clicked : ",value);
  };
  const handleSubmit = () => {
    stopTimer();
    const timeTaken = getTimeTaken();
    
    console.log("Time taken (ms):", timeTaken);
    setLoading(true);
    
    const payload = {
      // userId: session.userId,
      soloSessionId: session.soloSessionId,
      questionId: sanitizedQuestion.id,
      userAnswer: answer,
      time: timeTaken
    }
    nextQuestion(payload)
    .then((response) => {
        console.log('nextQuestion response:', response);
        if(response.success){
          setLoading(false);
          if ( response.isRoundCompleted ) {
            setRound(response.roundNumber+1);
            navigation.navigate('ad', {sessionDetails});
          } else {
            setSanitizedQuestion(response.nextQuestion);
          }
        } else {
          navigation.navigate('HomeMain');
        }
      })
      .catch((err) => {
        console.error('nextQuestion error:', err);
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
    style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.detailsBox}>
          <View style={styles.questionMeta}>
            <Text style={styles.questionNumber}>Q : <Text>1</Text></Text>
            <Text style={styles.questionLevel}>Level : <Text>{sanitizedQuestion.level}</Text></Text>
          </View>
          <Text style={styles.question}>{QuestionString}</Text>
        </View>
        <View style={styles.answerMeta}>
          <View style={styles.timer}>
            <AntDesign name="clock-circle" size={20} color="black" />
            <Text style={styles.time}>{formatTime(elapsedTime)}</Text>
          </View>
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>Are you sure 💭 ?</Text>
          </View>
        </View>
        <View style={styles.questionArea}>
          <View style={styles.optionsContainer}>
            {keypadLayout.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.row}>
                {row.map((value, colIndex) => {
                  return (
                    <TouchableOpacity
                      key={colIndex}
                      style={styles.optionBtn}
                      onPress={() => handleSelect(value)}
                    >
                      <Text style={styles.optionText}>{value}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity 
        style={styles.startBtn} 
        onPress={handleSubmit}
        >
          <Text style={styles.startBtnText}>
            {loading ? 'Loading...' : "Next Question"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
    StyleSheet.create({
    container: {
      flex:1,
    },
    safe: {
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    questionBox: {
      width: "100%",
      // backgroundColor: colors.bg,
      padding: 20,
      borderRadius: 20,
    },
    detailsBox: {
      width: "100%",
      backgroundColor: colors.card,
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderRadius: 10,
      borderWidth: 3,
    },
    questionMeta: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    questionNumber: {
      fontWeight: 900,
      fontSize: 20,
    },
    questionLevel: {
      backgroundColor: colors.secondary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      fontWeight: 800,
      color: "#FFF"
    },
    question: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 500,
    },
    answerMeta: {
      width: "100%",
      display: "flex",
      gap: 10,
      alignItems: "center",
      paddingVertical: 20,
    },
    timer: {
      width: 120,
      display: "flex",
      backgroundColor: colors.shadow,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    time: {
      fontWeight: 700,
      fontSize: 20,
      color: colors.text,
    },
    hintBox: {
      width: "100%",
      backgroundColor: colors.card,
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 5,
      borderRadius: 10,
      borderWidth: 3,
      borderColor: colors.secondary
    },
    hintText: {
      fontSize: 20,
      fontWeight: 700,
      color: colors.secondary,
    },
    highlight: {
      fontSize: 20,
      fontWeight: 700,
      color: colors.primary,
    },
    questionArea: {
      paddingHorizontal: 10,
      // backgroundColor: "white"
    },
    optionsContainer: {
      // backgroundColor: colors.primary,
    },
    row: {
      paddingVertical: 15,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 50,
    },
    optionBtn: {
      width: 60,
      height: 60,
      borderRadius: 999,
      borderWidth: 1,
      backgroundColor: colors.bg,
      borderColor: colors.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionText: {
      fontSize: 20,
      fontWeight: 900,
      color: colors.secondary,
    },
    startBtn: {
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
    startBtnText: {
        color: colors.textSecondary,
        fontSize: 20,
        fontWeight: 700,
    }
    });
