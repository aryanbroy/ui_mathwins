import { AxiosError } from 'axios';

export const parseApiError = (err: unknown): string => {
  if (!err) {
    return 'unknown error';
  }

  const axiosErr = err as AxiosError & { response?: any; message?: string };
  if (axiosErr.response?.data) {
    const res = axiosErr.response.data;
    if (typeof res.message === 'string') return res.message;
    if (Array.isArray(res.errors) && res.errors.length && res.errors[0].message)
      return res.errors[0].message;
  }

  return axiosErr?.message ?? String(err);
};
