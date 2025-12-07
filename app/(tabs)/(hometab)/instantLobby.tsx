import { TournamentState } from '@/types/api/daily';
import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { generateQuestion, Question } from '@/lib/generateQuestion';
import ScoreSubmitScreen from '@/components/ScoreSubmitScreen';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { useNavigation } from '@react-navigation/native';
import InstantTournamentScreen from '@/components/QuestionScreen/InstantTournamentScreen';

type Player = {
  id: string;
  name: string;
  score?: number;
};

export default function InstantTournamentLobby() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const roomId = 'R-12345';
  const roomCapacity = 100;
  const [players] = useState<Player[]>([
    { id: 'u1', name: 'Aryan', score: 220 },
    { id: 'u2', name: 'Sam', score: 180 },
    { id: 'u3', name: 'Priya', score: 150 },
    { id: 'u4', name: 'Nina', score: 120 },
    { id: 'u5', name: 'Raj', score: 90 },
  ]);
  const [tourState, setTourState] = useState<TournamentState>(
    TournamentState.LOBBY
  );
  const [initialQuestion, setInitialQuestion] = useState<Question | null>(null);
  const [isSubmittingSession, setIsSubmittingSession] =
    useState<boolean>(false);

  const isCreator = true;
  const expiresAt = useMemo(() => Date.now() + 20 * 60 * 1000, []);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  );

  useEffect(() => {
    const t = setInterval(() => {
      const secs = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemainingSeconds(secs);
    }, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const joinedCount = players.length;

  const onStartGame = () => {
    console.log('starting game now');
    const question = generateQuestion();
    setInitialQuestion(question);
    setTourState(TournamentState.PLAYING);
  };
  const onLeave = () => alert('Leave (dummy)');
  const onInvite = () => alert('Invite (dummy)');

  const handleSubmit = () => {
    setIsSubmittingSession(true);
    console.log('submitting session');
    setTimeout(() => {
      navigation.navigate('HomeMain');
      setIsSubmittingSession(false);
    }, 1000);
  };

  const renderPlayer = ({ item, index }: { item: Player; index: number }) => (
    <View style={styles.playerRow}>
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
      </View>

      <View style={styles.playerInfo}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerScore}>{item.score ?? 0} pts</Text>
      </View>

      <Text style={styles.rankBubble}>{index + 1}</Text>
    </View>
  );

  if (tourState === TournamentState.FINISHED) {
    return (
      <ScoreSubmitScreen
        isSubmittingSession={isSubmittingSession}
        handleSubmit={handleSubmit}
      />
    );
  }

  if (tourState === TournamentState.PLAYING && initialQuestion != null) {
    return (
      <InstantTournamentScreen
        question={initialQuestion}
        sessionId="sessionId"
        sessionDuration={180}
        setTourState={setTourState}
      />
    );
  }

  if (tourState === TournamentState.LOBBY) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.topRow}>
          <Text style={styles.title}>Instant Tournament</Text>
          <Text style={styles.roomTag}>Room • {roomId}</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Players</Text>
              <Text style={styles.summaryValue}>
                {joinedCount}/{roomCapacity}
              </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.summaryLabel}>Closes in</Text>
              <Text style={styles.summaryValue}>
                {formatTime(remainingSeconds)}
              </Text>
            </View>
          </View>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(joinedCount / roomCapacity) * 100}%` },
              ]}
            />
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.ghostButton} onPress={onInvite}>
              <Text style={styles.ghostText}>Invite</Text>
            </TouchableOpacity>

            {isCreator ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onStartGame}
              >
                <Text style={styles.primaryText}>Start</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.ghostButton} onPress={onLeave}>
                <Text style={styles.ghostText}>Leave</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Players</Text>
          <Text style={styles.sectionSub}>Live</Text>
        </View>

        <FlatList
          data={players}
          keyExtractor={(i) => i.id}
          renderItem={renderPlayer}
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 24 }}
        />

        {/* <View style={styles.footer}> */}
        {/*   <Text style={styles.footerText}> */}
        {/*     3 min per player · Early submit allowed (ad-gated) */}
        {/*   </Text> */}
        {/*   <TouchableOpacity */}
        {/*     style={styles.linkBtn} */}
        {/*     onPress={() => alert('Leaderboard (dummy)')} */}
        {/*   > */}
        {/*     <Text style={styles.linkText}>Leaderboard</Text> */}
        {/*   </TouchableOpacity> */}
        {/* </View> */}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFB', padding: 16 },
  topRow: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#111' },
  roomTag: { color: '#8B8F98', marginTop: 4 },

  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { color: '#8B8F98', fontSize: 12 },
  summaryValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },

  progressBarContainer: {
    height: 6,
    backgroundColor: '#F1F3F8',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBarFill: { height: 6, backgroundColor: '#6A5AE0' },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  ghostButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F6F7FB',
  },
  ghostText: { color: '#4A4A4A', fontWeight: '600' },
  primaryButton: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#6A5AE0',
    marginLeft: 10,
  },
  primaryText: { color: '#fff', fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: { fontWeight: '700', fontSize: 16 },
  sectionSub: { color: '#9AA0A6' },

  list: { flex: 1 },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 8,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontWeight: '700', color: '#565656' },
  playerInfo: { flex: 1, marginLeft: 12 },
  playerName: { fontWeight: '700', color: '#111' },
  playerScore: { color: '#8B8F98', marginTop: 4, fontSize: 12 },
  rankBubble: {
    backgroundColor: '#F6F7FB',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    color: '#6A5AE0',
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: { color: '#8B8F98', fontSize: 13 },
  linkBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  linkText: { color: '#6A5AE0', fontWeight: '700' },
});
