import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from '.';
import DailyScreen from './dailyScreen';
import { HomeTabStackParamList } from '@/types/tabTypes';
import TournamentScreen from './TournamentScreen';

const Stack = createNativeStackNavigator<HomeTabStackParamList>();

export default function HomeTabLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeMain"
        component={Index}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Daily"
        component={DailyScreen}
        options={{ title: 'Daily' }}
      />
      <Stack.Screen
        name="GameScreen"
        component={TournamentScreen}
        options={{ title: 'Game screen' }}
      />
    </Stack.Navigator>
  );
}
