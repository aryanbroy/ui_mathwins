export type DailyRewardClaimRes = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    pointsAwarded: number;
    currentStreak: number;
    longestStreak: number;
    streakBroken: boolean;
    totalCoinPointsToday: number;
  };
};
