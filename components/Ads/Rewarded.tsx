import { useEffect, useState } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,           // ✅ IMPORT THIS
  TestIds,
} from 'react-native-google-mobile-ads';

const rewarded = RewardedAd.createForAdRequest(
  TestIds.REWARDED,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

export function useRewardedAd(onRewardEarned: () => void) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeReward = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        onRewardEarned();
      }
    );

    const unsubscribeClosed = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false);
        rewarded.load(); // preload next ad
      }
    );

    rewarded.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeReward();
      unsubscribeClosed();
    };
  }, []);

  const showAd = () => {
    if (loaded) {
      rewarded.show();
    }
  };

  return { showAd, loaded };
}
