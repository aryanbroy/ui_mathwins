import {
  createDailySessionResponse,
  FinalSubmissionResponse,
  LeaderboardRes,
  SubmitQuestionProp,
  submitQuestionSessionResponse,
} from '@/types/api/daily';
import { api } from './client';
import { ApiHandledError, parseApiError } from './parseApiError';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getDailyAttempts = async () => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'get',
      url: 'api/daily/attempts',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return res.data;
  } catch (err) {
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const getDailyTournamentDetails = async () => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'get',
      url: 'api/daily/start',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log(res.data);
    return res.data;
  } catch (err) {
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const createDailySession = async (): Promise<createDailySessionResponse> => {
    try {
      const token = (await AsyncStorage.getItem('token')) as string;
      const res = await api({
        method: 'post',
        url: 'api/daily/session/create',
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      });
      const resData: createDailySessionResponse = res.data;
      return resData;
    } catch (err) {
      const { status, message } = parseApiError(err);
      throw new ApiHandledError(status, message);
    }
  };

export const submitQuestion = async ({
  dailyTournamentSessionId,
  questionId,
  answer,
  timeTaken,
}: SubmitQuestionProp) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'patch',
      url: 'api/daily/session/submit_question',
      data: {
        dailyTournamentSessionId,
        questionId,
        answer,
        timeTaken,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: submitQuestionSessionResponse = res.data;
    return resData;
  } catch (err) {
    console.log('error submitting question: ', err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const finalSubmission = async ({ sessionId }: { sessionId: string }) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'post',
      url: 'api/daily/session/submit_final',
      data: {
        sessionId,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: FinalSubmissionResponse = res.data;
    console.log('Final score: ', resData.data.finalScore);
    return resData;
  } catch (err) {
    console.log('error in final submission: ', err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const fetchDailyLeaderboard = async (page: number) => {
  try {
    console.log('get request to fetch daily leaderboard...');
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'get',
      url: 'api/daily/leaderboard',
      params: {
        page: page,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log(res);
    const resData: LeaderboardRes = res.data;
    const { leaderboard } = resData.data;
    return leaderboard;
  } catch (err: any) {
    console.log('Error fetching leaderboard: ', err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};
