import { AxiosError } from 'axios';

export type ErrObject = {
  status: number;
  message: string;
};

export const parseApiError = (err: unknown): ErrObject => {
  // Default fallback
  const fallback = { status: 500, message: 'unknown error' };

  if (!err) return fallback;

  // Check if it's an AxiosError
  if ((err as AxiosError)?.isAxiosError) {
    const axiosErr = err as AxiosError & {
      response?: { data?: any; status?: number };
      message?: string;
    };

    const status =
      axiosErr.response?.status ??
      // some APIs put status on the error itself
      (axiosErr as any).status ??
      500;

    const data = axiosErr.response?.data;

    let message =
      (typeof data?.message === 'string' && data.message) ||
      (Array.isArray(data?.errors) &&
        data.errors.length &&
        data.errors[0]?.message) ||
      axiosErr.message ||
      'unknown error';

    return { status, message };
  }

  return {
    status: 500,
    message:
      (err as Error)?.message ??
      (typeof err === 'string' ? err : 'unknown error'),
  };
};

export class ApiHandledError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ApiHandledError.prototype);
  }
}
