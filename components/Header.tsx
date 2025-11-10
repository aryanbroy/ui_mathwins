import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Header() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#6B5FDE', '#7B6FEE', '#8B7FFE']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.username}>Aryan</Text>
            </View>
            <View style={styles.coinContainer}>
              <Text style={styles.coinEmoji}>🪙</Text>
              <Text style={styles.coinText}>2,000/2,000 coins</Text>
            </View>
          </View>

          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <Image
                source={require('../assets/images/avatar.webp')}
                style={styles.avatar}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
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
    color: '#FFFFFF',
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
    borderRadius: 27,
  },
  coinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  coinEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  coinText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
});
