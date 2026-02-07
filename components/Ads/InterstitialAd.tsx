import { useEffect, useRef, useState } from 'react';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

const interstitial = InterstitialAd.createForAdRequest(
  TestIds.INTERSTITIAL,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

export function useInterstitialAd(onAdClosed?: () => void) {
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(true);
        interstitial.load(); 
        onAdClosed?.();
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
    };
  }, []);

  const showAd = () => {
    if (loaded) {
      console.log("okkkkkk ", loaded);
      interstitial.show();
      setLoaded(true);
    } else {
      console.log("ad not ready ", loaded);
      onAdClosed?.();
    }
  };

  return { showAd };
}
