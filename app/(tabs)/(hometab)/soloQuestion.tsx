import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { finalsubmission, nextQuestion } from '@/lib/api/soloTournament';

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
export default function SoloQuestionScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [answer, setAnswer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [round, setRound] = useState(1);
  const route = useRoute<any>();
  const [ sanitizedQuestion, setSanitizedQuestion ] = useState(route.params.sanitizedQuestion as sanitizedQuestionType);
  const [ session, setSession ] = useState(route.params.session as sanitizedSessionType);
  console.log("param question : ",sanitizedQuestion);
  console.log("param sesison : ",session);
  

  const handleSelect = (value: number) => {
    setAnswer(value);
    console.log("clicked : ",value);
  };
  const payload = {
    userId: session.userId,
    soloSessionId: session.soloSessionId,
    questionId: sanitizedQuestion.id,
    userAnswer: answer,
    time: 4732
  }
  const sessionDetails = {
    userId: session.userId,
    soloSessionId: session.soloSessionId,
  }
  const handleSubmit = () => {
    setLoading(true);

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
        <LinearGradient 
        colors={colors.gradients.surface}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.questionBox}>
        <View style={styles.detailsBox}>
          <Text style={styles.textBox}>Level : <Text>{sanitizedQuestion.level}</Text></Text>
        </View>
          <View style={styles.questionArea}>
            <Text style={{color: "#a0a0a0", fontSize: 20,}}>id: {sanitizedQuestion.id}</Text>
            <Text 
            style={styles.question}
            >
              For expression <Text style={styles.highlight}>{sanitizedQuestion.expression}</Text>. What is the <Text style={styles.highlight}>{sanitizedQuestion.kthDigit}</Text>th element from <Text style={styles.highlight}>{sanitizedQuestion.side}</Text> ?
            </Text>
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
        // onPress={() => navigation.navigate('Next')}
        onPress={handleSubmit}
        >
          <Text style={styles.startBtnText}>{loading ? 'Next Question' : 'loading'}</Text>
        </TouchableOpacity>
        </LinearGradient>

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
      backgroundColor: colors.bg,
      padding: 20,
      borderRadius: 20,
    },
    detailsBox: {
      width: "100%",
      alignItems: "flex-end"
    },
    textBox: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 7,    
      fontSize: 15,
      color: colors.bg,
      fontWeight: 900,
    },
    question: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 500,
    },
    highlight: {
      fontSize: 20,
      fontWeight: 700,
      color: colors.primary,
    },
    questionArea: {
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    optionsContainer: {
      paddingVertical: 50,
      // backgroundColor: colors.primary,
    },
    row: {
      paddingVertical: 10,
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
      borderColor: colors.text,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionText: {
      fontSize: 20,
      fontWeight: 700,
      color: colors.text,
    },
    startBtn: {
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%',
        alignSelf: 'center',
    },
    startBtnText: {
        color: colors.text,
        fontSize: 20,
        fontWeight: 700,
    }
    });
