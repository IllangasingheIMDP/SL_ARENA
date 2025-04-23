export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Matches: undefined;
  Tournaments: undefined;
  News: undefined;
  Settings: undefined;
  MatchDetails: { matchId: string };
  TournamentDetails: { tournamentId: string };
  TeamDetails: { teamId: string };
  PlayerDetails: { playerId: string };
  NewsDetails: { newsId: string };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyOTP: { email: string };
  ResetPassword: { email: string; otp: string };
};

export type GeneralUserTabParamList = {
  Home: undefined;
  Discover: {
    screen?: string;
    params?: {
      matchId?: string;
      tournamentId?: string;
      teamId?: string;
      playerId?: string;
      newsId?: string;
    };
  };
  Profile: undefined;
  Settings: undefined;
}; 