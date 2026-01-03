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

export default function TournamentCards() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.lifelineCard}>
        <LinearGradient
          colors={colors.gradients.muted}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.lifelineLabel}>
            Lifelines- <Text style={styles.lifelineValue}>10/10</Text>
            {/* <Text style={styles.lifelineSubText}>Lorem Ipsum dolor sit</Text> */}
          </Text>
        </LinearGradient>
      </View>
      {/*  navigate to lobby (solo) */}
      <DailyCard
        onPress={() => {
          navigation.navigate('lobby', {
            sessionType: SessionType.DAILY,
          });
        }}
      />
      <View style={styles.bottomRow}>
        <SoloCard
          onPress={() =>
            navigation.navigate('lobby', {
              sessionType: SessionType.SOLO,
            })
          }
        />
        <InstantCard onPress={() => navigation.navigate('Instant')} />
      </View>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      paddingBottom: 24,
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
    },
  });
