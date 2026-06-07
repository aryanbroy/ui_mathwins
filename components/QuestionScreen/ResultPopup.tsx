import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_W = Math.min(width - 48, 320);

type ResultPopupProps = {
  visible: boolean;
  isCorrect: boolean;
  correctAnswer: number;
  userAnswer: number | null;
  onClose: () => void;
  colors: any;
};

const Abs = ({ style }: { style: any }) => <View style={[{ position: 'absolute' }, style]} />;

const CONFETTI: any[] = [
  { top: 100, left: 14, width: 10, height: 10, backgroundColor: '#F4A83A', borderRadius: 2, transform: [{ rotate: '30deg' }] },
  { top: 135, left: 26, width: 8, height: 8, backgroundColor: '#E94F6A', borderRadius: 4 },
  { top: 160, left: 12, width: 12, height: 6, backgroundColor: '#4CC9F0', borderRadius: 2, transform: [{ rotate: '-20deg' }] },
  { top: 185, left: 32, width: 9, height: 9, backgroundColor: '#7B61FF', borderRadius: 2, transform: [{ rotate: '45deg' }] },
  { top: 210, left: 18, width: 7, height: 7, backgroundColor: '#F4A83A', borderRadius: 1 },
  { top: 230, left: 44, width: 11, height: 5, backgroundColor: '#4CC9F0', borderRadius: 2, transform: [{ rotate: '15deg' }] },
  { top: 105, right: 22, width: 10, height: 10, backgroundColor: '#4CC9F0', borderRadius: 2, transform: [{ rotate: '-30deg' }] },
  { top: 138, right: 38, width: 8, height: 8, backgroundColor: '#F4A83A', borderRadius: 4 },
  { top: 162, right: 16, width: 12, height: 6, backgroundColor: '#7B61FF', borderRadius: 2, transform: [{ rotate: '20deg' }] },
  { top: 188, right: 48, width: 9, height: 9, backgroundColor: '#E94F6A', borderRadius: 2, transform: [{ rotate: '-45deg' }] },
  { top: 215, right: 20, width: 7, height: 7, backgroundColor: '#4CC9F0', borderRadius: 1 },
  { top: 235, right: 42, width: 11, height: 5, backgroundColor: '#F4A83A', borderRadius: 2, transform: [{ rotate: '-15deg' }] },
  { top: 250, left: 28, width: 10, height: 10, backgroundColor: '#E94F6A', borderRadius: 2, transform: [{ rotate: '20deg' }] },
  { top: 265, left: 58, width: 8, height: 8, backgroundColor: '#F4A83A', borderRadius: 4 },
  { top: 252, left: 80, width: 11, height: 5, backgroundColor: '#4CC9F0', borderRadius: 2 },
  { top: 250, right: 28, width: 10, height: 10, backgroundColor: '#7B61FF', borderRadius: 2, transform: [{ rotate: '-20deg' }] },
  { top: 268, right: 60, width: 8, height: 8, backgroundColor: '#E94F6A', borderRadius: 4 },
  { top: 254, right: 82, width: 11, height: 5, backgroundColor: '#F4A83A', borderRadius: 2 },
];

