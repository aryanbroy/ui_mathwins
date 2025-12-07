import { Text, StyleSheet, TouchableOpacity } from 'react-native';

type ScoreSubmitScreenProps = {
  isSubmittingSession: boolean;
  handleSubmit: () => void;
};

export default function ScoreSubmitScreen({
  isSubmittingSession,
  handleSubmit,
}: ScoreSubmitScreenProps) {
  return (
    <TouchableOpacity
      disabled={isSubmittingSession}
      // disabled
      style={isSubmittingSession ? styles.submitBtnDisabled : styles.submitBtn}
      onPress={handleSubmit}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
});
