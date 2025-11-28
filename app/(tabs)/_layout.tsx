import { Tabs } from 'expo-router';
import { Gift, Home, Trophy, User } from 'lucide-react-native';
import { ThemeProvider } from '../../context/useAppTheme';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import useAppTheme from '../../context/useAppTheme';
import { isDynamicPart } from 'expo-router/build/fork/getPathFromState-forks';

export default function TabLayout() {
  const {isDarkMode, colors} = useAppTheme();
  return (
    <ThemeProvider>
      <Tabs screenOptions={{ 
        headerShown: false, 
        tabBarActiveTintColor: "#6A5AE0",
        tabBarStyle: {
          backgroundColor: colors.bg,
        },
      }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />

        <Tabs.Screen
          name="leaderBoard"
          options={{
            title: 'LeaderBoard',
            tabBarIcon: ({ color }) => <Trophy color={color} />,
          }}
        />

        <Tabs.Screen
          name="rewards"
          options={{
            title: 'Rewards',
            tabBarIcon: ({ color }) => <Gift color={color} />,
          }}
        />

        <Tabs.Screen
          name="user"
          options={{
            title: 'User',
            tabBarIcon: ({ color }) => <User color={color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
