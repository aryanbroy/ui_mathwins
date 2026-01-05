import {
  createDailySessionResponse,
  FinalSubmissionResponse,
  LeaderboardRes,
  SubmitQuestionProp,
  submitQuestionSessionResponse,
} from '@/types/api/daily';
import { api } from './client';
import { ApiHandledError, parseApiError } from './parseApiError';

export const getDailyAttempts = async () => {
  try {
    const res = await api.get('api/daily/attempts');
    return res.data;
  } catch (err) {
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const getDailyTournamentDetails = async () => {
  try {
    const res = await api.get('api/daily/start');
    console.log(res.data);
    return res.data;
  } catch (err) {
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const createDailySession =
  async (): Promise<createDailySessionResponse> => {
    try {
      const res = await api.post('api/daily/session/create');
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
    const res = await api({
      method: 'patch',
      url: 'api/daily/session/submit_question',
      data: {
        dailyTournamentSessionId,
        questionId,
        answer,
        timeTaken,
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
    const res = await api({
      method: 'post',
      url: 'api/daily/session/submit_final',
      data: {
        sessionId,
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
    const res = await api({
      method: 'get',
      url: 'api/daily/leaderboard',
      params: {
        page: page,
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
