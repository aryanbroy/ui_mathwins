import { SessionType } from '@/app/(tabs)/(hometab)/lobby';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type sanitizedQuestion =
  | {
      expression: string;
      kthDigit: number;
      level: number;
      side: string;
    }
  | any;
type continueParams = {
  params: {
    userId: string;
    sessionId: string;
  };
};
type otpParams = {
    phone: string;
};
type errorType = {
  params: {
    errorCode: number;
    errorMessage: string;
  }
}
export type HomeTabStackParamList = {
  homeMain: undefined;
  Daily: undefined;
  lobby: { sessionType: SessionType };
  Question: sanitizedQuestion;
  roundOverview: continueParams;
  ad: continueParams;
  GameScreen: undefined;
  Instant: undefined;
  login: undefined;
  editProfile: undefined;
  editConfig: undefined;
  errorScreen: errorType;
  privacyPolicy: undefined;
  termsAndCondition: undefined;
  contactUs: undefined;
  otpScreen: otpParams;
  rewardHistoryScreen: undefined;
};

export type HomeScreenNavigationProp =
  NativeStackNavigationProp<HomeTabStackParamList>;

export type TabList = {
  user: undefined;
};

export type TabScreenNavigationProp = NativeStackNavigationProp<TabList>;
