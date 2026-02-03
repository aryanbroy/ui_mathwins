import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

export default function AdBanner() {
  if (Platform.OS === 'web') return null;
  return (
    <BannerAd
      unitId={TestIds.BANNER}
      size={BannerAdSize.FULL_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
    />
  );
}
