import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SoloScreen() {
  return (
    <View style={styles.container}>
      <>
        <Text style={styles.attemptsText}>
          {/* Daily tournament attempts left: {maxAttempts - attemptsLeft} */}
          Solo tournament attempts left : 1
        </Text>

        <TouchableOpacity style={styles.startBtn}>
          <Text style={styles.startBtnText}>Start game</Text>
        </TouchableOpacity>
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  attemptsText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  startBtn: {
    backgroundColor: '#6A5AE0',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoTitle: { fontWeight: '600', marginBottom: 8 },
  infoText: { marginBottom: 12 },
  retryBtn: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryBtnText: { color: '#fff', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
