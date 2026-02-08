import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LeaderboardPodium = () => {
  const leaders = [
    {
      name: 'Soumik Bhoi',
      score: 2000,
      position: 2,
      crown: '👑',
      avatar: '👨‍💼',
    },
    {
      name: 'UjwalXMathwins',
      score: 2000,
      position: 1,
      crown: '👑',
      avatar: '👨‍💼',
    },
    {
      name: 'Bhuban saaar',
      score: 2000,
      position: 3,
      crown: '👑',
      avatar: '👨‍💼',
    },
  ];

  const getPodiumHeight = (position: any) => {
    switch (position) {
      case 1:
        return 200;
      case 2:
        return 160;
      case 3:
        return 140;
      default:
        return 120;
    }
  };

  const getCrownSize = (position: any) => {
    return position === 1 ? 32 : 24;
  };

  const renderLeader = (leader: any) => (
    <View key={leader.position} style={styles.leaderContainer}>
      <View style={styles.crownContainer}>
        <Text
          style={[styles.crown, { fontSize: getCrownSize(leader.position) }]}
        >
          {leader.crown}
        </Text>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{leader.avatar}</Text>
        </View>
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {leader.name}
      </Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{leader.score}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeIcon}>✓</Text>
        </View>
      </View>

      <View
        style={[styles.podium, { height: getPodiumHeight(leader.position) }]}
      >
        <LinearGradient
          colors={["#FFC3CD","#FF738A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <Text style={styles.position}>{leader.position}</Text>
        </LinearGradient>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.podiumWrapper}>
        {renderLeader(leaders[0])}
        {renderLeader(leaders[1])}
        {renderLeader(leaders[2])}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    flex:1,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    // flex: 1,
    // backgroundColor: '#FFB3D9',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 20,
  },
  podiumWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    // gap: 5,
  },
  leaderContainer: {
    alignItems: 'center',
    width: 110,
  },
  crownContainer: {
    marginBottom: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  crown: {
    fontSize: 24,
  },
  avatarContainer: {
    marginBottom: 8,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#9B6B9E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 32,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
    marginBottom: 6,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8FB8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    gap: 6,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 12,
    color: '#FF8FB8',
    fontWeight: 'bold',
  },
  podium: {
    width: '100%',
    backgroundColor: '#FFB3D9',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.7,
  },
  position: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
    opacity: 0.6,
  },
});

export default LeaderboardPodium;
