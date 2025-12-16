import { createSoloSessionResponse } from '@/types/api/solo';
import { api } from './client';
import { parseApiError } from './parseApiError';
import LeaderBoard from '@/app/(tabs)/leaderBoard';

export const soloStart = async ({userId}: any) => {
  try {
    console.log("userId : ",userId);
    const res = await api.post('api/solo/start', {userId});
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
// export const nextQuestion = async ({userId,soloSessionId,questionId,userAnswer,time}: any) => {
type NextQuestionParams = {
  userId: string;
  soloSessionId: string;
  questionId: string;
  userAnswer: number;
  time: number;
};
type continueParams = {
  userId: string;
  soloSessionId: string;
};
type quitParams = {
  userId: string;
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
    
    const res = await api.post('api/solo/nextquestion', params);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
export const continueSolo = async (params: continueParams) => {
  try {
    const res = await api.post('api/solo/continue', params);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
export const quitSolo = async (params: quitParams) => {
  try {
    const res = await api.post('api/solo/quit', params);
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