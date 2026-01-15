import { DailyRewardClaimRes } from '@/types/api/rewards';
import { api } from './client';
import { ApiHandledError, parseApiError } from './parseApiError';

export const claimDailyReward = async () => {
  try {
    const res = await api({
      method: 'post',
      url: 'api/rewards/daily_claim',
    });
    console.log('Response: ', res);
    const resData: DailyRewardClaimRes = res.data;
    return resData;
  } catch (err: any) {
    const { message, status } = parseApiError(err);
    throw new ApiHandledError(status, message);
  }
};
