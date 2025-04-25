import { api } from '../utils/api';
import { Team, Match, MatchPhase } from '../types/tournamentTypes';

export type MatchState = {
  currentPhase: MatchPhase;
  completedPhases: MatchPhase[];
  inningOneId?: number;
  inningTwoId?: number;
  battingTeamId?: number;
  bowlingTeamId?: number;
  tossWinningTeam?: number;
  tossWinningChoice?: 'bat' | 'bowl';
  selectedPlayers?: {
    team1: number[];
    team2: number[];
  };
  scores?: {
    inningOne: {
      runs: number;
      wickets: number;
      overs: number;
    };
    inningTwo: {
      runs: number;
      wickets: number;
      overs: number;
    };
  };
  winnerTeamId?: number;
};

export const matchService = {
  // Get the match details
  getMatchDetails: async (matchId: number): Promise<any> => {
    try {
      const response = await api.get(`/organizers/matches/${matchId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching match details for ID ${matchId}:`, error);
      // Return a default object to avoid UI errors
      return {
        match_id: matchId,
        phase: 'toss',
        team1_id: null,
        team2_id: null
      };
    }
  },

  // Get team details
  getTeam: async (teamId: number): Promise<Team> => {
    try {
      const response = await api.get(`/organizers/teams/${teamId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching team details for ID ${teamId}:`, error);
      // Return a default team object to avoid UI errors
      return {
        team_id: teamId,
        team_name: `Team ${teamId}`
      } as Team;
    }
  },

  // Get team players
  getTeamPlayers: async (teamId: number): Promise<any[]> => {
    try {
      const response = await api.post('/organizers/players-stats_ofTeam', {
        team_id: teamId
      });
      return response.data.data || []; // Added .data to handle your API response structure
    } catch (error) {
      console.error(`Error fetching team players for ID ${teamId}:`, error);
      return []; // Return empty array to avoid UI errors
    }
  },

  getMatchState: async (matchId: number): Promise<any> => {
    try {
      console.log(`Attempting to fetch match state for match ID: ${matchId}`);
      const response = await api.get(`/organizers/match-state/${matchId}`);
      
      // Check if we got a valid response
      if (response && response.data) {
        console.log("Match state API response:", response.data);
        return response.data;
      } else {
        console.warn("Match state API returned empty response");
        // Return default state instead of undefined
        return {
          currentPhase: 'toss',
          completedPhases: [],
          team1: null,
          team2: null,
          team1Name: '',
          team2Name: '',
          scores: {
            inningOne: { runs: 0, wickets: 0, overs: 0 },
            inningTwo: { runs: 0, wickets: 0, overs: 0 }
          },
          selectedPlayers: { team1: [], team2: [] }
        };
      }
    } catch (error) {
      console.error(`Error fetching match state for ID ${matchId}:`, error);
      // Return a default state object to avoid UI errors
      return {
        currentPhase: 'toss',
        completedPhases: [],
        team1: null,
        team2: null,
        team1Name: '',
        team2Name: '',
        scores: {
          inningOne: { runs: 0, wickets: 0, overs: 0 },
          inningTwo: { runs: 0, wickets: 0, overs: 0 }
        },
        selectedPlayers: { team1: [], team2: [] }
      };
    }
  },

  // Create a new inning
  createInning: async (
    matchId: number,
    battingTeamId: number,
    bowlingTeamId: number,
    inningNumber: number = 1
  ) => {
    try {
      console.log("Creating inning with params:", { matchId, battingTeamId, bowlingTeamId, inningNumber });
      
      const response = await api.post('/organizers/addInning', {
        match_id: matchId,
        batting_team_id: battingTeamId,
        bowling_team_id: bowlingTeamId
      });
      
      console.log("Create inning response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating inning:', error);
      // Return a mock response to allow the flow to continue
      return { inning_id: Date.now() }; // Use current timestamp as a fallback ID
    }
  },

  // Save selected players for a match
  saveMatchPlayers: async (
    matchId: number,
    playerIds: number[]
  ): Promise<void> => {
    try {
      const response = await api.post('/organizers/playing-11', {
        match_id: matchId,
        player_ids: playerIds
      });
      return response.data;
    } catch (error) {
      console.error('Error saving match players:', error);
    }
  },

  // Save selected players for both teams at once
  saveSelectedPlayers: async (
    matchId: number,
    team1Players: number[],
    team2Players: number[]
  ): Promise<void> => {
    try {
      // Combine all players into one call
      const allPlayers = [...team1Players, ...team2Players];
      await matchService.saveMatchPlayers(matchId, allPlayers);
    } catch (error) {
      console.error('Error saving selected players:', error);
    }
  },

  // Save the current match phase
  saveMatchPhase: async (matchId: number, phase: string): Promise<void> => {
    try {
      const response = await api.post('/organizers/update-match-phase', {
        match_id: matchId,
        phase: phase
      });
      return response.data;
    } catch (error) {
      console.error('Error saving match phase:', error);
    }
  },

  // Get the current match phase
  getMatchPhase: async (matchId: number): Promise<{ phase: string }> => {
    try {
      const response = await api.get(`/organizers/match-phase/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting match phase:', error);
      return { phase: 'toss' }; // Default to toss phase
    }
  },

  // Save inning result
  saveInningResult: async (
    inningId: number,
    runs: number,
    wickets: number,
    overs: number
  ): Promise<void> => {
    try {
      const response = await api.post('/organizers/save-inning-result', {
        inning_id: inningId,
        runs: runs,
        wickets: wickets,
        overs: overs
      });
      return response.data;
    } catch (error) {
      console.error('Error saving inning result:', error);
    }
  },

  // Save match result (winner)
  saveMatchResult: async (
    matchId: number,
    winnerTeamId: number
  ): Promise<void> => {
    try {
      const response = await api.post('/organizers/save-match-result', {
        match_id: matchId,
        winner_team_id: winnerTeamId
      });
      return response.data;
    } catch (error) {
      console.error('Error saving match result:', error);
    }
  },

  // Get match score
  getMatchScore: async (matchId: number): Promise<any> => {
    try {
      const response = await api.get(`/organizers/match-score/${matchId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting match score:', error);
      // Return default structure to avoid UI errors
      return {
        team1: {
          total: 0,
          wickets: 0,
          overs: 0,
          run_rate: 0,
          players: [],
          bowlers: []
        },
        team2: {
          total: 0,
          wickets: 0,
          overs: 0,
          run_rate: 0,
          players: [],
          bowlers: []
        }
      };
    }
  }
};