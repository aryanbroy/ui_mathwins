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
