export type joinOrCreateResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: tournamentInfo;
};

type tournamentInfo = {
  id: string;
  maxPlayers: number;
  playersCount: number;
  status: TournamentStatus;
  createdAt: Date;
  expiresAt: Date;
};

export enum TournamentStatus {
  NOT_OPENED = 'NOT_OPENED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
}

enum InstantTournamentSessionStatus {
  ACTIVE = 'ACTIVE',
  SUBMITTED = 'SUBMITTED',
  EXPIRED = 'EXPIRED',
}

export type fetchPlayersResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    playersCount: {
      playersCount: number;
    };
    firstFivePlayers: Player[];
  };
};

export type Player = {
  userId: string;
  joinedAt: Date;
  joinOrder: number;
  sessionStarted: boolean;
  user: {
    username: string;
  };
};

export type startSessionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    question: InstantQuestion;
    session: InstantSession;
  };
};

export type submitQuestionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    question: InstantQuestion;
    session: InstantSession;
  };
};

type InstantSession = {
  id: string;
  score: number;
  startedAt: Date;
  endsAt: Date;
  status: InstantTournamentSessionStatus;
  finalScore: number | null;
};

export type InstantQuestion = {
  id: string;
  expression: string;
  kthDigit: number;
  level: number;
  questionIndex: number;
  result: string;
  side: string;
};

export type finalSubmissionResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    alreadySubmitted: boolean;
    session: InstantSession;
  };
};

export type PastTournaments = {
  success: boolean;
  statusCode: number;
  message: string;
  data: InstantParticipant[];
};

export type InstantParticipant = {
  tournamentId: string;
  userId: string;
  finalScore: string;
  // finalRank: number | null;
  tournament: tournamentInfo;
};
