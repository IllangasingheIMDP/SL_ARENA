export interface Tournament {
  tournament_id: string;
  tournament_name: string;
  tournament_type: string;
  start_date: string;
  end_date: string;
  status: string;
  rules?: string;
  venue?: {
    venue_id: string;
    venue_name: string;
  };
  toss?: {
    winner: string;
    decision: string;
  };
} 