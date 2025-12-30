import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Index from '.';
import DailyScreen from './dailyLobby';
// import SoloScreen from './soloLobby';
import { HomeTabStackParamList } from '@/types/tabTypes';
import InstantLobby from './instantLobby';
import questionScreen from './question';
// import adScreen from './adScreen';
import roundOverview from './roundOverview';
import LoginScreen from '@/app/login';

const Stack = createNativeStackNavigator<HomeTabStackParamList>();

export default function HomeTabLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
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
      {/* <Stack.Screen */}
      {/*   name="Solo" */}
      {/*   component={SoloScreen} */}
      {/*   options={{ title: 'Solo' }} */}
      {/* /> */}
      <Stack.Screen
        name="Question"
        component={questionScreen}
        options={{ title: 'question' }}
      />
      {/* <Stack.Screen */}
      {/*   name="ad" */}
      {/*   component={adScreen} */}
      {/*   options={{ title: 'ad' }} */}
      {/* /> */}
      <Stack.Screen
        name="roundOverview"
        component={roundOverview}
        options={{ title: 'soloScoreboard' }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ title: 'login' }}
      />
      {/* <Stack.Screen */}
      {/*   name="GameScreen" */}
      {/*   component={TournamentScreen} */}
      {/*   options={{ title: 'Game screen' }} */}
      {/* /> */}
      <Stack.Screen
        name="Instant"
        component={InstantLobby}
        options={{ title: 'Lobby' }}
      />
    </Stack.Navigator>
  );
}
