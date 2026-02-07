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
import lobbyScreen from './lobby';
import adScreen from './adScreen';
import EditProfileScreen from '@/app/editProfile';
import ErrorScreen from '@/app/errorScreen';
import PrivacyPolicy from '@/app/privacyPolicy';
import TermsAndCondition from '@/app/termsAndCondition';
import Contactus from '@/app/contactUs';
import OtpScreen from '@/app/otpScreen';
import RewardHistoryScreen from '../../rewardHistory';

const Stack = createNativeStackNavigator<HomeTabStackParamList>();

export default function HomeTabLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="homeMain"
        component={Index}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Daily"
        component={DailyScreen}
        options={{ title: 'Daily' }}
      />
      <Stack.Screen
        name="lobby"
        component={lobbyScreen}
        options={{ title: 'lobby' }}
      />
      <Stack.Screen
        name="Question"
        component={questionScreen}
        options={{ title: 'question' }}
      />
      <Stack.Screen
        name="ad"
        component={adScreen}
        options={{ title: 'ad' }}
      />
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
      <Stack.Screen
        name="editProfile"
        component={EditProfileScreen}
        options={{ title: 'editProfile' }}
      />
      {/* <Stack.Screen */}
      {/*   name="GameScreen" */}
      {/*   component={TournamentScreen} */}
      {/*   options={{ title: 'Game screen' }} */}
      {/* /> */}
      <Stack.Screen
        name="Instant"
        component={InstantLobby}
        options={{ title: 'InstantLobby' }}
      />
      <Stack.Screen
        name="errorScreen"
        component={ErrorScreen}
        options={{ title: 'ErrorScreen' }}
      />
      <Stack.Screen
        name="privacyPolicy"
        component={PrivacyPolicy}
        options={{ title: 'PrivacyPolicy' }}
      />
      <Stack.Screen
        name="termsAndCondition"
        component={TermsAndCondition}
        options={{ title: 'T&C' }}
      />
      <Stack.Screen
        name="contactUs"
        component={Contactus}
        options={{ title: 'Contact Us' }}
      />
      <Stack.Screen
        name="otpScreen"
        component={OtpScreen}
        options={{ title: 'OtpScreen' }}
      />
      <Stack.Screen
        name="rewardHistoryScreen"
        component={RewardHistoryScreen}
        options={{ title: 'OtpScreen' }}
      />
    </Stack.Navigator>
  );
}
