import { StyleSheet, Text, View } from 'react-native';
import DailyCard from './DailyCard';
import SoloCard from './SoloCard';
import InstantCard from './InstantCard';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from '@/types/tabTypes';
import { SessionType } from '@/app/(tabs)/(hometab)/lobby';
import { useFeedback } from '@/context/useFeedback';

export default function TournamentCards() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {stopFeedback} = useFeedback();

  return (
    <View style={styles.container}>
      {/*  navigate to lobby (solo) */}
      <DailyCard
        onPress={() => {
          stopFeedback('lobby');
          navigation.navigate('lobby', {
            sessionType: SessionType.DAILY,
          });
        }}
        />
      <View style={styles.bottomRow}>
        <SoloCard
          onPress={async () => {
            await stopFeedback('lobby');
            navigation.navigate('lobby', {
              sessionType: SessionType.SOLO,
            })
          }}
          />
        <InstantCard onPress={async () => {
          await stopFeedback('lobby');
          navigation.navigate('Instant')
        }} />
      </View>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      // paddingBottom: 24,
    },
    gradient: {
      flex: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
    lifelineCard: {
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    lifelineLabel: {
      flex: 1,
      alignItems: 'center',
      fontSize: 16,
      fontWeight: '600',
      color: colors.textHighlight,
    },
    lifelineValue: {
      fontWeight: '600',
    },
    lifelineSubText: {
      marginLeft: 10,
      fontSize: 14,
      color: colors.textOnPrimary,
      opacity: 0.8,
    },
    bottomRow: {
      flexDirection: 'row',
      gap: 10,
      justifyContent: 'space-between',
      marginVertical: 5,
    },
  });
