export type Venue = {
  venue_id: string;
  venue_name: string;
  address?: string;
};

export type Team = {
  team_id: number;
  team_name: string;
  team_logo?: string;
  captain_id?: number;
  players?: TeamPlayer[];
};

export type TeamPlayer = {
  player_id: number;
  role: string; // e.g., batsman, bowler, all-rounder
};

export type TournamentStatus = 'upcoming' | 'start' | 'matches' | 'finished';

export type Tournament = {
  tournament_id?: number;
  tournament_name: string;
  start_date: string;
  end_date: string;
  tournament_type: string;
  rules: string;
  organizer_id: number;
  venue: Venue;
  teams: Team[];
  status?: TournamentStatus;
}; 

export type PlayerStats = {
  player_id: number;
  name: string;
  role: string;
  total_matches: number;
  total_runs: string;
  total_wickets: string;
  batting_average: string;
  bowling_economy: string;
}

export interface Match {
  match_id: number;
  round: number;
  match_number: number;
  team1_id: number | null;
  team2_id: number | null;
  team1_name: string | null;
  team2_name: string | null;
  winner_name: string | null;
}