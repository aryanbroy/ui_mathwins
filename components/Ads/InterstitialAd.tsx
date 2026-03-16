import { useEffect, useState, useRef, useCallback } from 'react';
import {
  InterstitialAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { suppressAppOpenAd } from '@/components/Ads/appOpen'; 

// Create singleton instance
const createInterstitial = () => {
  return InterstitialAd.createForAdRequest(
    TestIds.INTERSTITIAL,
    {
      requestNonPersonalizedAdsOnly: true,
    }
  );
};

export function useInterstitialAd() {
  const [loaded, setLoaded] = useState(false);
  const interstitialRef = useRef<InterstitialAd | null>(null);
  const isShowingRef = useRef(false);
  const listenersAttachedRef = useRef(false);

  const loadAd = useCallback(() => {
    if (interstitialRef.current && !isShowingRef.current) {
      console.log('Loading new ad...');
      try {
        interstitialRef.current.load();
      } catch (error) {
        console.log('Error loading ad:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Create interstitial instance
    if (!interstitialRef.current) {
      console.log('🆕 Creating interstitial instance');
      interstitialRef.current = createInterstitial();
    }

    const interstitial = interstitialRef.current;

    // Attach listeners only once
    if (!listenersAttachedRef.current) {
      console.log('🎧 Attaching listeners');
      listenersAttachedRef.current = true;

      const unsubscribeLoaded = interstitial.addAdEventListener(
        AdEventType.LOADED,
        () => {
          console.log('✅ Ad LOADED');
          setLoaded(true);
        }
      );

      const unsubscribeClosed = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          console.log('🔄 Ad CLOSED');
          isShowingRef.current = false;
          setLoaded(false);
          // Load next ad after a short delay
          setTimeout(() => {
            loadAd();
          }, 500);
        }
      );

      const unsubscribeError = interstitial.addAdEventListener(
        AdEventType.ERROR,
        (error) => {
          console.log('❌ Ad ERROR:', error);
          setLoaded(false);
          isShowingRef.current = false;
          // Retry after delay
          setTimeout(() => {
            loadAd();
          }, 3000);
        }
      );

      const unsubscribeOpened = interstitial.addAdEventListener(
        AdEventType.OPENED,
        () => {
          console.log('📺 Ad OPENED');
          isShowingRef.current = true;
        }
      );

      // Load initial ad
      loadAd();

      // Cleanup function
      return () => {
        console.log('🧹 Cleaning up');
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        unsubscribeOpened();
        listenersAttachedRef.current = false;
      };
    }
  }, [loadAd]);

  const showAd = useCallback(async () => {
    // console.log("showAd - loaded:", loaded, "showing:", isShowingRef.current);
    
    if (!interstitialRef.current) {
      return;
    }

    if (!loaded) {
      loadAd();
      return;
    }

    if (isShowingRef.current) {
      return;
    }

    return new Promise<void>((resolve) => {
      const interstitial = interstitialRef.current!;
      
      suppressAppOpenAd(7000);
      setLoaded(false);
      isShowingRef.current = true;

      const timeout = setTimeout(() => {
        isShowingRef.current = false;
        loadAd();
        resolve();
      }, 10000);

      const unsubscribeShowClosed = interstitial.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          clearTimeout(timeout);
          unsubscribeShowClosed();
          resolve();
        }
      );

      try {
        interstitial.show();
      } catch (error) {
        clearTimeout(timeout);
        unsubscribeShowClosed();
        isShowingRef.current = false;
        loadAd();
        resolve();
      }
    });
  }, [loaded, loadAd]);

  return { showAd, loaded };
}