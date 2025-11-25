import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/authContext';

export default function Header() {

  const {user} = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.username}>Aryan</Text>
          </View>
          <View style={styles.coinContainer}>
            <Text style={styles.coinEmoji}>🪙</Text>
            <Text style={styles.coinText}>2,000 / 2,000 coins</Text>
          </View>
        </View>

        <View style={styles.avatarContainer}>
          <View style={styles.avatarBorder}>
            <Image
              source={{ uri: user?.picture}}
              style={styles.avatar}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  container: {
    width: '100%',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    marginRight: 15,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
    columnGap: 6,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F0F0',
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 54,
    height: 54,
    borderWidth: 3,
    borderRadius: 100,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinEmoji: {
    fontSize: 20,
    marginRight: 6,
  },
  coinText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: "400",
  },
});
