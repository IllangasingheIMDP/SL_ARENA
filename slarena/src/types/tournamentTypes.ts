export type Venue = {
  venue_id: number;
  venue_name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
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
  tournament_id: number;
  name: string;
  start_date: string;
  end_date: string;
  type: string;
  rules: string;
  venue: Venue;
  organiser: {
    organiser_id: number;
    name: string;
  };
  teams: Team[];
  status: TournamentStatus;
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