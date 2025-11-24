import { Tabs } from 'expo-router';
import { Gift, Home, Trophy, User } from 'lucide-react-native';
import { ThemeProvider } from '../../context/useAppTheme';

export default function TabLayout() {
  return (
    <ThemeProvider>
      <Tabs screenOptions={{ headerShown: false }}>
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
