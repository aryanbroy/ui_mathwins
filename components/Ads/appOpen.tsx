import {
  AppOpenAd,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';

const appOpenAd = AppOpenAd.createForAdRequest(
  TestIds.APP_OPEN,
  {
    requestNonPersonalizedAdsOnly: true,
  }
);

let isLoaded = false;
let isShowing = false;

export function loadAppOpenAd() {
  if (!isLoaded) {
    console.log('[AppOpen] load');
    appOpenAd.load();
  }
}

export function showAppOpenAd() {
  console.log('[AppOpen] show attempt', { isLoaded, isShowing });

  if (isLoaded && !isShowing) {
    isShowing = true;
    appOpenAd.show();
  }
}

// EVENTS
appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
  console.log('[AppOpen] LOADED');
  isLoaded = true;
});

appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
  console.log('[AppOpen] OPENED');
});

appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
  console.log('[AppOpen] CLOSED');
  isLoaded = false;
  isShowing = false;

  loadAppOpenAd();
});

appOpenAd.addAdEventListener(AdEventType.ERROR, (err) => {
  console.log('[AppOpen] ERROR', err);
});
