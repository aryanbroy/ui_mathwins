import {
  View,
  Text,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';

type BtnProps = {
  onPress: (event: GestureResponderEvent) => void;
};

export default function HomeBtn({ onPress }: BtnProps) {
  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>VIEW FULL LEADERBOARD</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 8,
  },

  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 10,

    // soft shadow like your screenshot
    elevation: 4, // Android
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4A1BFD', // violet/purple like your UI
  },
});
