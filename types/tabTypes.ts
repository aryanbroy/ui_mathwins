import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type HomeTabStackParamList = {
  HomeMain: undefined;
  Daily: undefined;
  Solo: undefined;
  SoloQuestion: undefined;
  Next: undefined;
  GameScreen: undefined;
  Instant: undefined;
};

export type HomeScreenNavigationProp =
  NativeStackNavigationProp<HomeTabStackParamList>;
