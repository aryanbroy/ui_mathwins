import { createSoloSessionResponse } from '@/types/api/solo';
import { api } from './client';
import { parseApiError } from './parseApiError';
import LeaderBoard from '@/app/(tabs)/leaderBoard';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const soloStart = async () => {
  try {
    // console.log("userId : ",userId);
    const token = await AsyncStorage.getItem("token") as string;
    const res = await api.post(
      "api/solo/start",
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
    throw new Error(msg);
  }
};
// export const nextQuestion = async ({userId,soloSessionId,questionId,userAnswer,time}: any) => {
  type NextQuestionParams = {
  // userId: string;
  soloSessionId: string;
  questionId: string;
  userAnswer: number;
  time: number;
};
type continueParams = {
  soloSessionId: string;
};
type quitParams = {
  soloSessionId: string;
};
type loaderBoradParam = {
  todayDate: string;
  start: number;
  end: number;
};
export const nextQuestion = async (params: NextQuestionParams) => {
  try {
    console.log("ts next QS: ",params);
    
    const token = await AsyncStorage.getItem("token") as string;
    const res = await api.post(
      'api/solo/nextquestion', 
      params,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
export const continueSolo = async (params: continueParams) => {
  try {
    const token = await AsyncStorage.getItem("token") as string;
    const res = await api.post(
      'api/solo/continue',
      params,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
export const quitSolo = async (params: quitParams) => {
  try {
    const token = await AsyncStorage.getItem("token") as string;
    const res = await api.post(
      'api/solo/quit',
      params,
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
export const finalsubmission = async (params: quitParams) => {
  try {
    const res = await api.post('api/solo/finalsubmission', params);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
export const soloLeaderboard = async (params: loaderBoradParam) => {
  try {
    const res = await api.post('api/solo/leaderboard', params);
    // console.log(res);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const getSoloAtempts = async () => {
  try {
    // const token = await AsyncStorage.getItem("token") as string;
    const res = await api.post(
      'api/solo/getRemainingSoloAttempts',
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJjbWptaWQzbHUwMDBlZmsyajRrOHl2aTA2IiwidXNlcm5hbWUiOiJTd2F5YW5zaHUiLCJlbWFpbCI6ImFyZ3Vzc3RvbnlAZ21haWwuY29tIiwiaWF0IjoxNzY2NzMxNTc1LCJleHAiOjE3NjczMzYzNzV9.JgfEvsmCpGGrl-5XpoXNd8a6oD5HinREJ1gRog5wJtM')}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
}