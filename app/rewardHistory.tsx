import React from 'react';
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

const AD_FREQUENCY = 2;

const DEMO_DATA: RewardClaim[] = [
  {
    id: '1',
    url: 'amazon.com/gift?code=A1',
    status: 'PENDING',
    createdAt: '12 Jan 2026',
    updatedAt: '18 Jan 2026',
  },
  {
    id: '2',
    url: 'flipkart.com/gift?code=B2',
    status: 'APPROVED',
    createdAt: '11 Jan 2026',
    updatedAt: '15 Jan 2026',
  },
  {
    id: '3',
    url: 'myntra.com/gift?code=C3',
    status: 'REJECTED',
    createdAt: '10 Jan 2026',
    updatedAt: '14 Jan 2026',
    rejectionReason: 'Invalid invoice uploaded',
  },
  {
    id: '4',
    url: 'zomato.com/gift?code=D4',
    status: 'PENDING',
    createdAt: '09 Jan 2026',
    updatedAt: '09 Jan 2026',
  },
  {
    id: '5',
    url: 'swiggy.com/gift?code=E5',
    status: 'APPROVED',
    createdAt: '08 Jan 2026',
    updatedAt: '12 Jan 2026',
  },
  {
    id: '6',
    url: 'uber.com/gift?code=F6',
    status: 'REJECTED',
    createdAt: '07 Jan 2026',
    updatedAt: '10 Jan 2026',
    rejectionReason: 'Expired reward request',
  },
  {
    id: '7',
    url: 'ajio.com/gift?code=G7',
    status: 'PENDING',
    createdAt: '06 Jan 2026',
    updatedAt: '06 Jan 2026',
  },
  {
    id: '8',
    url: 'nykaa.com/gift?code=H8',
    status: 'APPROVED',
    createdAt: '05 Jan 2026',
    updatedAt: '08 Jan 2026',
  },
  {
    id: '9',
    url: 'paytm.com/gift?code=I9',
    status: 'REJECTED',
    createdAt: '04 Jan 2026',
    updatedAt: '05 Jan 2026',
    rejectionReason: 'Duplicate claim',
  },
  {
    id: '10',
    url: 'bookmyshow.com/gift?code=J10',
    status: 'PENDING',
    createdAt: '03 Jan 2026',
    updatedAt: '03 Jan 2026',
  },
];


export default function RewardHistoryScreen() {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const renderItem = ({ item, index }: any) => {
    return (
      <>
        {/* 🔥 insert native ad every 2 items */}
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

      <FlatList
        data={DEMO_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}


// -----------------------------
// Styles
// -----------------------------
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
