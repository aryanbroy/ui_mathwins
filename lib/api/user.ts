import { createSoloSessionResponse } from '@/types/api/solo';
import { api } from './client';
import { parseApiError } from './parseApiError';

type userDetailsParams = {
  username: string;
  email: string;
};
type tokenParams = {
  token: string;
};
export const loginUser = async (params: userDetailsParams) => {
  try {
    console.log("ts USER Details: ",params);
    
    const res = await api.post('api/user/create', params);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};
export const getUser = async (params: tokenParams) => {
  try {
    console.log("getUser ts USER Details: ",params);
    
    const res = await api.post('api/user/getuserdata', params);
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg);
  }
};