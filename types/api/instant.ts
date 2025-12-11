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
  status: tournamentStatus;
  createdAt: Date;
  expiresAt: Date;
};

enum tournamentStatus {
  NOT_OPENED = 'NOT_OPENED',
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  FULL = 'FULL',
  CANCELLED = 'CANCELLED',
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
