import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

type ClaimStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RewardClaim = {
  id: string;
  voucherCode: string;
  status: ClaimStatus;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
};

export default function RewardClaimCard({
  claim,
  index,
}: {
  claim: RewardClaim;
  index: number;
}) {
  const copyLink = async () => {
    await Clipboard.setStringAsync(claim.voucherCode);
    Alert.alert('Copied', 'Link copied to clipboard');
  };

  const statusColors = {
    PENDING: '#F59E0B',
    APPROVED: '#16A34A',
    REJECTED: '#DC2626',
  };

  const statusColor = statusColors[claim.status];

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.indexCircle}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>

        <Text style={[styles.statusText, { color: statusColor }]}>
          {claim.status}
        </Text>
      </View>

      {/* LINK */}
      <View style={styles.linkRow}>
        <Text style={styles.link} numberOfLines={1}>
          {claim.voucherCode}
        </Text>

        <TouchableOpacity onPress={copyLink}>
          <Text style={styles.copy}>📋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      {/* DATES */}
      <View style={styles.dateRow}>
        <View>
          <Text style={styles.label}>createdAt</Text>
          <Text style={styles.value}>{claim.createdAt}</Text>
        </View>

        <View>
          <Text style={styles.label}>updatedAt</Text>
          <Text style={styles.value}>{claim.updatedAt}</Text>
        </View>
      </View>

      {/* OPTIONAL REJECTION */}
      {claim.rejectionReason && (
        <View style={styles.reasonBox}>
          <Text style={styles.reasonLabel}>rejectionReason</Text>
          <Text style={styles.reasonText}>
            {claim.rejectionReason}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  indexCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  indexText: {
    color: '#fff',
    fontWeight: '700',
  },

  statusText: {
    fontSize: 20,
    fontWeight: '800',
  },

  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  link: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },

  copy: {
    fontSize: 18,
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  label: {
    fontSize: 12,
    color: '#888',
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  reasonBox: {
    marginTop: 10,
  },

  reasonLabel: {
    fontSize: 12,
    color: '#888',
  },

  reasonText: {
    marginTop: 4,
    fontSize: 14,
  },
});
