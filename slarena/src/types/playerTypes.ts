export interface PlayerStats {
  matches_played: number;
  total_runs: number;
  total_wickets: number;
}

export interface PlayerAchievement {
  achievement_type: string;
  match_id: number;
  date_achieved: string;
}

export interface PlayerProfile {
  name: string;
  bio: string;
  batting_style: string;
  bowling_style: string;
  fielding_position: string;
  achievements: {
    achievement_type: string;
    match_type: string;
    venue_name: string;
  }[];
}

export interface TrainingSession {
  session_date: string;
  duration: number;
  focus_area: string;
  notes: string;
}

export interface PlayerVideos {
  video_urls: string[];
}

export interface UpdateProfileBioRequest {
  bio: string;
} 