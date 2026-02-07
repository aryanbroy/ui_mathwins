import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native';

type Props = {
  length?: number;
  onChange?: (code: string) => void;
};

const LENGTH = 8;

export default function ReferralCodeInput({length = LENGTH,onChange,}: Props) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const { colors } = useAppTheme(); 
  const styles = React.useMemo(() => makeStyles(colors), [colors]);

  const inputs = useRef<RNTextInput[]>([]);

  const updateCode = (arr: string[]) => {
    setDigits(arr);
    onChange?.(arr.join('')); 
  };

  const handleChange = (text: string, index: number) => {
    // 🔥 paste support (user pastes full code)
    if (text.length > 1) {
      const chars = text.slice(0, LENGTH).split('');
      const newDigits = [...digits];

      chars.forEach((c, i) => {
        newDigits[i] = c;
      });

      updateCode(newDigits);
      inputs.current[chars.length - 1]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = text;

    updateCode(newDigits);

    // auto move next
    if (text && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // backspace → previous
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {digits.map((d, i) => (
        <TextInput
          key={i}
          ref={(ref) => {
            if (ref) inputs.current[i] = ref;
          }}
          style={styles.box}
          value={d}
          maxLength={1}
          keyboardType="default"
          onChangeText={(t) => handleChange(t, i)}
          onKeyPress={(e) => handleKeyPress(e, i)}
        />
      ))}
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
    StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        minWidth: 40,
        minHeight: 50,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 700,
        backgroundColor: colors.backgrounds.input,
        color: colors.text,
    },
    });
