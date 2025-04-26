import React, { createContext, useContext, useState, useEffect } from "react";
import { matchService } from "../services/matchService";
import { Alert } from "react-native";

export type MatchPhase =
  | "toss"
  | "team_selection"
  | "inning_one"
  | "inning_two"
  | "finished";

interface MatchState {
  matchId: number;
  currentPhase: MatchPhase;
  completedPhases: MatchPhase[];
  inningId: number | null;
  inningOneId: number | null;
  inningTwoId: number | null;
  battingTeamId: number | null;
  bowlingTeamId: number | null;
  tossWinningTeam: number | null;
  tossWinningChoice: "bat" | "bowl" | null;
  team1: any | null;
  team2: any | null;
  team1Name: string;
  team2Name: string;
  selectedPlayers: {
    team1: number[];
    team2: number[];
  };
  scores: {
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
  winnerTeamId: number | null;
}

interface MatchContextType {
  matchState: MatchState;
  setMatchPhase: (phase: MatchPhase) => Promise<void>;
  navigateToPhase: (phase: MatchPhase) => Promise<boolean>;
  setInningId: (inningId: number) => void;
  setInningOneId: (inningId: number) => void;
  setInningTwoId: (inningId: number) => void;
  setBattingTeam: (battingTeamId: number, bowlingTeamId: number) => void;
  setTossResult: (winningTeamId: number, choice: "bat" | "bowl") => void;
  setSelectedPlayers: (team1Players: number[], team2Players: number[]) => void;
  updateScore: (
    inningNumber: 1 | 2,
    runs: number,
    wickets: number,
    overs: number
  ) => void;
  setWinner: (teamId: number) => void;
  resetMatch: () => void;
  isPhaseCompleted: (phase: MatchPhase) => boolean;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export const MatchProvider: React.FC<{
  children: React.ReactNode;
  matchId: number;
  team1?: any;
  team2?: any;
  team1Name?: string;
  team2Name?: string;
  initialPhase?: MatchPhase;
}> = ({
  children,
  matchId,
  team1 = null,
  team2 = null,
  team1Name = "",
  team2Name = "",
  initialPhase = "toss",
}) => {
  const [matchState, setMatchState] = useState<MatchState>({
    matchId,
    currentPhase: initialPhase,
    completedPhases: [],
    inningId: null,
    inningOneId: null,
    inningTwoId: null,
    battingTeamId: null,
    bowlingTeamId: null,
    tossWinningTeam: null,
    tossWinningChoice: null,
    team1,
    team2,
    team1Name: team1Name || "Team 1",
    team2Name: team2Name || "Team 2",
    selectedPlayers: {
      team1: [],
      team2: [],
    },
    scores: {
      inningOne: {
        runs: 0,
        wickets: 0,
        overs: 0,
      },
      inningTwo: {
        runs: 0,
        wickets: 0,
        overs: 0,
      },
    },
    winnerTeamId: null,
  });

// Load match state from backend on initial render
useEffect(() => {
  const loadMatchState = async () => {
    try {
      console.log("Fetching match state for match ID:", matchId);
      const matchData = await matchService.getMatchState(matchId);

      // Only proceed if we have valid data from the API
      if (matchData) {

        // Merge existing state with loaded data, prioritizing certain fields
        setMatchState((prevState) => ({
          ...prevState,
          currentPhase: matchData.currentPhase || prevState.currentPhase,
          completedPhases: matchData.completedPhases || [],
          inningOneId: matchData.inningOneId || prevState.inningOneId,
          inningTwoId: matchData.inningTwoId || prevState.inningTwoId,
          battingTeamId: matchData.battingTeamId || prevState.battingTeamId,
          bowlingTeamId: matchData.bowlingTeamId || prevState.bowlingTeamId,
          tossWinningTeam: matchData.tossWinningTeam || prevState.tossWinningTeam,
          tossWinningChoice: matchData.tossWinningChoice || prevState.tossWinningChoice,
          selectedPlayers: matchData.selectedPlayers || prevState.selectedPlayers,
          scores: matchData.scores || prevState.scores,
          winnerTeamId: matchData.winnerTeamId || prevState.winnerTeamId,
          
          // Set team objects if they exist in the API response
          team1: matchData.team1 || team1 || prevState.team1,
          team2: matchData.team2 || team2 || prevState.team2,
          
          // Set team names from API, props, or previous state
          team1Name: matchData.team1Name || team1Name || prevState.team1Name,
          team2Name: matchData.team2Name || team2Name || prevState.team2Name,
        }));
      } else {
        console.warn("No match data returned from API");
      }
    } catch (error) {
      console.error("Error loading match state:", error);
    }
  };

  loadMatchState();
}, [matchId, team1, team2, team1Name, team2Name]);
  // Helper function to determine phase order
  const getPhaseOrder = (phase: MatchPhase): number => {
    const phases: MatchPhase[] = [
      "toss",
      "team_selection",
      "inning_one",
      "inning_two",
      "finished",
    ];
    return phases.indexOf(phase);
  };

  // Check if a phase is completed
  const isPhaseCompleted = (phase: MatchPhase): boolean => {
    return matchState.completedPhases.includes(phase);
  };

  // Set the match phase and mark previous phases as completed
  const setMatchPhase = async (phase: MatchPhase): Promise<void> => {
    try {
      // Save to backend first
      await matchService.saveMatchPhase(matchId, phase);

      // Update the phase in state
      setMatchState((prev) => {
        const currentPhaseOrder = getPhaseOrder(prev.currentPhase);
        const newPhaseOrder = getPhaseOrder(phase);

        // Create a new array of completed phases
        let newCompletedPhases = [...prev.completedPhases];

        // If we're moving forward, mark the current phase as completed
        if (newPhaseOrder > currentPhaseOrder) {
          if (!newCompletedPhases.includes(prev.currentPhase)) {
            newCompletedPhases.push(prev.currentPhase);
          }
        }

        return {
          ...prev,
          currentPhase: phase,
          completedPhases: newCompletedPhases,
        };
      });
    } catch (error) {
      console.error("Error saving match phase:", error);
      throw error;
    }
  };

  // Navigate to a specific phase if it's valid to do so
  const navigateToPhase = async (phase: MatchPhase): Promise<boolean> => {
    // Can always navigate to completed phases or the next phase in sequence
    const currentPhaseOrder = getPhaseOrder(matchState.currentPhase);
    const targetPhaseOrder = getPhaseOrder(phase);

    // Can navigate if:
    // 1. The phase is already completed
    // 2. The phase is the current phase
    // 3. The phase is the next phase in sequence
    if (
      isPhaseCompleted(phase) ||
      phase === matchState.currentPhase ||
      targetPhaseOrder === currentPhaseOrder + 1
    ) {
      await setMatchPhase(phase);
      return true;
    }

    Alert.alert(
      "Cannot Skip Steps",
      "You must complete the current phase before proceeding to this step.",
      [{ text: "OK" }]
    );

    return false;
  };

  const setInningId = (inningId: number) => {
    setMatchState((prev) => ({ ...prev, inningId }));
  };

  const setInningOneId = (inningId: number) => {
    console.log("Setting inningOneId:", inningId);
    setMatchState((prev) => ({ ...prev, inningOneId: inningId }));
  };

  const setInningTwoId = (inningId: number) => {
    setMatchState((prev) => ({ ...prev, inningTwoId: inningId }));
  };

  const setBattingTeam = (battingTeamId: number, bowlingTeamId: number) => {
    setMatchState((prev) => ({
      ...prev,
      battingTeamId,
      bowlingTeamId,
    }));
  };

  const setTossResult = (winningTeamId: number, choice: "bat" | "bowl") => {
    setMatchState((prev) => ({
      ...prev,
      tossWinningTeam: winningTeamId,
      tossWinningChoice: choice,
    }));
  };

  const setSelectedPlayers = (
    team1Players: number[],
    team2Players: number[]
  ) => {
    setMatchState((prev) => ({
      ...prev,
      selectedPlayers: {
        team1: team1Players,
        team2: team2Players,
      },
    }));
  };

  const updateScore = (
    inningNumber: 1 | 2,
    runs: number,
    wickets: number,
    overs: number
  ) => {
    setMatchState((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [inningNumber === 1 ? "inningOne" : "inningTwo"]: {
          runs,
          wickets,
          overs,
        },
      },
    }));
  };

