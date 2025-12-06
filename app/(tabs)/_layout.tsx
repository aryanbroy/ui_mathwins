import { Tabs } from 'expo-router';
import { Gift, Home, Trophy, User } from 'lucide-react-native';
import { ThemeProvider } from '../../context/useAppTheme';
import useAppTheme from '../../context/useAppTheme';

export default function TabLayout() {
  const {isDarkMode, colors} = useAppTheme();
  return (
    <ThemeProvider> 
        <Tabs 
        key={isDarkMode ? "tabs-dark" : "tabs-light"}
        screenOptions={{ 
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
