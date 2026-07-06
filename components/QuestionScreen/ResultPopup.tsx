import { fetchTopThreeLeaderboard } from '@/lib/api/dailyTournament';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';

const { width } = Dimensions.get('window');
const CARD_W = Math.min(width - 48, 320);

// Shape returned by fetchTopThreeLeaderboard
type ApiLeaderboardEntry = {
  userId: string;
  bestScore: number;
  user: {
    username: string;
  };
};

// Internal display shape — rank and crownColor derived from array position
type LeaderboardEntry = {
  rank: number;
  username: string;
  points: number;
  crownColor: 'gold' | 'silver' | 'bronze';
};

const CROWN_ORDER: Array<'gold' | 'silver' | 'bronze'> = ['gold', 'silver', 'bronze'];

// Maps the raw API array to the display shape
const mapApiLeaderboard = (apiData: ApiLeaderboardEntry[]): LeaderboardEntry[] =>
  apiData.map((entry, index) => ({
    rank: index + 1,
    username: entry.user.username,
    points: entry.bestScore,
    crownColor: CROWN_ORDER[index] ?? 'bronze',
  }));

type ResultPopupProps = {
  visible: boolean;
  isCorrect: boolean;
  correctAnswer: number;
  userAnswer: number | null;
  onClose: () => void;
  colors: any;
  currentScore?: number;
  showLeaderboard?: boolean; // true when it's the per-minute ad moment
  sessionId?: string;        // needed to fetch leaderboard from API
};

// ─── Crown component ──────────────────────────────────────────────────────────
const CROWN_COLORS = {
  gold: '#F4A83A',
  silver: '#A8A8A8',
  bronze: '#CD7F32',
};

const Crown = ({ color }: { color: string }) => (
  <View style={[s.crownWrap, { backgroundColor: color }]}>
    <Text style={s.crownText}>♛</Text>
  </View>
);

// ─── Leaderboard Row ──────────────────────────────────────────────────────────
const LeaderboardRow = ({ entry }: { entry: LeaderboardEntry }) => (
  <View style={s.lbRow}>
    <Text style={s.lbRank}>{entry.rank}</Text>
    {/* Avatar placeholder */}
    <View style={s.lbAvatar}>
      <Text style={s.lbAvatarText}>👤</Text>
    </View>
    <View style={s.lbInfo}>
      <Text style={s.lbName}>{entry.username}</Text>
      <Text style={s.lbPoints}>{entry.points} OVERALL POINTS</Text>
    </View>
    <Crown color={CROWN_COLORS[entry.crownColor]} />
  </View>
);

// ─── Leaderboard Section ──────────────────────────────────────────────────────
const LeaderboardSection = ({
  entries,
  loading,
}: {
  entries: LeaderboardEntry[];
  loading: boolean;
}) => (
  <View style={s.lbContainer}>
    <View style={s.lbTag}>
      <View style={s.lbTagNotch} />
      <Text style={s.lbTagText}>TOP 3</Text>
    </View>
    <View style={s.lbList}>
      {loading ? (
        <Text style={s.lbLoadingText}>Loading...</Text>
      ) : entries.length === 0 ? (
        <Text style={s.lbLoadingText}>No entries yet</Text>
      ) : (
        entries.map((entry) => (
          <LeaderboardRow key={entry.rank} entry={entry} />
        ))
      )}
    </View>
  </View>
);

// ─── Confetti pieces ──────────────────────────────────────────────────────────
const Abs = ({ style }: { style: any }) => <View style={[{ position: 'absolute' }, style]} />;

const CONFETTI: any[] = [
  { top: 100, left: 14, width: 10, height: 10, backgroundColor: '#F4A83A', borderRadius: 2, transform: [{ rotate: '30deg' }] },
  { top: 135, left: 26, width: 8, height: 8, backgroundColor: '#E94F6A', borderRadius: 4 },
  { top: 160, left: 12, width: 12, height: 6, backgroundColor: '#4CC9F0', borderRadius: 2, transform: [{ rotate: '-20deg' }] },
  { top: 185, left: 32, width: 9, height: 9, backgroundColor: '#7B61FF', borderRadius: 2, transform: [{ rotate: '45deg' }] },
  { top: 210, left: 18, width: 7, height: 7, backgroundColor: '#F4A83A', borderRadius: 1 },
  { top: 107, right: 22, width: 10, height: 10, backgroundColor: '#4CC9F0', borderRadius: 2, transform: [{ rotate: '-30deg' }] },
  { top: 138, right: 38, width: 8, height: 8, backgroundColor: '#F4A83A', borderRadius: 4 },
  { top: 162, right: 16, width: 12, height: 6, backgroundColor: '#7B61FF', borderRadius: 2, transform: [{ rotate: '20deg' }] },
  { top: 188, right: 48, width: 9, height: 9, backgroundColor: '#E94F6A', borderRadius: 2, transform: [{ rotate: '-45deg' }] },
];

