import { api } from './client';
import { parseApiError } from './parseApiError';

export const getDailyAttempts = async () => {
  try {
    const res = await api.get('api/daily/attempts');
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const getDailyTournamentDetails = async () => {
  try {
    const res = await api.get('api/daily/start');
    console.log(res.data);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};

export const createDailySession = async () => {
  const res = await api.post('api/daily/session/create');
  const data = res.data;
  return data;
};
