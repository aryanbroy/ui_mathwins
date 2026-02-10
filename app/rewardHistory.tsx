import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
} from 'react-native';

import RewardClaimCard, {
  RewardClaim,
} from '@/components/Reward/RewardClaimCard';

import NativeAdCard from '@/components/Ads/nativeAdCard';

import { SafeAreaView } from 'react-native-safe-area-context';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { getRewardHistory } from '@/lib/api/rewards';

const AD_FREQUENCY = 2;

export default function RewardHistoryScreen() {
  const [claimedRewards, setClaimedRewards] = useState<RewardClaim[]>([]);
  useEffect(()=>{
    getRewardHistory().then((res)=>{
      console.log("RewardHistoryScreen : ",res);
      setClaimedRewards(res.data);
      console.log(claimedRewards);
      
    }).catch((err)=>{
      console.log("RewardHistoryScreen error : ",err);
    });
  },[])
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        {index !== 0 && index % AD_FREQUENCY === 0 && (
          <NativeAdCard />
        )}

        <RewardClaimCard claim={item} index={index} />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Reward Claims</Text>
      {
        claimedRewards.length != 0 ?
        <FlatList
          data={claimedRewards}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        /> :
        <Text 
        style={{
          color: colors.textMuted,
          textAlign: 'center',
          fontSize: 14,
          marginVertical: 20,
        }}>no rewards claimed yet.</Text>
      }

    </SafeAreaView>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
