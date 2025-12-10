enum SessionStatus {
  NOT_OPENED = 'NOT_OPENED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

type soloSessionData = {
  session: {
    id: string;
    status: SessionStatus;
  };
  question: {
    id: string;
    expression: string;
    kthDigit: number;
    level: number;
    questionIndex: number;
    result: string;
    side: string;
  };
};

export type createSoloSessionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: soloSessionData;
};