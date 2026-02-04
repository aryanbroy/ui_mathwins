import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';

import {
  NativeAd,
  NativeAdView,
  TestIds,
} from 'react-native-google-mobile-ads';

export default function NativeAdCard() {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    let isMounted = true;

    const loadAd = async () => {
      try {
        const ad = await NativeAd.createForAdRequest(TestIds.NATIVE, {
          requestNonPersonalizedAdsOnly: true,
        });

        if (isMounted) {
          setNativeAd(ad);
        }
      } catch (err) {
        console.log('[NativeAd] load failed', err);
      }
    };

    loadAd();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!nativeAd) return null;

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.adTag}>Sponsored Ad</Text>

        <Text style={styles.title}>{nativeAd.headline}</Text>

        {nativeAd.body && (
          <Text style={styles.body}>{nativeAd.body}</Text>
        )}

        {nativeAd.icon && (
          <Image
            source={{ uri: nativeAd.icon.url }}
            style={styles.icon}
          />
        )}

        {/* CTA */}
        {nativeAd.callToAction && (
          <Text style={styles.cta}>{nativeAd.callToAction}</Text>
        )}
      </View>
    </NativeAdView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    elevation: 2,
  },
  adTag: {
    fontSize: 12,
    color: '#aeaeae',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  body: {
    marginTop: 6,
  },
  icon: {
    width: 40,
    height: 40,
    marginTop: 8,
  },
  cta: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#2563eb',
  },
});
