import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/context/authContext';
import useAppTheme, { ColorScheme } from '@/context/useAppTheme';
import { useNavigation } from '@react-navigation/native';
import { TabScreenNavigationProp } from '@/types/tabTypes';

export default function Header() {
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const navigation = useNavigation<TabScreenNavigationProp>();
  const styles = makeStyles(colors);
  function profileClick() {
    navigation.navigate('user');
    console.log('Clicked Profile');
  }

  return (
    <View style={styles.content}>
      <View style={styles.leftSection}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.username}>{user?.username || 'User'}</Text>
        </View>

        <View style={styles.coinContainer}>
          <Text style={styles.coinEmoji}>🪙</Text>
          <Text style={styles.coinText}>0 / 2,000 coins</Text>
        </View>
      </View>

      <TouchableOpacity onPress={profileClick} style={styles.avatarContainer}>
        <View style={styles.avatarBorder}>
          <Image source={{ uri: user?.picture }} style={styles.avatar} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const makeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    content: {
      paddingTop: 5,
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
      color: colors.textSecondary,
    },
    username: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
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
      color: colors.textSecondary,
      fontWeight: '400',
    },

    avatarContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    avatarBorder: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.surface,
      padding: 3,

      // theme-aware shadow
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },

    avatar: {
      width: 54,
      height: 54,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: 100,
    },
  });
