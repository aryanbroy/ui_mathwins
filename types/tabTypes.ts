import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type sanitizedQuestion = {
  expression: String,
  kthDigit: Number,
  level: Number,
  side: String
} | any ;
type continueParams = {
  sessionDetails: {
    userId: string;
    soloSessionId: string;
  };
};
export type HomeTabStackParamList = {
  HomeMain: undefined;
  Daily: undefined;
  Solo: undefined;
  SoloQuestion: sanitizedQuestion;
  roundOverview: continueParams;
  ad: continueParams;
  GameScreen: undefined;
  Instant: undefined;
  login: undefined;
};

export type HomeScreenNavigationProp =
  NativeStackNavigationProp<HomeTabStackParamList>;
