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
let isSuppressed = false;

export function loadAppOpenAd() {
  // if (!isLoaded && !isShowing) {
  //   console.log('[AppOpen] load');
  //   appOpenAd.load();
  // }
}
export function suppressAppOpenAd(duration = 3000) {
  // isSuppressed = true;

  // setTimeout(() => {
  //   isSuppressed = false;
  // }, duration);
}
export function showAppOpenAd() {
  // console.log('[AppOpen] show attempt', {
  //   isLoaded,
  //   isShowing,
  //   isSuppressed,
  // });

  // if (isSuppressed) return;

  // if (isLoaded && !isShowing) {
  //   isShowing = true;
  //   appOpenAd.show();
  // }
}

appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
  // console.log('[AppOpen] LOADED');
  // isLoaded = true;
});

appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
  // console.log('[AppOpen] OPENED');
  // isShowing = true;
});

appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
  // console.log('[AppOpen] CLOSED');
  // isShowing = false;
  // isLoaded = false;
  // loadAppOpenAd();
});

appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
  // console.log('[AppOpen] ERROR', error);
  // isLoaded = false;
  // isShowing = false;
  // setTimeout(loadAppOpenAd, 2000);
});