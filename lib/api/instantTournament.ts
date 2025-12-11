import {
  fetchPlayersResponse,
  joinOrCreateResponse,
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
