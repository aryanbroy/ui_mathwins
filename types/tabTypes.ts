import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type HomeTabStackParamList = {
  HomeMain: undefined;
  Daily: undefined;
  GameScreen: undefined;
  Instant: undefined;
};

export type HomeScreenNavigationProp =
  NativeStackNavigationProp<HomeTabStackParamList>;
