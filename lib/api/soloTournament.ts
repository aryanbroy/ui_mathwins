import { createSoloSessionResponse } from '@/types/api/solo';
import { api } from './client';
import { parseApiError } from './parseApiError';
import LeaderBoard from '@/app/(tabs)/leaderBoard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SessionType } from '@/app/(tabs)/(hometab)/lobby';

export const soloStart = async () => {
  try {
    // console.log("userId : ",userId);
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post(
      'api/solo/start',
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
// export const nextQuestion = async ({userId,soloSessionId,questionId,userAnswer,time}: any) => {
type NextQuestionParams = {
  // userId: string;
  sessionType: SessionType;
  soloSessionId: string;
  questionId: string;
  userAnswer: number;
  time: number;
};

type continueParams = {
  sessionType: SessionType;
  sessionId: string;
};
type quitParams = {
  sessionType: SessionType;
  sessionId: string;
};
type loaderBoradParam = {
  todayDate: string;
  start: number;
  end: number;
};
type lifelineParams = {
  sessionType: SessionType;
  sessionId: string;
  questionId: string;
};
export const nextQuestion = async (params: NextQuestionParams) => {
  try {
    console.log('ts next QS: ', params);

    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post('api/solo/nextquestion', params, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
export const continueSolo = async (params: continueParams) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post('api/solo/continue', params, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
export const quitSolo = async (params: quitParams) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post('api/solo/quit', params, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
export const finalsubmission = async (params: quitParams) => {
  try {
    const res = await api.post('api/solo/finalsubmission', params);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
export const soloLeaderboard = async (params: loaderBoradParam) => {
  try {
    const res = await api.post('api/solo/leaderboard', params);
    // console.log(res);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};

export const getSoloAtempts = async () => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post(
      'api/solo/getRemainingSoloAttempts',
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
export const applyFiftyfifty = async (params: lifelineParams) => {
  try {
    console.log('apply 50-50 soloTournament.ts - ', params);

    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post(
      'api/lifeline/fiftyfifty',
      { params },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
export const LevelDown = async (params: lifelineParams) => {
  try {
    console.log('apply leveldown soloTournament.ts - ', params);
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post(
      'api/lifeline/LevelDown',
      { params },
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};

