import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type ResultPopupProps = {
  visible: boolean;
  isCorrect: boolean;
  correctAnswer: number;
  userAnswer: number | null;
  onClose: () => void;
  colors: any;
};

const ResultPopup: React.FC<ResultPopupProps> = ({
  visible,
  isCorrect,
  correctAnswer,
  userAnswer,
  onClose,
  colors,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto close after 2 seconds
      const timer = setTimeout(() => {
        closeModal();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      onClose();
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={closeModal}
    >
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { scale: scaleAnim },
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* Success/Error Icon */}
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isCorrect ? '#2ecc71' : '#e74c3c',
              },
            ]}
          >
            <Text style={styles.iconText}>
              {isCorrect ? '✓' : '✗'}
            </Text>
          </View>

          {/* Result Message */}
          <Text style={[styles.resultTitle, { color: colors.text }]}>
            {isCorrect ? 'Correct!' : 'Wrong Answer!'}
          </Text>

          {/* Emoji */}
          <Text style={styles.emoji}>
            {isCorrect ? '🎉' : '😢'}
          </Text>

          {/* Answer Details */}
          <View style={styles.answerContainer}>
            {!isCorrect && (
              <>
                <View style={styles.answerRow}>
                  <Text style={[styles.answerLabel, { color: "#000" }]}>
                    Your Answer:
                  </Text>
                  <View style={[styles.answerBadge, styles.wrongBadge]}>
                    <Text style={styles.answerValue}>{userAnswer}</Text>
                  </View>
                </View>
              </>
            )}
            <View style={styles.answerRow}>
              <Text style={[styles.answerLabel, { color: "#000" }]}>
                {isCorrect ? 'Your Answer:' : 'Correct Answer:'}
              </Text>
              <View style={[styles.answerBadge, styles.correctBadge]}>
                <Text style={styles.answerValue}>{correctAnswer}</Text>
              </View>
            </View>
          </View>

          {/* Points/Score (optional) */}
          {isCorrect && (
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsText}>+1 Points</Text>
            </View>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    width: width * 0.85,
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  answerContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  answerLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  answerBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  correctBadge: {
    backgroundColor: '#2ecc71',
  },
  wrongBadge: {
    backgroundColor: '#e74c3c',
  },
  answerValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pointsContainer: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ResultPopup;