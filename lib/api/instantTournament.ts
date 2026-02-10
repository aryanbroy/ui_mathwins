import {
  fetchPlayersResponse,
  finalSubmissionResponse,
  joinOrCreateResponse,
  PastTournaments,
  startSessionResponse,
  submitQuestionResponse,
} from '@/types/api/instant';
import { api } from './client';
import { ApiHandledError, parseApiError } from './parseApiError';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const joinOrCreateTournament = async () => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'post',
      url: 'api/instant/join_or_create',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: joinOrCreateResponse = res.data;
    const data = resData.data;
    return data;
  } catch (err: any) {
    console.log('error joining tournamnet: ', err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const fetchTournamentPlayers = async (tournamentId: string) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'post',
      url: 'api/instant/players',
      data: {
        tournamentId: tournamentId,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: fetchPlayersResponse = res.data;
    const { playersCount, firstFivePlayers } = resData.data;
    return { playersCount, firstFivePlayers };
  } catch (err: any) {
    console.log('error fetching players: ', err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const startInstantSession = async (roomId: string) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'post',
      url: 'api/instant/start_session',
      data: {
        roomId,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: startSessionResponse = res.data;
    console.log(resData);
    const { question, session } = resData.data;
    return { question, session };
  } catch (err: any) {
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const submitQuestion = async (
  sessionId: string,
  questionId: string,
  answer: number,
  timeTakenMs: number
) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'post',
      url: 'api/instant/submit_question',
      data: {
        sessionId,
        questionId,
        answer,
        timeTakenMs,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: submitQuestionResponse = res.data;
    return resData;
  } catch (err: any) {
    console.log(err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const finalSubmission = async (sessionId: string) => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'post',
      url: 'api/instant/submit_final',
      data: {
        sessionId,
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: finalSubmissionResponse = res.data;
    const sessionData = resData.data.session;
    return sessionData;
  } catch (err: any) {
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const fetchPastTournaments = async () => {
  try {
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'GET',
      url: 'api/instant/participated_tournaments',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    const resData: PastTournaments = res.data;
    const data = resData.data;
    return data;
  } catch (err: any) {
    console.log('Error fetching past tournaments: ', err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const fetchInstantSessionLeaderboard = async (tournamentId: string) => {
  try {
    console.log('get request to fetch daily leaderboard...');
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api({
      method: 'post',
      url: 'api/instant/session_leaderboard',
      data: {
        tournamentId
      },
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log(res);
    const resData: PastTournaments = res.data;
    const data = resData.data;
    return data;
  } catch (err: any) {
    console.log('Error fetching leaderboard: ', err);
    const { status, message } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};
