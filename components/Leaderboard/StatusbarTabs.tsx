import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type TabProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function Tab({ label, active = false, onPress }: TabProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tab, active && styles.activeTab]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  text: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 12,
  },
  activeText: {
    color: '#6315FF',
  },
});
