enum SessionStatus {
  NOT_OPENED = 'NOT_OPENED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export type DailyQuestion = {
  id: string;
  expression: string;
  kthDigit: number;
  level: number;
  questionIndex: number;
  result: string;
  side: string;
};

type dailySessionData = {
  session: {
    userId: string;
    id: string;
    status: SessionStatus;
  };
  firstQuestion: DailyQuestion;
};

export type createDailySessionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: dailySessionData;
};

export type submitQuestionSessionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    userId: string;
    questionId: string;
    nextQuestion: DailyQuestion;
    currentScore: number;
    correctAnswer: number;
  };
};

export enum TournamentState {
  LOBBY = 'lobby',
  LOADING = 'loading',
  PLAYING = 'playing',
  FINISHED = 'finished',
}

export type SubmitQuestionProp = {
  dailyTournamentSessionId: string;
  questionId: string;
  answer: number;
  timeTaken: number;
};

export type FinalSubmissionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    finalScore: number;
  };
};

export type LeaderboardRes = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    leaderboard: LeaderboardUser[];
    rank: number;
  };
};

export type LeaderboardUser = {
  userId: string;
  bestScore: number;
  user: { username: string };
};
