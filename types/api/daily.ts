enum SessionStatus {
  NOT_OPENED = 'NOT_OPENED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

type dailySessionData = {
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

export type createDailySessionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: dailySessionData;
};

export enum TournamentState {
  LOBBY = 'lobby',
  LOADING = 'loading',
  PLAYING = 'playing',
  FINISHED = 'finished',
}

// export type TournamentState = {
//   state: TournamentState
// }
