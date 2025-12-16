import { DailyQuestion } from '@/types/api/daily';
import { InstantQuestion } from '@/types/api/instant';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

type QuestionScreenProps = {
  isLoading: boolean;
  timer: number;
  question: DailyQuestion | InstantQuestion;
  displayQuestion: DailyQuestion | InstantQuestion;
  tournament?: string;
  bannerTimer?: number;
  handleSelect: (value: number) => void;
};

export default function QuestionScreen({
  isLoading,
  timer,
  question,
  displayQuestion,
  tournament,
  bannerTimer,
  handleSelect,
}: QuestionScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="chevron-back" size={24} />
          <View style={styles.headerCenter}>
            <View style={styles.timerBadge}>
              <Text style={styles.timerText}>{timer}</Text>
            </View>
          </View>
          <View style={{ width: 24 }} />
        </View>
        {isLoading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={styles.questionWrapper}>
              <Text style={styles.questionLine1}>
                What is the{' '}
                {displayQuestion ? displayQuestion.kthDigit : question.kthDigit}{' '}
                digit from the{' '}
                {displayQuestion ? displayQuestion.side : question.side} of the
              </Text>
              <Text style={styles.questionLine1}>answer to:</Text>
              <Text style={styles.questionExpression}>
                {displayQuestion.expression}
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
      {tournament === 'instant' && bannerTimer === 0 && (
        <View style={styles.bannerSlot}>{/* Banner Ad goes here later */}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  timerBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF4B8C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  progressText: {
    marginTop: 16,
    fontSize: 12,
  },
  questionWrapper: {
    marginTop: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  questionLine1: {
    fontSize: 16,
    textAlign: 'center',
  },
  questionExpression: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '700',
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
  loadingView: {
    marginTop: 24,
  },
  content: {
    flex: 1,
  },
  bannerSlot: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EDEEF3',
  },
});
