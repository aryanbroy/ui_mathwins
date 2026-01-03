import {
  fetchPlayersResponse,
  finalSubmissionResponse,
  joinOrCreateResponse,
  PastTournaments,
  startSessionResponse,
  submitQuestionResponse,
} from '@/types/api/instant';
import { api } from './client';
import { parseApiError } from './parseApiError';

export const joinOrCreateTournament = async () => {
  try {
    const res = await api.post('api/instant/join_or_create');
    const resData: joinOrCreateResponse = res.data;
    const data = resData.data;
    return data;
  } catch (err: any) {
    console.log('error joining tournamnet: ', err);
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const fetchTournamentPlayers = async (tournamentId: string) => {
  try {
    const res = await api({
      method: 'post',
      url: 'api/instant/players',
      data: {
        tournamentId: tournamentId,
      },
    });
    const resData: fetchPlayersResponse = res.data;
    const { playersCount, firstFivePlayers } = resData.data;
    return { playersCount, firstFivePlayers };
  } catch (err: any) {
    console.log('error fetching players: ', err);
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const startInstantSession = async (roomId: string) => {
  try {
    const res = await api({
      method: 'post',
      url: 'api/instant/start_session',
      data: {
        roomId,
      },
    });
    const resData: startSessionResponse = res.data;
    console.log(resData);
    const { question, session } = resData.data;
    return { question, session };
  } catch (err: any) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const submitQuestion = async (
  sessionId: string,
  questionId: string,
  answer: number,
  timeTakenMs: number
) => {
  try {
    const res = await api({
      method: 'post',
      url: 'api/instant/submit_question',
      data: {
        sessionId,
        questionId,
        answer,
        timeTakenMs,
      },
    });
    const resData: submitQuestionResponse = res.data;
    return resData;
  } catch (err: any) {
    console.log(err);
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const finalSubmission = async (sessionId: string) => {
  try {
    const res = await api({
      method: 'post',
      url: 'api/instant/submit_final',
      data: {
        sessionId,
      },
    });
    const resData: finalSubmissionResponse = res.data;
    const sessionData = resData.data.session;
    return sessionData;
  } catch (err: any) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const fetchPastTournaments = async () => {
  try {
    const res = await api({
      method: 'get',
      url: 'api/instant/participated_tournaments',
    });
    console.log('Fetching past tournaments: ', res);
    const resData: PastTournaments = res.data;
    const data = resData.data;
    return data;
  } catch (err: any) {
    console.log('Error fetching past tournaments: ', err);
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
