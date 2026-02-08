import { DailyRewardClaimRes } from '@/types/api/rewards';
import { api } from './client';
import { ApiHandledError, parseApiError } from './parseApiError';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const claimDailyReward = async () => {
  const token = (await AsyncStorage.getItem('token')) as string;
  try {
    const res = await api({
      method: 'post',
      url: 'api/rewards/daily_claim',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log('Response: ', res);
    const resData: DailyRewardClaimRes = res.data;
    return resData;
  } catch (err: any) {
    const { message, status } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const redeemReward = async () => {
  const token = (await AsyncStorage.getItem('token')) as string;
  try {
    const res = await api({
      method: 'post',
      url: 'api/rewards/claim_request',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log('Response: ', res);
    const resData: DailyRewardClaimRes = res.data;
    return resData;
  } catch (err: any) {
    const { message, status } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const getStreak = async () => {
  const token = (await AsyncStorage.getItem('token')) as string;
  try {
    const res = await api({
      method: 'get',
      url: 'api/rewards/streak',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log('Response: ', res);
    const resData = res.data;
    return resData;
  } catch (err: any) {
    const { message, status } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const getRewardHistory = async () => {
  const token = (await AsyncStorage.getItem('token')) as string;
  try {
    const res = await api({
      method: 'get',
      url: 'api/rewards/claims',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log('Response: ', res);
    const resData = res.data;
    return resData;
  } catch (err: any) {
    const { message, status } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const getAllClaims = async () => {
  const token = (await AsyncStorage.getItem('token')) as string;
  try {
    const res = await api({
      method: 'post',
      url: 'api/admin/rewards/claims',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    console.log('Response: ', res);
    const resData = res.data;
    return resData;
  } catch (err: any) {
    const { message, status } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};

export const approveClaim = async (claimId : string, voucherCode : string,) => {
  const token = (await AsyncStorage.getItem('token')) as string;
  console.log("c : ", claimId," v ode : ",voucherCode);
  
  try {
    const res = await api({
      method: 'post',
      url: 'api/admin/rewards/claims',
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
      data: {
        claimId,
        voucherCode,
      },
    });
    console.log('Response: ', res);
    const resData = res.data;
    return resData;
  } catch (err: any) {
    const { message, status } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};