const WrongDecorations = () => (
  <>
    {/* × marks */}
    <Text style={[s.dec, { top: 108, left: 18, color: '#E84B6E', fontSize: 22, fontWeight: '900' }]}>×</Text>
    <Text style={[s.dec, { top: 200, left: 14, color: '#E84B6E', fontSize: 18, fontWeight: '900' }]}>×</Text>
    <Text style={[s.dec, { top: 240, left: 92, color: '#E84B6E', fontSize: 16, fontWeight: '900' }]}>×</Text>
    <Text style={[s.dec, { top: 108, right: 14, color: '#E84B6E', fontSize: 20, fontWeight: '900' }]}>×</Text>
    <Text style={[s.dec, { top: 230, right: 22, color: '#E84B6E', fontSize: 22, fontWeight: '900' }]}>×</Text>
    {/* dots */}
    <Abs style={{ top: 145, left: 34, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E84B6E' }} />
    <Abs style={{ top: 188, left: 50, width: 6, height: 6, borderRadius: 3, backgroundColor: '#c0002a' }} />
    <Abs style={{ top: 240, right: 56, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E84B6E' }} />
    <Abs style={{ top: 162, right: 38, width: 6, height: 6, borderRadius: 3, backgroundColor: '#c0002a' }} />
    <Abs style={{ top: 268, right: 16, width: 9, height: 9, borderRadius: 4, backgroundColor: '#E84B6E', transform: [{ rotate: '15deg' }] }} />
    {/* math hint */}
    <Text style={[s.dec, { top: 228, left: 16, color: '#E84B6E', fontSize: 13, fontWeight: '700', fontStyle: 'italic' }]}>2+5=?</Text>
    {/* retry arrow */}
    <Text style={[s.dec, { top: 185, right: 16, color: '#E84B6E', fontSize: 20 }]}>↺</Text>
    {/* small ✕ shapes */}
    <Text style={[s.dec, { top: 268, left: 52, color: '#E84B6E', fontSize: 13, fontWeight: '900' }]}>✕</Text>
    <Text style={[s.dec, { top: 118, right: 52, color: '#c0002a', fontSize: 11, fontWeight: '900' }]}>✕</Text>
  </>
);


const ResultPopup: React.FC<ResultPopupProps> = ({
  visible,
  isCorrect,
  correctAnswer,
  userAnswer,
  onClose,
  colors,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(-8)).current;
  const iconScale = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0.7);
      fadeAnim.setValue(0);
      floatY.setValue(-8);
      iconScale.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, { toValue: 0, duration: 650, useNativeDriver: true }),
          Animated.timing(floatY, { toValue: -8, duration: 650, useNativeDriver: true }),
        ])
      ).start();

      Animated.spring(iconScale, {
        toValue: 1, delay: 260, friction: 5, tension: 100, useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 180, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start(() => {
      scaleAnim.setValue(0.7);
      fadeAnim.setValue(0);
      onClose();
    });
  };

  const renderCorrect = () => (
    <View style={s.outer}>
      <View style={s.plusBadge}>
        <Text style={s.plusBadgeText}>+1</Text>
      </View>

      <Animated.View style={[s.floatWrap, { transform: [{ translateY: floatY }] }]}>
        <Text style={s.trophyEmoji}>🏆</Text>
      </Animated.View>

      <View style={s.pinkCard}>
        {CONFETTI.map((c, i) => <Abs key={i} style={c} />)}

        <View style={s.ribbon}>
          <View style={s.notchL} />
          <Text style={s.ribbonText}>AWESOME</Text>
          <View style={s.notchR} />
        </View>

        <Text style={s.titleText}>Perfect answer !</Text>
        <Text style={s.subText}>Keep solving to earn bigger rewards</Text>

        <Animated.View style={[s.greenCircle, { transform: [{ scale: iconScale }] }]}>
          <Text style={s.bigCheck}>✓</Text>
        </Animated.View>

        <TouchableOpacity style={s.pinkBtn} onPress={closeModal} activeOpacity={0.85}>
          <Text style={s.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWrong = () => (
    <View style={s.outer}>
      <Animated.View style={[s.floatWrap, { transform: [{ translateY: floatY }] }]}>
        {/* sad face — red fuzzy circle with face */}
        <View style={s.sadFaceOuter}>
          <View style={s.sadFaceGlow} />
          <View style={s.sadFace}>
            {/* eyes */}
            <View style={s.eyeRow}>
              <View style={s.eye} />
              <View style={s.eye} />
            </View>
            {/* mouth */}
            <View style={s.mouthWrap}>
              <View style={s.mouth} />
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={s.redCard}>
        <WrongDecorations />

        {/* OOPS ribbon */}
        <View style={s.redRibbon}>
          <View style={s.redNotchL} />
          <Text style={s.redRibbonText}>OOPS</Text>
          <View style={s.redNotchR} />
        </View>

        <Text style={s.titleText}>Incorrect answer</Text>
        <Text style={s.subText}>Don't give up! Mistakes help you learn</Text>

        {/* red X circle */}
        <Animated.View style={[s.redCircle, { transform: [{ scale: iconScale }] }]}>
          <Text style={s.bigX}>✕</Text>
        </Animated.View>

        <TouchableOpacity style={s.pinkBtn} onPress={closeModal} activeOpacity={0.85}>
          <Text style={s.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={closeModal}>
      <Animated.View style={[s.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          {isCorrect ? renderCorrect() : renderWrong()}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outer: { width: CARD_W, alignItems: 'center' },

  floatWrap: { zIndex: 5, marginBottom: -34 },

  trophyEmoji: { fontSize: 74 },

  sadFaceOuter: { alignItems: 'center', justifyContent: 'center' },
  sadFaceGlow: {
    position: 'absolute',
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(232,60,60,0.35)',
  },
  sadFace: {
    width: 82, height: 82, borderRadius: 41,
    backgroundColor: '#CC1C1C',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#ff0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 14, elevation: 10,
    // textured look via border
    borderWidth: 3, borderColor: '#a80000',
  },
  eyeRow: { flexDirection: 'row', gap: 14, marginBottom: 6, marginTop: 6 },
  eye: {
    width: 9, height: 9, borderRadius: 4.5,
    backgroundColor: '#1a0000',
  },
  mouthWrap: { alignItems: 'center' },
  mouth: {
    width: 28, height: 14,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 3,
    borderBottomColor: 'transparent',
    borderColor: '#1a0000',
    marginTop: 2,
    transform: [{ scaleY: -1 }],
  },

  // ── +1 badge ──────────────────────────────────────────────────────────────
  plusBadge: {
    position: 'absolute', top: 40, right: 2, zIndex: 10,
    backgroundColor: '#34C759',
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 6,
  },
  plusBadgeText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  // ── CORRECT card ──────────────────────────────────────────────────────────
  pinkCard: {
    width: '100%', backgroundColor: '#FFD6DC',
    borderRadius: 26, alignItems: 'center',
    paddingTop: 48, paddingBottom: 28, paddingHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 10,
  },

  // AWESOME ribbon
  ribbon: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#2DB84B', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 28,
    marginBottom: 16,
    shadowColor: '#1a7a30', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 5,
  },
  notchL: {
    position: 'absolute', left: -10,
    borderTopWidth: 10, borderBottomWidth: 10, borderRightWidth: 10,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#22963c',
  },
  notchR: {
    position: 'absolute', right: -10,
    borderTopWidth: 10, borderBottomWidth: 10, borderLeftWidth: 10,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#22963c',
  },
  ribbonText: { color: '#fff', fontWeight: '900', fontSize: 24, letterSpacing: 3 },

  // ── WRONG card ────────────────────────────────────────────────────────────
  redCard: {
    width: '100%', backgroundColor: '#FFD6DC',
    borderRadius: 26, alignItems: 'center',
    paddingTop: 48, paddingBottom: 28, paddingHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 10,
  },

  // OOPS ribbon
  redRibbon: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#D82040', borderRadius: 8,
    paddingVertical: 10, paddingHorizontal: 28,
    marginBottom: 16,
    shadowColor: '#8b0000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 5,
  },
  redNotchL: {
    position: 'absolute', left: -10,
    borderTopWidth: 10, borderBottomWidth: 10, borderRightWidth: 10,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: '#a8001a',
  },
  redNotchR: {
    position: 'absolute', right: -10,
    borderTopWidth: 10, borderBottomWidth: 10, borderLeftWidth: 10,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#a8001a',
  },
  redRibbonText: { color: '#fff', fontWeight: '900', fontSize: 24, letterSpacing: 5 },

  // ── shared text ───────────────────────────────────────────────────────────
  titleText: { fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  subText: { fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 22 },

  // ── green check circle ────────────────────────────────────────────────────
  greenCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#2DB84B',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 26,
    shadowColor: '#1a7a30', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  bigCheck: { color: '#fff', fontSize: 38, fontWeight: '900', lineHeight: 44 },

  // ── red X circle ──────────────────────────────────────────────────────────
  redCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#D82040',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 26,
    shadowColor: '#8b0000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  bigX: { color: '#fff', fontSize: 34, fontWeight: '900', lineHeight: 40 },

  // ── button ────────────────────────────────────────────────────────────────
  pinkBtn: {
    backgroundColor: '#E84B6E', borderRadius: 30,
    paddingVertical: 13, paddingHorizontal: 64,
    shadowColor: '#c0355a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38, shadowRadius: 8, elevation: 6,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.4 },

  // ── decoration helper ─────────────────────────────────────────────────────
  dec: { position: 'absolute' },
});

export default ResultPopup;
