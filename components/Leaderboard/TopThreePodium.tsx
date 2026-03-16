import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';

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
  const getCrownBgColor = (position: number) => {
    const colors: Record<number, string> = {
      1: '#ffc115', 
      2: '#BFC4CC', 
      3: '#c16700', 
    };
    // Default color if position is > 3
    return colors[position] || '#FFF'; 
  };

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

  const logoSource = require("@/assets/images/leaderboard/podium.png");
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const renderLeader = (leader: any) => (
    <View key={leader.position} style={styles.leaderContainer}>
      <View
        style={[
          styles.crownContainer,
          { backgroundColor: getCrownBgColor(leader.position as number) },
        ]}
      >
        <MaterialCommunityIcons 
        name="crown" 
        size={28} 
        color='#FFF'/>
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
        <Text style={styles.badgeIcon}>🪙</Text>
        {/* <View style={styles.badge}>
        </View> */}
      </View>

      <View
        // style={[styles.podium, { height: getPodiumHeight(leader.position) }]}
        style={[styles.podium, { height: getPodiumHeight(leader.position) }]}
      >
        <Image 
        source={logoSource} 
        style={styles.avatarImage} 
        contentFit="fill"/>
        <Text 
        style={styles.position}>{leader.position}</Text>
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

const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  avatarImage: {
    marginHorizontal: 20,
    height: '100%',
    width: '100%',
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
  },
  crownContainer: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginTop: 30,
    marginBottom: 4,
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
    fontFamily: 'Rubik-Medium',
    color: colors.textOnPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8FB8',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 8,
    gap: 6,
  },
  score: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Medium',
    color: '#FFFFFF',
  },
  badgeIcon: {
    fontSize: 10,
    borderWidth: 2,
    borderColor: '#FFF',
    borderRadius: 100,
  },
  podium: {
    width: 100,
    marginBottom: -10,
    // backgroundColor: '#f706f34b',
    // borderTopLeftRadius: 12,
    // borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    // opacity: 0.7,
  },
  position: {
    position: 'absolute',
    fontSize: 60,
    color: '#FFFFFF',
    fontFamily: 'Saira-Medium'
    // opacity: 0.6,
  },
});

export default LeaderboardPodium;
