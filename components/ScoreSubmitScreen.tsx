// SubmissionScreen.tsx
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScoreSubmitScreenProps = {
  isSubmittingSession: boolean;
  handleSubmit: () => void;
  finalScore: number;
};

export default function ScoreSubmitScreen({
  isSubmittingSession,
  handleSubmit,
  finalScore,
}: ScoreSubmitScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Final Score: {finalScore}</Text>

      <TouchableOpacity
        disabled={isSubmittingSession}
        onPress={handleSubmit}
        style={
          isSubmittingSession ? styles.submitBtn : styles.submitBtnDisabled
        }
      >
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 40,
    textAlign: 'center',
  },

  scoreBubble: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FF4B8C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },

  scoreText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFF',
  },

  submitBtn: {
    width: '80%',
    paddingVertical: 16,
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  submitBtnDisabled: {
    width: '80%',
    paddingVertical: 16,
    backgroundColor: 'grey',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
