import React, { createContext, useContext, useState, useEffect } from 'react';
import { matchService } from '../services/matchService';

export type MatchPhase = 'toss' | 'team_selection' | 'inning_one' | 'inning_two' | 'finished';

interface MatchState {
  matchId: number;
  currentPhase: MatchPhase;
  inningId: number | null;
  battingTeamId: number | null;
  bowlingTeamId: number | null;
  selectedPlayers: {
    team1: number[];
    team2: number[];
  };
}

interface MatchContextType {
  matchState: MatchState;
  setMatchPhase: (phase: MatchPhase) => Promise<void>;
  setInningId: (inningId: number) => void;
  setBattingTeam: (battingTeamId: number, bowlingTeamId: number) => void;
  setSelectedPlayers: (team1Players: number[], team2Players: number[]) => void;
  resetMatch: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{ 
  children: React.ReactNode;
  matchId: number;
}> = ({ children, matchId }) => {
  const [matchState, setMatchState] = useState<MatchState>({
    matchId,
    currentPhase: 'toss',
    inningId: null,
    battingTeamId: null,
    bowlingTeamId: null,
    selectedPlayers: {
      team1: [],
      team2: []
    }
  });

  const setMatchPhase = async (phase: MatchPhase) => {
    try {
      await matchService.saveMatchPhase(matchId, phase);
      setMatchState(prev => ({ ...prev, currentPhase: phase }));
    } catch (error) {
      console.error('Error saving match phase:', error);
      throw error;
    }
  };

  const setInningId = (inningId: number) => {
    setMatchState(prev => ({ ...prev, inningId }));
  };

  const setBattingTeam = (battingTeamId: number, bowlingTeamId: number) => {
    setMatchState(prev => ({ 
      ...prev, 
      battingTeamId, 
      bowlingTeamId 
    }));
  };

  const setSelectedPlayers = (team1Players: number[], team2Players: number[]) => {
    setMatchState(prev => ({
      ...prev,
      selectedPlayers: {
        team1: team1Players,
        team2: team2Players
      }
    }));
  };

  const resetMatch = () => {
    setMatchState({
      matchId,
      currentPhase: 'toss',
      inningId: null,
      battingTeamId: null,
      bowlingTeamId: null,
      selectedPlayers: {
        team1: [],
        team2: []
      }
    });
  };

  return (
    <MatchContext.Provider value={{
      matchState,
      setMatchPhase,
      setInningId,
      setBattingTeam,
      setSelectedPlayers,
      resetMatch
    }}>
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatch must be used within a MatchProvider');
  }
  return context;
}; 