  const setWinner = (teamId: number) => {
    setMatchState((prev) => ({
      ...prev,
      winnerTeamId: teamId,
    }));
  };

  const resetMatch = () => {
    setMatchState({
      matchId,
      currentPhase: "toss",
      completedPhases: [],
      inningId: null,
      inningOneId: null,
      inningTwoId: null,
      battingTeamId: null,
      bowlingTeamId: null,
      tossWinningTeam: null,
      tossWinningChoice: null,
      team1,
      team2,
      team1Name: team1Name || "Team 1",
      team2Name: team2Name || "Team 2",
      selectedPlayers: {
        team1: [],
        team2: [],
      },
      scores: {
        inningOne: {
          runs: 0,
          wickets: 0,
          overs: 0,
        },
        inningTwo: {
          runs: 0,
          wickets: 0,
          overs: 0,
        },
      },
      winnerTeamId: null,
    });
  };

  return (
    <MatchContext.Provider
      value={{
        matchState,
        setMatchPhase,
        navigateToPhase,
        setInningId,
        setInningOneId,
        setInningTwoId,
        setBattingTeam,
        setTossResult,
        setSelectedPlayers,
        updateScore,
        setWinner,
        resetMatch,
        isPhaseCompleted,
      }}
    >
      {children}
    </MatchContext.Provider>
  );
};

export const useMatch = () => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error("useMatch must be used within a MatchProvider");
  }
  return context;
};
