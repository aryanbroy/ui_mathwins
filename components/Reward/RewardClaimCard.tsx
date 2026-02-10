import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';

type ClaimStatus = 'Pending' | 'Fulfilled' | 'Rejected';

export type RewardClaim = {
  id: string;
  voucherCode: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  coinsLocked: number;
};

export default function RewardClaimCard({
  claim,
  index,
}: {
  claim: RewardClaim;
  index: number;
}) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const copyLink = async () => {
    await Clipboard.setStringAsync(claim.voucherCode);
    Alert.alert('Copied', 'Link copied to clipboard');
  };

  const statusConfig = {
    Pending: { label: 'Locked', color: '#F59E0B' },
    Fulfilled: { label: 'Deducted', color: '#16A34A' },
    Rejected: { label: 'Added', color: '#DC2626' },
  };

  const s = statusConfig[claim.status];

  const formatDate = (d: string) =>
    new Date(d).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <LinearGradient
      colors={colors.gradients.surface} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* TOP */}
      <View style={styles.topRow}>
        <Text style={styles.index}>#{index + 1}</Text>

        <View style={[styles.badge, { backgroundColor: s.color }]}>
          <Text style={styles.badgeText}>{claim.status}</Text>
        </View>
      </View>

      {/* MAIN */}
      <View style={styles.mainRow}>
        {/* Coins */}
        <Text style={[styles.coins, { color: s.color }]}>
          {claim.status === 'Rejected' ? '+' : '-'}
          {claim.coinsLocked}
        </Text>

        {/* Details */}
        <View style={{ flex: 1 }}>
          {(claim.voucherCode || claim.rejectionReason) && (
            <View style={styles.linkRow}>
              <Text style={styles.link} numberOfLines={1}>
                {claim.voucherCode || claim.rejectionReason}
              </Text>

              {claim.voucherCode && (
                <TouchableOpacity onPress={copyLink}>
                  <Feather
                    name="copy"
                    size={16}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Dates (Created + Updated) */}
          <Text style={styles.date}>
            Created: {formatDate(claim.createdAt)}
          </Text>
          <Text style={styles.date}>
            Updated: {formatDate(claim.updatedAt)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    card: {
      borderRadius: 18,
      padding: 14,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },

    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    index: {
      fontSize: 12,
      color: colors.textMuted,
    },

    badge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 20,
    },

    badgeText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },

    mainRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    coins: {
      fontSize: 22,
      fontWeight: '800',
      width: 75,
    },

    linkRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    link: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      marginRight: 8,
    },

    date: {
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
    },
  });