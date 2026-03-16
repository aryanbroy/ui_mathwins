import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type TabProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};


export default function Tab({ label, active = false, onPress }: TabProps) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tab, active && styles.activeTab]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const makeStyles = (colors: ColorScheme) => StyleSheet.create({
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: colors.gradients.surface[1],
  },
  text: {
    color: colors.textSecondary,
    fontWeight: '400',
    fontFamily: 'Saira-Medium',
    fontSize: 12,
  },
  activeText: {
    fontWeight: '700',
    color: '#FFF',
  },
});
