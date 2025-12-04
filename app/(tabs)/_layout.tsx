import { Gift, Home, Trophy, User } from 'lucide-react-native';
import useAppTheme, { ThemeProvider } from '../../context/useAppTheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LeaderBoard from './leaderBoard';
import Rewards from './rewards';
import UserProfileScreen from './user';
import HomeTabLayout from './(hometab)/_layout';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <ThemeProvider>
      <TabNavigator />
    </ThemeProvider>
  );
}

function TabNavigator() {
  const { colors } = useAppTheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6A5AE0',
        tabBarStyle: {
          backgroundColor: colors.bg,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeTabLayout}
        options={{
          headerTitle: 'hometab',
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />

      <Tab.Screen
        name="leaderBoard"
        component={LeaderBoard}
        options={{
          title: 'LeaderBoard',
          tabBarIcon: ({ color }) => <Trophy color={color} />,
        }}
      />

      <Tab.Screen
        name="rewards"
        component={Rewards}
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color }) => <Gift color={color} />,
        }}
      />

      <Tab.Screen
        name="user"
        component={UserProfileScreen}
        options={{
          title: 'User',
          tabBarIcon: ({ color }) => <User color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
