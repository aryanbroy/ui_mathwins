import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './client';
import { parseApiError } from './parseApiError';

export const getConfig = async () => {
  try {
    
    // const res = await api.post('api/admin/gameConfig', params);
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.post('api/admin/gameConfig', {}, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};
type saveConfigParams = {
  note: string;
  category: string;
  newConfig: object;
}
export const saveConfig = async (params: saveConfigParams) => {
  try {
    // const res = await api.post('api/admin/gameConfig', params);
    const token = (await AsyncStorage.getItem('token')) as string;
    const res = await api.patch(`api/admin/changeConfig?section=${params.category}`, 
      {
        note: params.note, 
        payload: params.newConfig
      }, {
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    });
    return res.data;
  } catch (err) {
    const msg = parseApiError(err);
    throw new Error(msg.message);
  }
};