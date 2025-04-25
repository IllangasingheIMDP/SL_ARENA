// Add this to your existing matchService.ts

import { api } from "../utils/api";

export const matchService = {
  createInning: async (
    matchId: number,
    battingTeamId: number,
    bowlingTeamId: number
  ) => {
    try {
      const response = await api.post("/organizers/addInning", {
        match_id: matchId,
        batting_team_id: battingTeamId,
        bowling_team_id: bowlingTeamId,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating inning:", error);
      throw error;
    }
  },

  async saveMatchPlayers(
    matchId: number,
    teamId: number,
    playerIds: number[]
  ): Promise<void> {
    try {
      const response = await api.post(`/organizers/playing-11`, {
        match_id: matchId,
        player_ids: playerIds,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving match players:", error);
      throw error;
    }
  },

  async saveMatchPhase(matchId: number, phase: string): Promise<void> {
    try {
      const response = await api.post(`/organizers/playing11`, {
        match_id: matchId,
        phase: phase,
      });
      return response.data;
    } catch (error) {
      console.error("Error saving match phase:", error);
      throw error;
    }
  },

  async getMatchPhase(matchId: number): Promise<{ phase: string }> {
    try {
      const response = await api.get(`/organizers/match-phase/${matchId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting match phase:", error);
      throw error;
    }
  },

  async getMatchScore(matchId: number): Promise<{
    team1: {
      total: number;
      wickets: number;
      overs: number;
      run_rate: number;
      players: Array<{
        player_id: number;
        name: string;
        runs: number;
        balls: number;
        fours: number;
        sixes: number;
        strike_rate: number;
      }>;
      bowlers: Array<{
        player_id: number;
        name: string;
        overs: number;
        maidens: number;
        runs: number;
        wickets: number;
        economy: number;
      }>;
    };
    team2: {
      total: number;
      wickets: number;
      overs: number;
      run_rate: number;
      players: Array<{
        player_id: number;
        name: string;
        runs: number;
        balls: number;
        fours: number;
        sixes: number;
        strike_rate: number;
      }>;
      bowlers: Array<{
        player_id: number;
        name: string;
        overs: number;
        maidens: number;
        runs: number;
        wickets: number;
        economy: number;
      }>;
    };
  }> {
    try {
      const response = await api.get(`/organizers/match-score/${matchId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting match score:", error);
      throw error;
    }
  }
};