// ─── Wrong decorations ────────────────────────────────────────────────────────
const WrongDecorations = () => (
  <>
    <Text style={[s.dec, { top: 108, left: 18, color: '#E84B6E', fontSize: 22, fontWeight: '900' }]}>×</Text>
    <Text style={[s.dec, { top: 200, left: 14, color: '#E84B6E', fontSize: 18, fontWeight: '900' }]}>×</Text>
    <Text style={[s.dec, { top: 108, right: 14, color: '#E84B6E', fontSize: 20, fontWeight: '900' }]}>×</Text>
    <Text style={[s.dec, { top: 230, right: 22, color: '#E84B6E', fontSize: 22, fontWeight: '900' }]}>×</Text>
    <Abs style={{ top: 145, left: 34, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E84B6E' }} />
    <Abs style={{ top: 188, left: 50, width: 6, height: 6, borderRadius: 3, backgroundColor: '#c0002a' }} />
    <Abs style={{ top: 162, right: 38, width: 6, height: 6, borderRadius: 3, backgroundColor: '#c0002a' }} />
    <Text style={[s.dec, { top: 228, left: 16, color: '#E84B6E', fontSize: 13, fontWeight: '700', fontStyle: 'italic' }]}>2+5=?</Text>
    <Text style={[s.dec, { top: 185, right: 16, color: '#E84B6E', fontSize: 20 }]}>↺</Text>
    <Text style={[s.dec, { top: 118, right: 52, color: '#c0002a', fontSize: 11, fontWeight: '900' }]}>✕</Text>
  </>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const ResultPopup: React.FC<ResultPopupProps> = ({
  visible,
  isCorrect,
  correctAnswer,
  userAnswer,
  onClose,
  colors,
  currentScore: currentScoreProp = 0,
  showLeaderboard = false,
  sessionId,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatY = useRef(new Animated.Value(-8)).current;
  const iconScale = useRef(new Animated.Value(0)).current;

  // ─── Live leaderboard state ─────────────────────────────────────────────────
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [lbLoading, setLbLoading] = useState(false);
  const [currentScore, setCurrentScore] = useState(currentScoreProp);

  // Fetch leaderboard from API whenever the popup becomes visible as an ad moment
  useEffect(() => {
    if (visible && showLeaderboard && sessionId) {
      setLbLoading(true);
      fetchTopThreeLeaderboard({ sessionId })
        .then((apiData: ApiLeaderboardEntry[]) => {
          setLeaderboard(mapApiLeaderboard(apiData));
        })
        .catch((err: any) => {
          console.error('Failed to fetch leaderboard:', err);
          setLeaderboard([]); // fail silently — section just won't render rows
        })
        .finally(() => setLbLoading(false));
    }
  }, [visible, showLeaderboard, sessionId]);

  // Keep local score in sync if the prop changes between renders
  useEffect(() => {
    setCurrentScore(currentScoreProp);
  }, [currentScoreProp]);

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
      onClose(); // caller handles whether to show ad
    });
  };

  // ─── Score Badge (top-left of card) ────────────────────────────────────────
  const ScoreBadge = () => (
    <View style={s.scoreBadge}>
      <Text style={s.scoreBadgeText}>Your Score: {currentScore}</Text>
    </View>
  );

  const renderCorrect = () => (
    <View style={s.outer}>
      {/* +1 badge top-right */}
      <View style={s.plusBadge}>
        <Text style={s.plusBadgeText}>+1</Text>
      </View>

      <Animated.View style={[s.floatWrap, { transform: [{ translateY: floatY }] }]}>
        <Text style={s.trophyEmoji}>🏆</Text>
      </Animated.View>

      <View style={s.pinkCard}>
        {CONFETTI.map((c, i) => <Abs key={i} style={c} />)}

        {/* Score badge top-left inside card */}
        <ScoreBadge />

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

        {/* Leaderboard — only shown on per-minute ad moment */}
        {showLeaderboard && (
          <LeaderboardSection entries={leaderboard} loading={lbLoading} />
        )}

        <TouchableOpacity style={s.pinkBtn} onPress={closeModal} activeOpacity={0.85}>
          <Text style={s.btnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWrong = () => (
    <View style={s.outer}>
      {/* Red +1 badge top-right — matches correct card position */}
      <View style={[s.plusBadge, { backgroundColor: '#D82040' }]}>
        <Text style={s.plusBadgeText}>+1</Text>
      </View>

      <Animated.View style={[s.floatWrap, { transform: [{ translateY: floatY }] }]}>
        <View style={s.sadFaceOuter}>
          <View style={s.sadFaceGlow} />
          <View style={s.sadFace}>
            <View style={s.eyeRow}>
              <View style={s.eye} />
              <View style={s.eye} />
            </View>
            <View style={s.mouthWrap}>
              <View style={s.mouth} />
            </View>
          </View>
        </View>
      </Animated.View>

      <View style={s.redCard}>
        <WrongDecorations />

        {/* Score badge top-left inside card */}
        <ScoreBadge />

        <View style={s.redRibbon}>
          <View style={s.redNotchL} />
          <Text style={s.redRibbonText}>OOPS</Text>
          <View style={s.redNotchR} />
        </View>

        <Text style={s.titleText}>Incorrect answer</Text>
        <Text style={s.subText}>Don't give up! Mistakes help you learn</Text>

        <Animated.View style={[s.redCircle, { transform: [{ scale: iconScale }] }]}>
          <Text style={s.bigX}>✕</Text>
        </Animated.View>

        {/* Leaderboard — only shown on per-minute ad moment */}
        {showLeaderboard && (
          <LeaderboardSection entries={leaderboard} loading={lbLoading} />
        )}

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

// ─── Styles ───────────────────────────────────────────────────────────────────
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

  // ── Score badge ─────────────────────────────────────────────────────────────
  scoreBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#D82040',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  scoreBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  // ── +1 badge ────────────────────────────────────────────────────────────────
  plusBadge: {
    position: 'absolute', top: 40, right: 2, zIndex: 10,
    backgroundColor: '#34C759',
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25, shadowRadius: 4, elevation: 6,
  },
  plusBadgeText: { color: '#fff', fontWeight: '800', fontSize: 15 },

  // ── Sad face ────────────────────────────────────────────────────────────────
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
    borderWidth: 3, borderColor: '#a80000',
  },
  eyeRow: { flexDirection: 'row', gap: 14, marginBottom: 6, marginTop: 6 },
  eye: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: '#1a0000' },
  mouthWrap: { alignItems: 'center' },
  mouth: {
    width: 28, height: 14,
    borderTopLeftRadius: 14, borderTopRightRadius: 14,
    borderWidth: 3, borderBottomColor: 'transparent', borderColor: '#1a0000',
    marginTop: 2, transform: [{ scaleY: -1 }],
  },

  // ── CORRECT card ─────────────────────────────────────────────────────────────
  pinkCard: {
    width: '100%', backgroundColor: '#FFD6DC',
    borderRadius: 26, alignItems: 'center',
    paddingTop: 48, paddingBottom: 28, paddingHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 10,
  },
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

  // ── WRONG card ───────────────────────────────────────────────────────────────
  redCard: {
    width: '100%', backgroundColor: '#FFD6DC',
    borderRadius: 26, alignItems: 'center',
    paddingTop: 48, paddingBottom: 28, paddingHorizontal: 20,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18, shadowRadius: 16, elevation: 10,
  },
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

  // ── Shared text ──────────────────────────────────────────────────────────────
  titleText: { fontSize: 18, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  subText: { fontSize: 13, color: '#555', textAlign: 'center', marginBottom: 22 },

  // ── Green check circle ───────────────────────────────────────────────────────
  greenCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#2DB84B',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1a7a30', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 10, elevation: 8,
  },
  bigCheck: { color: '#fff', fontSize: 38, fontWeight: '900', lineHeight: 44 },

  // ── Red X circle ─────────────────────────────────────────────────────────────
  redCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#D82040',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#8b0000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  bigX: { color: '#fff', fontSize: 34, fontWeight: '900', lineHeight: 40 },

  // ── Button ───────────────────────────────────────────────────────────────────
  pinkBtn: {
    backgroundColor: '#E84B6E', borderRadius: 30,
    paddingVertical: 13, paddingHorizontal: 64,
    marginTop: 8,
    shadowColor: '#c0355a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38, shadowRadius: 8, elevation: 6,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16, letterSpacing: 0.4 },

  // ── Leaderboard ──────────────────────────────────────────────────────────────
  lbContainer: {
    width: '100%',
    marginBottom: 16,
  },
  lbTag: {
    backgroundColor: '#D82040',
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 14,
    paddingLeft: 18,
    marginBottom: 8,
    marginLeft: 4,
    position: 'relative',
  },
  lbTagNotch: {
    position: 'absolute',
    left: -8,
    top: 0,
    bottom: 0,
    width: 0,
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderRightWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#D82040',
  },
  lbTagText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  lbLoadingText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 8,
  },
  lbList: {
    width: '100%',
    gap: 6,
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  lbRank: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    width: 18,
  },
  lbAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8D0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginLeft: 4,
  },
  lbAvatarText: {
    fontSize: 18,
  },
  lbInfo: {
    flex: 1,
  },
  lbName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  lbPoints: {
    fontSize: 10,
    color: '#888',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  crownWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crownText: {
    fontSize: 16,
    color: '#fff',
  },

  // ── Decoration helper ────────────────────────────────────────────────────────
  dec: { position: 'absolute' },
});

export default ResultPopup;
