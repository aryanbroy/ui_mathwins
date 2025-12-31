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
  sessionDetails: {
    userId: string;
    sessionId: string;
  };
};
export type HomeTabStackParamList = {
  HomeMain: undefined;
  Daily: undefined;
  lobby: undefined;
  Question: sanitizedQuestion;
  roundOverview: continueParams;
  ad: continueParams;
  GameScreen: undefined;
  Instant: undefined;
  login: undefined;
};

export type HomeScreenNavigationProp =
  NativeStackNavigationProp<HomeTabStackParamList>;

export type TabList = {
  user: undefined;
};

export type TabScreenNavigationProp = NativeStackNavigationProp<TabList>;
